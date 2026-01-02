/**
 * API 응답 타입 정의
 *
 * 책임 분리 원칙:
 * - standings: 국가 메타 정보만 (선수 정보 없음)
 * - teams: 전체 참가국 목록 (선수 정보 없음)
 * - teams/:id/players: 선수 정보 (유일한 선수 데이터 소스)
 */

/**
 * standings API 응답 타입
 * GET /api/worldcup/standings
 */
export interface StandingsResponse {
  standings: TeamStanding[];
}

export interface TeamStanding {
  team: {
    id: number | null; // null인 경우 플레이오프 국가
    name: string;
  };
  group: string; // 조 (A, B, C, ...)
  position: number; // 조 내 순위
  crest: string; // 국기 URL
}

/**
 * teams API 응답 타입
 * GET /api/worldcup/teams
 */
export interface TeamsResponse {
  teams: Team[];
}

export interface Team {
  id: number | null; // null인 경우 플레이오프 국가
  name: string;
  crest: string; // 국기 URL
}

/**
 * players API 응답 타입
 * GET /api/worldcup/teams/:id/players
 * 유일한 선수 데이터 소스
 */
export interface PlayersResponse {
  team: {
    id: number;
    name: string;
    crest: string;
  };
  players: Player[];
}

export interface Player {
  id: number;
  name: string;
  nameEn?: string;
  position: string; // GK, DF, MF, FW
  age?: number;
  club?: string;
}
