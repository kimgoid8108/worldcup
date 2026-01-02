/**
 * API 응답을 프론트엔드 타입으로 변환하는 유틸리티 함수
 *
 * 목적:
 * - 백엔드 API의 다양한 필드명을 프론트엔드의 일관된 타입으로 변환
 * - API 응답 구조 변경에 대응
 * - 타입 안정성 보장
 */

import type { ApiTeam, ApiPlayer, PlayersResponse, FrontTeam, FrontPlayer, FrontPlayersResponse } from "@/src/types/api";

/**
 * API Team을 FrontTeam으로 변환
 *
 * 다양한 필드명을 지원:
 * - id / teamId
 * - name / teamName
 * - crest / crestUrl / flag
 * - tla / shortName
 *
 * @param apiTeam - 백엔드 API의 Team 객체
 * @returns 프론트엔드에서 사용하는 FrontTeam 객체
 */
export function mapApiTeam(apiTeam: ApiTeam): FrontTeam | null {
  if (!apiTeam) {
    return null;
  }

  // id 추출 (여러 가능한 필드명 확인)
  const id = apiTeam.id !== undefined && apiTeam.id !== null
    ? apiTeam.id
    : apiTeam.teamId !== undefined && apiTeam.teamId !== null
    ? apiTeam.teamId
    : null;

  // name 추출 (여러 가능한 필드명 확인)
  const name = apiTeam.name || apiTeam.teamName || "";

  // name이 없으면 null 반환
  if (!name) {
    console.warn("[mapApiTeam] name이 없어서 변환 실패", { apiTeam });
    return null;
  }

  // tla 추출 (여러 가능한 필드명 확인)
  const tla = apiTeam.tla || apiTeam.shortName;

  // crest 추출 (여러 가능한 필드명 확인)
  const crest = apiTeam.crest || apiTeam.crestUrl || apiTeam.flag || "";

  return {
    id,
    name,
    tla,
    crest,
  };
}

/**
 * API Teams 배열을 FrontTeam 배열로 변환
 *
 * @param apiTeams - 백엔드 API의 Team 배열
 * @returns 프론트엔드에서 사용하는 FrontTeam 배열
 */
export function mapApiTeams(apiTeams: ApiTeam[] | undefined | null): FrontTeam[] {
  if (!apiTeams || !Array.isArray(apiTeams)) {
    return [];
  }

  return apiTeams
    .map(mapApiTeam)
    .filter((team): team is FrontTeam => team !== null);
}

/**
 * API Player를 FrontPlayer로 변환
 *
 * 다양한 필드명을 지원:
 * - id / playerId
 * - name / playerName
 * - nameEn
 * - club / clubName
 *
 * @param apiPlayer - 백엔드 API의 Player 객체
 * @returns 프론트엔드에서 사용하는 FrontPlayer 객체
 */
export function mapApiPlayer(apiPlayer: ApiPlayer): FrontPlayer | null {
  if (!apiPlayer) {
    return null;
  }

  // id 추출 (여러 가능한 필드명 확인)
  const id = apiPlayer.id !== undefined && apiPlayer.id !== null
    ? apiPlayer.id
    : apiPlayer.playerId !== undefined && apiPlayer.playerId !== null
    ? apiPlayer.playerId
    : null;

  if (id === null || id === undefined) {
    console.warn("[mapApiPlayer] id가 없어서 변환 실패", { apiPlayer });
    return null;
  }

  // name 추출 (여러 가능한 필드명 확인)
  const name = apiPlayer.name || apiPlayer.playerName || "";

  if (!name) {
    console.warn("[mapApiPlayer] name이 없어서 변환 실패", { apiPlayer });
    return null;
  }

  // nameEn 추출
  const nameEn = apiPlayer.nameEn;

  // position 추출
  const position = apiPlayer.position || "";

  if (!position) {
    console.warn("[mapApiPlayer] position이 없어서 변환 실패", { apiPlayer });
    return null;
  }

  // age 추출
  const age = apiPlayer.age;

  // club 추출 (여러 가능한 필드명 확인)
  const club = apiPlayer.club || apiPlayer.clubName;

  return {
    id,
    name,
    nameEn,
    position,
    age,
    club,
  };
}

