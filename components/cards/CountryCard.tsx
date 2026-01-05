/**
 * CountryCard 컴포넌트
 *
 * 용도: 국가 정보를 표시하는 재사용 가능한 카드 컴포넌트
 */

"use client";

import { Country } from "@/data/countries";
import { getFifaRanking, getFifaRank } from "@/data/fifaRankings";
import Flag from "@/components/ui/Flag";

interface CountryCardProps {
  country: Country;
  onClick?: (countryId: string) => void;
  showRanking?: boolean;
  highlight?: boolean;
  className?: string;
}

export default function CountryCard({
  country,
  onClick,
  showRanking = true,
  highlight = false,
  className = "",
}: CountryCardProps) {
  const fifaRanking = showRanking && country.id ? getFifaRanking(country.id) : null;
  const fifaRank = showRanking && country.id ? getFifaRank(country.id) : null;

  return (
    <button
      onClick={() => country.id && onClick?.(country.id)}
      className={`px-4 py-3 bg-blue-50 rounded-lg border-2 border-blue-200 hover:border-blue-400 hover:shadow-md transition-all flex flex-row items-center justify-between relative group max-w-2xl mx-auto w-full ${className}`}
    >
      <Flag country={country} size="xl" />
      <div className="flex flex-col items-end">
        <span className="text-sm font-semibold text-gray-800">
          {country.nameKo || country.nameEn || ""}
        </span>
        {fifaRanking && fifaRank && (
          <span className="text-xs text-gray-600">
            {fifaRank}위 ({fifaRanking}점)
          </span>
        )}
      </div>
      {highlight && (
        <span className="absolute inset-0 border-2 border-yellow-400 rounded-lg animate-pulse" />
      )}
    </button>
  );
}
