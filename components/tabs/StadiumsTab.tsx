/**
 * StadiumsTab 컴포넌트
 *
 * 용도: 경기장 목록 및 지도를 표시하는 탭 컴포넌트
 * - 지도에 경기장 마커 표시 (StadiumMapOverlay 사용)
 * - 국가별로 그룹화된 경기장 목록 표시
 * - 경기장 클릭 시 상세 정보 모달 표시
 * - 목록 호버 시 지도 마커 하이라이트
 */

"use client";

import { useState, useMemo } from "react";
import { stadiums } from "@/data/stadiums";
import StadiumModal from "@/components/modals/StadiumModal";
import StadiumMapOverlay from "@/components/maps/StadiumMapOverlay";

export default function StadiumsTab() {
  // 선택된 경기장 ID (모달 표시용)
  const [selectedStadium, setSelectedStadium] = useState<string | null>(null);

  // 하이라이트된 경기장 ID (목록 호버 시 지도 마커 강조)
  const [highlightedStadium, setHighlightedStadium] = useState<string | null>(null);

  // 검색어
  const [searchQuery, setSearchQuery] = useState("");


  /**
   * 경기장을 국가별로 그룹화 및 검색 필터링
   * useMemo로 최적화: stadiums 배열이 변경되지 않는 한 재계산하지 않음
   * 띄어쓰기를 제거하고 검색 (예: "So Fi" → "SoFi"로 검색)
   */
  const groupedStadiums = useMemo(() => {
    const filtered = searchQuery
      ? stadiums.filter((stadium) => {
          // 검색어에서 띄어쓰기 제거 및 소문자 변환
          const normalizedQuery = searchQuery.replace(/\s+/g, "").toLowerCase();

          // 경기장 이름, 도시, 국가에서 띄어쓰기 제거 후 검색
          const normalizedName = stadium.name.replace(/\s+/g, "").toLowerCase();
          const normalizedCity = stadium.city.replace(/\s+/g, "").toLowerCase();
          const normalizedCountry = stadium.country.replace(/\s+/g, "").toLowerCase();

          return (
            normalizedName.includes(normalizedQuery) ||
            normalizedCity.includes(normalizedQuery) ||
            normalizedCountry.includes(normalizedQuery)
          );
        })
      : stadiums;

    return filtered.reduce((acc, stadium) => {
      if (!acc[stadium.country]) {
        acc[stadium.country] = [];
      }
      acc[stadium.country].push(stadium);
      return acc;
    }, {} as Record<string, typeof stadiums>);
  }, [searchQuery]);

  // 국가 목록 (정렬된 순서)
  const countries = useMemo(() => Object.keys(groupedStadiums), [groupedStadiums]);

  return (
    <div>
      {/* 경기장 상세 정보 모달 */}
      <StadiumModal
        stadiumId={selectedStadium}
        onClose={() => setSelectedStadium(null)}
      />

      <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 text-center border-b-4 border-blue-500 pb-3">
          경기장 정보
        </h2>

        {/* 검색 입력 */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="경기장 이름, 도시, 국가로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-white text-gray-800"
            />
            <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
          </div>
        </div>

        {/* 지도 섹션 */}
        <div id="stadium-map" className="mb-8">
          <div className="bg-gray-50 rounded-lg shadow-md p-4 md:p-6 mb-6">
            <h3 className="text-xl md:text-2xl font-bold mb-4 text-gray-800">
              경기장 지도
            </h3>

            {/* 커스텀 지도 오버레이 (마커 포함) */}
            <StadiumMapOverlay
              stadiums={stadiums}
              onStadiumClick={setSelectedStadium}
              highlightedStadiumId={highlightedStadium}
            />

            <p className="text-sm text-gray-600 mt-4">
              지도에서 경기장 위치를 확인할 수 있습니다. 경기장 마커를 클릭하거나 아래 목록에서 경기장을 클릭하면 상세 정보를 볼 수 있습니다.
            </p>
          </div>
        </div>

        {/* 경기장 목록 섹션 */}
        <div id="stadium-list">
          <p className="text-center text-gray-600 mb-6">
            총 {stadiums.length}개 경기장
            {searchQuery && ` (검색 결과: ${Object.values(groupedStadiums).flat().length}개)`}
          </p>

          {/* 국가별로 그룹화된 경기장 목록 */}
          {countries.length > 0 ? (
            countries.map((country) => (
              <div key={country} className="mb-12">
                <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-700 border-b-2 border-gray-300 pb-2">
                  {country} ({groupedStadiums[country].length}개)
                </h2>

                {/* 경기장 그리드 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupedStadiums[country].map((stadium) => {
                    const isHighlighted = highlightedStadium === stadium.id;
                    const isSearchMatch =
                      searchQuery &&
                      (stadium.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        stadium.city.toLowerCase().includes(searchQuery.toLowerCase()));

                    return (
                      <button
                        key={stadium.id}
                        onClick={() => setSelectedStadium(stadium.id)}
                        onMouseEnter={() => setHighlightedStadium(stadium.id)}
                        onMouseLeave={() => setHighlightedStadium(null)}
                        className={`p-5 bg-white rounded-lg shadow-md hover:shadow-xl transition-all hover:scale-105 text-left border-2 relative ${
                          isHighlighted
                            ? "border-blue-500 ring-2 ring-blue-200"
                            : "border-transparent"
                        } ${isSearchMatch ? "ring-2 ring-yellow-400" : ""}`}
                      >
                        <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-800">
                          {stadium.name}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {stadium.city}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-600">
              검색 결과가 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
