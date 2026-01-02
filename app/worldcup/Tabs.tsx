/**
 * WorldCup 페이지 전용 Tabs 컴포넌트
 *
 * 용도: WorldCup 페이지의 탭 네비게이션 컴포넌트
 * - "경기 일정" 탭: 월드컵 조별 경기 정보
 * - "경기장" 탭: 경기장 목록 및 지도
 *
 * 타입 안정성:
 * - constants.ts의 WorldCupTab 타입을 사용하여 타입 안정성 보장
 * - activeTab과 onTabChange 모두 WorldCupTab 타입으로 제한
 * - string 타입의 사용을 완전히 차단
 */

"use client";

import { type WorldCupTab } from "./constants";
import { TABS } from "./constants";

interface TabsProps {
  activeTab: WorldCupTab; // 현재 활성화된 탭 (WorldCupTab 타입으로 제한)
  onTabChange: (tab: WorldCupTab) => void; // 탭 변경 핸들러 (WorldCupTab만 허용)
}

export default function Tabs({ activeTab, onTabChange }: TabsProps) {
  return (
    <div className="flex justify-center border-b-2 border-gray-200 mb-6 overflow-x-auto">
      <div className="flex gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-4 md:px-6 py-3 font-semibold text-sm md:text-lg transition-colors duration-300 whitespace-nowrap ${
              activeTab === tab.id
                ? "text-blue-600 border-b-2 border-blue-600 -mb-[2px]"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
