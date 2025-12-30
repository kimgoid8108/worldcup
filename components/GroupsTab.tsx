/**
 * GroupsTab 컴포넌트
 *
 * 용도: 2026 FIFA 월드컵 조별 경기 정보를 표시하는 탭 컴포넌트
 * - 조 탭(A~L)을 클릭하여 각 조의 참가국과 경기 일정을 확인
 * - 국가 클릭 시 국가 상세 정보 모달 표시
 */

"use client";

import { useState, useMemo, useEffect } from "react";
import { groups, Match } from "@/data/groups";
import { getCountryById, countries } from "@/data/countries";
import { stadiums } from "@/data/stadiums";
import { pots } from "@/data/pots";
import { getPlayersByCountry, Player } from "@/data/players";
import CountryModal from "./CountryModal";
import PlayerModal from "./PlayerModal";

export default function GroupsTab() {
  // 선택된 국가 ID (국가 모달 표시용)
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  // 선택된 선수 (선수 모달 표시용)
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [selectedPlayerCountryName, setSelectedPlayerCountryName] = useState<string | undefined>(undefined);

  // 선택된 조 ID (기본값: A조)
  const [selectedGroup, setSelectedGroup] = useState<string>("A");

  // 검색어
  const [searchQuery, setSearchQuery] = useState("");

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
      playoff_europe: ["scotland", "norway", "sweden", "denmark", "poland", "turkey"], // 유럽 플레이오프 참가국
      playoff_a: ["ghana", "capeverde", "ivorycoast", "algeria"], // 플레이오프 A 참가국
      playoff_b: ["uzbekistan", "jordan", "thailand", "vietnam"], // 플레이오프 B 참가국
      playoff_c: ["newzealand", "panama", "jamaica", "costa"], // 플레이오프 C 참가국
      playoff_1: ["china", "india", "saudiarabia", "uae"], // 플레이오프 1 참가국
      playoff_2: ["russia", "iran", "qatar", "egypt"], // 플레이오프 2 참가국
    };
    return participants[playoffId] || [];
  };

  // 현재 선택된 조 정보 (메모이제이션으로 불필요한 재계산 방지)
  const currentGroup = useMemo(
    () => groups.find((g) => g.id === selectedGroup),
    [selectedGroup]
  );

  /**
   * 팀이 검색어와 일치하는지 확인 (팀 이름 또는 선수 이름으로 검색)
   * 띄어쓰기를 제거하고 검색 (예: "손 흥민" → "손흥민"으로 검색)
   */
  const matchesSearch = (teamId: string, query: string): boolean => {
    if (!query) return true;

    // 검색어에서 띄어쓰기 제거 및 소문자 변환
    const normalizedQuery = query.replace(/\s+/g, "").toLowerCase();

    const country = getCountryById(teamId);
    if (!country) {
      // 플레이오프 승자는 검색어가 포함되어 있으면 표시
      const playoffName = getPlayoffName(teamId).replace(/\s+/g, "").toLowerCase();
      return playoffName.includes(normalizedQuery);
    }

    // 팀 이름으로 검색 (띄어쓰기 제거)
    const normalizedCountryName = country.name.replace(/\s+/g, "").toLowerCase();
    if (normalizedCountryName.includes(normalizedQuery)) {
      return true;
    }

    // 선수 이름으로 검색 (띄어쓰기 제거) - 한국어 및 영어 모두 검색
    const players = getPlayersByCountry(teamId);
    return players.some((player) => {
      const normalizedPlayerName = player.name.replace(/\s+/g, "").toLowerCase();
      const normalizedPlayerNameEn = player.nameEn?.replace(/\s+/g, "").toLowerCase() || "";
      return normalizedPlayerName.includes(normalizedQuery) || normalizedPlayerNameEn.includes(normalizedQuery);
    });
  };

  // 검색어에 따라 필터링된 조 목록
  const filteredGroups = useMemo(() => {
    if (!searchQuery) return groups;
    return groups.filter((group) => {
      return group.countries.some((countryId) => matchesSearch(countryId, searchQuery));
    });
  }, [searchQuery]);

  // 검색어가 있고 현재 선택된 조가 검색 결과에 없으면 첫 번째 검색 결과 조로 자동 전환
  useEffect(() => {
    if (searchQuery && filteredGroups.length > 0) {
      const isCurrentGroupInResults = filteredGroups.some((g) => g.id === selectedGroup);
      if (!isCurrentGroupInResults) {
        setSelectedGroup(filteredGroups[0].id);
      }
    }
  }, [searchQuery, filteredGroups, selectedGroup]);

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

  // 검색어에 맞는 선수 목록 (검색란 아래 표시용)
  const searchedPlayers = useMemo(() => {
    if (!searchQuery) return [];

    const normalizedQuery = searchQuery.replace(/\s+/g, "").toLowerCase();
    const results: Array<{ player: Player; countryId: string; countryName: string }> = [];

    // 모든 국가를 순회하며 선수 검색 - 한국어 및 영어 모두 검색
    countries.forEach((country) => {
      const players = getPlayersByCountry(country.id);
      players.forEach((player) => {
        const normalizedPlayerName = player.name.replace(/\s+/g, "").toLowerCase();
        const normalizedPlayerNameEn = player.nameEn?.replace(/\s+/g, "").toLowerCase() || "";
        if (normalizedPlayerName.includes(normalizedQuery) || normalizedPlayerNameEn.includes(normalizedQuery)) {
          results.push({
            player,
            countryId: country.id,
            countryName: country.name,
          });
        }
      });
    });

    return results;
  }, [searchQuery]);

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
      <CountryModal countryId={selectedCountry} onClose={() => setSelectedCountry(null)} />

      {/* 경기 상세 정보 모달 */}
      {selectedMatch && (() => {
        const team1 = getCountryById(selectedMatch.team1);
        const team2 = getCountryById(selectedMatch.team2);
        const stadium = getStadium(selectedMatch.stadium);
        const team1Name = team1 ? team1.name : getPlayoffName(selectedMatch.team1);
        const team2Name = team2 ? team2.name : getPlayoffName(selectedMatch.team2);
        const team1Players = team1 ? getPlayersByCountry(selectedMatch.team1) : [];
        const team2Players = team2 ? getPlayersByCountry(selectedMatch.team2) : [];

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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4" onClick={() => setSelectedMatch(null)}>
            <div className="bg-white rounded-lg shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              {/* 모달 헤더 */}
              <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-lg flex items-center justify-between">
                <h3 className="text-2xl font-bold flex items-center gap-3">
                  <span className="text-2xl">{team1 ? team1.flag : "⚽"}</span>
                  <span>{team1Name}</span>
                  <span className="px-3 py-1 bg-white text-blue-600 rounded-full font-bold text-sm">VS</span>
                  <span>{team2Name}</span>
                  <span className="text-2xl">{team2 ? team2.flag : "⚽"}</span>
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
                        <span className="font-semibold text-gray-700">경기장명:</span>
                        <span className="ml-2 text-gray-800">{stadium.name}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">위치:</span>
                        <span className="ml-2 text-gray-800">{stadium.city}, {stadium.country}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">수용 인원:</span>
                        <span className="ml-2 text-gray-800">{stadium.capacity.toLocaleString()}명</span>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">경기 시간:</span>
                        <span className="ml-2 text-gray-800">{selectedMatch.date} {selectedMatch.time}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 선수 명단 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 팀1 선수 명단 */}
                  {team1 && team1Players.length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
                      <h4 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <span className="text-lg">{team1 ? team1.flag : "⚽"}</span>
                        <span>{team1Name} 선수 명단</span>
                      </h4>
                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {team1Players.map((player) => (
                          <div
                            key={player.id}
                            onClick={() => {
                              setSelectedPlayer(player);
                              setSelectedPlayerCountryName(team1Name);
                            }}
                            className="p-2 bg-white rounded border border-gray-200 hover:border-blue-400 hover:shadow-sm transition-all cursor-pointer"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-semibold text-gray-800 text-sm">
                                  {player.name}
                                  {player.nameEn && (
                                    <span className="text-xs font-normal text-gray-600 ml-1">
                                      ({player.nameEn})
                                    </span>
                                  )}
                                </p>
                                <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
                                  <span>{getPositionName(player.position)}</span>
                                  <span>•</span>
                                  <span>{player.age}세</span>
                                  <span>•</span>
                                  <span>{player.club}</span>
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
                    <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
                      <h4 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <span className="text-lg">{team2 ? team2.flag : "⚽"}</span>
                        <span>{team2Name} 선수 명단</span>
                      </h4>
                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {team2Players.map((player) => (
                          <div
                            key={player.id}
                            onClick={() => {
                              setSelectedPlayer(player);
                              setSelectedPlayerCountryName(team2Name);
                            }}
                            className="p-2 bg-white rounded border border-gray-200 hover:border-blue-400 hover:shadow-sm transition-all cursor-pointer"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-semibold text-gray-800 text-sm">
                                  {player.name}
                                  {player.nameEn && (
                                    <span className="text-xs font-normal text-gray-600 ml-1">
                                      ({player.nameEn})
                                    </span>
                                  )}
                                </p>
                                <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
                                  <span>{getPositionName(player.position)}</span>
                                  <span>•</span>
                                  <span>{player.age}세</span>
                                  <span>•</span>
                                  <span>{player.club}</span>
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

      <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 text-center border-b-4 border-blue-500 pb-3">
          조별 경기 정보
        </h2>

          {/* 검색 입력 */}
          <div className="mb-6">
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

            {/* 검색된 선수 목록 */}
            {searchQuery && searchedPlayers.length > 0 && (
              <div className="mt-4 bg-gray-50 rounded-lg p-4 border-2 border-blue-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  검색된 선수 ({searchedPlayers.length}명)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {searchedPlayers.map(({ player, countryId, countryName }) => {
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
                          {country && <span className="text-xl">{country.flag}</span>}
                          <span className="text-xs text-gray-600">{countryName}</span>
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
                  })}
                </div>
              </div>
            )}
          </div>

        {/* 조 탭 버튼들 (A~L) */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 justify-center">
            {filteredGroups.map((group) => (
              <button
                key={group.id}
                onClick={() => setSelectedGroup(group.id)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  selectedGroup === group.id
                    ? "bg-blue-600 text-white shadow-lg scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {group.name}
              </button>
            ))}
          </div>
        </div>

        {/* 선택된 조의 상세 정보 */}
        {currentGroup && (
          <div className="bg-gray-50 rounded-lg shadow-lg p-4 md:p-6 max-w-5xl mx-auto">
            {/* 조 제목 */}
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gray-800 border-b-4 border-blue-500 pb-3">
                {currentGroup.name}
              </h2>
            </div>

            {/* 참가국 섹션 */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <span>🏆</span>
                <span>참가국</span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {currentGroup.countries.map((countryId) => {
                  const country = getCountryById(countryId);

                  // 플레이오프 승자 처리 (아직 확정되지 않은 팀)
                  if (!country) {
                    const participants = getPlayoffParticipants(countryId);
                    return (
                      <div
                        key={countryId}
                        className="px-4 py-3 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300"
                      >
                        <div className="text-sm font-medium text-gray-600 mb-2">
                          {getPlayoffName(countryId)}
                        </div>
                        {participants.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-gray-300">
                            <div className="text-xs font-semibold text-gray-500 mb-1">경쟁 국가:</div>
                            <div className="flex flex-wrap gap-1 justify-center">
                              {participants.map((participantId) => {
                                const participant = getCountryById(participantId);
                                if (!participant) return null;
                                return (
                                  <div
                                    key={participantId}
                                    className="flex items-center gap-1 px-2 py-1 bg-white rounded border border-gray-200 text-xs"
                                  >
                                    <span>{participant.flag}</span>
                                    <span className="text-gray-700">{participant.name}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  }

                  // 일반 국가 카드 (클릭 시 국가 모달 표시)
                  const isHighlighted = searchQuery && matchesSearch(countryId, searchQuery);

                  return (
                    <button
                      key={countryId}
                      onClick={() => setSelectedCountry(countryId)}
                      className={`px-4 py-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all flex flex-col items-center gap-2 border-2 border-blue-200 hover:border-blue-400 hover:shadow-md relative ${
                        isHighlighted ? "ring-2 ring-yellow-400" : ""
                      }`}
                    >
                      <span className="text-3xl">{country.flag}</span>
                      <span className="text-sm font-semibold text-gray-800">
                        {country.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 경기 일정 섹션 */}
            <div>
              <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <span>📅</span>
                <span>경기 일정</span>
              </h3>
              <div className="space-y-3">
                {currentGroup.matches.map((match) => {
                  const team1 = getCountryById(match.team1);
                  const team2 = getCountryById(match.team2);

                  // 팀 이름과 국기 설정 (플레이오프 승자 처리 포함)
                  const team1Name = team1 ? team1.name : getPlayoffName(match.team1);
                  const team2Name = team2 ? team2.name : getPlayoffName(match.team2);
                  const team1Flag = team1 ? team1.flag : "⚽";
                  const team2Flag = team2 ? team2.flag : "⚽";

                  const isTeam1Highlighted = team1 && searchQuery && matchesSearch(match.team1, searchQuery);
                  const isTeam2Highlighted = team2 && searchQuery && matchesSearch(match.team2, searchQuery);

                  return (
                    <div
                      key={match.id}
                      onClick={() => setSelectedMatch(match)}
                      className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border-2 border-gray-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                    >
                      {/* 팀 대전 정보 */}
                      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                        <div className={`flex items-center gap-3 flex-1 min-w-[120px] ${
                          isTeam1Highlighted ? "ring-2 ring-yellow-400 rounded-lg p-2" : ""
                        }`}>
                          <span className="text-2xl">{team1Flag}</span>
                          <span className="font-semibold text-gray-800 text-sm md:text-base">
                            {team1Name}
                          </span>
                        </div>
                        <div className="px-4 py-1 bg-blue-500 text-white rounded-full font-bold text-sm mx-2">
                          VS
                        </div>
                        <div className={`flex items-center gap-3 flex-1 min-w-[120px] justify-end ${
                          isTeam2Highlighted ? "ring-2 ring-yellow-400 rounded-lg p-2" : ""
                        }`}>
                          <span className="font-semibold text-gray-800 text-sm md:text-base">
                            {team2Name}
                          </span>
                          <span className="text-2xl">{team2Flag}</span>
                        </div>
                      </div>

                      {/* 경기 일시 및 경기장 정보 */}
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-300 flex-wrap gap-2">
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">📆 {match.date}</span>
                          <span className="mx-2">•</span>
                          <span className="font-medium">🕐 {match.time}</span>
                        </div>
                        <div className="text-sm text-gray-700 font-medium">
                          🏟️ {getStadiumName(match.stadium)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
