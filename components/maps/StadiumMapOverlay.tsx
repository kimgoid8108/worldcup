/**
 * StadiumMapOverlay 컴포넌트
 *
 * 용도: 북중미 월드컵 경기장 지도에 마커를 오버레이하는 컴포넌트
 * - 지도 이미지 위에 경기장 위치 마커 표시
 * - 마커 호버 시 툴팁 표시
 * - 마커 클릭 시 경기장 상세 정보 모달 표시
 * - 반응형 디자인: 화면 크기 변경 시 마커 위치 자동 조정
 */

"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import { Stadium } from "@/data/stadiums";

interface CustomMapProps {
  stadiums: Stadium[];
  onStadiumClick: (stadiumId: string) => void;
  highlightedStadiumId?: string | null;
}

/**
 * 국가별 마커 색상 반환
 * @param country - 국가명 (USA, Canada, Mexico)
 * @returns 색상 코드
 */
const getCountryColor = (country: string): string => {
  switch (country) {
    case "USA":
      return "#1a89ff"; // 파란색
    case "Canada":
      return "#ff1a1a"; // 빨간색
    case "Mexico":
      return "#00b300"; // 초록색
    default:
      return "#1a89ff";
  }
};

/**
 * 경기장의 퍼센트 기반 위치 (지도 이미지 기준)
 * - left: 왼쪽에서 오른쪽으로의 퍼센트 (0% = 맨 왼쪽, 100% = 맨 오른쪽)
 * - top: 위에서 아래로의 퍼센트 (0% = 맨 위, 100% = 맨 아래)
 *
 * 주의: 이 좌표는 지도 이미지의 실제 픽셀 위치를 퍼센트로 변환한 값입니다.
 */
const stadiumPercentPositions: Record<string, { left: string; top: string }> = {
  // 🇺🇸 미국 - 서부 (왼쪽)
  lumen: { left: "33%", top: "45%" }, // Seattle, WA
  levis: { left: "33%", top: "60%" }, // Santa Clara, CA
  sofi: { left: "35%", top: "66%" }, // Inglewood, CA

  // 🇺🇸 미국 - 중부
  arrowhead: { left: "58%", top: "57%" }, // Kansas City, MO
  att: { left: "54%", top: "65%" }, // Arlington, TX
  nrg: { left: "55%", top: "69%" }, // Houston, TX

  // 🇺🇸 미국 - 동부
  gillette: { left: "80%", top: "52%" }, // Foxborough, MA
  metlife: { left: "76%", top: "55%" }, // East Rutherford, NJ
  lincoln: { left: "75%", top: "58%" }, // Philadelphia, PA
  mercedes: { left: "68%", top: "65%" }, // Atlanta, GA
  hardrock: { left: "70%", top: "72%" }, // Miami Gardens, FL

  // 🇨🇦 캐나다
  bcplace: { left: "33%", top: "40%" }, // Vancouver, BC
  bmo: { left: "72%", top: "48%" }, // Toronto, ON

  // 🇲🇽 멕시코
  bbva: { left: "51%", top: "75%" }, // Monterrey
  akron: { left: "47%", top: "80%" }, // Guadalajara
  azteca: { left: "52%", top: "83%" }, // Mexico City
};

