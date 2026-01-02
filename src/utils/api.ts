/**
 * API 클라이언트 유틸 함수
 *
 * 책임 분리 원칙:
 * - standings: 국가 메타 정보만
 * - teams: 전체 참가국 목록
 * - teams/:id/players: 선수 정보 (유일한 선수 데이터 소스)
 */

import type {
  StandingsResponse,
  TeamsResponse,
  PlayersResponse,
} from "@/src/types/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api";

/**
 * standings API 호출
 * GET /api/worldcup/standings
 *
 * @returns 조별 포진 정보 (국가 메타 정보만, 선수 정보 없음)
 */
export async function fetchStandings(): Promise<StandingsResponse> {
  const response = await fetch(`${API_BASE_URL}/worldcup/standings`);

  if (!response.ok) {
    throw new Error(`Failed to fetch standings: ${response.statusText}`);
  }

  return response.json();
}

/**
 * teams API 호출
 * GET /api/worldcup/teams
 *
 * @returns 전체 참가국 목록 (선수 정보 없음)
 */
export async function fetchTeams(): Promise<TeamsResponse> {
  const response = await fetch(`${API_BASE_URL}/worldcup/teams`);

  if (!response.ok) {
    throw new Error(`Failed to fetch teams: ${response.statusText}`);
  }

  return response.json();
}

/**
 * players API 호출
 * GET /api/worldcup/teams/:id/players
 *
 * 유일한 선수 데이터 소스
 *
 * @param teamId - 국가 ID (team.id)
 * @returns 국가별 선수단 정보
 * @throws team.id가 null이거나 유효하지 않은 경우
 */
export async function fetchPlayersByTeamId(
  teamId: number
): Promise<PlayersResponse> {
  if (teamId === null || teamId === undefined) {
    throw new Error("Invalid team ID: team.id cannot be null");
  }

  const response = await fetch(
    `${API_BASE_URL}/worldcup/teams/${teamId}/players`
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Team not found: ${teamId}`);
    }
    throw new Error(`Failed to fetch players: ${response.statusText}`);
  }

  return response.json();
}

/**
 * 플레이오프 국가 여부 확인
 *
 * @param teamId - 국가 ID
 * @returns 플레이오프 국가 여부 (team.id === null)
 */
export function isPlayoffTeam(teamId: number | null): boolean {
  return teamId === null;
}
