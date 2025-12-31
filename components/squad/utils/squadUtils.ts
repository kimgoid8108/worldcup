/**
 * 스쿼드 빌더 유틸리티 함수들
 */

import { Player } from "@/data/players";
import { PlayerWithImage } from "../PlayerImageCard";

export interface Position {
  x: number; // 0-100 (퍼센트)
  y: number; // 0-100 (퍼센트)
}

export interface SquadPlayer {
  player: (PlayerWithImage | Player) | null;
  position: Position;
  isCustom: boolean;
}

export type Formation = "4-3-3" | "4-4-2";

// 포메이션별 기본 위치 설정
export const FORMATION_POSITIONS: Record<Formation, Position[]> = {
  "4-3-3": [
    // GK
    { x: 50, y: 90 },
    // DF (4명)
    { x: 25, y: 75 },
    { x: 50, y: 80 },
    { x: 75, y: 75 },
    { x: 50, y: 70 },
    // MF (3명)
    { x: 30, y: 50 },
    { x: 50, y: 50 },
    { x: 70, y: 50 },
    // FW (3명)
    { x: 25, y: 25 },
    { x: 50, y: 20 },
    { x: 75, y: 25 },
  ],
  "4-4-2": [
    // GK
    { x: 50, y: 90 },
    // DF (4명)
    { x: 20, y: 70 },
    { x: 40, y: 70 },
    { x: 60, y: 70 },
    { x: 80, y: 70 },
    // MF (4명)
    { x: 20, y: 45 },
    { x: 40, y: 45 },
    { x: 60, y: 45 },
    { x: 80, y: 45 },
    // FW (2명)
    { x: 35, y: 20 },
    { x: 65, y: 20 },
  ],
};

// 포지션별 선수 필터링
export const getPlayersByPosition = (
  players: (PlayerWithImage | Player)[],
  position: string
): (PlayerWithImage | Player)[] => {
  return players.filter((p) => p.position === position);
};

// Player를 PlayerWithImage로 변환 (imageUrl이 없으면 기본 이미지 사용)
export const convertToPlayerWithImage = (
  player: PlayerWithImage | Player | null
): PlayerWithImage | null => {
  if (!player) return null;
  const defaultImageUrl = "https://i.ifh.cc/qbhPHD.png";

  // 이미 PlayerWithImage 타입인 경우
  if ("imageUrl" in player && player.imageUrl) {
    return player as PlayerWithImage;
  }

  // Player 타입인 경우 변환
  return {
    id: typeof player.id === "string" ? parseInt(player.id) || 0 : player.id,
    name: player.name,
    position: player.position,
    imageUrl: (player as Player).imageUrl || defaultImageUrl,
  };
};

// 포메이션별 선수 인덱스 매핑
export const FORMATION_INDICES: Record<
  Formation,
  { df: number[]; mf: number[]; fw: number[] }
> = {
  "4-3-3": {
    df: [1, 2, 3, 4],
    mf: [5, 6, 7],
    fw: [8, 9, 10],
  },
  "4-4-2": {
    df: [1, 2, 3, 4],
    mf: [5, 6, 7, 8],
    fw: [9, 10],
  },
};

// 홈 팀 커스텀 좌표 (4-3-3 포메이션)
export const HOME_TEAM_CUSTOM_POSITIONS: Position[] = [
  { x: 10, y: 50 }, // GK
  { x: 20, y: 90 }, // DF
  { x: 20, y: 60 }, // DF
  { x: 20, y: 40 }, // DF
  { x: 20, y: 10 }, // DF
  { x: 30, y: 30 }, // MF
  { x: 30, y: 50 }, // MF
  { x: 30, y: 70 }, // MF
  { x: 40, y: 20 }, // FW
  { x: 45, y: 50 }, // FW
  { x: 40, y: 80 }, // FW
];

// 어웨이 팀 커스텀 좌표 (4-3-3 포메이션)
export const AWAY_TEAM_CUSTOM_POSITIONS: Position[] = [
  { x: 95, y: 50 }, // GK
  { x: 85, y: 10 }, // DF
  { x: 85, y: 40 }, // DF
  { x: 85, y: 60 }, // DF
  { x: 85, y: 90 }, // DF
  { x: 75, y: 30 }, // MF
  { x: 75, y: 50 }, // MF
  { x: 75, y: 70 }, // MF
  { x: 65, y: 80 }, // FW
  { x: 60, y: 50 }, // FW
  { x: 65, y: 20 }, // FW
];
