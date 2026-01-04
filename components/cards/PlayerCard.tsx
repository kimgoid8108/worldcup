/**
 * PlayerCard 컴포넌트
 *
 * 용도: 선수 정보를 표시하는 재사용 가능한 카드 컴포넌트
 */

"use client";

import { type Player } from "@/types/player";
import { useLanguage } from "@/contexts/LanguageContext";
import { getPlayerNameByLanguage } from "@/utils/playerUtils";

interface PlayerCardProps {
  player: Player;
  onClick?: (player: Player, e: React.MouseEvent) => void;
  variant?: "default" | "compact";
  className?: string;
}

export default function PlayerCard({
  player,
  onClick,
  variant = "default",
  className = "",
}: PlayerCardProps) {
  const { language, t } = useLanguage();
  const playerName = getPlayerNameByLanguage(player, language);
  const alternateName = language === "ko" ? player.nameEn : (player.name !== player.nameEn ? player.name : undefined);
  
  const baseClasses =
    "w-full p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 hover:border-blue-300 transition-all text-left";

  if (variant === "compact") {
    return (
      <button
        onClick={onClick ? (e) => onClick(player, e) : undefined}
        className={`${baseClasses} ${className}`}
      >
        <div className="flex justify-between items-center">
          <div>
            <p className="font-semibold text-gray-800">
              {playerName}
              {alternateName && (
                <span className="text-sm font-normal text-gray-600 ml-2">
                  ({alternateName})
                </span>
              )}
            </p>
            <p className="text-sm text-gray-600">{player.position}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">{player.club}</p>
            <p className="text-xs text-gray-500">
              {language === "ko" ? "나이" : "Age"}: {player.age}
            </p>
          </div>
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={onClick ? (e) => onClick(player, e) : undefined}
      className={`${baseClasses} ${className}`}
    >
      <div className="flex justify-between items-center">
        <div>
          <p className="font-semibold text-gray-800">
            {playerName}
            {alternateName && (
              <span className="text-sm font-normal text-gray-600 ml-2">
                ({alternateName})
              </span>
            )}
          </p>
          <p className="text-sm text-gray-600">{player.position}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">{player.club}</p>
          <p className="text-xs text-gray-500">
            {language === "ko" ? "나이" : "Age"}: {player.age}
          </p>
        </div>
      </div>
    </button>
  );
}
