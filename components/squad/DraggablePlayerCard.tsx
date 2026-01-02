/**
 * DraggablePlayerCard 컴포넌트
 * 드래그 가능한 선수 카드 컴포넌트
 */

import { memo, useCallback } from "react";
import PlayerImageCard from "./PlayerImageCard";
import { type PlayerWithImage } from "@/types/player";
import { type SquadPlayer, convertToPlayerWithImage } from "./utils/squadUtils";

interface DraggablePlayerCardProps {
  squadPlayer: SquadPlayer;
  index: number;
  team: "team1" | "team2";
  isDragging: boolean;
  hasDragged: boolean;
  imageSize?: "small" | "normal";
  onDragStart: (index: number, team: "team1" | "team2", e: React.MouseEvent) => void;
  onPlayerClick?: (player: PlayerWithImage | null, index: number) => void;
}

const DraggablePlayerCard = memo(
  ({
    squadPlayer,
    index,
    team,
    isDragging,
    hasDragged,
    imageSize = "normal",
    onDragStart,
    onPlayerClick,
  }: DraggablePlayerCardProps) => {
    const handleClick = useCallback(
      (e: React.MouseEvent) => {
        // 드래그가 발생하지 않았을 때만 클릭 이벤트 실행
        if (!isDragging && !hasDragged) {
          // squadPlayer.player를 PlayerWithImage로 변환하여 전달
          const playerWithImage = convertToPlayerWithImage(squadPlayer.player);
          onPlayerClick?.(playerWithImage, index);
        }
      },
      [isDragging, hasDragged, squadPlayer.player, index, onPlayerClick]
    );

    const handleMouseDown = useCallback(
      (e: React.MouseEvent) => {
        onDragStart(index, team, e);
      },
      [index, team, onDragStart]
    );

    return (
      <div
        className={`absolute transform -translate-x-1/2 -translate-y-1/2 z-10 ${
          isDragging ? "" : "transition-transform duration-150"
        }`}
        style={{
          left: `${squadPlayer.position.x}%`,
          top: `${squadPlayer.position.y}%`,
          transform: "translateX(-50%) translateY(-50%)",
          transition: isDragging ? "none" : "transform 0.15s",
          ...(team === "team2" && { maxWidth: "calc(100% - 20px)" }),
        }}
        onMouseDown={handleMouseDown}
        onClick={handleClick}
      >
        <PlayerImageCard
          player={convertToPlayerWithImage(squadPlayer.player)}
          index={index}
          className="cursor-move"
          size={imageSize}
        />
      </div>
    );
  }
);

DraggablePlayerCard.displayName = "DraggablePlayerCard";

export default DraggablePlayerCard;
