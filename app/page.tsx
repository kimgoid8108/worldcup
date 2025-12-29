/**
 * 메인 페이지 (홈)
 *
 * 용도: 2026 북중미 월드컵 정보를 표시하는 메인 페이지
 * - 탭 네비게이션: "조 경기" / "경기장"
 * - GroupsTab: 조별 경기 정보 표시
 * - StadiumsTab: 경기장 목록 및 지도 표시
 *
 * 경로: / (루트 경로)
 */

"use client";

import { useState } from "react";
import Tabs from "@/components/Tabs";
import GroupsTab from "@/components/GroupsTab";
import StadiumsTab from "@/components/StadiumsTab";

export default function Home() {
  // 현재 활성화된 탭 상태 ("groups" 또는 "stadiums")
  const [activeTab, setActiveTab] = useState<"groups" | "stadiums">("groups");

  return (
    <main className="min-h-screen p-8 bg-gradient-to-br from-blue-50 to-green-50">
      <div className="max-w-7xl mx-auto">
        {/* 페이지 제목 */}
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          2026 북중미 월드컵
        </h1>

        {/* 탭 네비게이션 */}
        <Tabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* 탭별 컨텐츠 */}
        {activeTab === "groups" && <GroupsTab />}
        {activeTab === "stadiums" && <StadiumsTab />}
      </div>
    </main>
  );
}
