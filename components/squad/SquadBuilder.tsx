/**
 * SquadBuilder 컴포넌트
 *
 * 용도: 축구장 배경 위에 선수들을 포메이션에 맞춰 배치하는 스쿼드 빌더
 * - 4-3-3, 4-4-2 포메이션 지원
 * - 선수 카드 드래그 앤 드롭
 * - 선수 클릭으로 교체
 * - 커스텀 모드
 */

"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Player } from "@/data/players";

export type Formation = "4-3-3" | "4-4-2";

interface Position {
  x: number; // 0-100 (퍼센트)
  y: number; // 0-100 (퍼센트)
}

interface SquadPlayer {
  player: Player | null;
  position: Position;
  isCustom: boolean; // 커스텀 모드에서 이동된 선수인지
}

interface SquadBuilderProps {
  players: Player[];
  formation?: Formation;
  onPlayerClick?: (player: Player | null, position: string, e?: React.MouseEvent) => void;
}

// 포메이션별 기본 위치 설정 (x, y 좌표 - 퍼센트)
const FORMATION_POSITIONS: Record<Formation, Position[]> = {
  "4-3-3": [
    // GK
    { x: 50, y: 90 },
    // DF (4명)
    { x: 20, y: 70 }, { x: 40, y: 70 }, { x: 60, y: 70 }, { x: 80, y: 70 },
    // MF (3명)
    { x: 30, y: 45 }, { x: 50, y: 45 }, { x: 70, y: 45 },
    // FW (3명)
    { x: 25, y: 20 }, { x: 50, y: 20 }, { x: 75, y: 20 },
  ],
  "4-4-2": [
    // GK
    { x: 50, y: 90 },
    // DF (4명)
    { x: 20, y: 70 }, { x: 40, y: 70 }, { x: 60, y: 70 }, { x: 80, y: 70 },
    // MF (4명)
    { x: 20, y: 45 }, { x: 40, y: 45 }, { x: 60, y: 45 }, { x: 80, y: 45 },
    // FW (2명)
    { x: 35, y: 20 }, { x: 65, y: 20 },
  ],
};

// 포지션별 선수 필터링
const getPlayersByPosition = (players: Player[], position: string): Player[] => {
  return players.filter((p) => p.position === position);
};

