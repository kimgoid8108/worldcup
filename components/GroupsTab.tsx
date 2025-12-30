/**
 * GroupsTab 컴포넌트
 *
 * 용도: 2026 FIFA 월드컵 조별 경기 정보를 표시하는 탭 컴포넌트
 * - 조 탭(A~L)을 클릭하여 각 조의 참가국과 경기 일정을 확인
 * - 국가 클릭 시 국가 상세 정보 모달 표시
 */

"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { groups, Match } from "@/data/groups";
import { getCountryById, countries } from "@/data/countries";
import { stadiums } from "@/data/stadiums";
import { pots } from "@/data/pots";
import { getPlayersByCountry, Player } from "@/data/players";
import CountryModal from "./CountryModal";
import PlayerModal from "./PlayerModal";
import Flag from "./Flag";

export default function GroupsTab() {
  // 선택된 국가 ID (국가 모달 표시용)
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  // 선택된 선수 (선수 모달 표시용)
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [selectedPlayerCountryName, setSelectedPlayerCountryName] = useState<
    string | undefined
  >(undefined);

  // 검색어 (선수 및 국가 검색용)
  const [searchQuery, setSearchQuery] = useState("");

  // 경기 일정 검색어 (전체 경기 일정 필터링용)
  const [matchSearchQuery, setMatchSearchQuery] = useState("");

  // 선택된 경기 (경기 상세 정보 모달 표시용)
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

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
   * 개선된 fuzzy matching: 연속된 부분 문자열 또는 순서대로 포함된 문자 매칭
   */
  const matchesSearch = useCallback(
    (teamId: string, query: string): boolean => {
      if (!query) return true;

      // 검색어에서 띄어쓰기 제거 및 소문자 변환
      const normalizedQuery = query.replace(/\s+/g, "").toLowerCase();

      const country = getCountryById(teamId);
      if (!country) {
        // 플레이오프 승자는 검색어가 포함되어 있으면 표시
        const playoffName = getPlayoffName(teamId)
          .replace(/\s+/g, "")
          .toLowerCase();
        return fuzzyMatch(playoffName, normalizedQuery);
      }

      // 팀 이름으로 검색 (띄어쓰기 제거)
      const normalizedCountryName = country.name
        .replace(/\s+/g, "")
        .toLowerCase();
      if (fuzzyMatch(normalizedCountryName, normalizedQuery)) {
        return true;
      }

      // 선수 이름으로 검색 (띄어쓰기 제거) - 한국어 및 영어 모두 검색
      const players = getPlayersByCountry(teamId);
      return players.some((player) => {
        const normalizedPlayerName = player.name
          .replace(/\s+/g, "")
          .toLowerCase();
        const normalizedPlayerNameEn =
          player.nameEn?.replace(/\s+/g, "").toLowerCase() || "";
        return (
          fuzzyMatch(normalizedPlayerName, normalizedQuery) ||
          fuzzyMatch(normalizedPlayerNameEn, normalizedQuery)
        );
      });
    },
    []
  );

  // 모달이 열려있을 때 뒷 페이지 스크롤 방지
  useEffect(() => {
    if (selectedMatch || selectedCountry || selectedPlayer) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedMatch, selectedCountry, selectedPlayer]);

  // 검색어에 맞는 국가 목록 (국가 이름으로 검색했을 때)
  // 성능 최적화: useMemo로 검색 결과 캐싱
  const searchedCountries = useMemo(() => {
    if (!searchQuery) return [];

    const normalizedQuery = searchQuery.replace(/\s+/g, "").toLowerCase();
    const results: Array<{ countryId: string; countryName: string }> = [];

    // 모든 국가를 순회하며 국가 이름으로 검색
    // 개선된 fuzzy matching 사용: 연속된 부분 문자열 또는 순서대로 포함된 문자 매칭
    countries.forEach((country) => {
      const normalizedCountryName = country.name
        .replace(/\s+/g, "")
        .toLowerCase();
      if (fuzzyMatch(normalizedCountryName, normalizedQuery)) {
        results.push({
          countryId: country.id,
          countryName: country.name,
        });
      }
    });

    return results;
  }, [searchQuery]);

  // 검색어에 맞는 선수 목록 (선수 이름으로 검색했을 때만)
  const searchedPlayers = useMemo(() => {
    if (!searchQuery) return [];

    const normalizedQuery = searchQuery.replace(/\s+/g, "").toLowerCase();
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
        const normalizedPlayerName = player.name
          .replace(/\s+/g, "")
          .toLowerCase();
        const normalizedPlayerNameEn =
          player.nameEn?.replace(/\s+/g, "").toLowerCase() || "";
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

  // 검색어에 따라 필터링된 경기 일정
  const filteredMatchesByDate = useMemo(() => {
    if (!matchSearchQuery) {
      // 검색어가 없으면 모든 경기 표시
      const grouped: Record<
        string,
        Array<Match & { groupId: string; groupName: string }>
      > = {};
      sortedMatchesByDate.forEach((match) => {
        if (!grouped[match.date]) {
          grouped[match.date] = [];
        }
        grouped[match.date].push(match);
      });
      return grouped;
    }

    // 검색어가 있으면 필터링
    const filtered = sortedMatchesByDate.filter((match) => {
      return (
        matchesSearch(match.team1, matchSearchQuery) ||
        matchesSearch(match.team2, matchSearchQuery)
      );
    });

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
  }, [sortedMatchesByDate, matchSearchQuery, matchesSearch]);

  return (
    <div>
      {/* 선수 상세 정보 모달 */}
      <PlayerModal
        player={selectedPlayer}
        countryName={selectedPlayerCountryName}
        onClose={() => {
          setSelectedPlayer(null);
          setSelectedPlayerCountryName(undefined);
        }}
      />

      {/* 국가 상세 정보 모달 */}
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
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
              onClick={() => setSelectedMatch(null)}
            >
              <div
                className="bg-white rounded-lg shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* 모달 헤더 */}
                <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-lg flex items-center justify-between">
                  <h3 className="text-2xl font-bold flex items-center gap-3">
                    {team1 ? (
                      <Flag country={team1} size="md" />
                    ) : (
                      <span className="text-2xl">⚽</span>
                    )}
                    <span>{team1Name}</span>
                    <span className="px-3 py-1 bg-white text-blue-600 rounded-full font-bold text-sm">
                      VS
                    </span>
                    <span>{team2Name}</span>
                    {team2 ? (
                      <Flag country={team2} size="md" />
                    ) : (
                      <span className="text-2xl">⚽</span>
                    )}
                  </h3>
                  <button
                    onClick={() => setSelectedMatch(null)}
                    className="text-white hover:text-gray-200 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
                  >
                    ×
                  </button>
                </div>

                {/* 모달 내용 */}
                <div className="p-6 space-y-6">
                  {/* 경기장 상세 정보 */}
                  {stadium && (
                    <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                      <h4 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <span>🏟️</span>
                        <span>경기장 정보</span>
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
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
                    </div>
                  )}

                  {/* 선수 명단 */}
                  <div className="grid grid-cols-2 gap-2 md:gap-4">
                    {/* 팀1 선수 명단 */}
                    {team1 && team1Players.length > 0 && (
                      <div className="bg-gray-50 rounded-lg p-2 md:p-4 border-2 border-gray-200">
                        <h4 className="text-sm md:text-lg font-bold text-gray-800 mb-2 md:mb-3 flex items-center gap-1 md:gap-2">
                          {team1 ? (
                            <Flag country={team1} size="sm" />
                          ) : (
                            <span className="text-sm md:text-lg">⚽</span>
                          )}
                          <span className="text-xs md:text-base">
                            {team1Name}
                          </span>
                        </h4>
                        <div className="space-y-1 md:space-y-2 max-h-96 overflow-y-auto">
                          {team1Players.map((player) => (
                            <div
                              key={player.id}
                              onClick={() => {
                                setSelectedPlayer(player);
                                setSelectedPlayerCountryName(team1Name);
                              }}
                              className="p-1 md:p-2 bg-white rounded border border-gray-200 hover:border-blue-400 hover:shadow-sm transition-all cursor-pointer"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-gray-800 text-xs md:text-sm truncate">
                                    {player.name}
                                    {player.nameEn && (
                                      <span className="text-[10px] md:text-xs font-normal text-gray-600 ml-1 hidden md:inline">
                                        ({player.nameEn})
                                      </span>
                                    )}
                                  </p>
                                  <div className="flex items-center gap-1 md:gap-2 text-[10px] md:text-xs text-gray-600 mt-0.5 md:mt-1 flex-wrap">
                                    <span className="truncate">
                                      {getPositionName(player.position)}
                                    </span>
                                    <span>•</span>
                                    <span>{player.age}세</span>
                                    <span className="hidden md:inline">•</span>
                                    <span className="hidden md:inline truncate">
                                      {player.club}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 팀2 선수 명단 */}
                    {team2 && team2Players.length > 0 && (
                      <div className="bg-gray-50 rounded-lg p-2 md:p-4 border-2 border-gray-200">
                        <h4 className="text-sm md:text-lg font-bold text-gray-800 mb-2 md:mb-3 flex items-center gap-1 md:gap-2">
                          {team2 ? (
                            <Flag country={team2} size="sm" />
                          ) : (
                            <span className="text-sm md:text-lg">⚽</span>
                          )}
                          <span className="text-xs md:text-base">
                            {team2Name}
                          </span>
                        </h4>
                        <div className="space-y-1 md:space-y-2 max-h-96 overflow-y-auto">
                          {team2Players.map((player) => (
                            <div
                              key={player.id}
                              onClick={() => {
                                setSelectedPlayer(player);
                                setSelectedPlayerCountryName(team2Name);
                              }}
                              className="p-1 md:p-2 bg-white rounded border border-gray-200 hover:border-blue-400 hover:shadow-sm transition-all cursor-pointer"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-gray-800 text-xs md:text-sm truncate">
                                    {player.name}
                                    {player.nameEn && (
                                      <span className="text-[10px] md:text-xs font-normal text-gray-600 ml-1 hidden md:inline">
                                        ({player.nameEn})
                                      </span>
                                    )}
                                  </p>
                                  <div className="flex items-center gap-1 md:gap-2 text-[10px] md:text-xs text-gray-600 mt-0.5 md:mt-1 flex-wrap">
                                    <span className="truncate">
                                      {getPositionName(player.position)}
                                    </span>
                                    <span>•</span>
                                    <span>{player.age}세</span>
                                    <span className="hidden md:inline">•</span>
                                    <span className="hidden md:inline truncate">
                                      {player.club}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
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
        className="bg-white rounded-lg shadow-lg p-4 md:p-6 min-h-[800px]"
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 text-center border-b-4 border-blue-500 pb-3">
          전체 경기 일정
        </h2>

        {/* 경기 일정 검색 입력 */}
        <div className="mb-6">
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
