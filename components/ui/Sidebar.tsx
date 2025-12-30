/**
 * Sidebar 컴포넌트
 *
 * 용도: 좌측 고정 사이드바 메뉴
 * - 포트, 조 경기, 경기장 메뉴 버튼 (텍스트만)
 * - 선택된 메뉴 시각적 구분
 * - position: fixed로 화면에 고정
 */

"use client";

interface SidebarProps {
  activeTab: "pots" | "groups" | "stadiums";
  onTabChange: (tab: "pots" | "groups" | "stadiums") => void;
}

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const menuItems = [
    { id: "pots" as const, label: "포트" },
    { id: "groups" as const, label: "조 경기" },
    { id: "stadiums" as const, label: "경기장" },
  ];

  return (
    <>
      {/* 데스크톱 사이드바 */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-lg z-40 flex-col">
        {/* 로고/제목 영역 */}
        <div className="h-20 flex items-center justify-center border-b border-gray-200 dark:border-gray-700 px-4 flex-shrink-0">
          <h1 className="text-lg md:text-xl font-bold text-gray-800 dark:text-white text-center">
            2026 북중미 월드컵
          </h1>
        </div>

        {/* 메뉴 버튼 영역 */}
        <nav className="p-4 space-y-1 overflow-y-auto flex-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === item.id
                  ? "bg-blue-600 dark:bg-blue-500 text-white"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* 모바일 하단 네비게이션 바 */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg z-40 flex items-center justify-around">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`px-4 py-2 text-sm font-medium transition-all duration-200 ${
              activeTab === item.id
                ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                : "text-gray-600 dark:text-gray-400"
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </>
  );
}
