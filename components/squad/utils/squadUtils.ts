/**
 * 스쿼드 빌더 유틸리티 함수들
 */

import { type Player, type PlayerWithImage } from "@/types/player";

export interface Position {
  x: number; // 0-100 (퍼센트)
  y: number; // 0-100 (퍼센트)
}

/**
 * 스쿼드 선수 인터페이스
 * player는 Player 또는 PlayerWithImage 타입 (둘 다 PlayerBase를 확장하므로 구조적으로 호환)
 */
export interface SquadPlayer {
  player: Player | PlayerWithImage | null;
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
    { x: 20, y: 70 },
    { x: 40, y: 70 },
    { x: 60, y: 70 },
    { x: 80, y: 70 },
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

/**
 * Player를 PlayerWithImage로 변환
 * imageUrl이 없으면 기본 이미지 사용
 * id는 이미 number이므로 타입 캐스팅 불필요
 */
export const convertToPlayerWithImage = (
  player: PlayerWithImage | Player | null
): PlayerWithImage | null => {
  if (!player) return null;
  const defaultImageUrl = "https://i.ifh.cc/qbhPHD.png";

  // 이미 PlayerWithImage 타입인 경우 (imageUrl이 필수 필드)
  // 타입 가드: PlayerWithImage는 imageUrl이 항상 string
  if ("imageUrl" in player && typeof player.imageUrl === "string" && player.imageUrl) {
    return player as PlayerWithImage;
  }

  // Player 타입인 경우 변환 (imageUrl이 optional)
  return {
    id: player.id, // 이미 number 타입이므로 변환 불필요
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
  { x: 5, y: 50 }, // GK
  { x: 15, y: 85 }, // DF
  { x: 15, y: 60 }, // DF
  { x: 15, y: 37 }, // DF
  { x: 15, y: 14 }, // DF
  { x: 28, y: 30 }, // MF
  { x: 28, y: 50 }, // MF
  { x: 28, y: 70 }, // MF
  { x: 42, y: 20 }, // FW
  { x: 42, y: 50 }, // FW
  { x: 42, y: 80 }, // FW
];

// 어웨이 팀 커스텀 좌표 (4-3-3 포메이션)
export const AWAY_TEAM_CUSTOM_POSITIONS: Position[] = [
  { x: 95, y: 50 }, // GK
  { x: 85, y: 15 }, // DF
  { x: 85, y: 40 }, // DF
  { x: 85, y: 63 }, // DF
  { x: 85, y: 86 }, // DF
  { x: 72, y: 30 }, // MF
  { x: 72, y: 50 }, // MF
  { x: 72, y: 70 }, // MF
  { x: 58, y: 80 }, // FW
  { x: 58, y: 50 }, // FW
  { x: 58, y: 20 }, // FW
];

// 4-4-2 포메이션 홈팀 커스텀 좌표
export const HOME_TEAM_CUSTOM_POSITIONS_442: Position[] = [
  { x: 5, y: 50 }, // GK
  { x: 15, y: 85 }, // DF
  { x: 15, y: 60 }, // DF
  { x: 15, y: 37 }, // DF
  { x: 15, y: 14 }, // DF
  { x: 30, y: 37 }, // MF
  { x: 30, y: 60 }, // MF
  { x: 30, y: 85 }, // MF
  { x: 30, y: 15 }, // MF
  { x: 42, y: 30 }, // FW
  { x: 42, y: 70 }, // FW
];

// 4-4-2 포메이션 어웨이팀 커스텀 좌표
export const AWAY_TEAM_CUSTOM_POSITIONS_442: Position[] = [
  { x: 95, y: 50 }, // GK
  { x: 85, y: 15 }, // DF
  { x: 85, y: 40 }, // DF
  { x: 85, y: 63 }, // DF
  { x: 85, y: 86 }, // DF
  { x: 70, y: 15 }, // MF
  { x: 70, y: 40 }, // MF
  { x: 70, y: 63 }, // MF
  { x: 70, y: 87 }, // MF
  { x: 58, y: 70 }, // FW
  { x: 58, y: 30 }, // FW
];
