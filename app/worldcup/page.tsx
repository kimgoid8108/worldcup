"use client";

import { useState } from "react";
import Tabs from "@/components/Tabs";
import GroupsTab from "@/components/GroupsTab";
import StadiumsTab from "@/components/StadiumsTab";

export default function WorldCupPage() {
  const [activeTab, setActiveTab] = useState("groups");

  return (
    <main className="min-h-screen p-8 bg-gradient-to-br from-blue-50 to-green-50">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          2026 북중미 월드컵
        </h1>

        <Tabs activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === "groups" && <GroupsTab />}
        {activeTab === "stadiums" && <StadiumsTab />}
      </div>
    </main>
  );
}
