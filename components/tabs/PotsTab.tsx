/**
 * PotsTab 컴포넌트
 *
 * 용도: 포트별 팀 정보를 표시하는 탭 컴포넌트
 * - 각 포트별 참가 팀 표시 (국기 + 국가명)
 * - 검색 기능: 팀 이름으로 검색 가능
 * - 필터 기능: 특정 포트만 보기
 *
 * ⚠️ 중요:
 * - 포트 화면에서는 선수 API를 절대 호출하지 않음
 * - 모든 매칭은 team.id(number) 하나로 통일
 * - team.name으로 매칭한 후 team.id로 변환하여 사용
 */

"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { pots } from "@/data/pots";
import { getCountryByTeamId, createCountriesFromTeams, type Country } from "@/data/countries";
import Flag from "@/components/ui/Flag";
import { normalizeText } from "@/src/utils/normalizeText";
import { fetchPotsTeams } from "@/src/utils/api";
import { getTeamById } from "@/src/utils/team";
import { getFifaRankingByTeamName } from "@/data/fifaRankings";
import type { FrontTeam } from "@/src/types/api";

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

                    // 일반 국가: 국기 + 국가명만 표시
                    return (
                      <div key={`${pot.id}-${team.id}-${index}`} className="px-4 py-3 bg-blue-50 rounded-lg border-2 border-blue-200 flex flex-col items-center justify-center gap-2 relative group">
                        <Flag country={country} size="lg" />
                        <span className="text-sm font-semibold text-gray-800 text-center">{country.nameKo}</span>
                        {fifaRanking && (
                          <span className="text-xs text-gray-500 mt-1">
                            FIFA {fifaRanking.rank}위 ({fifaRanking.points}점)
                          </span>
                        )}
                        {searchQuery && matchesSearch(team.id, searchQuery) && <span className="absolute inset-0 border-2 border-yellow-400 rounded-lg animate-pulse" />}
                      </div>
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
    </div>
  );
}
