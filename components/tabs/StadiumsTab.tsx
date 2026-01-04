/**
 * StadiumsTab 컴포넌트
 *
 * 용도: 경기장 목록 및 지도를 표시하는 탭 컴포넌트
 * - 지도에 경기장 마커 표시 (StadiumMapOverlay 사용)
 * - 국가별로 그룹화된 경기장 목록 표시
 * - 경기장 클릭 시 상세 정보 모달 표시
 * - 목록 호버 시 지도 마커 하이라이트
 */

"use client";

import { useState, useMemo } from "react";
import { stadiums } from "@/data/stadiums";
import StadiumModal from "@/components/modals/StadiumModal";
import StadiumMapOverlay from "@/components/maps/StadiumMapOverlay";
import { normalizeText } from "@/src/utils/normalizeText";
import { useLanguage } from "@/contexts/LanguageContext";

export default function StadiumsTab() {
  const { t, language } = useLanguage();
  
  // 국가명을 언어에 따라 변환
  const getCountryName = (countryCode: string): string => {
    const countryMap: Record<string, { ko: string; en: string }> = {
      "USA": { ko: "미국", en: "United States" },
      "Canada": { ko: "캐나다", en: "Canada" },
      "Mexico": { ko: "멕시코", en: "Mexico" },
    };
    const country = countryMap[countryCode];
    return country ? (language === "ko" ? country.ko : country.en) : countryCode;
  };
  // 선택된 경기장 ID (모달 표시용)
  const [selectedStadium, setSelectedStadium] = useState<string | null>(null);

  // 하이라이트된 경기장 ID (목록 호버 시 지도 마커 강조)
  const [highlightedStadium, setHighlightedStadium] = useState<string | null>(null);

  // 검색어
  const [searchQuery, setSearchQuery] = useState("");


  /**
   * 경기장을 국가별로 그룹화 및 검색 필터링
   * useMemo로 최적화: stadiums 배열이 변경되지 않는 한 재계산하지 않음
   * 띄어쓰기를 제거하고 검색 (예: "So Fi" → "SoFi"로 검색)
   * 국가 이름 검색은 앞글자부터 시작해야 함 (startsWith 기반)
   * normalizeText를 사용하여 유니코드 정규화 및 whitespace 제거
   */
  const groupedStadiums = useMemo(() => {
    const filtered = searchQuery
      ? stadiums.filter((stadium) => {
          // 검색어 정규화 (NFC, 모든 whitespace 제거, 소문자 변환)
          const normalizedQuery = normalizeText(searchQuery);

          // 경기장 이름, 도시는 includes 사용 (기존 동작 유지)
          // 국가 이름은 앞글자부터 시작해야 함
          const normalizedName = normalizeText(stadium.name);
          const normalizedCity = normalizeText(stadium.city);
          const countryName = getCountryName(stadium.country);
          const normalizedCountry = normalizeText(countryName);

          return (
            normalizedName.includes(normalizedQuery) ||
            normalizedCity.includes(normalizedQuery) ||
            normalizedCountry.startsWith(normalizedQuery)
          );
        })
      : stadiums;

    return filtered.reduce((acc, stadium) => {
      const countryName = getCountryName(stadium.country);
      if (!acc[countryName]) {
        acc[countryName] = [];
      }
      acc[countryName].push(stadium);
      return acc;
    }, {} as Record<string, typeof stadiums>);
  }, [searchQuery, language]);

  // 국가 목록 (정렬된 순서)
  const countries = useMemo(() => Object.keys(groupedStadiums), [groupedStadiums]);

  return (
    <div>
      {/* 경기장 상세 정보 모달 */}
      <StadiumModal
        stadiumId={selectedStadium}
        onClose={() => setSelectedStadium(null)}
      />

      <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 text-center border-b-4 border-blue-500 pb-3">
          {t("stadiums.stadiumInfo")}
        </h2>

        {/* 검색 입력 */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder={t("stadiums.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-white text-gray-800"
            />
            <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
          </div>
        </div>

        {/* 지도 섹션 */}
        <div id="stadium-map" className="mb-8">
          <div className="bg-gray-50 rounded-lg shadow-md p-4 md:p-6 mb-6">
            <h3 className="text-xl md:text-2xl font-bold mb-4 text-gray-800">
              {t("stadiums.stadiumMap")}
            </h3>

            {/* 커스텀 지도 오버레이 (마커 포함) */}
            <StadiumMapOverlay
              stadiums={stadiums}
              onStadiumClick={setSelectedStadium}
              highlightedStadiumId={highlightedStadium}
            />

            <p className="text-sm text-gray-600 mt-4">
              {t("stadiums.mapDescription")}
            </p>
          </div>
        </div>

        {/* 경기장 목록 섹션 */}
        <div id="stadium-list">
          <p className="text-center text-gray-600 mb-6">
            {t("stadiums.totalStadiums")} {stadiums.length}{t("stadiums.searchResults")}
            {searchQuery && ` (${t("groups.searchResults")}: ${Object.values(groupedStadiums).flat().length}${t("stadiums.searchResults")})`}
          </p>

          {/* 국가별로 그룹화된 경기장 목록 */}
          {countries.length > 0 ? (
            countries.map((country) => (
              <div key={country} className="mb-12">
                <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-700 border-b-2 border-gray-300 pb-2">
                  {country} ({groupedStadiums[country].length}{language === "ko" ? "개" : ""})
                </h2>

                {/* 경기장 그리드 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupedStadiums[country].map((stadium) => {
                    const isHighlighted = highlightedStadium === stadium.id;
                    const isSearchMatch =
                      searchQuery &&
                      (stadium.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        stadium.city.toLowerCase().includes(searchQuery.toLowerCase()));

                    return (
                      <button
                        key={stadium.id}
                        onClick={() => setSelectedStadium(stadium.id)}
                        onMouseEnter={() => setHighlightedStadium(stadium.id)}
                        onMouseLeave={() => setHighlightedStadium(null)}
                        className={`p-5 bg-white rounded-lg shadow-md hover:shadow-xl transition-all hover:scale-105 text-left border-2 relative ${
                          isHighlighted
                            ? "border-blue-500 ring-2 ring-blue-200"
                            : "border-transparent"
                        } ${isSearchMatch ? "ring-2 ring-yellow-400" : ""}`}
                      >
                        <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-800">
                          {stadium.name}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {stadium.city}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-600">
              {t("stadiums.noSearchResults")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
