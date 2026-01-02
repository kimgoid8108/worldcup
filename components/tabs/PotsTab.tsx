/**
 * PotsTab 컴포넌트
 *
 * 용도: 포트별 팀 정보를 표시하는 탭 컴포넌트
 * - 각 포트별 참가 팀 표시
 * - 팀 클릭 시 팀 상세 정보 표시: 국기, 주요 선수 명단, FIFA 랭킹
 * - 검색 기능: 팀 이름 및 선수 이름으로 검색 가능
 * - 필터 기능: 특정 포트만 보기
 */

"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { pots } from "@/data/pots";
import { getCountryById } from "@/data/countries";
import { getPlayersByCountry } from "@/data/players";
import CountryModal from "@/components/modals/CountryModal";
import Flag from "@/components/ui/Flag";
import { normalizeText } from "@/src/utils/normalizeText";
import { fetchStandings, fetchPlayersByTeamId, isPlayoffTeam } from "@/src/utils/api";
import type { TeamStanding, PlayersResponse } from "@/src/types/api";

export default function PotsTab() {
  // 선택된 국가 ID (국가 모달 표시용)
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  // 검색어
  const [searchQuery, setSearchQuery] = useState("");
  // 선택된 포트 필터 (null이면 전체 표시)
  const [selectedPotFilter, setSelectedPotFilter] = useState<number | null>(null);

  // 선수 명단 표시용: 선택된 teamId (number)
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [selectedTeamStanding, setSelectedTeamStanding] = useState<TeamStanding | null>(null);
  const [players, setPlayers] = useState<PlayersResponse | null>(null);
  const [playersList, setPlayersList] = useState<PlayersResponse["players"]>([]);
  const [loadingPlayers, setLoadingPlayers] = useState(false);

  /**
   * 플레이오프 승자 ID를 한글 이름으로 변환
   */
  const getPlayoffName = (playoffId: string): string => {
    const playoffNames: Record<string, string> = {
      playoff_europe_d: "유럽 플레이오프 D조 승자",
      playoff_europe_a: "유럽 플레이오프 A조 승자",
      playoff_europe_c: "유럽 플레이오프 C조 승자",
      playoff_europe_b: "유럽 플레이오프 B조 승자",
      playoff_fifa_1: "FIFA 플레이오프 1조 승자",
      playoff_fifa_2: "FIFA 플레이오프 2조 승자",
      playoff_intercontinental_1: "인터콘티넨털 플레이오프 1조 승자",
      playoff_intercontinental_2: "인터콘티넨털 플레이오프 2조 승자",
      // 하위 호환성
      playoff_europe: "유럽 플레이오프 승자",
      playoff_a: "플레이오프 A 승자",
      playoff_b: "플레이오프 B 승자",
      playoff_c: "플레이오프 C 승자",
      playoff_1: "플레이오프 1 승자",
      playoff_2: "플레이오프 2 승자",
    };
    return playoffNames[playoffId] || "플레이오프 승자";
  };

  /**
   * 플레이오프에 참가하는 국가 목록 조회
   */
  const getPlayoffParticipants = (playoffId: string): string[] => {
    // pots.ts의 플레이오프 ID를 실제 플레이오프 ID로 매핑
    const playoffIdMap: Record<string, string> = {
      playoff_europe_1: "playoff_europe_d",
      playoff_europe_2: "playoff_europe_a",
      playoff_europe_3: "playoff_europe_c",
      playoff_europe_4: "playoff_europe_b",
      playoff_intercontinental_1: "playoff_fifa_1",
      playoff_intercontinental_2: "playoff_fifa_2",
    };

    const actualPlayoffId = playoffIdMap[playoffId] || playoffId;

    const participants: Record<string, string[]> = {
      // 유럽 플레이오프
      playoff_europe_d: ["denmark", "northmacedonia", "czechrepublic", "ireland"],
      playoff_europe_a: ["italy", "northernireland", "wales", "bosnia"],
      playoff_europe_c: ["turkiye", "romania", "slovakia", "kosovo"],
      playoff_europe_b: ["ukraine", "sweden", "poland", "albania"],
      // FIFA 플레이오프
      playoff_fifa_2: ["bolivia", "suriname", "iraq"],
      playoff_fifa_1: ["newcaledonia", "jamaica", "congodr"],
      // 하위 호환성
      playoff_europe: ["scotland", "norway", "sweden", "denmark", "poland", "turkiye"],
      playoff_a: ["ghana", "capeverde", "ivorycoast", "algeria"],
      playoff_b: ["uzbekistan", "jordan", "thailand", "vietnam"],
      playoff_c: ["newzealand", "panama", "jamaica", "costa"],
      playoff_1: ["china", "india", "saudiarabia", "uae"],
      playoff_2: ["russia", "iran", "qatar", "egypt"],
    };
    return participants[actualPlayoffId] || [];
  };

  /**
   * 팀이 검색어와 일치하는지 확인 (팀 이름 또는 선수 이름으로 검색)
   * 띄어쓰기를 제거하고 검색 (예: "손 흥민" → "손흥민"으로 검색)
   * 국가 이름 검색은 앞글자부터 시작해야 함 (startsWith 기반)
   * normalizeText를 사용하여 유니코드 정규화 및 whitespace 제거
   */
  const matchesSearch = (teamId: string, query: string): boolean => {
    if (!query) return true;

    // 검색어 정규화 (NFC, 모든 whitespace 제거, 소문자 변환)
    const normalizedQuery = normalizeText(query);

    const country = getCountryById(teamId);
    if (!country) {
      // 플레이오프 승자는 검색어가 포함되어 있으면 표시
      const playoffName = normalizeText(getPlayoffName(teamId));
      return playoffName.includes(normalizedQuery);
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
      return normalizedPlayerName.includes(normalizedQuery) || normalizedPlayerNameEn.includes(normalizedQuery);
    });
  };

  // standings API 데이터 로드 (국가 메타 정보)
  const [standings, setStandings] = useState<TeamStanding[]>([]);
  const [standingsLoaded, setStandingsLoaded] = useState(false);

  useEffect(() => {
    async function loadStandings() {
      try {
        console.log("[PotsTab] standings API 호출 시작");
        const standingsData = await fetchStandings();
        console.log("[PotsTab] standings API 응답 수신", {
          count: standingsData.standings?.length || 0,
        });
        setStandings(standingsData.standings || []);
        setStandingsLoaded(true);
      } catch (err) {
        console.error("[PotsTab] standings API 호출 실패", err);
      }
    }
    loadStandings();
  }, []);

  // selectedTeamId 변경 시 players API 호출
  useEffect(() => {
    console.log("[PotsTab] selectedTeamId 변경 감지", { selectedTeamId });

    async function loadPlayers() {
      // teamId가 없거나 플레이오프 국가인 경우 fetch 실행 안 함
      if (!selectedTeamId || isPlayoffTeam(selectedTeamId)) {
        console.log("[PotsTab] teamId가 유효하지 않아 players API 호출 차단", {
          selectedTeamId,
          isPlayoff: isPlayoffTeam(selectedTeamId),
        });
        setPlayers(null);
        setPlayersList([]);
        setLoadingPlayers(false);
        return;
      }

      try {
        console.log("[PotsTab] players API 호출 시작", {
          teamId: selectedTeamId,
          timestamp: new Date().toISOString(),
        });
        setLoadingPlayers(true);
        setPlayers(null);
        setPlayersList([]);

        const playersData = await fetchPlayersByTeamId(selectedTeamId);
        console.log("[PotsTab] players API 응답 수신", {
          team: playersData.team,
          playersCount: playersData.players?.length || 0,
        });

        // API response 구조 확인 및 처리
        let actualPlayers: PlayersResponse["players"] = [];
        if (playersData && typeof playersData === 'object') {
          if ('players' in playersData && Array.isArray(playersData.players)) {
            actualPlayers = playersData.players;
          } else if ('data' in playersData &&
                     typeof playersData.data === 'object' &&
                     playersData.data !== null &&
                     'players' in playersData.data &&
                     Array.isArray((playersData.data as any).players)) {
            actualPlayers = (playersData.data as any).players;
          } else if (Array.isArray(playersData)) {
            actualPlayers = playersData as any;
          }
        }

        console.log("[PotsTab] players state 설정", {
          playersCount: actualPlayers.length,
        });
        setPlayers(playersData);
        setPlayersList(actualPlayers);
      } catch (err) {
        console.error("[PotsTab] players API 호출 실패", {
          error: err,
          teamId: selectedTeamId,
        });
        setPlayers(null);
        setPlayersList([]);
      } finally {
        setLoadingPlayers(false);
        console.log("[PotsTab] players 로딩 완료", { teamId: selectedTeamId });
      }
    }

    loadPlayers();
  }, [selectedTeamId]);

  // 국가 클릭 핸들러: countryId (string) → teamId (number) 변환
  const handleCountryClick = useCallback((countryId: string) => {
    console.log("[PotsTab] 국가 클릭", { countryId });

    // standings에서 해당 국가의 team.id 찾기
    const standing = standings.find((s) => {
      const country = getCountryById(countryId);
      if (!country) return false;
      return s.team.name === country.name;
    });

    if (standing && standing.team.id !== null) {
      console.log("[PotsTab] teamId 설정", {
        countryId,
        teamId: standing.team.id,
        teamName: standing.team.name,
      });
      setSelectedTeamId(standing.team.id);
      setSelectedTeamStanding(standing);
    } else {
      console.warn("[PotsTab] teamId를 찾을 수 없음", {
        countryId,
        standingsCount: standings.length,
      });
      setSelectedTeamId(null);
      setSelectedTeamStanding(null);
    }
  }, [standings]);

  /**
   * 필터링된 포트 목록 (검색어 및 포트 필터 적용)
   */
  const filteredPots = useMemo(() => {
    return pots
      .filter((pot) => selectedPotFilter === null || pot.id === selectedPotFilter)
      .map((pot) => {
        const filteredTeams = pot.teams.filter((teamId) =>
          matchesSearch(teamId, searchQuery)
        );
        return { ...pot, teams: filteredTeams };
      })
      .filter((pot) => pot.teams.length > 0);
  }, [searchQuery, selectedPotFilter]);

  return (
    <div>
      {/* 국가 상세 정보 모달 */}
      <CountryModal countryId={selectedCountry} onClose={() => setSelectedCountry(null)} />

      <div id="pots-content" className="bg-white rounded-lg shadow-lg p-4 md:p-6">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 text-center border-b-4 border-blue-500 pb-3">
          포트별 팀 정보
        </h2>

        {/* 검색 및 필터 섹션 */}
        <div className="mb-6 space-y-4">
          {/* 검색 입력 */}
          <div className="relative">
            <input
              type="text"
              placeholder="팀 이름 또는 선수 이름으로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-white text-gray-800"
            />
            <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
          </div>

          {/* 포트 필터 버튼 */}
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setSelectedPotFilter(null)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                selectedPotFilter === null
                  ? "bg-blue-600 text-white shadow-lg scale-105"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              전체
            </button>
            {pots.map((pot) => (
              <button
                key={pot.id}
                onClick={() => setSelectedPotFilter(pot.id)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  selectedPotFilter === pot.id
                    ? "bg-blue-600 text-white shadow-lg scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {pot.name}
              </button>
            ))}
          </div>
        </div>

        {/* 포트별 팀 목록 */}
        {filteredPots.length > 0 ? (
          // 포트별 표시
          <div className="space-y-6">
            {filteredPots.map((pot) => (
              <div
                key={pot.id}
                className="bg-gray-50 rounded-lg p-4 md:p-6 border-2 border-gray-200"
              >
                <h3 className="text-xl md:text-2xl font-bold mb-4 text-gray-800">
                  {pot.name}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {pot.teams.map((teamId, index) => {
                    const country = getCountryById(teamId);

                    if (!country) {
                      // 플레이오프 승자 - 유럽 플레이오프는 참가국들을 표시
                      const participants = getPlayoffParticipants(teamId);

                      // 유럽 플레이오프인 경우 참가국들을 표시
                      if ((teamId.startsWith("playoff_europe") || teamId.startsWith("playoff_intercontinental")) && participants.length > 0) {
                        return (
                          <div
                            key={`${pot.id}-${teamId}-${index}`}
                            className="col-span-full"
                          >
                            <div className="mb-2 text-sm font-semibold text-gray-700">
                              {getPlayoffName(teamId)} 참가국:
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                              {participants.map((participantId) => {
                                const participantCountry = getCountryById(participantId);
                                if (!participantCountry) return null;

                                return (
                                  <button
                                    key={participantId}
                                    onClick={() => setSelectedCountry(participantId)}
                                    className="px-4 py-3 bg-blue-50 rounded-lg border-2 border-blue-200 hover:border-blue-400 hover:shadow-md transition-all flex flex-col items-center justify-center gap-2"
                                  >
                                    <Flag country={participantCountry} size="lg" />
                                    <span className="text-sm font-semibold text-gray-800 text-center">
                                      {participantCountry.name}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      }

                      // 다른 플레이오프는 기존대로 표시
                      return (
                        <div
                          key={`${pot.id}-${index}`}
                          className="px-4 py-3 bg-gray-200 rounded-lg border-2 border-dashed border-gray-400 text-center"
                        >
                          <div className="text-sm font-medium text-gray-700">
                            {getPlayoffName(teamId)}
                          </div>
                        </div>
                      );
                    }

                  // 일반 국가
                  return (
                    <button
                      key={country.id}
                      onClick={() => {
                        console.log("[PotsTab] 국가 클릭", { countryId: country.id, countryName: country.name });
                        handleCountryClick(country.id);
                      }}
                      className="px-4 py-3 bg-blue-50 rounded-lg border-2 border-blue-200 hover:border-blue-400 hover:shadow-md transition-all flex flex-col items-center justify-center gap-2 relative group"
                    >
                      <Flag country={country} size="lg" />
                      <span className="text-sm font-semibold text-gray-800 text-center">
                        {country.name}
                      </span>
                      {searchQuery && matchesSearch(country.id, searchQuery) && (
                        <span className="absolute inset-0 border-2 border-yellow-400 rounded-lg animate-pulse" />
                      )}
                    </button>
                  );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-600">
            검색 결과가 없습니다.
          </div>
        )}

        {/* 선수 명단 표시 섹션 */}
        {selectedTeamId && selectedTeamStanding && (
          <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 mt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <img
                  src={selectedTeamStanding.crest}
                  alt={selectedTeamStanding.team.name}
                  className="w-12 h-12 object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {selectedTeamStanding.team.name} 선수 명단
                  </h3>
                  <p className="text-sm text-gray-600">
                    {selectedTeamStanding.group}조 · {selectedTeamStanding.position}위
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  console.log("[PotsTab] 선수 명단 닫기");
                  setSelectedTeamId(null);
                  setSelectedTeamStanding(null);
                  setPlayers(null);
                  setPlayersList([]);
                }}
                className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                닫기
              </button>
            </div>

            {loadingPlayers ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-gray-600">선수 정보를 불러오는 중...</p>
              </div>
            ) : playersList && playersList.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {playersList.map((player) => (
                  <div
                    key={player.id}
                    className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <h4 className="font-semibold text-gray-800">{player.name}</h4>
                    {player.nameEn && (
                      <p className="text-sm text-gray-600">{player.nameEn}</p>
                    )}
                    <p className="text-sm text-gray-500 mt-1">
                      {player.position}
                      {player.age && ` · ${player.age}세`}
                      {player.club && ` · ${player.club}`}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-600">
                {players ? "선수 정보가 없습니다." : "선수 정보를 불러올 수 없습니다."}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
