/**
 * 드래그 앤 드롭 커스텀 훅
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { SquadPlayer, Position } from "../utils/squadUtils";

interface UseDragAndDropProps {
  squadPlayers: SquadPlayer[];
  team2SquadPlayers: SquadPlayer[];
  pitchRef: React.RefObject<HTMLDivElement>;
  onSquadUpdate: (newSquad: SquadPlayer[]) => void;
  onTeam2SquadUpdate: (newSquad: SquadPlayer[]) => void;
}

interface DragState {
  draggedIndex: number | null;
  draggedTeam: "team1" | "team2" | null;
  dragOffset: { x: number; y: number };
  hasDragged: boolean;
  dragStartPos: { x: number; y: number } | null;
}

const BOUNDARY_MARGIN = 5; // 경계 여유 공간 (퍼센트)
const MIN_DRAG_DISTANCE = 5; // 최소 드래그 거리 (픽셀)

export const useDragAndDrop = ({
  squadPlayers,
  team2SquadPlayers,
  pitchRef,
  onSquadUpdate,
  onTeam2SquadUpdate,
}: UseDragAndDropProps) => {
  const [dragState, setDragState] = useState<DragState>({
    draggedIndex: null,
    draggedTeam: null,
    dragOffset: { x: 0, y: 0 },
    hasDragged: false,
    dragStartPos: null,
  });

  // 드래그 시작 핸들러
  const handleDragStart = useCallback(
    (index: number, team: "team1" | "team2", e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();

      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      setDragState({
        draggedIndex: index,
        draggedTeam: team,
        dragOffset: {
          x: e.clientX - rect.left - rect.width / 2,
          y: e.clientY - rect.top - rect.height / 2,
        },
        hasDragged: false,
        dragStartPos: { x: e.clientX, y: e.clientY },
      });
    },
    []
  );

  // 드래그 중 핸들러
  const handleDrag = useCallback(
    (e: MouseEvent) => {
      setDragState((currentState) => {
        const { draggedIndex, draggedTeam, dragOffset, dragStartPos, hasDragged } = currentState;

        if (
          draggedIndex === null ||
          draggedTeam === null ||
          !pitchRef.current ||
          !dragStartPos
        )
          return currentState;

        // 드래그가 발생했는지 확인
        const moveDistance = Math.sqrt(
          Math.pow(e.clientX - dragStartPos.x, 2) +
            Math.pow(e.clientY - dragStartPos.y, 2)
        );

        const newHasDragged = moveDistance > MIN_DRAG_DISTANCE || hasDragged;

        const pitchRect = pitchRef.current.getBoundingClientRect();
        const x = ((e.clientX - pitchRect.left - dragOffset.x) / pitchRect.width) * 100;
        const y =
          ((e.clientY - pitchRect.top - dragOffset.y) / pitchRect.height) * 100;

        // 경계 제한
        const clampedX = Math.max(
          BOUNDARY_MARGIN,
          Math.min(100 - BOUNDARY_MARGIN, x)
        );
        const clampedY = Math.max(
          BOUNDARY_MARGIN,
          Math.min(100 - BOUNDARY_MARGIN, y)
        );

        const newPosition: Position = { x: clampedX, y: clampedY };

        if (draggedTeam === "team1") {
          const newSquad = [...squadPlayers];
          newSquad[draggedIndex] = {
            ...newSquad[draggedIndex],
            position: newPosition,
            isCustom: true,
          };
          onSquadUpdate(newSquad);
        } else if (draggedTeam === "team2") {
          const newSquad = [...team2SquadPlayers];
          newSquad[draggedIndex] = {
            ...newSquad[draggedIndex],
            position: newPosition,
            isCustom: true,
          };
          onTeam2SquadUpdate(newSquad);
        }

        return { ...currentState, hasDragged: newHasDragged };
      });
    },
    [squadPlayers, team2SquadPlayers, pitchRef, onSquadUpdate, onTeam2SquadUpdate]
  );

  // 드래그 종료 핸들러
  const handleDragEnd = useCallback(() => {
    setDragState((currentState) => {
      const wasDragging = currentState.hasDragged;

      // 드래그가 발생했다면 클릭 이벤트를 막기 위해 약간의 지연 후 초기화
      if (wasDragging) {
        setTimeout(() => {
          setDragState((prev) => ({ ...prev, hasDragged: false }));
        }, 100);
      }

      return {
        draggedIndex: null,
        draggedTeam: null,
        dragOffset: { x: 0, y: 0 },
        hasDragged: false,
        dragStartPos: null,
      };
    });
  }, []);

  // 드래그 이벤트 리스너
  useEffect(() => {
    if (dragState.draggedIndex !== null) {
      const handleMouseMove = (e: MouseEvent) => {
        requestAnimationFrame(() => handleDrag(e));
      };
      const handleMouseUp = () => {
        handleDragEnd();
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [dragState.draggedIndex, handleDrag, handleDragEnd]);

  return {
    dragState,
    handleDragStart,
    isDragging: (index: number, team: "team1" | "team2") =>
      dragState.draggedIndex === index && dragState.draggedTeam === team,
    hasDragged: dragState.hasDragged,
  };
};