export default function StadiumMapOverlay({ stadiums, onStadiumClick, highlightedStadiumId }: CustomMapProps) {
  // DOM 참조
  const containerRef = useRef<HTMLDivElement>(null);

  // 상태 관리
  const [hoveredStadium, setHoveredStadium] = useState<string | null>(null);
  const [imageDisplayArea, setImageDisplayArea] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [imageNaturalSize, setImageNaturalSize] = useState({ width: 0, height: 0 });

  /**
   * 이미지 원본 크기 로드
   * 지도 이미지의 실제 크기를 가져와서 마커 위치 계산에 사용
   */
  useEffect(() => {
    const img = new window.Image();
    img.onload = () => {
      setImageNaturalSize({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.src = "/map.png";
  }, []);

  /**
   * 이미지의 실제 표시 영역 계산
   * - object-contain으로 인한 여백을 고려하여 마커 위치 정확도 향상
   * - 화면 크기 변경 시 자동 재계산
   */
  useEffect(() => {
    if (!containerRef.current || imageNaturalSize.width === 0 || imageNaturalSize.height === 0) {
      return;
    }

    /**
     * 이미지 표시 영역 계산 함수
     * 컨테이너와 이미지의 비율을 비교하여 실제 표시되는 영역 계산
     */
    const calculateImageDisplayArea = () => {
      if (containerRef.current && imageNaturalSize.width > 0 && imageNaturalSize.height > 0) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const containerWidth = containerRect.width;
        const containerHeight = containerRect.height;

        const imageAspectRatio = imageNaturalSize.width / imageNaturalSize.height;
        const containerAspectRatio = containerWidth / containerHeight;

        let displayWidth: number;
        let displayHeight: number;
        let offsetX: number;
        let offsetY: number;

        if (imageAspectRatio > containerAspectRatio) {
          // 이미지가 더 넓음 - 컨테이너 너비에 맞춤 (좌우 여백 없음, 상하 여백 있음)
          displayWidth = containerWidth;
          displayHeight = containerWidth / imageAspectRatio;
          offsetX = 0;
          offsetY = (containerHeight - displayHeight) / 2;
        } else {
          // 이미지가 더 높음 - 컨테이너 높이에 맞춤 (상하 여백 없음, 좌우 여백 있음)
          displayWidth = containerHeight * imageAspectRatio;
          displayHeight = containerHeight;
          offsetX = (containerWidth - displayWidth) / 2;
          offsetY = 0;
        }

        setImageDisplayArea({
          x: offsetX,
          y: offsetY,
          width: displayWidth,
          height: displayHeight,
        });
      }
    };

    // 초기 계산 및 리사이즈 이벤트 리스너
    calculateImageDisplayArea();
    window.addEventListener("resize", calculateImageDisplayArea);

    return () => window.removeEventListener("resize", calculateImageDisplayArea);
  }, [imageNaturalSize]);

  return (
    <div className="relative w-full">
      {/* 지도 이미지 컨테이너 */}
      <div ref={containerRef} className="relative w-full bg-gray-100 rounded-lg overflow-hidden" style={{ aspectRatio: "16/9", minHeight: "500px" }}>
        {/* 지도 이미지 (Next.js Image 컴포넌트로 최적화) */}
        <Image src="/map.png" alt="World Cup 2026 Stadiums Map" fill className="object-contain" priority />

        {/* 마커 오버레이 - 이미지의 실제 표시 영역 내에서만 렌더링 */}
        {imageDisplayArea.width > 0 && imageDisplayArea.height > 0 && (
          <div
            className="absolute"
            style={{
              left: `${imageDisplayArea.x}px`,
              top: `${imageDisplayArea.y}px`,
              width: `${imageDisplayArea.width}px`,
              height: `${imageDisplayArea.height}px`,
            }}>
            {stadiums.map((stadium) => {
              const position = stadiumPercentPositions[stadium.id];
              if (!position) return null;

              const isHighlighted = highlightedStadiumId === stadium.id;
              const isHovered = hoveredStadium === stadium.id;
              const color = getCountryColor(stadium.country);

              // 퍼센트를 픽셀로 변환 (이미지 표시 영역 기준)
              const leftPercent = parseFloat(position.left);
              const topPercent = parseFloat(position.top);
              const pixelX = (imageDisplayArea.width * leftPercent) / 100;
              const pixelY = (imageDisplayArea.height * topPercent) / 100;

              return (
                <button
                  key={stadium.id}
                  onClick={() => onStadiumClick(stadium.id)}
                  onMouseEnter={() => setHoveredStadium(stadium.id)}
                  onMouseLeave={() => setHoveredStadium(null)}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 group transition-all duration-200 cursor-pointer ${isHovered || isHighlighted ? "z-50" : "z-10"}`}
                  style={{
                    left: `${pixelX}px`,
                    top: `${pixelY}px`,
                  }}
                  aria-label={`${stadium.name} 경기장`}>
                  <div className="relative">
                    {/* 마커 원형 버튼 */}
                    <div
                      className={`rounded-full border-3 border-white shadow-lg transition-all duration-200 flex items-center justify-center ${
                        isHovered || isHighlighted ? "w-5 h-5 scale-125" : "w-4 h-4"
                      }`}
                      style={{
                        backgroundColor: color,
                        borderWidth: "3px",
                      }}>
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>

                    {/* 툴팁 (호버 또는 하이라이트 시 표시) */}
                    {(isHovered || isHighlighted) && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-white rounded-lg shadow-xl whitespace-nowrap z-[100] border border-gray-200 pointer-events-none">
                        <div className="font-semibold mb-1 text-gray-900 text-xs">{stadium.name}</div>
                        <div className="text-gray-600 text-xs">
                          {stadium.city}, {stadium.country}
                        </div>
                        {/* 툴팁 화살표 */}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                          <div className="w-2 h-2 bg-white border-r border-b border-gray-200 rotate-45"></div>
                        </div>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 범례: 국가별 마커 색상 설명 */}
      <div className="mt-4 flex flex-wrap gap-4 justify-center">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full border-2 border-white" style={{ backgroundColor: "#1a89ff" }}></div>
          <span className="text-sm font-medium text-gray-700">🇺🇸 미국 (11개)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full border-2 border-white" style={{ backgroundColor: "#ff1a1a" }}></div>
          <span className="text-sm font-medium text-gray-700">🇨🇦 캐나다 (2개)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full border-2 border-white" style={{ backgroundColor: "#00b300" }}></div>
          <span className="text-sm font-medium text-gray-700">🇲🇽 멕시코 (3개)</span>
        </div>
      </div>
    </div>
  );
}
