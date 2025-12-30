/**
 * PotInfo 컴포넌트
 *
 * 용도: 2026 FIFA 월드컵 포트별 팀 정보를 표시하는 컴포넌트
 * - 각 Pot에 속한 팀 목록 표시
 * - 국가 정보는 countries.ts에서 조회
 * - 플레이오프 승자는 간단히 표시
 *
 * 사용 위치:
 * - GroupsTab 또는 별도 페이지에서 포트 정보 표시
 */

"use client";

import { useState } from "react";
import { pots } from "@/data/pots";
import { getCountryById } from "@/data/countries";
import Flag from "./Flag";

export default function PotInfo() {
  const [selectedPot, setSelectedPot] = useState<number | null>(null);

  /**
   * 플레이오프 승자 ID를 한글 이름으로 변환
   * @param playoffId - 플레이오프 ID
   * @returns 플레이오프 한글 이름
   */
  const getPlayoffName = (playoffId: string): string => {
    if (playoffId.startsWith("playoff_europe")) {
      return "유럽 플레이오프 승자";
    }
    if (playoffId.startsWith("playoff_intercontinental")) {
      return "인터콘티넨털 플레이오프 승자";
    }
    return "플레이오프 승자";
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center border-b-4 border-blue-500 pb-3">
        포트별 팀 정보
      </h2>

      {/* Pot 탭 */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 justify-center">
          {pots.map((pot) => (
            <button
              key={pot.id}
              onClick={() => setSelectedPot(selectedPot === pot.id ? null : pot.id)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                selectedPot === pot.id
                  ? "bg-blue-600 text-white shadow-lg scale-105"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {pot.name}
            </button>
          ))}
        </div>
      </div>

      {/* 선택된 Pot 정보 또는 전체 Pot 정보 */}
      {selectedPot ? (
        // 특정 Pot 상세 정보
        (() => {
          const pot = pots.find((p) => p.id === selectedPot);
          if (!pot) return null;

          return (
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-2xl font-bold mb-4 text-gray-800">{pot.name}</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {pot.teams.map((teamId, index) => {
                  const country = getCountryById(teamId);

                  if (!country) {
                    // 플레이오프 승자
                    return (
                      <div
                        key={`${pot.id}-${index}`}
                        className="px-4 py-3 bg-gray-200 rounded-lg border-2 border-dashed border-gray-400 text-center"
                      >
                        <div className="text-sm font-medium text-gray-700">
                          {getPlayoffName(teamId)}
                        </div>
                      </div>
                    );
                  }

                  // 일반 국가
                  return (
                    <div
                      key={country.id}
                      className="px-4 py-3 bg-blue-50 rounded-lg border-2 border-blue-200 flex flex-col items-center justify-center gap-2"
                    >
                      <Flag country={country} size="lg" />
                      <span className="text-sm font-semibold text-gray-800 text-center">{country.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()
      ) : (
        // 전체 Pot 정보 (간단히)
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {pots.map((pot) => (
            <div
              key={pot.id}
              className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200 hover:border-blue-300 transition-all cursor-pointer"
              onClick={() => setSelectedPot(pot.id)}
            >
              <h3 className="text-xl font-bold mb-3 text-gray-800">{pot.name}</h3>
              <p className="text-sm text-gray-600 mb-2">총 {pot.teams.length}개 팀</p>
              <div className="flex flex-wrap gap-1">
                {pot.teams.slice(0, 6).map((teamId, index) => {
                  const country = getCountryById(teamId);
                  if (country) {
                    return (
                      <span key={index} title={country.name}>
                        <Flag country={country} size="sm" />
                      </span>
                    );
                  }
                  return null;
                })}
                {pot.teams.length > 6 && (
                  <span className="text-xs text-gray-500">+{pot.teams.length - 6}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
