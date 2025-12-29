/**
 * GroupsTab 컴포넌트
 *
 * 용도: 2026 FIFA 월드컵 조별 경기 정보를 표시하는 탭 컴포넌트
 * - 조 탭(A~L)을 클릭하여 각 조의 참가국과 경기 일정을 확인
 * - 국가 클릭 시 국가 상세 정보 모달 표시
 */

"use client";

import { useState, useMemo } from "react";
import { groups } from "@/data/groups";
import { getCountryById } from "@/data/countries";
import { stadiums } from "@/data/stadiums";
import { pots } from "@/data/pots";
import CountryModal from "./CountryModal";
import PotInfo from "./PotInfo";

export default function GroupsTab() {
  // 선택된 국가 ID (국가 모달 표시용)
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  // 선택된 조 ID (기본값: A조)
  const [selectedGroup, setSelectedGroup] = useState<string>("A");

  // 포트 정보 표시 여부
  const [showPotInfo, setShowPotInfo] = useState(false);

  /**
   * 경기장 ID로 경기장 이름 조회
   * @param stadiumId - 경기장 ID
   * @returns 경기장 이름 또는 ID (경기장을 찾지 못한 경우)
   */
  const getStadiumName = (stadiumId: string): string => {
    const stadium = stadiums.find((s) => s.id === stadiumId);
    return stadium ? stadium.name : stadiumId;
  };

  /**
   * 플레이오프 승자 ID를 한글 이름으로 변환
   * @param playoffId - 플레이오프 ID (예: "playoff_europe")
   * @returns 플레이오프 한글 이름
   */
  const getPlayoffName = (playoffId: string): string => {
    const playoffNames: Record<string, string> = {
      playoff_europe: "유럽 플레이오프 승자",
      playoff_a: "플레이오프 A 승자",
      playoff_b: "플레이오프 B 승자",
      playoff_c: "플레이오프 C 승자",
      playoff_1: "플레이오프 1 승자",
      playoff_2: "플레이오프 2 승자",
    };
    return playoffNames[playoffId] || playoffId;
  };

  // 현재 선택된 조 정보 (메모이제이션으로 불필요한 재계산 방지)
  const currentGroup = useMemo(
    () => groups.find((g) => g.id === selectedGroup),
    [selectedGroup]
  );

  return (
    <div>
      {/* 국가 상세 정보 모달 */}
      <CountryModal countryId={selectedCountry} onClose={() => setSelectedCountry(null)} />

      {/* 포트 정보 토글 버튼 */}
      <div className="mb-6 text-center">
        <button
          onClick={() => setShowPotInfo(!showPotInfo)}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold shadow-md"
        >
          {showPotInfo ? "포트 정보 숨기기" : "포트별 팀 정보 보기"}
        </button>
      </div>

      {/* 포트 정보 표시 */}
      {showPotInfo && (
        <div className="mb-8">
          <PotInfo />
        </div>
      )}

      {/* 조 탭 버튼들 (A~L) */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 justify-center">
          {groups.map((group) => (
            <button
              key={group.id}
              onClick={() => setSelectedGroup(group.id)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                selectedGroup === group.id
                  ? "bg-blue-600 text-white shadow-lg scale-105"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {group.name}
            </button>
          ))}
        </div>
      </div>

      {/* 선택된 조의 상세 정보 */}
      {currentGroup && (
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-5xl mx-auto">
          {/* 조 제목 */}
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-2 text-gray-800 border-b-4 border-blue-500 pb-3">
              {currentGroup.name}
            </h2>
          </div>

          {/* 참가국 섹션 */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <span>🏆</span>
              <span>참가국</span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {currentGroup.countries.map((countryId) => {
                const country = getCountryById(countryId);

                // 플레이오프 승자 처리 (아직 확정되지 않은 팀)
                if (!country) {
                  return (
                    <div
                      key={countryId}
                      className="px-4 py-3 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 text-center"
                    >
                      <div className="text-sm font-medium text-gray-600">
                        {getPlayoffName(countryId)}
                      </div>
                    </div>
                  );
                }

                // 일반 국가 카드 (클릭 시 국가 모달 표시)
                return (
                  <button
                    key={countryId}
                    onClick={() => setSelectedCountry(countryId)}
                    className="px-4 py-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all flex flex-col items-center gap-2 border-2 border-blue-200 hover:border-blue-400 hover:shadow-md"
                  >
                    <span className="text-3xl">{country.flag}</span>
                    <span className="text-sm font-semibold text-gray-800">{country.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 경기 일정 섹션 */}
          <div>
            <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <span>📅</span>
              <span>경기 일정</span>
            </h3>
            <div className="space-y-3">
              {currentGroup.matches.map((match) => {
                const team1 = getCountryById(match.team1);
                const team2 = getCountryById(match.team2);

                // 팀 이름과 국기 설정 (플레이오프 승자 처리 포함)
                const team1Name = team1 ? team1.name : getPlayoffName(match.team1);
                const team2Name = team2 ? team2.name : getPlayoffName(match.team2);
                const team1Flag = team1 ? team1.flag : "⚽";
                const team2Flag = team2 ? team2.flag : "⚽";

                return (
                  <div
                    key={match.id}
                    className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border-2 border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
                  >
                    {/* 팀 대전 정보 */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3 flex-1">
                        <span className="text-2xl">{team1Flag}</span>
                        <span className="font-semibold text-gray-800 text-base">{team1Name}</span>
                      </div>
                      <div className="px-4 py-1 bg-blue-500 text-white rounded-full font-bold text-sm mx-4">
                        VS
                      </div>
                      <div className="flex items-center gap-3 flex-1 justify-end">
                        <span className="font-semibold text-gray-800 text-base">{team2Name}</span>
                        <span className="text-2xl">{team2Flag}</span>
                      </div>
                    </div>

                    {/* 경기 일시 및 경기장 정보 */}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-300">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">📆 {match.date}</span>
                        <span className="mx-2">•</span>
                        <span className="font-medium">🕐 {match.time}</span>
                      </div>
                      <div className="text-sm text-gray-700 font-medium">
                        🏟️ {getStadiumName(match.stadium)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
