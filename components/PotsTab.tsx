/**
 * PotsTab 컴포넌트
 *
 * 용도: 포트별 팀 정보를 표시하는 탭 컴포넌트
 * - 각 포트별 참가 팀 표시
 * - 팀 클릭 시 팀 상세 정보 표시: 국기, 주요 선수 명단, FIFA 랭킹
 * - 검색 기능: 팀 이름 및 선수 이름으로 검색 가능
 * - 필터 기능: 특정 포트만 보기
 */

"use client";

import { useState, useMemo } from "react";
import { pots } from "@/data/pots";
import { getCountryById } from "@/data/countries";
import { getFifaRanking, getFifaRank } from "@/data/fifaRankings";
import { getPlayersByCountry } from "@/data/players";
import CountryModal from "./CountryModal";

export default function PotsTab() {
  // 선택된 국가 ID (국가 모달 표시용)
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  // 검색어
  const [searchQuery, setSearchQuery] = useState("");
  // 선택된 포트 필터 (null이면 전체 표시)
  const [selectedPotFilter, setSelectedPotFilter] = useState<number | null>(null);

  /**
   * 플레이오프 승자 ID를 한글 이름으로 변환
   */
  const getPlayoffName = (playoffId: string): string => {
    if (playoffId.startsWith("playoff_europe")) {
      return "유럽 플레이오프 승자";
    }
    if (playoffId.startsWith("playoff_intercontinental")) {
      return "인터콘티넨털 플레이오프 승자";
    }
    if (playoffId.startsWith("playoff_a")) {
      return "플레이오프 A 승자";
    }
    if (playoffId.startsWith("playoff_b")) {
      return "플레이오프 B 승자";
    }
    if (playoffId.startsWith("playoff_c")) {
      return "플레이오프 C 승자";
    }
    return "플레이오프 승자";
  };

  /**
   * 팀이 검색어와 일치하는지 확인 (팀 이름 또는 선수 이름으로 검색)
   * 띄어쓰기를 제거하고 검색 (예: "손 흥민" → "손흥민"으로 검색)
   */
  const matchesSearch = (teamId: string, query: string): boolean => {
    if (!query) return true;

    // 검색어에서 띄어쓰기 제거 및 소문자 변환
    const normalizedQuery = query.replace(/\s+/g, "").toLowerCase();

    const country = getCountryById(teamId);
    if (!country) {
      // 플레이오프 승자는 검색어가 포함되어 있으면 표시
      const playoffName = getPlayoffName(teamId).replace(/\s+/g, "").toLowerCase();
      return playoffName.includes(normalizedQuery);
    }

    // 팀 이름으로 검색 (띄어쓰기 제거)
    const normalizedCountryName = country.name.replace(/\s+/g, "").toLowerCase();
    if (normalizedCountryName.includes(normalizedQuery)) {
      return true;
    }

    // 선수 이름으로 검색 (띄어쓰기 제거) - 한국어 및 영어 모두 검색
    const players = getPlayersByCountry(teamId);
    return players.some((player) => {
      const normalizedPlayerName = player.name.replace(/\s+/g, "").toLowerCase();
      const normalizedPlayerNameEn = player.nameEn?.replace(/\s+/g, "").toLowerCase() || "";
      return normalizedPlayerName.includes(normalizedQuery) || normalizedPlayerNameEn.includes(normalizedQuery);
    });
  };

  /**
   * 필터링된 포트 목록 (검색어 및 포트 필터 적용)
   */
  const filteredPots = useMemo(() => {
    return pots
      .filter((pot) => selectedPotFilter === null || pot.id === selectedPotFilter)
      .map((pot) => {
        const filteredTeams = pot.teams.filter((teamId) =>
          matchesSearch(teamId, searchQuery)
        );
        return { ...pot, teams: filteredTeams };
      })
      .filter((pot) => pot.teams.length > 0);
  }, [searchQuery, selectedPotFilter]);

  return (
    <div>
      {/* 국가 상세 정보 모달 */}
      <CountryModal countryId={selectedCountry} onClose={() => setSelectedCountry(null)} />

      <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 text-center border-b-4 border-blue-500 pb-3">
          포트별 팀 정보
        </h2>

        {/* 검색 및 필터 섹션 */}
        <div className="mb-6 space-y-4">
          {/* 검색 입력 */}
          <div className="relative">
            <input
              type="text"
              placeholder="팀 이름 또는 선수 이름으로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-white text-gray-800"
            />
            <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
          </div>

          {/* 포트 필터 버튼 */}
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setSelectedPotFilter(null)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                selectedPotFilter === null
                  ? "bg-blue-600 text-white shadow-lg scale-105"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              전체
            </button>
            {pots.map((pot) => (
              <button
                key={pot.id}
                onClick={() => setSelectedPotFilter(pot.id)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  selectedPotFilter === pot.id
                    ? "bg-blue-600 text-white shadow-lg scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {pot.name}
              </button>
            ))}
          </div>
        </div>

        {/* 포트별 팀 목록 */}
        {filteredPots.length > 0 ? (
          <div className="space-y-6">
            {filteredPots.map((pot) => (
              <div
                key={pot.id}
                className="bg-gray-50 rounded-lg p-4 md:p-6 border-2 border-gray-200"
              >
                <h3 className="text-xl md:text-2xl font-bold mb-4 text-gray-800">
                  {pot.name}
                </h3>
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
                    const fifaRanking = getFifaRanking(teamId);
                    const fifaRank = getFifaRank(teamId);

                    return (
                      <button
                        key={country.id}
                        onClick={() => setSelectedCountry(country.id)}
                        className="px-4 py-3 bg-blue-50 rounded-lg border-2 border-blue-200 hover:border-blue-400 hover:shadow-md transition-all flex flex-col items-center gap-2 relative group"
                      >
                        <span className="text-3xl">{country.flag}</span>
                        <span className="text-sm font-semibold text-gray-800">
                          {country.name}
                        </span>
                        {fifaRanking && (
                          <span className="text-xs text-gray-600">
                            FIFA 랭킹: {fifaRank}위 ({fifaRanking}점)
                          </span>
                        )}
                        {searchQuery && matchesSearch(country.id, searchQuery) && (
                          <span className="absolute inset-0 border-2 border-yellow-400 rounded-lg animate-pulse" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-600">
            검색 결과가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
