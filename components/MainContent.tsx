/**
 * MainContent 컴포넌트
 *
 * 용도: 우측 메인 콘텐츠 영역
 * - 선택된 탭에 따라 해당 콘텐츠 표시
 * - 세로 스크롤 가능
 */

"use client";

import PotsTab from "./PotsTab";
import GroupsTab from "./GroupsTab";
import StadiumsTab from "./StadiumsTab";

interface MainContentProps {
  activeTab: "pots" | "groups" | "stadiums";
}

export default function MainContent({ activeTab }: MainContentProps) {
  return (
    <main className="ml-0 md:ml-64 min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 pb-16 md:pb-0">
      {/* 모바일 헤더 */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-30 flex items-center justify-center">
        <h2 className="text-lg font-bold text-gray-800 dark:text-white">
          2026 북중미 월드컵
        </h2>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="p-4 md:p-8 pt-20 md:pt-4">
        {/* 탭별 컨텐츠 (애니메이션 효과) */}
        <div className="animate-fadeIn">
          {activeTab === "pots" && <PotsTab />}
          {activeTab === "groups" && <GroupsTab />}
          {activeTab === "stadiums" && <StadiumsTab />}
        </div>
      </div>
    </main>
  );
}
