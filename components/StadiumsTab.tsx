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
import StadiumModal from "./StadiumModal";
import StadiumMapOverlay from "./StadiumMapOverlay";

export default function StadiumsTab() {
  // 선택된 경기장 ID (모달 표시용)
  const [selectedStadium, setSelectedStadium] = useState<string | null>(null);

  // 하이라이트된 경기장 ID (목록 호버 시 지도 마커 강조)
  const [highlightedStadium, setHighlightedStadium] = useState<string | null>(null);

  /**
   * 경기장을 국가별로 그룹화
   * useMemo로 최적화: stadiums 배열이 변경되지 않는 한 재계산하지 않음
   */
  const groupedStadiums = useMemo(() => {
    return stadiums.reduce((acc, stadium) => {
      if (!acc[stadium.country]) {
        acc[stadium.country] = [];
      }
      acc[stadium.country].push(stadium);
      return acc;
    }, {} as Record<string, typeof stadiums>);
  }, []);

  // 국가 목록 (정렬된 순서)
  const countries = useMemo(() => Object.keys(groupedStadiums), [groupedStadiums]);

  return (
    <div>
      {/* 경기장 상세 정보 모달 */}
      <StadiumModal
        stadiumId={selectedStadium}
        onClose={() => setSelectedStadium(null)}
      />

      {/* 지도 섹션 */}
      <div className="mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-2xl font-bold mb-4 text-gray-800">경기장 지도</h3>

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
      <div>
        <p className="text-center text-gray-600 mb-6">
          총 {stadiums.length}개 경기장
        </p>

        {/* 국가별로 그룹화된 경기장 목록 */}
        {countries.map((country) => (
          <div key={country} className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-gray-700 border-b-2 border-gray-300 pb-2">
              {country} ({groupedStadiums[country].length}개)
            </h2>

            {/* 경기장 그리드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groupedStadiums[country].map((stadium) => (
                <button
                  key={stadium.id}
                  onClick={() => setSelectedStadium(stadium.id)}
                  onMouseEnter={() => setHighlightedStadium(stadium.id)}
                  onMouseLeave={() => setHighlightedStadium(null)}
                  className={`p-5 bg-white rounded-lg shadow-md hover:shadow-xl transition-all hover:scale-105 text-left border-2 ${
                    highlightedStadium === stadium.id
                      ? "border-blue-500 ring-2 ring-blue-200"
                      : "border-transparent"
                  }`}
                >
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">
                    {stadium.name}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {stadium.city}
                  </p>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
