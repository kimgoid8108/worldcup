"use client";

import { useState } from "react";
import Tabs from "./Tabs";
import { type WorldCupTab } from "./constants";
import GroupsTab from "@/components/tabs/GroupsTab";
import StadiumsTab from "@/components/tabs/StadiumsTab";

export default function WorldCupPage() {
  const [activeTab, setActiveTab] = useState<WorldCupTab>("groups");

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
