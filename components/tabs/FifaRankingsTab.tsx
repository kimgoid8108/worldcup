/**
 * FifaRankingsTab 컴포넌트
 *
 * 용도: FIFA 랭킹 순위를 표시하는 탭 컴포넌트
 * - 모든 국가를 FIFA 랭킹 순위대로 정렬하여 표시
 * - 테이블 레이아웃으로 FIFA 공식 홈페이지 스타일 구현
 * - 검색 기능: 팀 이름으로 검색 가능
 * - 국가 클릭 시 상세 정보 표시
 */

"use client";

import { useState, useMemo, useCallback } from "react";
import { countries } from "@/data/countries";
import { getCountryById } from "@/data/countries";
import { getFifaRanking, getFifaRank } from "@/data/fifaRankings";
import CountryModal from "@/components/modals/CountryModal";
import SearchBar from "@/components/search/SearchBar";
import Flag from "@/components/ui/Flag";
import { Filter, ChevronDown, ArrowUp, ArrowDown, X } from "lucide-react";
import { normalizeText } from "@/src/utils/normalizeText";

interface RankingData {
  countryId: string;
  rank: number;
  totalPoints: number;
  previousPoints: number;
  change: number;
}

// 대륙별 국가 매핑
const getContinentByCountry = (countryId: string): string => {
  const continentMap: Record<string, string> = {
    // 아시아 (AFC)
    japan: "asia",
    southkorea: "asia",
    iran: "asia",
    saudiarabia: "asia",
    qatar: "asia",
    jordan: "asia",
    uzbekistan: "asia",
    iraq: "asia",
    australia: "asia", // AFC 소속
    // 유럽 (UEFA)
    france: "europe",
    england: "europe",
    spain: "europe",
    germany: "europe",
    italy: "europe",
    portugal: "europe",
    netherlands: "europe",
    belgium: "europe",
    croatia: "europe",
    switzerland: "europe",
    denmark: "europe",
    poland: "europe",
    sweden: "europe",
    norway: "europe",
    turkiye: "europe",
    scotland: "europe",
    czechrepublic: "europe",
    ireland: "europe",
    northernireland: "europe",
    wales: "europe",
    bosnia: "europe",
    romania: "europe",
    slovakia: "europe",
    kosovo: "europe",
    ukraine: "europe",
    albania: "europe",
    austria: "europe",
    northmacedonia: "europe",
    // 남미 (CONMEBOL)
    brazil: "southamerica",
    argentina: "southamerica",
    uruguay: "southamerica",
    colombia: "southamerica",
    ecuador: "southamerica",
    paraguay: "southamerica",
    bolivia: "southamerica",
    // 북중미 (CONCACAF)
    usa: "northamerica",
    canada: "northamerica",
    mexico: "northamerica",
    panama: "northamerica",
    jamaica: "northamerica",
    haiti: "northamerica",
    curacao: "northamerica",
    suriname: "northamerica",
    // 아프리카 (CAF)
    morocco: "africa",
    senegal: "africa",
    egypt: "africa",
    southafrica: "africa",
    ivorycoast: "africa",
    tunisia: "africa",
    algeria: "africa",
    ghana: "africa",
    capeverde: "africa",
    congodr: "africa",
    // 오세아니아 (OFC)
    newzealand: "oceania",
    newcaledonia: "oceania",
  };
  return continentMap[countryId] || "other";
};

const CONTINENTS = [
  { id: "all", name: "전체" },
  { id: "asia", name: "아시아" },
  { id: "europe", name: "유럽" },
  { id: "southamerica", name: "남미" },
  { id: "northamerica", name: "북중미" },
  { id: "africa", name: "아프리카" },
  { id: "oceania", name: "오세아니아" },
];

