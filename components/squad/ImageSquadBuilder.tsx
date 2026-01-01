/**
 * ImageSquadBuilder 컴포넌트
 *
 * 용도: 선수 이미지를 사용하는 스쿼드 빌더
 * - 4-3-3, 4-4-2 포메이션 지원
 * - 선수 이미지 표시
 * - 드래그 앤 드롭으로 위치 변경
 */

"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { PlayerWithImage } from "./PlayerImageCard";
import { Player } from "@/data/players";
import { Formation, SquadPlayer } from "./utils/squadUtils";
import { useSquadInitialization } from "./hooks/useSquadInitialization";
import { useDragAndDrop } from "./hooks/useDragAndDrop";
import PitchLines from "./PitchLines";
import DraggablePlayerCard from "./DraggablePlayerCard";

// Export types for external use
export type { PlayerWithImage, Formation };

interface ImageSquadBuilderProps {
  players: (PlayerWithImage | Player)[];
  formation?: Formation;
  onPlayerClick?: (player: PlayerWithImage | Player | null, index: number) => void;
  // 두 팀 모드
  team2Players?: (PlayerWithImage | Player)[];
  team2Formation?: Formation;
  onTeam2PlayerClick?: (player: PlayerWithImage | Player | null, index: number) => void;
  imageSize?: "small" | "normal"; // 이미지 크기 옵션
}

export default function ImageSquadBuilder({ players, formation = "4-3-3", onPlayerClick, team2Players, team2Formation = "4-3-3", onTeam2PlayerClick, imageSize = "normal" }: ImageSquadBuilderProps) {
  const pitchRef = useRef<HTMLDivElement>(null);
  const isTwoTeamMode = !!team2Players;
  const [isMobile, setIsMobile] = useState(false);

  // 모바일 체크
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 스쿼드 초기화
  const { team1Squad, team2Squad } = useSquadInitialization({
    players,
    formation,
    isTwoTeamMode,
    team2Players,
    team2Formation,
  });

  // 모바일에서 세로 배치를 위한 위치 변환 함수
  const transformPositionForMobile = useCallback((pos: { x: number; y: number }, isTeam2: boolean): { x: number; y: number } => {
    if (!isMobile || !isTwoTeamMode) return pos;
    
    // 가로 배치(왼쪽/오른쪽) → 세로 배치(위/아래) 변환
    if (isTeam2) {
      // 어웨이 팀: 아래쪽에 배치 (y: 60-90%)
      // x는 그대로, y는 아래쪽으로 이동
      return {
        x: pos.x,
        y: 60 + (pos.y / 100) * 30, // y를 60-90% 범위로 변환
      };
    } else {
      // 홈 팀: 위쪽에 배치 (y: 10-40%)
      // x는 그대로, y는 위쪽으로 이동
      return {
        x: pos.x,
        y: 10 + (pos.y / 100) * 30, // y를 10-40% 범위로 변환
      };
    }
  }, [isMobile, isTwoTeamMode]);

  const [squadPlayers, setSquadPlayers] = useState<SquadPlayer[]>(team1Squad);
  const [team2SquadPlayers, setTeam2SquadPlayers] = useState<SquadPlayer[]>(team2Squad);

  // 스쿼드 초기화 상태 동기화 및 모바일 위치 변환
  useEffect(() => {
    if (isMobile && isTwoTeamMode) {
      setSquadPlayers(team1Squad.map(sp => ({
        ...sp,
        position: transformPositionForMobile(sp.position, false)
      })));
    } else {
      setSquadPlayers(team1Squad);
    }
  }, [team1Squad, isMobile, isTwoTeamMode, transformPositionForMobile]);

  useEffect(() => {
    if (isTwoTeamMode) {
      if (isMobile) {
        setTeam2SquadPlayers(team2Squad.map(sp => ({
          ...sp,
          position: transformPositionForMobile(sp.position, true)
        })));
      } else {
        setTeam2SquadPlayers(team2Squad);
      }
    }
  }, [team2Squad, isTwoTeamMode, isMobile, transformPositionForMobile]);

  // 드래그 앤 드롭
  const { dragState, handleDragStart, isDragging, hasDragged } = useDragAndDrop({
    squadPlayers,
    team2SquadPlayers,
    pitchRef,
    onSquadUpdate: setSquadPlayers,
    onTeam2SquadUpdate: setTeam2SquadPlayers,
  });

  // 스타일 메모이제이션
  const pitchStyle = useMemo(
    () => {
      if (isTwoTeamMode && isMobile) {
        // 모바일에서 두 팀 모드: 세로 배치
        return {
          minHeight: "600px",
          maxHeight: "1200px",
        };
      }
      return {
        minHeight: "500px",
        maxHeight: isTwoTeamMode ? "900px" : "700px",
      };
    },
    [isTwoTeamMode, isMobile]
  );

  return (
    <div className="w-full">
      {/* 축구장 배경 */}
      <div 
        ref={pitchRef} 
        className={`relative w-full bg-gradient-to-b from-green-600 to-green-700 rounded-lg overflow-hidden select-none ${
          isTwoTeamMode && isMobile ? 'aspect-[3/4]' : isTwoTeamMode ? 'md:aspect-video' : 'aspect-[3/4]'
        }`}
        style={pitchStyle}
      >
        {/* 선수 카드들이 경계를 벗어나지 않도록 하는 클리핑 컨테이너 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 pointer-events-auto" style={{ clipPath: "inset(0)" }} />
        </div>

        {/* 축구장 라인 */}
        <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: "none" }}>
          <PitchLines isTwoTeamMode={isTwoTeamMode} isMobile={isMobile} />
        </svg>

        {/* 팀1 선수 카드들 */}
        {squadPlayers.map((squadPlayer, index) => (
          <DraggablePlayerCard
            key={`team1-${index}`}
            squadPlayer={squadPlayer}
            index={index}
            team="team1"
            isDragging={isDragging(index, "team1")}
            hasDragged={hasDragged && dragState.draggedIndex === index && dragState.draggedTeam === "team1"}
            imageSize={imageSize}
            onDragStart={handleDragStart}
            onPlayerClick={onPlayerClick}
          />
        ))}

        {/* 팀2 선수 카드들 */}
        {isTwoTeamMode &&
          team2SquadPlayers.map((squadPlayer, index) => (
            <DraggablePlayerCard
              key={`team2-${index}`}
              squadPlayer={squadPlayer}
              index={index}
              team="team2"
              isDragging={isDragging(index, "team2")}
              hasDragged={hasDragged && dragState.draggedIndex === index && dragState.draggedTeam === "team2"}
              imageSize={imageSize}
              onDragStart={handleDragStart}
              onPlayerClick={onTeam2PlayerClick}
            />
          ))}
      </div>
    </div>
  );
}
