/**
 * PotsTab 컴포넌트
 *
 * 용도: 포트별 팀 정보를 표시하는 탭 컴포넌트
 * - 각 포트별 참가 팀 표시 (국기 + 국가명)
 * - 검색 기능: 팀 이름으로 검색 가능
 * - 필터 기능: 특정 포트만 보기
 * - 국가 클릭 시 선수 명단 표시 (API 사용)
 *
 * ⚠️ 중요:
 * - 포트 화면에서만 API 사용 (fetchPotsTeams, fetchPlayersByTeamId)
 * - 모든 매칭은 team.id(number) 하나로 통일
 * - team.name으로 매칭한 후 team.id로 변환하여 사용
 */

"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { pots } from "@/data/pots";
import { getCountryByTeamId, createCountriesFromTeams, type Country } from "@/data/countries";
import Flag from "@/components/ui/Flag";
import { normalizeText } from "@/src/utils/normalizeText";
import { fetchPotsTeams, fetchPlayersByTeamId } from "@/src/utils/api";
import { getTeamById } from "@/src/utils/team";
import { getFifaRankingByTeamName } from "@/data/fifaRankings";
import type { FrontTeam, FrontPlayersResponse } from "@/src/types/api";
import PlayerList from "@/components/cards/PlayerList";
import { type Player } from "@/types/player";
import PlayerModal from "@/components/modals/PlayerModal";

