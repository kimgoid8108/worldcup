/**
 * PlayerImageCard 컴포넌트
 *
 * 용도: 선수 이미지와 정보를 표시하는 재사용 가능한 카드 컴포넌트
 */

"use client";

import { useState } from "react";
import { type PlayerWithImage } from "@/types/player";

// PlayerWithImage 타입은 types/player.ts에서 import

interface PlayerImageCardProps {
  player: PlayerWithImage | null;
  index: number;
  onClick?: (player: PlayerWithImage | null, index: number) => void;
  className?: string;
  size?: "small" | "normal"; // 이미지 크기 옵션
}

export default function PlayerImageCard({
  player,
  index,
  onClick,
  className = "",
  size = "normal",
}: PlayerImageCardProps) {
  const defaultImageUrl = "https://i.ifh.cc/qbhPHD.png";
  const [imageSrc, setImageSrc] = useState(player?.imageUrl || defaultImageUrl);
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    if (!imageError && imageSrc !== defaultImageUrl) {
      setImageError(true);
      setImageSrc(defaultImageUrl);
    }
  };

  // 크기별 클래스 설정
  const imageSizeClass = size === "small"
    ? "w-10 h-10 md:w-12 md:h-12"
    : "w-14 h-14 md:w-16 md:h-16";
  const textSizeClass = size === "small"
    ? "text-[9px] md:text-[10px]"
    : "text-[10px] md:text-xs";
  const positionSizeClass = size === "small"
    ? "text-[8px] md:text-[9px]"
    : "text-[9px] md:text-[10px]";

  return (
    <div
      className={`flex flex-col items-center cursor-pointer ${className}`}
      onClick={() => onClick?.(player, index)}
    >
      {/* 선수 이미지 */}
      <div className={`relative ${imageSizeClass} rounded-full overflow-hidden border-2 border-blue-500 shadow-lg hover:shadow-xl transition-shadow`}>
        <img
          src={imageSrc}
          alt={player?.name || `Player ${index + 1}`}
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
      </div>

      {/* 선수 이름과 포지션 */}
      <div className="mt-1 text-center w-full">
        <div className={`${textSizeClass} font-semibold text-white bg-black/70 px-1.5 py-0.5 rounded whitespace-normal break-words max-w-[120px] mx-auto overflow-hidden text-ellipsis`}>
          {player?.name || `Player ${index + 1}`}
        </div>
        <div className={`${positionSizeClass} text-gray-300 mt-0.5`}>
          {player?.position || "N/A"}
        </div>
      </div>
    </div>
  );
}
