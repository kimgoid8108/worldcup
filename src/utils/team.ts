/**
 * Team 유틸리티 함수
 *
 * 목적:
 * - team.id 기반 단일 매칭만 수행
 * - 문자열 비교, area.name, countryId 등 잘못된 키 사용 금지
 */

import type { FrontTeam } from "@/src/types/api";

/**
 * teams 배열에서 team.id로 team 찾기
 * ⚠️ 중요: team.id 단일 비교만 수행 (문자열 비교 금지)
 *
 * @param teams - FrontTeam 배열
 * @param teamId - 찾을 team.id (number)
 * @returns FrontTeam 또는 undefined
 */
export function getTeamById(teams: FrontTeam[], teamId: number | null): FrontTeam | undefined {
  if (!teamId || teamId === 0) {
    return undefined;
  }

  return teams.find((team) => team?.id === teamId);
}