export default function PotsTab() {
  // 검색어
  const [searchQuery, setSearchQuery] = useState("");
  // 선택된 포트 필터 (기본값: 첫 번째 포트)
  const [selectedPotFilter, setSelectedPotFilter] = useState<number | null>(pots[0]?.id ?? null);

  // teams API 데이터 로드 (기준 데이터: team.id, name, crest)
  const [teams, setTeams] = useState<FrontTeam[]>([]);
  const [teamsLoaded, setTeamsLoaded] = useState(false);
  const [teamsError, setTeamsError] = useState<string | null>(null);

  // 동적으로 생성된 countries 배열 (API teams 데이터 기반)
  const [countriesList, setCountriesList] = useState<Country[]>([]);

  // 선수 명단 관련 상태
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [playersData, setPlayersData] = useState<FrontPlayersResponse | null>(null);
  const [playersLoading, setPlayersLoading] = useState(false);
  const [playersError, setPlayersError] = useState<string | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  /**
   * 팀이 검색어와 일치하는지 확인 (팀 이름으로 검색)
   * ⚠️ 중요: 검색은 UI 표시용 한글 이름으로만 수행됩니다.
   * team.id를 기준으로 country 정보를 조회하여 검색합니다.
   */
  const matchesSearch = useCallback(
    (teamId: number | null, query: string): boolean => {
      if (!query || !teamId) return true;

      // 검색어 정규화 (NFC, 모든 whitespace 제거, 소문자 변환)
      const normalizedQuery = normalizeText(query);

      // country 정보는 UI 표시용으로만 조회
      const country = getCountryByTeamId(teamId, countriesList);
      if (!country) {
        return false;
      }

      // 팀 이름으로 검색 (앞글자부터 시작해야 함)
      const normalizedCountryName = normalizeText(country.nameKo || "");
      return normalizedCountryName.startsWith(normalizedQuery);
    },
    [countriesList]
  );

  /**
   * 모달 열림/닫힘 시 배경 스크롤 제어
   * - 모달이 열리면 배경 스크롤만 잠금 (배경은 보이도록 유지)
   * - 모달이 닫히면 스크롤 복원
   * - wheel/touchmove 이벤트로 배경 스크롤만 차단
   * - 모달 내부에서 스크롤이 끝에 도달해도 배경 스크롤 방지
   */
  useEffect(() => {
    if (selectedTeamId) {
      /**
       * 배경 스크롤 완전 차단 함수
       * 모달 내부(.modal-content)가 아닌 영역의 스크롤을 완전히 차단
       * 모달 내부에서 스크롤이 끝에 도달해도 배경 스크롤 방지
       */
      const preventScroll = (e: WheelEvent | TouchEvent) => {
        // e.target이 Element인지 확인
        if (!(e.target instanceof Element)) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }

        const target = e.target as HTMLElement;
        const modalContent = target.closest(".modal-content") as HTMLElement;

        // 모달 내부가 아닌 경우 무조건 스크롤 차단
        if (!modalContent) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }

        // 모달 내부인 경우, 스크롤이 끝에 도달했는지 확인
        if (modalContent) {
          const { scrollTop, scrollHeight, clientHeight } = modalContent;
          const isScrollAtTop = scrollTop === 0;
          const isScrollAtBottom = scrollTop + clientHeight >= scrollHeight - 1;

          // wheel 이벤트인 경우
          if (e instanceof WheelEvent) {
            const deltaY = e.deltaY;

            // 위로 스크롤하려고 할 때 이미 맨 위에 있으면 배경 스크롤 방지
            if (deltaY < 0 && isScrollAtTop) {
              e.preventDefault();
              e.stopPropagation();
              return false;
            }

            // 아래로 스크롤하려고 할 때 이미 맨 아래에 있으면 배경 스크롤 방지
            if (deltaY > 0 && isScrollAtBottom) {
              e.preventDefault();
              e.stopPropagation();
              return false;
            }
          }

          // touchmove 이벤트인 경우 (터치 스크롤이 끝에 도달했을 때 배경 스크롤 방지)
          if (e instanceof TouchEvent && (isScrollAtTop || isScrollAtBottom)) {
            // 모달 내부 스크롤이 끝에 도달했을 때는 배경 스크롤 방지
            // 다만 실제 터치 스크롤은 모달 내부에서만 동작하도록 함
          }
        }
      };

      // 전역 스크롤 이벤트 리스너 추가 (여러 이벤트 타입)
      window.addEventListener("wheel", preventScroll, { passive: false, capture: true });
      window.addEventListener("touchmove", preventScroll, { passive: false, capture: true });
      document.addEventListener("wheel", preventScroll, { passive: false, capture: true });
      document.addEventListener("touchmove", preventScroll, { passive: false, capture: true });

      // cleanup: 모달 닫힐 때 이벤트 리스너 제거
      return () => {
        window.removeEventListener("wheel", preventScroll, true);
        window.removeEventListener("touchmove", preventScroll, true);
        document.removeEventListener("wheel", preventScroll, true);
        document.removeEventListener("touchmove", preventScroll, true);
      };
    }
  }, [selectedTeamId]);

  // 포트 팀 API 데이터 로드
  useEffect(() => {
    async function loadTeams() {
      try {
        console.log("[PotsTab] Pots Teams API 호출 시작");
        setTeamsError(null);
        const teamsData = await fetchPotsTeams();
        console.log("[PotsTab] Pots Teams API 응답 수신", {
          teamsCount: teamsData.teams?.length || 0,
        });

        const teamsList = teamsData.teams || [];
        setTeams(teamsList);
        setTeamsLoaded(true);

        // API teams 데이터를 기반으로 countries 배열 동적 생성
        const dynamicCountries = createCountriesFromTeams(teamsList);
        setCountriesList(dynamicCountries);

        console.log("[PotsTab] Pots Teams 데이터 로드 완료", {
          totalTeams: teamsList.length,
          teamsWithValidId: teamsList.filter((t) => t.id !== null && t.id !== 0).length,
          countriesCreated: dynamicCountries.length,
        });
      } catch (err) {
        console.error("[PotsTab] Pots Teams API 호출 실패", err);
        setTeamsLoaded(false);
        setTeamsError(err instanceof Error ? err.message : "팀 정보를 불러올 수 없습니다.");
      }
    }
    loadTeams();
  }, []);

  /**
   * team.name으로 team 찾기 (team.id 반환)
   * ⚠️ 중요: team.name으로 매칭한 후 team.id로 변환
   */
  const getTeamIdFromTeamName = useCallback(
    (teamName: string): number | null => {
      if (!teamName) {
        return null;
      }

      // team.name으로 매칭 (대소문자 무시)
      const team = teams.find((t) => {
        if (!t?.name || !t?.id) return false;
        return t.name.toLowerCase() === teamName.toLowerCase();
      });

      if (!team || !team.id || team.id === 0) {
        console.warn("[PotsTab] team.name으로 team.id 찾기 실패", {
          teamName,
          teamsCount: teams.length,
        });
        return null;
      }

      return team.id;
    },
    [teams]
  );

  /**
   * teamId로 FIFA 랭킹 조회 (로컬 데이터 사용)
   */
  const getFifaRankingByTeamId = useCallback(
    (teamId: number | null): { rank: number; points: number } | null => {
      if (!teamId) return null;

      // team.id로 team 찾기
      const team = getTeamById(teams, teamId);
      if (!team || !team.name) return null;

      // team.name으로 FIFA 랭킹 조회
      return getFifaRankingByTeamName(team.name);
    },
    [teams]
  );

  // 국가 클릭 핸들러
  const handleTeamClick = useCallback(async (teamId: number, team: FrontTeam) => {
    setSelectedTeamId(teamId);
    setPlayersLoading(true);
    setPlayersError(null);
    setSelectedPlayer(null);

    try {
      const data = await fetchPlayersByTeamId(teamId, {
        id: team.id!,
        name: team.name,
        crest: team.crest,
      });
      setPlayersData(data);
    } catch (err) {
      console.error("[PotsTab] 선수 데이터 로드 실패", err);
      setPlayersError(err instanceof Error ? err.message : "선수 데이터를 불러올 수 없습니다.");
    } finally {
      setPlayersLoading(false);
    }
  }, []);

  // 선수 데이터를 Player 타입으로 변환
  const playersList: Player[] = useMemo(() => {
    if (!playersData || !playersData.players) return [];
    return playersData.players
      .filter((p) => p.age !== undefined && p.age !== null && p.club !== undefined && p.club !== null)
      .map((p) => ({
        id: p.id,
        name: p.name,
        nameEn: p.nameEn,
        position: p.position,
        age: p.age!,
        club: p.club!,
      }));
  }, [playersData]);

  /**
   * 필터링된 포트 목록 (검색어 및 포트 필터 적용)
   */
  const filteredPots = useMemo(() => {
    // selectedPotFilter가 null이면 첫 번째 포트를 기본값으로 사용
    const activePotFilter = selectedPotFilter ?? pots[0]?.id ?? null;

    return pots
      .filter((pot) => activePotFilter === null || pot.id === activePotFilter)
      .map((pot) => {
        const filteredTeams = pot.teams.filter((teamNameOrPlayoff) => {
          // 플레이오프는 검색에서 제외
          if (typeof teamNameOrPlayoff === "string" && teamNameOrPlayoff.startsWith("playoff_")) {
            return true; // 플레이오프는 항상 표시
          }

          if (!searchQuery) return true;

          // team.name으로 team.id 찾기
          const teamId = getTeamIdFromTeamName(teamNameOrPlayoff);
          if (!teamId) return false;

          return matchesSearch(teamId, searchQuery);
        });
        return { ...pot, teams: filteredTeams };
      })
      .filter((pot) => pot.teams.length > 0);
  }, [searchQuery, selectedPotFilter, getTeamIdFromTeamName, matchesSearch]);

  return (
    <div>
      <div id="pots-content" className="bg-white rounded-lg shadow-lg p-4 md:p-6">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 text-center border-b-4 border-blue-500 pb-3">포트별 팀 정보</h2>

        {/* 검색 및 필터 섹션 */}
        <div className="mb-6 space-y-4">
          {/* 검색 입력 */}
          <div className="relative">
            <input
              type="text"
              placeholder="팀 이름으로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-white text-gray-800"
            />
            <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
          </div>

          {/* 포트 필터 버튼 */}
          <div className="flex flex-wrap gap-2 justify-center">
            {pots.map((pot) => (
              <button
                key={pot.id}
                onClick={() => setSelectedPotFilter(pot.id)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  selectedPotFilter === pot.id ? "bg-blue-600 text-white shadow-lg scale-105" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}>
                {pot.name}
              </button>
            ))}
          </div>
        </div>

        {/* 포트별 팀 목록 */}
        {filteredPots.length > 0 ? (
          <div className="space-y-6">
            {filteredPots.map((pot) => (
              <div key={pot.id} className="bg-gray-50 rounded-lg p-4 md:p-6 border-2 border-gray-200">
                <h3 className="text-xl md:text-2xl font-bold mb-4 text-gray-800">{pot.name}</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {pot.teams.map((teamNameOrPlayoff, index) => {
                    // 플레이오프 승자 체크
                    if (typeof teamNameOrPlayoff === "string" && teamNameOrPlayoff.startsWith("playoff_")) {
                      return (
                        <div key={`${pot.id}-${teamNameOrPlayoff}-${index}`} className="px-4 py-3 bg-gray-200 rounded-lg border-2 border-dashed border-gray-400 text-center">
                          <div className="text-sm font-medium text-gray-700">{teamNameOrPlayoff.replace("playoff_", "").replace(/_/g, " ").toUpperCase()} 플레이오프 승자</div>
                        </div>
                      );
                    }

                    // team.name으로 team.id 찾기
                    const teamId = getTeamIdFromTeamName(teamNameOrPlayoff);
                    if (!teamId) {
                      console.warn("[PotsTab] teamId를 찾을 수 없음", { teamNameOrPlayoff });
                      return null;
                    }

                    // team.id로 team 찾기 (getTeamById 유틸 사용)
                    const team = getTeamById(teams, teamId);
                    if (!team || !team.id) {
                      console.warn("[PotsTab] team을 찾을 수 없음", { teamNameOrPlayoff, teamId });
                      return null;
                    }

                    // FIFA 랭킹 조회 (data 파일 사용)
                    const fifaRanking = getFifaRankingByTeamId(team.id);

                    // country 정보는 UI 표시용으로만 조회 (동적으로 생성된 countriesList 사용)
                    const country = getCountryByTeamId(team.id, countriesList);
                    if (!country) {
                      console.warn("[PotsTab] country를 찾을 수 없음", { teamId: team.id, teamName: team.name });
                      return null;
                    }

                    // 일반 국가: 국기 + 국가명만 표시 (클릭 가능)
                    return (
                      <button
                        key={`${pot.id}-${team.id}-${index}`}
                        onClick={() => handleTeamClick(team.id!, team)}
                        className="px-4 py-3 bg-blue-50 rounded-lg border-2 border-blue-200 flex flex-col items-center justify-center gap-2 relative group hover:bg-blue-100 hover:border-blue-400 transition-colors cursor-pointer">
                        <Flag country={country} size="lg" />
                        <span className="text-sm font-semibold text-gray-800 text-center">{country.nameKo}</span>
                        {fifaRanking && (
                          <span className="text-xs text-gray-500 mt-1">
                            FIFA {fifaRanking.rank}위 ({fifaRanking.points}점)
                          </span>
                        )}
                        {searchQuery && matchesSearch(team.id, searchQuery) && <span className="absolute inset-0 border-2 border-yellow-400 rounded-lg animate-pulse" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-600">검색 결과가 없습니다.</div>
        )}

        {/* API 로드 실패 시 fallback UI */}
        {teamsError && (
          <div className="mt-6 bg-red-50 border-2 border-red-200 rounded-lg p-4">
            <p className="text-red-800 font-semibold mb-2">⚠️ 팀 정보를 불러올 수 없습니다</p>
            <p className="text-sm text-red-600">{teamsError}</p>
          </div>
        )}
      </div>

      {/* 선수 명단 모달 */}
      {selectedTeamId && (
        <div
          className="fixed inset-0 z-[30] flex items-center justify-center p-4"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            pointerEvents: "auto",
            backdropFilter: "blur(4px)",
          }}
          onClick={() => {
            setSelectedTeamId(null);
            setPlayersData(null);
            setSelectedPlayer(null);
          }}>
          <div
            className="modal-content bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            style={{ pointerEvents: "auto", position: "relative", zIndex: 31 }}
            onClick={(e) => e.stopPropagation()}>
            {/* 모달 헤더 */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-lg flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                {playersData &&
                  (() => {
                    const country = getCountryByTeamId(playersData.team.id, countriesList);
                    return country ? <Flag country={country} size="md" /> : null;
                  })()}
                <h3 className="text-xl md:text-2xl font-bold">{playersData?.team.name || "선수 명단"}</h3>
              </div>
              <button
                onClick={() => {
                  setSelectedTeamId(null);
                  setPlayersData(null);
                  setSelectedPlayer(null);
                }}
                className="text-white hover:text-gray-200 text-3xl font-bold w-10 h-10 flex items-center justify-center rounded-full hover:bg-white hover:bg-opacity-20 transition-colors">
                ×
              </button>
            </div>

            {/* 모달 내용 */}
            <div className="p-6">
              {playersLoading ? (
                <div className="text-center py-16">
                  <p className="text-gray-600">선수 명단을 불러오는 중...</p>
                </div>
              ) : playersError ? (
                <div className="text-center py-16">
                  <p className="text-red-600 font-semibold mb-2">⚠️ 오류 발생</p>
                  <p className="text-sm text-gray-600">{playersError}</p>
                </div>
              ) : playersList.length > 0 ? (
                <PlayerList players={playersList} onPlayerClick={(player) => setSelectedPlayer(player)} />
              ) : (
                <div className="text-center py-16">
                  <p className="text-gray-600">선수 명단이 없습니다.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 선수 상세 정보 모달 */}
      <PlayerModal player={selectedPlayer} countryName={playersData?.team.name} onClose={() => setSelectedPlayer(null)} />
    </div>
  );
}
