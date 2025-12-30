/**
 * FifaRankingsTab 컴포넌트
 *
 * 용도: FIFA 랭킹 순위를 표시하는 탭 컴포넌트
 * - 모든 국가를 FIFA 랭킹 순위대로 정렬하여 표시
 * - 검색 기능: 팀 이름으로 검색 가능
 * - 국가 클릭 시 상세 정보 표시
 */

"use client";

import { useState, useMemo } from "react";
import { countries } from "@/data/countries";
import { getCountryById } from "@/data/countries";
import { getFifaRanking, getFifaRank } from "@/data/fifaRankings";
import CountryModal from "./CountryModal";
import Flag from "./Flag";

export default function FifaRankingsTab() {
  // 선택된 국가 ID (국가 모달 표시용)
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  // 검색어
  const [searchQuery, setSearchQuery] = useState("");

  /**
   * 팀이 검색어와 일치하는지 확인
   */
  const matchesSearch = (teamId: string, query: string): boolean => {
    if (!query) return true;

    // 검색어에서 띄어쓰기 제거 및 소문자 변환
    const normalizedQuery = query.replace(/\s+/g, "").toLowerCase();

    const country = getCountryById(teamId);
    if (!country) return false;

    // 팀 이름으로 검색 (띄어쓰기 제거)
    const normalizedCountryName = country.name.replace(/\s+/g, "").toLowerCase();
    return normalizedCountryName.includes(normalizedQuery);
  };

  /**
   * FIFA 랭킹 순으로 정렬된 팀 목록
   */
  const teamsSortedByRanking = useMemo(() => {
    // 모든 국가 가져오기
    const allTeams = countries.map((country) => country.id);

    // 검색어 필터 적용
    const filteredTeams = allTeams.filter((teamId) =>
      matchesSearch(teamId, searchQuery)
    );

    // FIFA 랭킹 순으로 정렬
    return filteredTeams.sort((a, b) => {
      const rankingA = getFifaRanking(a);
      const rankingB = getFifaRanking(b);

      // 랭킹이 없는 경우 맨 뒤로
      if (rankingA === null && rankingB !== null) return 1;
      if (rankingA !== null && rankingB === null) return -1;
      if (rankingA === null && rankingB === null) return 0;

      // 랭킹이 높은 순서대로 (점수가 높은 순서)
      return (rankingB || 0) - (rankingA || 0);
    });
  }, [searchQuery]);

  return (
    <>
      {/* 메인 리스트 - 항상 렌더링되어야 함 (언마운트 방지) */}
      <div className="bg-white rounded-lg shadow-lg p-4 md:p-6" style={{ position: 'relative', zIndex: 1 }}>
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 text-center border-b-4 border-blue-500 pb-3">
          FIFA 랭킹 순위
        </h2>

        {/* 검색 섹션 */}
        <div className="mb-6">
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
        </div>

        {/* FIFA 랭킹 순위 목록 */}
        {teamsSortedByRanking.length > 0 ? (
          <div className="bg-gray-50 rounded-lg p-4 md:p-6 border-2 border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {teamsSortedByRanking.map((teamId, index) => {
                const country = getCountryById(teamId);
                if (!country) return null;

                const fifaRanking = getFifaRanking(teamId);
                const fifaRank = getFifaRank(teamId);

                return (
                  <button
                    key={country.id}
                    onClick={() => setSelectedCountry(country.id)}
                    className="px-4 py-3 bg-blue-50 rounded-lg border-2 border-blue-200 hover:border-blue-400 hover:shadow-md transition-all flex flex-col items-center justify-center gap-2 relative group"
                  >
                    <Flag country={country} size="lg" />
                    <span className="text-sm font-semibold text-gray-800 text-center">
                      {country.name}
                    </span>
                    {fifaRanking && fifaRank && (
                      <span className="text-xs text-gray-600 text-center">
                        {fifaRank}위 ({fifaRanking}점)
                      </span>
                    )}
                    {searchQuery && matchesSearch(country.id, searchQuery) && (
                      <span className="absolute inset-0 border-2 border-yellow-400 rounded-lg animate-pulse" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-600">
            검색 결과가 없습니다.
          </div>
        )}
      </div>

      {/* 국가 상세 정보 모달 - 메인 리스트와 분리하여 항상 렌더링 가능하도록 */}
      <CountryModal countryId={selectedCountry} onClose={() => setSelectedCountry(null)} />
    </>
  );
}

