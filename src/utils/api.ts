/**
 * API 클라이언트 유틸 함수
 *
 * 책임 분리 원칙:
 * - standings: 국가 메타 정보만
 * - teams: 전체 참가국 목록
 * - teams/:id/players: 선수 정보 (유일한 선수 데이터 소스)
 *
 * 환경변수:
 * - NEXT_PUBLIC_API_BASE_URL: Railway 백엔드 API URL
 *   예: https://worldcupback-production.up.railway.app
 */

import type {
  StandingsResponse,
  TeamsResponse,
  PlayersResponse,
} from "@/src/types/api";

/**
 * API Base URL 가져오기
 * 환경변수 누락 시 경고 및 기본값 반환
 */
function getApiBaseUrl(): string {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!apiBaseUrl) {
    console.warn(
      "[API Config] NEXT_PUBLIC_API_BASE_URL이 설정되지 않았습니다.\n" +
      "로컬 개발: .env.local 파일에 NEXT_PUBLIC_API_BASE_URL을 설정하세요.\n" +
      "예: NEXT_PUBLIC_API_BASE_URL=https://worldcupback-production.up.railway.app"
    );
    // 개발 환경에서는 기본값 사용하지 않고 명시적으로 에러 발생
    if (process.env.NODE_ENV === "development") {
      throw new Error(
        "NEXT_PUBLIC_API_BASE_URL 환경변수가 설정되지 않았습니다. .env.local 파일을 확인하세요."
      );
    }
    // 프로덕션에서는 빈 문자열 반환 (에러 발생)
    return "";
  }

  // URL 끝의 슬래시 제거
  return apiBaseUrl.replace(/\/$/, "");
}

/**
 * API 엔드포인트 URL 생성
 * 절대경로 기반으로 동작 (로컬/배포 환경 모두 동일)
 *
 * @param path - API 경로 (예: "/worldcup/standings")
 * @returns 완전한 API URL
 */
function buildApiUrl(path: string): string {
  const baseUrl = getApiBaseUrl();
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}

/**
 * standings API 호출
 * GET /worldcup/standings
 *
 * @returns 조별 포진 정보 (국가 메타 정보만, 선수 정보 없음)
 */
export async function fetchStandings(): Promise<StandingsResponse> {
  const url = buildApiUrl("/worldcup/standings");
  console.log("[API 호출] fetchStandings", { url });

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch standings: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

/**
 * teams API 호출
 * GET /worldcup/teams
 *
 * @returns 전체 참가국 목록 (선수 정보 없음)
 */
export async function fetchTeams(): Promise<TeamsResponse> {
  const url = buildApiUrl("/worldcup/teams");
  console.log("[API 호출] fetchTeams", { url });

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch teams: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

/**
 * players API 호출
 * GET /worldcup/teams/:id/players
 *
 * 유일한 선수 데이터 소스
 * 로컬/배포 환경 모두에서 동일하게 동작 (절대경로 기반)
 *
 * @param teamId - 국가 ID (team.id)
 * @returns 국가별 선수단 정보
 * @throws team.id가 null이거나 유효하지 않은 경우
 */
export async function fetchPlayersByTeamId(
  teamId: number
): Promise<PlayersResponse> {
  if (teamId === null || teamId === undefined || isNaN(teamId)) {
    throw new Error("Invalid team ID: team.id cannot be null or undefined");
  }

  const url = buildApiUrl(`/worldcup/teams/${teamId}/players`);
  console.log("[API 호출] fetchPlayersByTeamId", { teamId, url });

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Team not found: ${teamId}`);
    }
    throw new Error(
      `Failed to fetch players: ${response.status} ${response.statusText}`
    );
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