/**
 * API Players 배열을 FrontPlayer 배열로 변환
 *
 * @param apiPlayers - 백엔드 API의 Player 배열
 * @returns 프론트엔드에서 사용하는 FrontPlayer 배열
 */
export function mapApiPlayers(apiPlayers: ApiPlayer[] | undefined | null): FrontPlayer[] {
  if (!apiPlayers || !Array.isArray(apiPlayers)) {
    return [];
  }

  return apiPlayers
    .map(mapApiPlayer)
    .filter((player): player is FrontPlayer => player !== null);
}

/**
 * API PlayersResponse를 FrontPlayersResponse로 변환
 *
 * ⚠️ 중요: response.id를 신뢰하고, team 정보를 찾지 않습니다.
 * API 응답의 team.id가 유일한 기준입니다.
 *
 * 다양한 응답 구조를 지원:
 * - { team: {...}, players: [...] }
 * - { data: { team: {...}, players: [...] } }
 * - { players: [...] } (직접 배열)
 *
 * @param apiResponse - 백엔드 API의 PlayersResponse 객체
 * @param expectedTeamId - 예상되는 team.id (검증용)
 * @returns 프론트엔드에서 사용하는 FrontPlayersResponse 객체
 */
export function mapApiPlayersResponse(
  apiResponse: PlayersResponse | undefined | null,
  expectedTeamId?: number,
  fallbackTeam?: { id: number; name: string; crest: string }
): FrontPlayersResponse | null {
  if (!apiResponse) {
    return null;
  }

  // players 배열 추출 (여러 가능한 구조 확인)
  let apiPlayers: ApiPlayer[] = [];

  if (Array.isArray(apiResponse.players)) {
    apiPlayers = apiResponse.players;
    console.log("[mapApiPlayersResponse] players 배열 발견 (apiResponse.players)", { count: apiPlayers.length });
  } else if (apiResponse.data?.players && Array.isArray(apiResponse.data.players)) {
    apiPlayers = apiResponse.data.players;
    console.log("[mapApiPlayersResponse] players 배열 발견 (apiResponse.data.players)", { count: apiPlayers.length });
  } else if (Array.isArray(apiResponse)) {
    // 직접 배열인 경우
    apiPlayers = apiResponse as any;
    console.log("[mapApiPlayersResponse] players 배열 발견 (직접 배열)", { count: apiPlayers.length });
  } else {
    console.warn("[mapApiPlayersResponse] players 배열을 찾을 수 없음", {
      hasPlayers: !!apiResponse.players,
      hasData: !!apiResponse.data,
      isArray: Array.isArray(apiResponse),
      apiResponseKeys: Object.keys(apiResponse || {}),
      apiResponse,
    });
  }

  // team 정보 추출 (여러 가능한 구조 확인)
  // API 응답 구조가 다양할 수 있으므로 여러 경로 확인
  let apiTeam = apiResponse.team || apiResponse.data?.team;

  // team 정보가 없으면 다른 구조 확인
  if (!apiTeam) {
    // 응답 전체가 team 정보일 수도 있음
    if (apiResponse.id || apiResponse.teamId) {
      apiTeam = apiResponse;
      console.log("[mapApiPlayersResponse] team 정보를 응답 루트에서 발견", { apiTeam });
    } else {
      // team 정보가 없으면 fallback 사용
      if (fallbackTeam) {
        console.warn("[mapApiPlayersResponse] team 정보가 없어서 fallbackTeam 사용", {
          fallbackTeam,
          apiResponseKeys: Object.keys(apiResponse || {}),
        });
        apiTeam = {
          id: fallbackTeam.id,
          teamId: fallbackTeam.id,
          name: fallbackTeam.name,
          teamName: fallbackTeam.name,
          crest: fallbackTeam.crest,
          crestUrl: fallbackTeam.crest,
        };
      } else if (expectedTeamId !== undefined) {
        console.warn("[mapApiPlayersResponse] team 정보가 없어서 expectedTeamId로 fallback 생성", {
          expectedTeamId,
          apiResponseKeys: Object.keys(apiResponse || {}),
        });
        // expectedTeamId를 사용하여 기본 team 정보 생성
        apiTeam = {
          id: expectedTeamId,
          teamId: expectedTeamId,
          name: `Team ${expectedTeamId}`,
          teamName: `Team ${expectedTeamId}`,
          crest: "",
          crestUrl: "",
        };
      } else {
        console.error("[mapApiPlayersResponse] team 정보를 찾을 수 없고 fallback도 없음", {
          hasTeam: !!apiResponse.team,
          hasDataTeam: !!apiResponse.data?.team,
          hasId: !!apiResponse.id,
          hasTeamId: !!apiResponse.teamId,
          apiResponseKeys: Object.keys(apiResponse || {}),
          apiResponse,
        });
        return null;
      }
    }
  } else {
    console.log("[mapApiPlayersResponse] team 정보 발견", {
      teamId: apiTeam.id || apiTeam.teamId,
      teamName: apiTeam.name || apiTeam.teamName,
    });
  }

  // team.id 추출 - response.id를 신뢰
  const teamId = apiTeam.id !== undefined && apiTeam.id !== null
    ? apiTeam.id
    : apiTeam.teamId !== undefined && apiTeam.teamId !== null
    ? apiTeam.teamId
    : null;

  // team.id가 없거나 team.name이 없으면 supported: false로 반환 (예외 던지지 않음)
  if (teamId === null || teamId === undefined) {
    console.warn("[mapApiPlayersResponse] team.id가 없어서 미지원 팀으로 처리", { apiResponse });
    // fallbackTeam이 있으면 사용, 없으면 null 반환 (api.ts에서 처리)
    if (fallbackTeam) {
      return {
        team: {
          id: fallbackTeam.id,
          name: fallbackTeam.name,
          crest: fallbackTeam.crest,
        },
        players: [],
        supported: false,
      };
    }
    return null;
  }

  // teams[].id === playersResponse.id 검증
  if (expectedTeamId !== undefined && teamId !== expectedTeamId) {
    console.warn("[mapApiPlayersResponse] team.id 불일치 - 미지원 팀으로 처리", {
      expectedTeamId,
      actualTeamId: teamId,
      apiResponse,
    });
    // fallbackTeam이 있으면 사용, 없으면 null 반환 (api.ts에서 처리)
    if (fallbackTeam) {
      return {
        team: {
          id: fallbackTeam.id,
          name: fallbackTeam.name,
          crest: fallbackTeam.crest,
        },
        players: [],
        supported: false,
      };
    }
    return null;
  }

  // team.name 추출
  const teamName = apiTeam.name || apiTeam.teamName || "";

  // team.name이 없으면 supported: false로 반환 (예외 던지지 않음)
  if (!teamName) {
    console.warn("[mapApiPlayersResponse] team.name이 없어서 미지원 팀으로 처리", { apiResponse });
    // fallbackTeam이 있으면 사용, 없으면 null 반환 (api.ts에서 처리)
    if (fallbackTeam) {
      return {
        team: {
          id: fallbackTeam.id,
          name: fallbackTeam.name,
          crest: fallbackTeam.crest,
        },
        players: [],
        supported: false,
      };
    }
    return null;
  }

  // team.crest 추출
  const teamCrest = apiTeam.crest || apiTeam.crestUrl || "";

  // players 변환
  const players = mapApiPlayers(apiPlayers);

  console.log("[mapApiPlayersResponse] 변환 완료", {
    teamId,
    teamName,
    playersCount: players.length,
    expectedTeamId,
    verified: expectedTeamId === undefined || teamId === expectedTeamId,
    supported: true,
  });

  // 정상 응답은 supported: true (또는 undefined, 기본값 true로 간주)
  return {
    team: {
      id: teamId,
      name: teamName,
      crest: teamCrest,
    },
    players,
    supported: true,
  };
}
