/**
 * 검색 결과 컴포넌트
 *
 * 책임:
 * - standings API 데이터를 기반으로 국가 검색
 * - 검색 결과 클릭 시 /teams/:id로 이동
 * - 플레이오프 국가(team.id === null)는 비활성 처리
 */

"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { normalizeText } from "@/src/utils/normalizeText";
import { isPlayoffTeam } from "@/src/utils/api";
import type { TeamStanding } from "@/src/types/api";

interface SearchResultsProps {
  searchQuery: string;
  standings: TeamStanding[];
}

export default function SearchResults({
  searchQuery,
  standings,
}: SearchResultsProps) {
  const router = useRouter();

  // 검색 결과 필터링 (국가명만 검색, startsWith 기준)
  const filteredStandings = useMemo(() => {
    if (!searchQuery) return [];

    const normalizedQuery = normalizeText(searchQuery);

    return standings.filter((standing) => {
      const normalizedCountryName = normalizeText(standing.team.name);
      return normalizedCountryName.startsWith(normalizedQuery);
    });
  }, [searchQuery, standings]);

  const handleTeamClick = (standing: TeamStanding) => {
    // 플레이오프 국가는 클릭 불가
    if (isPlayoffTeam(standing.team.id)) {
      return;
    }

    // team.id로 이동
    router.push(`/teams/${standing.team.id}`);
  };

  if (!searchQuery) {
    return null;
  }

  if (filteredStandings.length === 0) {
    return (
      <div className="text-center py-8 text-gray-600">
        검색 결과가 없습니다.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {filteredStandings.map((standing) => {
        const isPlayoff = isPlayoffTeam(standing.team.id);

        return (
          <button
            key={`${standing.team.id}-${standing.group}-${standing.position}`}
            onClick={() => handleTeamClick(standing)}
            disabled={isPlayoff}
            className={`
              p-4 bg-white rounded-lg border-2 transition-all
              ${isPlayoff
                ? "border-gray-200 opacity-50 cursor-not-allowed"
                : "border-blue-200 hover:border-blue-400 hover:shadow-md"
              }
            `}
          >
            <div className="flex flex-col items-center justify-center gap-2">
              <img
                src={standing.crest}
                alt={standing.team.name}
                className="w-12 h-12 object-contain"
              />
              <span className="text-sm font-semibold text-gray-800 text-center">
                {standing.team.name}
              </span>
              <span className="text-xs text-gray-600">
                {standing.group}조 · {standing.position}위
              </span>
              {isPlayoff && (
                <span className="text-xs text-gray-500">플레이오프</span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
