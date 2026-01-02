/**
 * PlayerList 컴포넌트
 *
 * 용도: 선수 목록을 표시하는 재사용 가능한 컴포넌트
 */

"use client";

import { type Player } from "@/types/player";
import PlayerCard from "@/components/cards/PlayerCard";

interface PlayerListProps {
  players: Player[];
  onPlayerClick?: (player: Player, e: React.MouseEvent) => void;
  emptyMessage?: string;
  className?: string;
}

export default function PlayerList({
  players,
  onPlayerClick,
  emptyMessage = "선수 정보가 없습니다.",
  className = "",
}: PlayerListProps) {
  if (players.length === 0) {
    return (
      <p className={`text-gray-500 ${className}`}>{emptyMessage}</p>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {players.map((player) => (
        <PlayerCard
          key={player.id}
          player={player}
          onClick={onPlayerClick}
          variant="compact"
        />
      ))}
    </div>
  );
}