export default function SquadBuilder({
  players,
  formation = "4-3-3",
  onPlayerClick,
}: SquadBuilderProps) {
  const [squadPlayers, setSquadPlayers] = useState<SquadPlayer[]>([]);
  const pitchRef = useRef<HTMLDivElement>(null);

  // 포메이션 변경 시 스쿼드 초기화
  useEffect(() => {
    const positions = FORMATION_POSITIONS[formation];
    setSquadPlayers((prevSquad) => {
      const newSquad: SquadPlayer[] = positions.map((pos) => {
        return { player: null, position: pos, isCustom: false };
      });

      // 포지션별로 선수 자동 배치
      const gkPlayers = getPlayersByPosition(players, "GK");
      const dfPlayers = getPlayersByPosition(players, "DF");
      const mfPlayers = getPlayersByPosition(players, "MF");
      const fwPlayers = getPlayersByPosition(players, "FW");

      let gkIndex = 0, dfIndex = 0, mfIndex = 0, fwIndex = 0;

      if (formation === "4-3-3") {
        // GK (0)
        if (gkPlayers.length > 0) newSquad[0].player = gkPlayers[gkIndex++];
        // DF (1-4)
        for (let i = 1; i <= 4 && dfIndex < dfPlayers.length; i++) {
          newSquad[i].player = dfPlayers[dfIndex++];
        }
        // MF (5-7)
        for (let i = 5; i <= 7 && mfIndex < mfPlayers.length; i++) {
          newSquad[i].player = mfPlayers[mfIndex++];
        }
        // FW (8-10)
        for (let i = 8; i <= 10 && fwIndex < fwPlayers.length; i++) {
          newSquad[i].player = fwPlayers[fwIndex++];
        }
      } else if (formation === "4-4-2") {
        // GK (0)
        if (gkPlayers.length > 0) newSquad[0].player = gkPlayers[gkIndex++];
        // DF (1-4)
        for (let i = 1; i <= 4 && dfIndex < dfPlayers.length; i++) {
          newSquad[i].player = dfPlayers[dfIndex++];
        }
        // MF (5-8)
        for (let i = 5; i <= 8 && mfIndex < mfPlayers.length; i++) {
          newSquad[i].player = mfPlayers[mfIndex++];
        }
        // FW (9-10)
        for (let i = 9; i <= 10 && fwIndex < fwPlayers.length; i++) {
          newSquad[i].player = fwPlayers[fwIndex++];
        }
      }

      return newSquad;
    });
  }, [formation, players]);

  // 선수 클릭 핸들러
  const handlePlayerCardClick = useCallback(
    (index: number, e: React.MouseEvent) => {
      e.stopPropagation();
      if (onPlayerClick) {
        onPlayerClick(squadPlayers[index].player, `${formation}-${index}`, e);
      }
    },
    [onPlayerClick, squadPlayers, formation]
  );


  return (
    <div className="w-full">
      {/* 축구장 배경 */}
      <div
        ref={pitchRef}
        className="relative w-full bg-gradient-to-b from-green-600 to-green-700 rounded-lg overflow-hidden select-none"
        style={{ aspectRatio: "3/4", minHeight: "400px", maxHeight: "500px" }}
      >
        {/* 축구장 라인 */}
        <svg
          className="absolute inset-0 w-full h-full"
          style={{ pointerEvents: "none" }}
        >
          {/* 중앙 원 */}
          <circle
            cx="50%"
            cy="50%"
            r="15%"
            fill="none"
            stroke="white"
            strokeWidth="2"
            opacity="0.8"
          />
          {/* 중앙점 */}
          <circle
            cx="50%"
            cy="50%"
            r="2"
            fill="white"
            opacity="0.8"
          />
          {/* 페널티 박스 (상단) */}
          <rect
            x="20%"
            y="5%"
            width="60%"
            height="20%"
            fill="none"
            stroke="white"
            strokeWidth="2"
            opacity="0.8"
          />
          {/* 페널티 박스 (하단) */}
          <rect
            x="20%"
            y="75%"
            width="60%"
            height="20%"
            fill="none"
            stroke="white"
            strokeWidth="2"
            opacity="0.8"
          />
          {/* 골 에어리어 (상단) */}
          <rect
            x="35%"
            y="5%"
            width="30%"
            height="10%"
            fill="none"
            stroke="white"
            strokeWidth="2"
            opacity="0.8"
          />
          {/* 골 에어리어 (하단) */}
          <rect
            x="35%"
            y="85%"
            width="30%"
            height="10%"
            fill="none"
            stroke="white"
            strokeWidth="2"
            opacity="0.8"
          />
          {/* 중앙선 */}
          <line
            x1="0%"
            y1="50%"
            x2="100%"
            y2="50%"
            stroke="white"
            strokeWidth="2"
            opacity="0.8"
          />
        </svg>

        {/* 선수 카드들 */}
        {squadPlayers.map((squadPlayer, index) => (
          <div
            key={index}
            className="absolute transform -translate-x-1/2 cursor-pointer z-10 transition-transform duration-150 hover:scale-110 flex flex-col items-center"
            style={{
              left: `${squadPlayer.position.x}%`,
              top: `${squadPlayer.position.y}%`,
            }}
            onClick={(e) => handlePlayerCardClick(index, e)}
          >
            {squadPlayer.player ? (
              <>
                <div className="bg-white rounded-full w-16 h-16 shadow-lg border-2 border-blue-500 flex items-center justify-center hover:shadow-xl transition-shadow">
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">
                      {index + 1}
                    </div>
                    <div className="text-[10px] text-gray-500 mt-0.5">
                      {squadPlayer.player.position}
                    </div>
                  </div>
                </div>
                <div className="mt-1 text-xs font-semibold text-white bg-black/60 px-2 py-0.5 rounded max-w-[80px] truncate text-center">
                  {squadPlayer.player.name}
                </div>
              </>
            ) : (
              <>
                <div className="bg-gray-200 rounded-full w-16 h-16 shadow-md border-2 border-gray-400 flex items-center justify-center opacity-60">
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-500">
                      {index + 1}
                    </div>
                    <div className="text-[10px] text-gray-400 mt-0.5">
                      빈 슬롯
                    </div>
                  </div>
                </div>
                <div className="mt-1 text-xs text-gray-400 bg-black/40 px-2 py-0.5 rounded max-w-[80px] truncate text-center">
                  빈 슬롯
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