export default function FifaRankingsTab() {
  // 선택된 국가 ID (국가 모달 표시용)
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  // 검색어
  const [searchQuery, setSearchQuery] = useState("");
  // 정렬 컬럼 및 방향
  const [sortColumn, setSortColumn] = useState<"rank" | "points" | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  // 선택된 대륙 필터
  const [selectedContinent, setSelectedContinent] = useState<string>("all");
  // 필터 드롭다운 열림/닫힘
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  // 전체 랭킹 표시 여부
  const [showAll, setShowAll] = useState(false);

  /**
   * 팀이 검색어와 일치하는지 확인 (useCallback으로 메모이제이션)
   * 검색어는 국가 이름의 앞글자부터 시작해야 함 (startsWith 기반)
   * normalizeText를 사용하여 유니코드 정규화 및 whitespace 제거
   */
  const matchesSearch = useCallback((teamId: string, query: string): boolean => {
    if (!query) return true;

    // 검색어 정규화 (NFC, 모든 whitespace 제거, 소문자 변환)
    const normalizedQuery = normalizeText(query);

    const country = getCountryById(teamId);
    if (!country) return false;

    // 국가 이름 정규화 후 앞글자부터 시작하는지 확인
    const normalizedCountryName = normalizeText(country.name);
    return normalizedCountryName.startsWith(normalizedQuery);
  }, []);

  /**
   * 이전 포인트 계산 (시뮬레이션: 현재 포인트에서 작은 변동 생성)
   */
  const getPreviousPoints = useCallback((currentPoints: number, rank: number): number => {
    // 랭킹에 따라 작은 변동 생성 (상위권은 작은 변동, 하위권은 큰 변동)
    const variation = rank <= 10 ? Math.random() * 5 - 2.5 : Math.random() * 10 - 5;
    return Math.max(0, currentPoints + variation);
  }, []);

  /**
   * FIFA 랭킹 데이터 생성
   */
  const rankingData = useMemo(() => {
    // 모든 국가 가져오기
    let allTeams = countries.map((country) => country.id);

    // 대륙 필터 적용
    if (selectedContinent !== "all") {
      allTeams = allTeams.filter((teamId) => getContinentByCountry(teamId) === selectedContinent);
    }

    // 검색어 필터 적용
    const filteredTeams = allTeams.filter((teamId) => matchesSearch(teamId, searchQuery));

    // FIFA 랭킹 데이터 생성
    const data: RankingData[] = filteredTeams
      .map((teamId) => {
        const ranking = getFifaRanking(teamId);
        const rank = getFifaRank(teamId);

        if (ranking === null || rank === null) return null;

        const previousPoints = getPreviousPoints(ranking, rank);
        const change = ranking - previousPoints;

        return {
          countryId: teamId,
          rank,
          totalPoints: ranking,
          previousPoints,
          change,
        };
      })
      .filter((item): item is RankingData => item !== null);

    // 정렬
    if (sortColumn) {
      data.sort((a, b) => {
        if (sortColumn === "rank") {
          return sortDirection === "asc" ? a.rank - b.rank : b.rank - a.rank;
        } else {
          return sortDirection === "asc" ? a.totalPoints - b.totalPoints : b.totalPoints - a.totalPoints;
        }
      });
    } else {
      // 기본 정렬: 랭킹 순
      data.sort((a, b) => a.rank - b.rank);
    }

    return data;
  }, [searchQuery, matchesSearch, sortColumn, sortDirection, getPreviousPoints, selectedContinent]);

  // 모달 닫기 핸들러 메모이제이션
  const handleCloseModal = useCallback(() => {
    setSelectedCountry(null);
  }, []);

  // 국가 클릭 핸들러 메모이제이션
  const handleCountryClick = useCallback((countryId: string) => {
    setSelectedCountry(countryId);
  }, []);

  // 정렬 핸들러
  const handleSort = useCallback(
    (column: "rank" | "points") => {
      if (sortColumn === column) {
        setSortDirection(sortDirection === "asc" ? "desc" : "asc");
      } else {
        setSortColumn(column);
        setSortDirection("asc");
      }
    },
    [sortColumn, sortDirection]
  );

  return (
    <>
      {/* 메인 리스트 - 항상 렌더링되어야 함 (언마운트 방지) */}
      <div className="bg-white rounded-lg shadow-lg p-3 md:p-6" style={{ position: "relative", zIndex: 1 }}>
        <h2 className="text-xl md:text-3xl font-bold mb-4 md:mb-6 text-gray-800 text-center border-b-2 md:border-b-4 border-blue-500 pb-2 md:pb-3">FIFA 랭킹 순위</h2>

        {/* 검색 섹션 및 Filters 버튼 */}
        <div className="max-w-5xl mx-auto mb-3 md:mb-4 flex flex-col md:flex-row gap-3 md:gap-4 items-stretch md:items-center justify-between">
          <div className="flex-1 w-full md:max-w-md">
            <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="팀 이름으로 검색..." />
          </div>
          <div className="relative w-full md:w-auto">
            <button onClick={() => setIsFilterOpen(!isFilterOpen)} className="flex items-center justify-center gap-2 px-3 md:px-4 py-2 w-full md:w-auto border border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm md:text-base">
              <Filter size={16} />
              <span>{selectedContinent === "all" ? "전체" : CONTINENTS.find((c) => c.id === selectedContinent)?.name}</span>
            </button>
            {isFilterOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsFilterOpen(false)} />
                <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20 min-w-[150px]">
                  {CONTINENTS.map((continent) => (
                    <button
                      key={continent.id}
                      onClick={() => {
                        setSelectedContinent(continent.id);
                        setIsFilterOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors flex items-center justify-between ${
                        selectedContinent === continent.id ? "bg-blue-50 text-blue-600" : "text-gray-700"
                      }`}>
                      <span>{continent.name}</span>
                      {selectedContinent === continent.id && <span className="text-blue-600">✓</span>}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* 테이블 컨테이너 */}
        {rankingData.length > 0 ? (
          <div className="max-w-5xl mx-auto bg-[#f3f3f3] rounded-xl p-2 md:p-6">
            {/* 테이블 헤더 */}
            <div className="hidden md:grid gap-4 mb-3 px-4 py-2" style={{ gridTemplateColumns: "50px 1fr 120px 120px 100px 50px" }}>
              <div className="flex items-center justify-center gap-1 cursor-pointer" onClick={() => handleSort("rank")}>
                <span className="text-sm font-semibold text-gray-500">랭킹</span>
                {sortColumn === "rank" && (sortDirection === "asc" ? <ArrowUp size={14} className="text-gray-500" /> : <ArrowDown size={14} className="text-gray-500" />)}
              </div>
              <div className="flex items-center justify-center">
                <span className="text-sm font-semibold text-gray-500">국가</span>
              </div>
              <div className="flex items-center justify-center gap-1 cursor-pointer" onClick={() => handleSort("points")}>
                <span className="text-sm font-semibold text-gray-500">현재 포인트</span>
                {sortColumn === "points" && (sortDirection === "asc" ? <ArrowUp size={14} className="text-gray-500" /> : <ArrowDown size={14} className="text-gray-500" />)}
              </div>
              <div className="flex items-center justify-center">
                <span className="text-sm font-semibold text-gray-500">이전 포인트</span>
              </div>
              <div className="flex items-center justify-center">
                <span className="text-sm font-semibold text-gray-500">변동</span>
              </div>
              <div className="flex items-center justify-center">
                <span className="text-sm font-semibold text-gray-500">더보기</span>
              </div>
            </div>

            {/* 모바일 헤더 */}
            <div className="md:hidden grid gap-2 mb-2 px-2 py-2" style={{ gridTemplateColumns: "35px 1fr 60px 50px" }}>
              <div className="flex items-center justify-center gap-1 cursor-pointer" onClick={() => handleSort("rank")}>
                <span className="text-xs font-semibold text-gray-500">순위</span>
                {sortColumn === "rank" && (sortDirection === "asc" ? <ArrowUp size={12} className="text-gray-500" /> : <ArrowDown size={12} className="text-gray-500" />)}
              </div>
              <div className="flex items-center justify-start">
                <span className="text-xs font-semibold text-gray-500">팀</span>
              </div>
              <div className="flex items-center justify-center gap-1 cursor-pointer" onClick={() => handleSort("points")}>
                <span className="text-xs font-semibold text-gray-500">포인트</span>
                {sortColumn === "points" && (sortDirection === "asc" ? <ArrowUp size={12} className="text-gray-500" /> : <ArrowDown size={12} className="text-gray-500" />)}
              </div>
              <div className="flex items-center justify-center">
                <span className="text-xs font-semibold text-gray-500">변동</span>
              </div>
            </div>

            {/* 데이터 행 */}
            <div className="space-y-2">
              {(showAll || selectedContinent !== "all" ? rankingData : rankingData.slice(0, 10)).map((data) => {
                const country = getCountryById(data.countryId);
                if (!country) return null;

                const changeValue = Math.abs(data.change) < 0.01 ? 0 : data.change;
                const isPositive = changeValue > 0;
                const isNegative = changeValue < 0;

                return (
                  <div
                    key={data.countryId}
                    className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-100 p-2 md:p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleCountryClick(data.countryId)}>
                    {/* 데스크톱 레이아웃 */}
                    <div className="hidden md:grid gap-4 items-center" style={{ gridTemplateColumns: "50px 1fr 120px 120px 100px 50px" }}>
                      {/* RK */}
                      <div className="font-bold text-gray-800 text-center">{data.rank}</div>

                      {/* Team */}
                      <div className="flex items-center justify-center gap-3">
                        <Flag country={country} size="md" />
                        <span className="font-medium text-gray-800">{country.name}</span>
                      </div>

                      {/* Total Points */}
                      <div className="text-center font-medium text-gray-800">{Math.round(data.totalPoints)}</div>

                      {/* Previous Points */}
                      <div className="text-center text-gray-600">{Math.round(data.previousPoints)}</div>

                      {/* +/- */}
                      <div className="flex items-center justify-center gap-1">
                        {changeValue === 0 ? (
                          <span className="text-gray-500">-</span>
                        ) : isPositive ? (
                          <>
                            <ArrowUp size={14} className="text-green-600" />
                            <span className="text-green-600 font-medium">{changeValue.toFixed(2)}</span>
                          </>
                        ) : (
                          <>
                            <ArrowDown size={14} className="text-red-600" />
                            <span className="text-red-600 font-medium">{Math.abs(changeValue).toFixed(2)}</span>
                          </>
                        )}
                      </div>

                      {/* More */}
                      <div className="flex justify-center">
                        <ChevronDown size={16} className="text-gray-400" />
                      </div>
                    </div>

                    {/* 모바일 레이아웃 */}
                    <div className="md:hidden grid gap-2 items-center" style={{ gridTemplateColumns: "35px 1fr 60px 50px" }}>
                      {/* RK */}
                      <div className="font-bold text-gray-800 text-center text-sm">{data.rank}</div>

                      {/* Team */}
                      <div className="flex items-center gap-1.5 min-w-0">
                        <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                          <Flag country={country} size="sm" />
                        </div>
                        <span className="font-medium text-gray-800 text-xs truncate whitespace-nowrap flex-1">{country.name}</span>
                      </div>

                      {/* Points */}
                      <div className="text-center font-medium text-gray-800 text-xs">{Math.round(data.totalPoints)}</div>

                      {/* +/- */}
                      <div className="flex items-center justify-center gap-0.5">
                        {changeValue === 0 ? (
                          <span className="text-gray-500 text-xs">-</span>
                        ) : isPositive ? (
                          <>
                            <ArrowUp size={10} className="text-green-600" />
                            <span className="text-green-600 font-medium text-xs">{changeValue.toFixed(1)}</span>
                          </>
                        ) : (
                          <>
                            <ArrowDown size={10} className="text-red-600" />
                            <span className="text-red-600 font-medium text-xs">{Math.abs(changeValue).toFixed(1)}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Show full rankings 버튼 */}
            {selectedContinent === "all" && !showAll && rankingData.length > 10 && (
              <div className="mt-4 md:mt-6 text-center">
                <button onClick={() => setShowAll(true)} className="px-4 md:px-6 py-2 text-sm md:text-base border border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                  전체 랭킹 보기
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-600">검색 결과가 없습니다.</div>
        )}
      </div>

      {/* 국가 상세 정보 모달 - 메인 리스트와 분리하여 항상 렌더링 가능하도록 */}
      <CountryModal countryId={selectedCountry} onClose={handleCloseModal} />
    </>
  );
}
