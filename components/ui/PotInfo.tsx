/**
 * PotInfo 컴포넌트
 *
 * 용도: 2026 FIFA 월드컵 포트별 팀 정보를 표시하는 컴포넌트
 * - Teams API에서 데이터를 가져와 표시
 * - team.id를 key로 사용
 * - UI에서는 getKoreanName(team.name)으로 한글 표시
 *
 * 사용 위치:
 * - GroupsTab 또는 별도 페이지에서 포트 정보 표시
 */

"use client";

import { useState, useEffect } from "react";
import { pots } from "@/data/pots";
import { getCountryById, getKoreanNameByTeamId, createCountriesFromTeams, type Country } from "@/data/countries";
import { fetchTeams } from "@/src/utils/api";
import type { FrontTeam } from "@/src/types/api";
import Flag from "@/components/ui/Flag";

export default function PotInfo() {
  const [selectedPot, setSelectedPot] = useState<number | null>(null);
  const [teams, setTeams] = useState<FrontTeam[]>([]);
  const [countriesList, setCountriesList] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Teams API 호출
  useEffect(() => {
    async function loadTeams() {
      try {
        setLoading(true);
        setError(null);
        const teamsData = await fetchTeams();
        const teamsList = teamsData.teams || [];
        setTeams(teamsList);

        // API teams 데이터를 기반으로 countries 배열 동적 생성
        const dynamicCountries = createCountriesFromTeams(teamsList);
        setCountriesList(dynamicCountries);

        console.log("[PotInfo] Teams API 로드 완료", {
          teamsCount: teamsList.length,
          countriesCreated: dynamicCountries.length,
        });
      } catch (err) {
        console.error("[PotInfo] Teams API 호출 실패", err);
        setError(err instanceof Error ? err.message : "팀 정보를 불러올 수 없습니다.");
      } finally {
        setLoading(false);
      }
    }
    loadTeams();
  }, []);

  /**
   * 플레이오프 승자 ID를 한글 이름으로 변환
   * @param playoffId - 플레이오프 ID
   * @returns 플레이오프 한글 이름
   */
  const getPlayoffName = (playoffId: string): string => {
    if (playoffId.startsWith("playoff_europe")) {
      return "유럽 플레이오프 승자";
    }
    if (playoffId.startsWith("playoff_intercontinental")) {
      return "인터콘티넨털 플레이오프 승자";
    }
    return "플레이오프 승자";
  };

  /**
   * pot.teams 배열의 countryId(string)를 team.id로 변환
   * pots.ts의 teams는 countryId(string) 배열이므로,
   * 이를 team.id(number)로 변환해야 함
   *
   * 변환 로직:
   * 1. countryId → nameEn (매핑 테이블)
   * 2. nameEn → teams 배열에서 team.name으로 찾기
   * 3. team.id 반환
   */
  const getTeamIdFromCountryId = (countryId: string): number | null => {
    // 1. countryId → nameEn 변환
    const country = getCountryById(countryId);
    if (!country || !country.nameEn) {
      return null;
    }

    // 2. nameEn을 기준으로 teams 배열에서 team 찾기 (team.id 기반 매칭)
    const team = teams.find((t) => {
      if (!t?.name || !t?.id) return false;
      return t.name.toLowerCase() === country.nameEn.toLowerCase();
    });

    if (!team || !team.id || team.id === 0) {
      return null;
    }

    return team.id;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">팀 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center py-8 text-red-600">
          <p>오류: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center border-b-4 border-blue-500 pb-3">
        포트별 팀 정보
      </h2>

      {/* Pot 탭 */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 justify-center">
          {pots.map((pot) => (
            <button
              key={pot.id}
              onClick={() => setSelectedPot(selectedPot === pot.id ? null : pot.id)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                selectedPot === pot.id
                  ? "bg-blue-600 text-white shadow-lg scale-105"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {pot.name}
            </button>
          ))}
        </div>
      </div>

      {/* 선택된 Pot 정보 또는 전체 Pot 정보 */}
      {selectedPot ? (
        // 특정 Pot 상세 정보
        (() => {
          const pot = pots.find((p) => p.id === selectedPot);
          if (!pot) return null;

          return (
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-2xl font-bold mb-4 text-gray-800">{pot.name}</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {pot.teams.map((countryId, index) => {
                  // 플레이오프 승자 체크
                  if (countryId.startsWith("playoff_")) {
                    return (
                      <div
                        key={`${pot.id}-${countryId}-${index}`}
                        className="px-4 py-3 bg-gray-200 rounded-lg border-2 border-dashed border-gray-400 text-center"
                      >
                        <div className="text-sm font-medium text-gray-700">
                          {getPlayoffName(countryId)}
                        </div>
                      </div>
                    );
                  }

                  // countryId → teamId 변환
                  const teamId = getTeamIdFromCountryId(countryId);

                  if (!teamId) {
                    console.warn("[PotInfo] teamId를 찾을 수 없음", { countryId });
                    return null;
                  }

                  // teams 배열에서 team.id로 찾기
                  const team = teams.find((t) => t?.id === teamId);

                  if (!team) {
                    console.warn("[PotInfo] team을 찾을 수 없음", { countryId, teamId });
                    return null;
                  }

                  // country 정보는 UI 표시용 (국기 등) - 동적으로 생성된 countriesList 사용
                  const country = getCountryByTeamId(team.id, countriesList) || getCountryById(countryId);

                  // 일반 국가
                  return (
                    <div
                      key={`${pot.id}-${team.id}-${index}`}
                      className="px-4 py-3 bg-blue-50 rounded-lg border-2 border-blue-200 flex flex-col items-center justify-center gap-2"
                    >
                      {country && <Flag country={country} size="lg" />}
                      <span className="text-sm font-semibold text-gray-800 text-center">
                        {getKoreanNameByTeamId(team.id, countriesList) || team.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()
      ) : (
        // 전체 Pot 정보 (간단히)
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {pots.map((pot) => (
            <div
              key={pot.id}
              className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200 hover:border-blue-300 transition-all cursor-pointer"
              onClick={() => setSelectedPot(pot.id)}
            >
              <h3 className="text-xl font-bold mb-3 text-gray-800">{pot.name}</h3>
              <p className="text-sm text-gray-600 mb-2">총 {pot.teams.length}개 팀</p>
              <div className="flex flex-wrap gap-1">
                {pot.teams.slice(0, 6).map((countryId, index) => {
                  // 플레이오프는 스킵
                  if (countryId.startsWith("playoff_")) {
                    return null;
                  }

                  const teamId = getTeamIdFromCountryId(countryId);
                  if (!teamId) return null;

                  const team = teams.find((t) => t?.id === teamId);
                  if (!team) return null;

                  const country = getCountryByTeamId(team.id, countriesList) || getCountryById(countryId);
                  if (!country) return null;

                  return (
                    <span key={index} title={getKoreanNameByTeamId(team.id, countriesList) || team.name}>
                      <Flag country={country} size="sm" />
                    </span>
                  );
                })}
                {pot.teams.length > 6 && (
                  <span className="text-xs text-gray-500">+{pot.teams.length - 6}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
