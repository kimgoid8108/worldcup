/**
 * API 클라이언트 유틸 함수
 *
 * ⚠️ 중요 아키텍처 결정:
 * - 백엔드(API)는 "포트(Pots) 화면"에서만 사용
 * - 조별 경기(Group Matches), FIFA 랭킹, 국가 기본 정보는 프론트 data 파일로 관리
 * - 선수 명단 API는 완전 비활성화
 *
 * 환경변수:
 * - NEXT_PUBLIC_API_BASE_URL: Railway 백엔드 API URL
 *   예: https://worldcupback-production.up.railway.app
 */

import type {
  TeamsResponse,
  FrontTeam,
} from "@/src/types/api";
import { mapApiTeams } from "./apiMappers";

/**
 * API Base URL 가져오기
 * 환경변수 누락 시 경고 및 기본값 반환
 *
 * 주의사항:
 * - NEXT_PUBLIC_ 접두사가 있는 환경 변수는 빌드 타임에 클라이언트 번들에 주입됨
 * - 환경 변수 변경 후 개발 서버 재시작 필요 (npm run dev 재실행)
 * - Vercel 배포 시 환경 변수는 Settings > Environment Variables에서 설정
 */
function getApiBaseUrl(): string {
  // 실행 환경 감지
  const isClient = typeof window !== "undefined";
  const isServer = typeof window === "undefined";
  const env = process.env.NODE_ENV;
  const isVercel = process.env.VERCEL === "1";

  console.log("[ENV CHECK] 환경 변수 확인 시작", {
    isClient,
    isServer,
    env,
    isVercel,
    hasEnvVar: !!process.env.NEXT_PUBLIC_API_BASE_URL,
  });

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  // 환경 변수 미설정 체크
  if (!apiBaseUrl) {
    const errorMsg =
      "[ENV ERROR] NEXT_PUBLIC_API_BASE_URL 환경 변수가 설정되지 않았습니다.\n" +
      `실행 환경: ${isClient ? "클라이언트" : "서버"} / ${env}\n` +
      (isVercel
        ? "Vercel 배포 환경: Vercel 대시보드 > Settings > Environment Variables에서 설정하세요.\n"
        : "로컬 개발: .env.local 파일에 NEXT_PUBLIC_API_BASE_URL을 설정하고 개발 서버를 재시작하세요.\n") +
      "예: NEXT_PUBLIC_API_BASE_URL=https://worldcupback-production.up.railway.app\n" +
      "⚠️ 환경 변수 변경 후 반드시 개발 서버를 재시작해야 합니다 (npm run dev 재실행)";

    console.error(errorMsg);

    // 개발 환경에서는 명시적으로 에러 발생
    if (env === "development") {
      throw new Error(
        "NEXT_PUBLIC_API_BASE_URL 환경변수가 설정되지 않았습니다.\n" +
        ".env.local 파일을 확인하고 개발 서버를 재시작하세요."
      );
    }

    // 프로덕션에서는 빈 문자열 반환 (빈 URL로 인한 fetch 실패)
    return "";
  }

  // 환경 변수는 설정되었지만 빈 문자열인 경우
  if (apiBaseUrl.trim() === "") {
    console.error("[ENV ERROR] NEXT_PUBLIC_API_BASE_URL이 빈 문자열입니다.");
    return "";
  }

  // URL 형식 검증 (http:// 또는 https://로 시작해야 함)
  const trimmedUrl = apiBaseUrl.trim().replace(/\/$/, "");
  if (!trimmedUrl.startsWith("http://") && !trimmedUrl.startsWith("https://")) {
    console.error(
      "[ENV ERROR] NEXT_PUBLIC_API_BASE_URL 형식이 올바르지 않습니다.",
      {
        provided: apiBaseUrl,
        expected: "http:// 또는 https://로 시작해야 합니다.",
      }
    );
    throw new Error(
      `NEXT_PUBLIC_API_BASE_URL 형식이 올바르지 않습니다: ${apiBaseUrl}`
    );
  }

  // 환경 변수 정상 주입 확인 로그
  console.log("[ENV OK] 환경 변수 정상 주입 확인", {
    apiBaseUrl: trimmedUrl,
    isClient,
    isServer,
    env,
    isVercel,
    note: "환경 변수 변경 후 개발 서버 재시작 필요",
  });

  return trimmedUrl;
}

