/**
 * Tabs 컴포넌트
 *
 * 용도: 메인 페이지의 탭 네비게이션 컴포넌트
 * - "포트" 탭: 포트별 팀 정보
 * - "조 경기" 탭: 월드컵 조별 경기 정보
 * - "경기장" 탭: 경기장 목록 및 지도
 *
 * 사용 위치:
 * - app/page.tsx: 메인 페이지의 탭 네비게이션
 */

"use client";

interface TabsProps {
  activeTab: "pots" | "groups" | "stadiums"; // 현재 활성화된 탭
  onTabChange: (tab: "pots" | "groups" | "stadiums") => void; // 탭 변경 핸들러
}

export default function Tabs({ activeTab, onTabChange }: TabsProps) {
  const tabs = [
    { id: "groups" as const, label: "조 경기" },
    { id: "stadiums" as const, label: "경기장" },
    { id: "pots" as const, label: "포트" },
  ];

  return (
    <div className="flex justify-center border-b-2 border-gray-200 mb-6 overflow-x-auto">
      <div className="flex gap-2">
        {tabs.map((tab) => (
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
