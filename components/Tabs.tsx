/**
 * Tabs 컴포넌트
 *
 * 용도: 메인 페이지의 탭 네비게이션 컴포넌트
 * - "조 경기" 탭: 월드컵 조별 경기 정보
 * - "경기장" 탭: 경기장 목록 및 지도
 *
 * 사용 위치:
 * - app/page.tsx: 메인 페이지의 탭 네비게이션
 */

"use client";

interface TabsProps {
  activeTab: string; // 현재 활성화된 탭 ("groups" 또는 "stadiums")
  onTabChange: (tab: string) => void; // 탭 변경 핸들러
}

export default function Tabs({ activeTab, onTabChange }: TabsProps) {
  return (
    <div className="flex justify-center border-b-2 border-gray-200 mb-6">
      {/* 조 경기 탭 */}
      <button
        onClick={() => onTabChange("groups")}
        className={`px-6 py-3 font-semibold text-lg transition-colors ${
          activeTab === "groups"
            ? "text-blue-600 border-b-2 border-blue-600 -mb-[2px]"
            : "text-gray-600 hover:text-gray-800"
        }`}
      >
        조 경기
      </button>

      {/* 경기장 탭 */}
      <button
        onClick={() => onTabChange("stadiums")}
        className={`px-6 py-3 font-semibold text-lg transition-colors ${
          activeTab === "stadiums"
            ? "text-blue-600 border-b-2 border-blue-600 -mb-[2px]"
            : "text-gray-600 hover:text-gray-800"
        }`}
      >
        경기장
      </button>
    </div>
  );
}