/**
 * API 엔드포인트 URL 생성
 * 절대경로 기반으로 동작 (로컬/배포 환경 모두 동일)
 *
 * ⚠️ 모든 API 경로에 /api prefix가 자동으로 추가됩니다
 * 예: "/worldcup/teams" → "/api/worldcup/teams"
 *
 * @param path - API 경로 (예: "/worldcup/teams")
 * @returns 완전한 API URL
 */
function buildApiUrl(path: string): string {
  const baseUrl = getApiBaseUrl();

  // baseUrl이 빈 문자열이면 에러
  if (!baseUrl) {
    throw new Error(
      "API Base URL이 설정되지 않았습니다. NEXT_PUBLIC_API_BASE_URL 환경 변수를 확인하세요."
    );
  }

  // 경로 정규화 (앞에 /가 없으면 추가)
  let cleanPath = path.startsWith("/") ? path : `/${path}`;

  // /api prefix가 없으면 추가
  if (!cleanPath.startsWith("/api")) {
    cleanPath = `/api${cleanPath}`;
  }

  const fullUrl = `${baseUrl}${cleanPath}`;

  console.log("[API URL] API URL 생성", {
    baseUrl,
    path,
    cleanPath,
    fullUrl,
    note: "절대경로 사용, /api prefix 자동 추가",
  });

  return fullUrl;
}

/**
 * 포트(Pots) 팀 API 호출
 * GET /api/worldcup/teams
 *
 * ⚠️ 중요: 이 함수는 포트(Pots) 화면에서만 사용됩니다.
 * - 포트별 팀 정보 표시용
 * - team.id 기준으로 매칭
 * - 국기: team.crest
 * - 국가명: team.name (영문)
 *
 * @returns 전체 참가국 목록 (선수 정보 없음) - 프론트엔드 타입으로 변환된 데이터
 */
export async function fetchPotsTeams(): Promise<{ teams: FrontTeam[] }> {
  const url = buildApiUrl("/worldcup/teams");
  console.log("[API 호출] fetchPotsTeams", { url });

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch pots teams: ${response.status} ${response.statusText}`
    );
  }

  const apiResponse: TeamsResponse = await response.json();

  // 프론트엔드 타입으로 변환
  const teams = mapApiTeams(apiResponse.teams);

  console.log("[API 변환] fetchPotsTeams 변환 완료", {
    originalCount: apiResponse.teams?.length || 0,
    mappedCount: teams.length,
  });

  return { teams };
}

/* ============================================
 * 선수 관련 API - 완전 비활성화
 * ============================================
 *
 * ⚠️ 중요: 선수 명단 API는 현재 사용하지 않습니다.
 * 아래 코드는 참고용으로 주석 처리되어 있습니다.
 */

/*
// 선수 데이터 캐시 관련 코드 (비활성화)
interface CacheEntry {
  data: FrontPlayersResponse;
  timestamp: number;
}

const playersCache = new Map<number, CacheEntry>();
const CACHE_TTL = 5 * 60 * 1000; // 5분

let lastRequestTime = 0;
const REQUEST_DELAY = 500; // 500ms

export async function fetchPlayersByTeamId(
  teamId: number,
  fallbackTeam?: { id: number; name: string; crest: string }
): Promise<FrontPlayersResponse> {
  // 선수 API 비활성화
  throw new Error("선수 명단 API는 현재 사용하지 않습니다.");
}
*/

/* ============================================
 * Standings/FIFA Rankings API - 완전 비활성화
 * ============================================
 *
 * ⚠️ 중요: 조별 경기 및 FIFA 랭킹은 data 파일로 관리합니다.
 * 아래 코드는 참고용으로 주석 처리되어 있습니다.
 */

/*
export async function fetchStandings(): Promise<StandingsResponse> {
  // Standings API 비활성화 - data/groups.ts 사용
  throw new Error("Standings API는 현재 사용하지 않습니다. data/groups.ts를 사용하세요.");
}

export async function fetchFifaRankings(): Promise<FifaRankingsResponse> {
  // FIFA Rankings API 비활성화 - data/fifaRankings.ts 사용
  throw new Error("FIFA Rankings API는 현재 사용하지 않습니다. data/fifaRankings.ts를 사용하세요.");
}
*/
