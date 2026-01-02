/**
 * API 응답 타입 정의
 *
 * 책임 분리 원칙:
 * - standings: 국가 메타 정보만 (선수 정보 없음)
 * - teams: 전체 참가국 목록 (선수 정보 없음)
 * - teams/:id/players: 선수 정보 (유일한 선수 데이터 소스)
 */

/**
 * 백엔드 API 응답 타입 (원본 JSON 구조)
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
 * teams API 응답 타입 (백엔드 원본)
 * GET /api/worldcup/teams
 */
export interface TeamsResponse {
  teams: ApiTeam[];
}

/**
 * 백엔드 API의 Team 타입 (원본 JSON 구조)
 * 실제 API 응답 구조에 맞게 정의
 */
export interface ApiTeam {
  id?: number | null; // null인 경우 플레이오프 국가
  teamId?: number | null; // 대체 필드명
  name?: string;
  teamName?: string; // 대체 필드명
  tla?: string; // 3자리 국가 코드 (선택적)
  shortName?: string; // 대체 필드명
  crest?: string; // 국기 URL
  crestUrl?: string; // 대체 필드명
  flag?: string; // 대체 필드명
  [key: string]: any; // 기타 필드 허용
}

/**
 * players API 응답 타입 (백엔드 원본)
 * GET /api/worldcup/teams/:id/players
 */
export interface PlayersResponse {
  team?: {
    id?: number;
    teamId?: number; // 대체 필드명
    name?: string;
    teamName?: string; // 대체 필드명
    crest?: string;
    crestUrl?: string; // 대체 필드명
    [key: string]: any;
  };
  data?: {
    team?: {
      id?: number;
      teamId?: number;
      name?: string;
      teamName?: string;
      crest?: string;
      crestUrl?: string;
      [key: string]: any;
  };
    players?: ApiPlayer[];
  };
  players?: ApiPlayer[]; // 직접 배열일 수도 있음
  [key: string]: any; // 기타 필드 허용
}

/**
 * 백엔드 API의 Player 타입 (원본 JSON 구조)
 * 실제 API 응답 구조에 맞게 정의
 */
export interface ApiPlayer {
  id?: number;
  playerId?: number; // 대체 필드명
  name?: string;
  playerName?: string; // 대체 필드명
  nameEn?: string;
  position?: string; // GK, DF, MF, FW
  age?: number;
  club?: string;
  clubName?: string; // 대체 필드명
  imageUrl?: string;
  [key: string]: any; // 기타 필드 허용
}

/**
 * 프론트엔드에서 사용하는 타입 (변환 후)
 */

/**
 * 프론트엔드 Team 타입
 * 변환 후 일관된 구조로 사용
 */
export interface FrontTeam {
  id: number | null; // null인 경우 플레이오프 국가
  name: string;
  tla?: string; // 3자리 국가 코드 (선택적)
  crest: string; // 국기 URL
}

/**
 * 프론트엔드 Player 타입
 * 변환 후 일관된 구조로 사용
 */
export interface FrontPlayer {
  id: number;
  name: string;
  nameEn?: string;
  position: string; // GK, DF, MF, FW
  age?: number;
  club?: string;
}

/**
 * 프론트엔드 PlayersResponse 타입
 * 변환 후 일관된 구조로 사용
 */
export interface FrontPlayersResponse {
  team: {
    id: number;
    name: string;
    crest: string;
  };
  players: FrontPlayer[];
  supported?: boolean; // API 지원 여부 (true: 지원됨, false: 미지원, undefined: 기본값 true로 간주)
}

/**
 * FIFA 랭킹 API 응답 타입
 * GET /api/worldcup/fifa-rankings
 */
export interface FifaRankingsResponse {
  rankings: FifaRanking[];
}

export interface FifaRanking {
  teamId: number; // team.id
  teamName: string;
  rank: number; // FIFA 랭킹 순위
  points: number; // FIFA 랭킹 점수
  previousPoints?: number; // 이전 포인트 (선택적)
  crest: string; // 국기 URL
}
