"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Stadium } from "@/data/stadiums";

interface CustomMapProps {
  stadiums: Stadium[];
  onStadiumClick: (stadiumId: string) => void;
}

// 경기장 위치를 맵 이미지의 퍼센트 좌표로 변환
// 북중미 지역 범위: 위도 15°N ~ 60°N, 경도 -130°W ~ -60°W
const latToPercent = (lat: number): number => {
  // 위도: 60°N = 0% (맨 위), 15°N = 100% (맨 아래)
  const minLat = 15;
  const maxLat = 60;
  const range = maxLat - minLat;
  return ((maxLat - lat) / range) * 100;
};

const lngToPercent = (lng: number): number => {
  // 경도: -130°W = 0% (맨 왼쪽), -60°W = 100% (맨 오른쪽)
  const minLng = -130;
  const maxLng = -60;
  const range = maxLng - minLng;
  return ((lng - minLng) / range) * 100;
};

// 실제 경기장 좌표 (위도, 경도)
const stadiumCoordinates: Record<string, { lat: number; lng: number }> = {
  sofi: { lat: 33.9533, lng: -118.3387 },
  metlife: { lat: 40.8136, lng: -74.0745 },
  att: { lat: 32.7473, lng: -97.0945 },
  arrowhead: { lat: 39.0489, lng: -94.4839 },
  gillette: { lat: 42.0909, lng: -71.2643 },
  mercedes: { lat: 33.7555, lng: -84.4013 },
  nrg: { lat: 29.6847, lng: -95.4107 },
  lumen: { lat: 47.5952, lng: -122.3316 },
  levis: { lat: 37.403, lng: -121.9694 },
  hardrock: { lat: 25.9581, lng: -80.2389 },
  lincoln: { lat: 39.9008, lng: -75.1675 },
  bmo: { lat: 43.6325, lng: -79.4181 },
  bcplace: { lat: 49.2768, lng: -123.1088 },
  azteca: { lat: 19.3031, lng: -99.1503 },
  akron: { lat: 20.6819, lng: -103.3496 },
  bbva: { lat: 25.6802, lng: -100.2503 },
};

export default function CustomMap({ stadiums, onStadiumClick }: CustomMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mapDimensions, setMapDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMapDimensions({ width: rect.width, height: rect.height });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-gray-100 rounded-lg overflow-hidden"
      style={{ aspectRatio: "16/9", minHeight: "400px" }}
    >
      <Image
        src="/map.png"
        alt="World Cup 2026 Stadiums Map"
        fill
        className="object-contain"
        priority
      />

      {stadiums.map((stadium) => {
        const coords = stadiumCoordinates[stadium.id];
        if (!coords) return null;

        const leftPercent = lngToPercent(coords.lng);
        const topPercent = latToPercent(coords.lat);

        return (
          <button
            key={stadium.id}
            onClick={() => onStadiumClick(stadium.id)}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
            style={{
              left: `${leftPercent}%`,
              top: `${topPercent}%`,
            }}
            aria-label={`${stadium.name} 경기장`}
          >
            <div className="relative">
              <div className="w-6 h-6 bg-blue-600 rounded-full border-2 border-white shadow-lg hover:bg-blue-700 transition-all hover:scale-125 cursor-pointer flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg">
                {stadium.name}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
