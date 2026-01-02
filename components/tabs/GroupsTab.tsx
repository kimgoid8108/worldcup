/**
 * GroupsTab 컴포넌트
 *
 * 용도: 2026 FIFA 월드컵 조별 경기 정보를 표시하는 탭 컴포넌트
 * - 조 탭(A~L)을 클릭하여 각 조의 참가국과 경기 일정을 확인
 * - 국가 클릭 시 국가 상세 정보 모달 표시
 */

"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { groups, Match } from "@/data/groups";
import { getCountryById, countries } from "@/data/countries";
import { stadiums } from "@/data/stadiums";
import { pots } from "@/data/pots";
import { getPlayersByCountry } from "@/data/players";
import { type Player } from "@/types/player";
import CountryModal from "@/components/modals/CountryModal";
import PlayerModal from "@/components/modals/PlayerModal";
import Flag from "@/components/ui/Flag";
import SquadBuilder, { Formation } from "@/components/squad/SquadBuilder";
import ImageSquadBuilder from "@/components/squad/ImageSquadBuilder";
import PlayerList from "@/components/cards/PlayerList";
import { normalizeText } from "@/src/utils/normalizeText";

export default function GroupsTab() {
  // 선택된 국가 ID (국가 모달 표시용)
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  // 선택된 선수는 CountryModal 내부에서 관리하므로 여기서는 제거
  // GroupsTab에서 직접 선수를 클릭하는 경우를 위한 상태 (경기 상세 모달에서 선수 클릭 시)
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [selectedPlayerCountryName, setSelectedPlayerCountryName] = useState<
    string | undefined
  >(undefined);

  // 검색어 (선수 및 국가 검색용)
  const [searchQuery, setSearchQuery] = useState("");

  // 경기 일정 검색어 (전체 경기 일정 필터링용)
  const [matchSearchQuery, setMatchSearchQuery] = useState("");
  // 선택된 날짜 (전체 경기 일정 필터링용)
  const [selectedDate, setSelectedDate] = useState<string>("");

  // 선택된 경기 (경기 상세 정보 모달 표시용)
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  // 경기 상세 모달의 탭 상태
  const [matchModalTab, setMatchModalTab] = useState<"squad" | "players" | "stadium">("squad");

  // 경기 상세 모달의 포메이션 상태 (각 팀별로 관리)
  const [team1Formation, setTeam1Formation] = useState<Formation>("4-3-3");
  const [team2Formation, setTeam2Formation] = useState<Formation>("4-3-3");

  /**
   * 경기장 ID로 경기장 정보 조회
   * @param stadiumId - 경기장 ID
   * @returns 경기장 정보 또는 null
   */
  const getStadium = (stadiumId: string) => {
    return stadiums.find((s) => s.id === stadiumId);
  };

  /**
   * 경기장 ID로 경기장 이름 조회
   * @param stadiumId - 경기장 ID
   * @returns 경기장 이름 또는 ID (경기장을 찾지 못한 경우)
   */
  const getStadiumName = (stadiumId: string): string => {
    const stadium = getStadium(stadiumId);
    return stadium ? stadium.name : stadiumId;
  };

  /**
   * 플레이오프 승자 ID를 한글 이름으로 변환
   * @param playoffId - 플레이오프 ID (예: "playoff_europe")
   * @returns 플레이오프 한글 이름
   */
  const getPlayoffName = (playoffId: string): string => {
    const playoffNames: Record<string, string> = {
      playoff_europe_d: "유럽 플레이오프 D조 승자",
      playoff_europe_a: "유럽 플레이오프 A조 승자",
      playoff_europe_c: "유럽 플레이오프 C조 승자",
      playoff_europe_b: "유럽 플레이오프 B조 승자",
      playoff_fifa_1: "FIFA 플레이오프 1조 승자",
      playoff_fifa_2: "FIFA 플레이오프 2조 승자",
      // 하위 호환성
      playoff_europe: "유럽 플레이오프 승자",
      playoff_a: "플레이오프 A 승자",
      playoff_b: "플레이오프 B 승자",
      playoff_c: "플레이오프 C 승자",
      playoff_1: "플레이오프 1 승자",
      playoff_2: "플레이오프 2 승자",
    };
    return playoffNames[playoffId] || playoffId;
  };

  /**
   * 플레이오프에 참가하는 국가 목록 조회
   * @param playoffId - 플레이오프 ID
   * @returns 참가 국가 배열 (국가 ID 배열)
   */
  const getPlayoffParticipants = (playoffId: string): string[] => {
    const participants: Record<string, string[]> = {
      // 유럽 플레이오프
      playoff_europe_d: [
        "denmark",
        "northmacedonia",
        "czechrepublic",
        "ireland",
      ], // 유럽 플레이오프 D조: 덴마크/북마케도니아/체코/아일랜드
      playoff_europe_a: ["italy", "northernireland", "wales", "bosnia"], // 유럽 플레이오프 A조: 이탈리아/북아일랜드/웨일스/보스니아 헤르체고비나
      playoff_europe_c: ["turkiye", "romania", "slovakia", "kosovo"], // 유럽 플레이오프 C조: 튀르키예/루마니아/슬로바키아/코소보
      playoff_europe_b: ["ukraine", "sweden", "poland", "albania"], // 유럽 플레이오프 B조: 우크라이나/스웨덴/폴란드/알바니아
      // FIFA 플레이오프
      playoff_fifa_2: ["bolivia", "suriname", "iraq"], // FIFA 플레이오프 2조: 볼리비아/수리남/이라크
      playoff_fifa_1: ["newcaledonia", "jamaica", "congodr"], // FIFA 플레이오프 1조: 누벨칼레도니/자메이카/콩고민주공화국
      // 하위 호환성
      playoff_europe: [
        "scotland",
        "norway",
        "sweden",
        "denmark",
        "poland",
        "turkiye",
      ],
      playoff_a: ["ghana", "capeverde", "ivorycoast", "algeria"],
      playoff_b: ["uzbekistan", "jordan", "thailand", "vietnam"],
      playoff_c: ["newzealand", "panama", "jamaica", "costa"],
      playoff_1: ["china", "india", "saudiarabia", "uae"],
      playoff_2: ["russia", "iran", "qatar", "egypt"],
    };
    return participants[playoffId] || [];
  };

  /**
   * 개선된 검색 함수: 연속된 부분 문자열 또는 순서대로 포함된 문자 매칭
   * - 연속된 부분 문자열 매칭 (예: "대한" → "대한민국" 매칭)
   * - 순서대로 포함된 문자 매칭 (예: "대하" → "대한민국" 매칭)
   * - 성능 최적화: 연속 매칭을 먼저 시도 (더 빠름)
   */
  const fuzzyMatch = (text: string, query: string): boolean => {
    if (!query) return true;

    // 1. 연속된 부분 문자열 매칭 (가장 빠르고 직관적)
    if (text.includes(query)) {
      return true;
    }

    // 2. 순서대로 포함된 문자 매칭 (더 유연한 검색)
    let queryIndex = 0;
    for (let i = 0; i < text.length && queryIndex < query.length; i++) {
      if (text[i] === query[queryIndex]) {
        queryIndex++;
      }
    }
    return queryIndex === query.length;
  };

  /**
   * 팀이 검색어와 일치하는지 확인 (팀 이름 또는 선수 이름으로 검색)
   * 띄어쓰기를 제거하고 검색 (예: "손 흥민" → "손흥민"으로 검색)
   * 국가 이름 검색은 앞글자부터 시작해야 함 (startsWith 기반)
   * 선수 이름 검색은 fuzzy matching 사용
   * normalizeText를 사용하여 유니코드 정규화 및 whitespace 제거
   */
  const matchesSearch = useCallback(
    (teamId: string, query: string): boolean => {
      if (!query) return true;

      // 검색어 정규화 (NFC, 모든 whitespace 제거, 소문자 변환)
      const normalizedQuery = normalizeText(query);

      const country = getCountryById(teamId);
      if (!country) {
        // 플레이오프 승자는 검색어가 포함되어 있으면 표시
        const playoffName = normalizeText(getPlayoffName(teamId));
        return fuzzyMatch(playoffName, normalizedQuery);
      }

      // 팀 이름으로 검색 (앞글자부터 시작해야 함)
      const normalizedCountryName = normalizeText(country.name);
      if (normalizedCountryName.startsWith(normalizedQuery)) {
        return true;
      }

      // 선수 이름으로 검색 - 한국어 및 영어 모두 검색
      const players = getPlayersByCountry(teamId);
      return players.some((player) => {
        const normalizedPlayerName = normalizeText(player.name);
        const normalizedPlayerNameEn = player.nameEn ? normalizeText(player.nameEn) : "";
        return (
          fuzzyMatch(normalizedPlayerName, normalizedQuery) ||
          fuzzyMatch(normalizedPlayerNameEn, normalizedQuery)
        );
      });
    },
    []
  );

  // 경기 상세 모달이 열릴 때 탭 상태 초기화
  useEffect(() => {
    if (selectedMatch) {
      setMatchModalTab("squad");
      setTeam1Formation("4-3-3");
      setTeam2Formation("4-3-3");
    }
  }, [selectedMatch]);

  // 경기 상세 모달의 스크롤 제어
  useEffect(() => {
    if (selectedMatch) {
      // 스크롤바 너비 계산 (스크롤바가 사라질 때 레이아웃이 밀리지 않도록)
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

      // 현재 스크롤 위치 저장
      const scrollY = window.scrollY;

      // body에 overflow: hidden 적용 및 스크롤바 너비만큼 padding-right 추가
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      document.documentElement.style.overflow = 'hidden';

      // 스크롤 위치 고정
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.width = '100%';

      // cleanup: 모달 닫힐 때 스타일 복원
      return () => {
        const savedScrollY = document.body.style.top;

        // 스타일 복원
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        document.documentElement.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.width = '';

        // 스크롤 위치 복원
        if (savedScrollY) {
          window.scrollTo(0, parseInt(savedScrollY || '0') * -1);
        }
      };
    }
  }, [selectedMatch]);

  // ESC 키로 경기 상세 모달 닫기
  useEffect(() => {
    if (!selectedMatch) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        // PlayerModal이 열려있으면 먼저 PlayerModal 닫기
        if (selectedPlayer) {
          e.preventDefault();
          e.stopPropagation();
          setSelectedPlayer(null);
          setSelectedPlayerCountryName(undefined);
        } else {
          // PlayerModal이 없으면 경기 상세 모달 닫기
          e.preventDefault();
          e.stopPropagation();
          setSelectedMatch(null);
        }
      }
    };

    window.addEventListener("keydown", handleEscape, true);
    return () => {
      window.removeEventListener("keydown", handleEscape, true);
    };
  }, [selectedMatch, selectedPlayer]);

  // 검색어에 맞는 국가 목록 (국가 이름으로 검색했을 때)
  // 성능 최적화: useMemo로 검색 결과 캐싱
  // 국가 이름 검색은 앞글자부터 시작해야 함 (startsWith 기반)
  // normalizeText를 사용하여 유니코드 정규화 및 whitespace 제거
  const searchedCountries = useMemo(() => {
    if (!searchQuery) return [];

    // 검색어 정규화 (NFC, 모든 whitespace 제거, 소문자 변환)
    const normalizedQuery = normalizeText(searchQuery);
    const results: Array<{ countryId: string; countryName: string }> = [];

    // 모든 국가를 순회하며 국가 이름으로 검색
    // 앞글자부터 시작하는 검색만 허용
    countries.forEach((country) => {
      const normalizedCountryName = normalizeText(country.name);
      if (normalizedCountryName.startsWith(normalizedQuery)) {
        results.push({
          countryId: country.id,
          countryName: country.name,
        });
      }
    });

    return results;
  }, [searchQuery]);

  // 검색어에 맞는 선수 목록 (선수 이름으로 검색했을 때만)
  // normalizeText를 사용하여 유니코드 정규화 및 whitespace 제거
  const searchedPlayers = useMemo(() => {
    if (!searchQuery) return [];

    // 검색어 정규화 (NFC, 모든 whitespace 제거, 소문자 변환)
    const normalizedQuery = normalizeText(searchQuery);
    const results: Array<{
      player: Player;
      countryId: string;
      countryName: string;
    }> = [];

    // 국가 이름으로 검색된 경우가 있으면 선수 검색 제외
    if (searchedCountries.length > 0) {
      return [];
    }

    // 모든 국가를 순회하며 선수 이름으로 검색
    countries.forEach((country) => {
      const players = getPlayersByCountry(country.id);
      // 선수 이름으로 검색 - 한국어 및 영어 모두 검색
      // 개선된 fuzzy matching 사용
      players.forEach((player) => {
        const normalizedPlayerName = normalizeText(player.name);
        const normalizedPlayerNameEn = player.nameEn ? normalizeText(player.nameEn) : "";
        if (
          fuzzyMatch(normalizedPlayerName, normalizedQuery) ||
          fuzzyMatch(normalizedPlayerNameEn, normalizedQuery)
        ) {
          results.push({
            player,
            countryId: country.id,
            countryName: country.name,
          });
        }
      });
    });

    return results;
  }, [searchQuery, searchedCountries]);

  // 날짜별로 정렬된 전체 경기 일정 (최신순)
  const sortedMatchesByDate = useMemo(() => {
    const allMatches: Array<Match & { groupId: string; groupName: string }> =
      [];

    groups.forEach((group) => {
      group.matches.forEach((match) => {
        allMatches.push({
          ...match,
          groupId: group.id,
          groupName: group.name,
        });
      });
    });

    // 날짜와 시간 기준으로 정렬 (최신순)
    return allMatches.sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date);
      if (dateCompare !== 0) return dateCompare;
      return a.time.localeCompare(b.time);
    });
  }, []);

  // 검색어와 날짜에 따라 필터링된 경기 일정
  const filteredMatchesByDate = useMemo(() => {
    // 먼저 검색어로 필터링
    let filtered = sortedMatchesByDate;
    if (matchSearchQuery) {
      filtered = sortedMatchesByDate.filter((match) => {
        return (
          matchesSearch(match.team1, matchSearchQuery) ||
          matchesSearch(match.team2, matchSearchQuery)
        );
      });
    }

    // 날짜로 필터링
    if (selectedDate) {
      filtered = filtered.filter((match) => match.date === selectedDate);
    }

    // 날짜별로 그룹화
    const grouped: Record<
      string,
      Array<Match & { groupId: string; groupName: string }>
    > = {};
    filtered.forEach((match) => {
      if (!grouped[match.date]) {
        grouped[match.date] = [];
      }
      grouped[match.date].push(match);
    });

    return grouped;
  }, [sortedMatchesByDate, matchSearchQuery, selectedDate, matchesSearch]);

  return (
    <div style={{ overflow: 'visible' }}>
      {/* 선수 상세 정보 모달 (경기 상세 모달에서 선수를 클릭한 경우에만 표시) */}
      {/* CountryModal 내부의 PlayerModal과는 별개로, 경기 상세 모달에서 직접 선수를 클릭한 경우를 처리 */}
      <PlayerModal
        player={selectedPlayer}
        countryName={selectedPlayerCountryName}
        onClose={() => {
          setSelectedPlayer(null);
          setSelectedPlayerCountryName(undefined);
        }}
      />

      {/* 국가 상세 정보 모달 (내부에서 PlayerModal을 관리) */}
      <CountryModal
        countryId={selectedCountry}
        onClose={() => setSelectedCountry(null)}
      />

      {/* 경기 상세 정보 모달 */}
      {selectedMatch &&
        (() => {
          const team1 = getCountryById(selectedMatch.team1);
          const team2 = getCountryById(selectedMatch.team2);
          const stadium = getStadium(selectedMatch.stadium);
          const team1Name = team1
            ? team1.name
            : getPlayoffName(selectedMatch.team1);
          const team2Name = team2
            ? team2.name
            : getPlayoffName(selectedMatch.team2);
          const team1Players = team1
            ? getPlayersByCountry(selectedMatch.team1)
            : [];
          const team2Players = team2
            ? getPlayersByCountry(selectedMatch.team2)
            : [];

          const getPositionName = (position: string): string => {
            const positionMap: Record<string, string> = {
              GK: "골키퍼",
              DF: "수비수",
              MF: "미드필더",
              FW: "공격수",
            };
            return positionMap[position] || position;
          };

          return (
            <div
              className="fixed inset-0 z-[35] flex items-center justify-center p-0 md:p-4"
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                pointerEvents: 'auto',
                backdropFilter: 'blur(2px)',
              }}
              onClick={() => setSelectedMatch(null)}
            >
              <div
                className="modal-content bg-white rounded-none md:rounded-lg shadow-2xl max-w-7xl w-full h-full md:h-auto max-h-full md:max-h-[90vh] overflow-y-auto"
                style={{ pointerEvents: 'auto', position: 'relative', zIndex: 36 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* 모달 헤더 */}
                <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 md:p-4 rounded-none md:rounded-t-lg flex items-center justify-between z-10">
                  <h3 className="text-base md:text-2xl font-bold flex items-center gap-1 md:gap-3 flex-1 min-w-0">
                    {team1 ? (
                      <Flag country={team1} size="sm" className="md:hidden" />
                    ) : (
                      <span className="text-lg md:text-2xl">⚽</span>
                    )}
                    <span className="truncate text-xs md:text-base">{team1Name}</span>
                    <span className="px-2 md:px-3 py-0.5 md:py-1 bg-white text-blue-600 rounded-full font-bold text-xs md:text-sm whitespace-nowrap mx-1 md:mx-0">
                      VS
                    </span>
                    <span className="truncate text-xs md:text-base">{team2Name}</span>
                    {team2 ? (
                      <Flag country={team2} size="sm" className="md:hidden" />
                    ) : (
                      <span className="text-lg md:text-2xl">⚽</span>
                    )}
                    {/* 데스크톱에서만 표시되는 플래그 */}
                    <div className="hidden md:flex items-center gap-3">
                      {team1 && <Flag country={team1} size="md" />}
                      {team2 && <Flag country={team2} size="md" />}
                    </div>
                  </h3>
                  <button
                    onClick={() => setSelectedMatch(null)}
                    className="text-white hover:text-gray-200 text-2xl md:text-3xl font-bold w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full hover:bg-white hover:bg-opacity-20 transition-colors flex-shrink-0 ml-2"
                  >
                    ×
                  </button>
                </div>

                {/* 탭 네비게이션 */}
                <div className="flex gap-1 md:gap-2 px-2 md:px-6 pt-3 md:pt-4 border-b border-gray-200 overflow-x-auto">
                  <button
                    onClick={() => setMatchModalTab("squad")}
                    className={`px-3 md:px-4 py-2 text-sm md:text-base font-semibold transition-colors whitespace-nowrap ${
                      matchModalTab === "squad"
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    스쿼드
                  </button>
                  <button
                    onClick={() => setMatchModalTab("players")}
                    className={`px-3 md:px-4 py-2 text-sm md:text-base font-semibold transition-colors whitespace-nowrap ${
                      matchModalTab === "players"
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    선수 명단
                  </button>
                  <button
                    onClick={() => setMatchModalTab("stadium")}
                    className={`px-3 md:px-4 py-2 text-sm md:text-base font-semibold transition-colors whitespace-nowrap ${
                      matchModalTab === "stadium"
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    경기장 정보
                  </button>
                </div>

                {/* 모달 내용 */}
                <div className="p-3 md:p-6 space-y-4 md:space-y-6">
                  {/* 스쿼드 탭 */}
                  {matchModalTab === "squad" && (
                    <div className="w-full">
                      {/* 팀 헤더 */}
                      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 md:gap-0 mb-3 md:mb-4">
                        {/* 팀1 헤더 */}
                        {team1 && (
                          <div className="flex items-center gap-2 flex-1">
                            {team1 && <Flag country={team1} size="sm" />}
                            <h4 className="text-sm md:text-lg font-semibold text-gray-700 truncate">
                              {team1Name}
                            </h4>
                            <select
                              value={team1Formation}
                              onChange={(e) =>
                                setTeam1Formation(e.target.value as Formation)
                              }
                              className="px-2 py-1 rounded-lg border border-gray-300 bg-white text-xs flex-shrink-0"
                            >
                              <option value="4-3-3">4-3-3</option>
                              <option value="4-4-2">4-4-2</option>
                            </select>
                          </div>
                        )}

                        {/* VS 표시 */}
                        <div className="px-2 md:px-4 self-center">
                          <span className="text-base md:text-lg font-bold text-gray-500">VS</span>
                        </div>

                        {/* 팀2 헤더 */}
                        {team2 && (
                          <div className="flex items-center gap-2 flex-1 justify-end md:justify-end">
                            <select
                              value={team2Formation}
                              onChange={(e) =>
                                setTeam2Formation(e.target.value as Formation)
                              }
                              className="px-2 py-1 rounded-lg border border-gray-300 bg-white text-xs flex-shrink-0"
                            >
                              <option value="4-3-3">4-3-3</option>
                              <option value="4-4-2">4-4-2</option>
                            </select>
                            <h4 className="text-sm md:text-lg font-semibold text-gray-700 truncate">
                              {team2Name}
                            </h4>
                            {team2 && <Flag country={team2} size="sm" />}
                          </div>
                        )}
                      </div>

                      {/* 통합 스쿼드 빌더 (이미지 기반) */}
                      {team1 && team2 && (
                        <ImageSquadBuilder
                          players={team1Players || []}
                          formation={team1Formation}
                          team2Players={team2Players || []}
                          team2Formation={team2Formation}
                          onPlayerClick={(player, index) => {
                            if (player) {
                              setSelectedPlayer(player as any);
                              setSelectedPlayerCountryName(team1Name);
                            }
                          }}
                          onTeam2PlayerClick={(player, index) => {
                            if (player) {
                              setSelectedPlayer(player as any);
                              setSelectedPlayerCountryName(team2Name);
                            }
                          }}
                        />
                      )}
                    </div>
                  )}

                  {/* 선수 명단 탭 */}
                  {matchModalTab === "players" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                      {/* 팀1 선수 명단 */}
                      {team1 && team1Players.length > 0 && (
                        <div>
                          <h4 className="text-base md:text-lg font-bold text-gray-800 mb-2 md:mb-3 flex items-center gap-2">
                            {team1 && <Flag country={team1} size="sm" />}
                            <span className="truncate">{team1Name}</span>
                          </h4>
                          <div className="bg-gray-50 rounded-lg p-3 md:p-4 max-h-[400px] md:max-h-[600px] overflow-y-auto">
                            <PlayerList
                              players={team1Players}
                              onPlayerClick={(player, e) => {
                                if (e) {
                                  e.stopPropagation();
                                }
                                setSelectedPlayer(player);
                                setSelectedPlayerCountryName(team1Name);
                              }}
                            />
                          </div>
                        </div>
                      )}

                      {/* 팀2 선수 명단 */}
                      {team2 && team2Players.length > 0 && (
                        <div>
                          <h4 className="text-base md:text-lg font-bold text-gray-800 mb-2 md:mb-3 flex items-center gap-2">
                            {team2 && <Flag country={team2} size="sm" />}
                            <span className="truncate">{team2Name}</span>
                          </h4>
                          <div className="bg-gray-50 rounded-lg p-3 md:p-4 max-h-[400px] md:max-h-[600px] overflow-y-auto">
                            <PlayerList
                              players={team2Players}
                              onPlayerClick={(player, e) => {
                                if (e) {
                                  e.stopPropagation();
                                }
                                setSelectedPlayer(player);
                                setSelectedPlayerCountryName(team2Name);
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 경기장 정보 탭 */}
                  {matchModalTab === "stadium" && stadium && (
                    <div className="bg-blue-50 rounded-lg p-3 md:p-4 border-2 border-blue-200">
                      <h4 className="text-base md:text-lg font-bold text-gray-800 mb-2 md:mb-3 flex items-center gap-2">
                        <span>🏟️</span>
                        <span>경기장 정보</span>
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 text-xs md:text-sm">
                        <div>
                          <span className="font-semibold text-gray-700">
                            경기장명:
                          </span>
                          <span className="ml-2 text-gray-800">
                            {stadium.name}
                          </span>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-700">
                            위치:
                          </span>
                          <span className="ml-2 text-gray-800">
                            {stadium.city}, {stadium.country}
                          </span>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-700">
                            수용 인원:
                          </span>
                          <span className="ml-2 text-gray-800">
                            {stadium.capacity.toLocaleString()}명
                          </span>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-700">
                            경기 시간:
                          </span>
                          <span className="ml-2 text-gray-800">
                            {selectedMatch.date} {selectedMatch.time}
                          </span>
                        </div>
                      </div>
                      {stadium.description && (
                        <div className="mt-4">
                          <span className="font-semibold text-gray-700">
                            설명:
                          </span>
                          <p className="mt-2 text-gray-800">
                            {stadium.description}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })()}

      {/* 선수 및 국가 검색 섹션 */}
      <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 mb-6 min-h-[330px]">
        <div className="relative">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            선수 및 국가 검색
          </h3>
          <div className="relative">
            <input
              type="text"
              placeholder="국가 이름 또는 선수 이름으로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-white text-gray-800"
            />
            <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
          </div>

          {/* 검색된 국가 또는 선수 목록 */}
          {searchQuery && (
            <div className="mt-4 bg-gray-50 rounded-lg p-4 border-2 border-blue-200 max-h-[600px] overflow-y-auto">
              {searchedCountries.length > 0 ? (
                <>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    검색된 국가 ({searchedCountries.length}개)
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {searchedCountries.map(({ countryId, countryName }) => {
                      const country = getCountryById(countryId);
                      if (!country) return null;

                      return (
                        <button
                          key={countryId}
                          onClick={() => setSelectedCountry(countryId)}
                          className="p-4 bg-white rounded-lg border-2 border-blue-200 hover:border-blue-400 hover:shadow-md transition-all flex flex-col items-center justify-center gap-2"
                        >
                          <Flag country={country} size="lg" />
                          <span className="text-sm font-semibold text-gray-800 text-center">
                            {countryName}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </>
              ) : searchedPlayers.length > 0 ? (
                <>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    검색된 선수 ({searchedPlayers.length}명)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {searchedPlayers.map(
                      ({ player, countryId, countryName }) => {
                        const country = getCountryById(countryId);
                        const getPositionName = (position: string): string => {
                          const positionMap: Record<string, string> = {
                            GK: "골키퍼",
                            DF: "수비수",
                            MF: "미드필더",
                            FW: "공격수",
                          };
                          return positionMap[position] || position;
                        };

                        return (
                          <div
                            key={`${countryId}-${player.id}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedPlayer(player);
                              setSelectedPlayerCountryName(countryName);
                            }}
                            className="p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer"
                          >
                            <div className="flex items-center gap-2 mb-2">
                              {country && <Flag country={country} size="sm" />}
                              <span className="text-xs text-gray-600">
                                {countryName}
                              </span>
                            </div>
                            <p className="font-semibold text-gray-800 mb-1">
                              {player.name}
                              {player.nameEn && (
                                <span className="text-sm font-normal text-gray-600 ml-2">
                                  ({player.nameEn})
                                </span>
                              )}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <span>{getPositionName(player.position)}</span>
                              <span>•</span>
                              <span>{player.age}세</span>
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-gray-600 min-h-[80px] flex items-center justify-center">
                  검색 결과가 없습니다. 국가 이름 또는 선수 이름으로
                  검색해주세요.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 전체 경기 일정 섹션 */}
      <div
        id="match-schedule"
        className="bg-white rounded-lg shadow-lg p-4 md:p-6 min-h-[800px] relative"
        style={{ overflow: 'visible' }}
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 text-center border-b-4 border-blue-500 pb-3">
          전체 경기 일정
        </h2>

        {/* 경기 일정 검색 및 날짜 선택 */}
        <div className={`sticky top-0 bg-white py-4 mb-6 space-y-4 border-2 border-gray-300 rounded-lg shadow-md border-b-4 border-gray-200 px-4 ${selectedMatch ? 'z-[30]' : 'z-50'}`}>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              국가 이름으로 경기 검색
            </h3>
            <div className="relative">
              <input
                type="text"
                placeholder="국가 이름으로 검색..."
                value={matchSearchQuery}
                onChange={(e) => setMatchSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-white text-gray-800"
              />
              <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              날짜로 경기 검색
            </h3>
            <div className="flex items-center gap-2">
              <div
                className="cursor-pointer"
                onClick={(e) => {
                  const input = e.currentTarget.querySelector('input[type="date"]') as HTMLInputElement;
                  if (input) {
                    input.showPicker?.();
                    input.focus();
                  }
                }}
              >
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min="2026-06-11"
                  max="2026-07-19"
                  className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-white text-gray-800 cursor-pointer w-auto"
                  style={{ width: 'auto', minWidth: '200px' }}
                />
              </div>
              {selectedDate && (
                <button
                  onClick={() => setSelectedDate("")}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors whitespace-nowrap"
                >
                  날짜 초기화
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6 min-h-[200px]">
          {Object.keys(filteredMatchesByDate).length > 0 ? (
            Object.keys(filteredMatchesByDate).map((date) => {
              const dateMatches = filteredMatchesByDate[date];
              const dateObj = new Date(date);
              const formattedDate = `${dateObj.getFullYear()}년 ${
                dateObj.getMonth() + 1
              }월 ${dateObj.getDate()}일`;
              const dayOfWeek = ["일", "월", "화", "수", "목", "금", "토"][
                dateObj.getDay()
              ];

              return (
                <div
                  key={date}
                  className="border-b-2 border-gray-200 pb-6 last:border-b-0"
                >
                  <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
                    📅 {formattedDate} ({dayOfWeek}요일)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {dateMatches.map((match) => {
                      const team1 = getCountryById(match.team1);
                      const team2 = getCountryById(match.team2);
                      const team1Name = team1
                        ? team1.name
                        : getPlayoffName(match.team1);
                      const team2Name = team2
                        ? team2.name
                        : getPlayoffName(match.team2);
                      const stadium = getStadium(match.stadium);

                      return (
                        <button
                          key={match.id}
                          onClick={() => setSelectedMatch(match)}
                          className="p-4 bg-gray-50 rounded-lg border-2 border-gray-200 hover:border-blue-400 hover:shadow-md transition-all text-left"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded">
                              {match.groupName}
                            </span>
                            <span className="text-sm font-medium text-gray-600">
                              🕐 {match.time}
                            </span>
                          </div>
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <div className="flex flex-col items-center gap-1">
                              {team1 ? (
                                <Flag country={team1} size="md" />
                              ) : (
                                <span className="text-2xl">⚽</span>
                              )}
                              <span className="text-sm font-semibold text-gray-800 text-center">
                                {team1Name}
                              </span>
                            </div>
                            <span className="text-lg font-bold text-gray-500">
                              VS
                            </span>
                            <div className="flex flex-col items-center gap-1">
                              {team2 ? (
                                <Flag country={team2} size="md" />
                              ) : (
                                <span className="text-2xl">⚽</span>
                              )}
                              <span className="text-sm font-semibold text-gray-800 text-center">
                                {team2Name}
                              </span>
                            </div>
                          </div>
                          {stadium && (
                            <div className="text-xs text-gray-600 text-center mt-2">
                              🏟️ {stadium.name}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-16 text-gray-600 min-h-[150px] flex items-center justify-center">
              검색 결과가 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
