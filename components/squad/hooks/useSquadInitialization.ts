/**
 * 스쿼드 초기화 커스텀 훅
 */

import { useCallback, useMemo } from "react";
import {
  SquadPlayer,
  Position,
  Formation,
  FORMATION_POSITIONS,
  FORMATION_INDICES,
  getPlayersByPosition,
  HOME_TEAM_CUSTOM_POSITIONS,
  AWAY_TEAM_CUSTOM_POSITIONS,
} from "../utils/squadUtils";
import { PlayerWithImage } from "../PlayerImageCard";
import { Player } from "@/data/players";

interface UseSquadInitializationProps {
  players: (PlayerWithImage | Player)[];
  formation: Formation;
  isTwoTeamMode: boolean;
  team2Players?: (PlayerWithImage | Player)[];
  team2Formation?: Formation;
}

/**
 * 홈 팀 선수 위치 계산
 */
const calculateHomeTeamPosition = (
  pos: Position,
  positionIndex: number,
  formation: Formation
): Position => {
  if (formation === "4-3-3" && positionIndex < HOME_TEAM_CUSTOM_POSITIONS.length) {
    return HOME_TEAM_CUSTOM_POSITIONS[positionIndex];
  }
  return pos;
};

/**
 * 어웨이 팀 선수 위치 계산
 */
const calculateAwayTeamPosition = (
  pos: Position,
  positionIndex: number,
  formation: Formation
): Position => {
  if (formation === "4-3-3" && positionIndex < AWAY_TEAM_CUSTOM_POSITIONS.length) {
    return AWAY_TEAM_CUSTOM_POSITIONS[positionIndex];
  }
  return pos;
};

/**
 * 선수 배치 헬퍼 함수
 */
const assignPlayersToSquad = (
  newSquad: SquadPlayer[],
  indices: number[],
  playerArray: (PlayerWithImage | Player)[],
  currentIndex: { value: number }
): void => {
  indices
    .slice(0, Math.min(indices.length, playerArray.length - currentIndex.value))
    .forEach((i) => {
      if (currentIndex.value < playerArray.length) {
        newSquad[i].player = playerArray[currentIndex.value++];
      }
    });
};

/**
 * 스쿼드 초기화 함수
 */
const initializeSquad = (
  players: (PlayerWithImage | Player)[],
  formation: Formation,
  isTwoTeamMode: boolean
): SquadPlayer[] => {
  const positions = FORMATION_POSITIONS[formation];
  const newSquad: SquadPlayer[] = positions.map((pos, index) => {
    const adjustedPos = isTwoTeamMode
      ? calculateHomeTeamPosition(pos, index, formation)
      : pos;
    return { player: null, position: adjustedPos, isCustom: false };
  });

  if (players && players.length > 0) {
    const gkPlayers = getPlayersByPosition(players, "GK");
    const dfPlayers = getPlayersByPosition(players, "DF");
    const mfPlayers = getPlayersByPosition(players, "MF");
    const fwPlayers = getPlayersByPosition(players, "FW");

    // GK 배치
    if ((formation === "4-3-3" || formation === "4-4-2") && gkPlayers.length > 0) {
      newSquad[0].player = gkPlayers[0];
    }

    // DF, MF, FW 배치
    const indices = FORMATION_INDICES[formation];
    const dfIndex = { value: 0 };
    const mfIndex = { value: 0 };
    const fwIndex = { value: 0 };

    assignPlayersToSquad(newSquad, indices.df, dfPlayers, dfIndex);
    assignPlayersToSquad(newSquad, indices.mf, mfPlayers, mfIndex);
    assignPlayersToSquad(newSquad, indices.fw, fwPlayers, fwIndex);
  }

  return newSquad;
};

/**
 * 팀2 스쿼드 초기화 함수
 */
const initializeTeam2Squad = (
  team2Players: (PlayerWithImage | Player)[],
  team2Formation: Formation
): SquadPlayer[] => {
  const team2Positions = FORMATION_POSITIONS[team2Formation];
  const newSquad: SquadPlayer[] = team2Positions.map((pos, index) => {
    const adjustedPos = calculateAwayTeamPosition(pos, index, team2Formation);
    return { player: null, position: adjustedPos, isCustom: false };
  });

  if (team2Players && team2Players.length > 0) {
    const gkPlayers = getPlayersByPosition(team2Players, "GK");
    const dfPlayers = getPlayersByPosition(team2Players, "DF");
    const mfPlayers = getPlayersByPosition(team2Players, "MF");
    const fwPlayers = getPlayersByPosition(team2Players, "FW");

    // GK 배치
    if (gkPlayers.length > 0) {
      newSquad[0].player = gkPlayers[0];
    }

    // DF, MF, FW 배치
    const indices = FORMATION_INDICES[team2Formation];
    const dfIndex = { value: 0 };
    const mfIndex = { value: 0 };
    const fwIndex = { value: 0 };

    assignPlayersToSquad(newSquad, indices.df, dfPlayers, dfIndex);
    assignPlayersToSquad(newSquad, indices.mf, mfPlayers, mfIndex);
    assignPlayersToSquad(newSquad, indices.fw, fwPlayers, fwIndex);
  }

  return newSquad;
};

export const useSquadInitialization = ({
  players,
  formation,
  isTwoTeamMode,
  team2Players,
  team2Formation = "4-3-3",
}: UseSquadInitializationProps) => {
  const team1Squad = useMemo(
    () => initializeSquad(players, formation, isTwoTeamMode),
    [players, formation, isTwoTeamMode]
  );

  const team2Squad = useMemo(() => {
    if (!isTwoTeamMode || !team2Players) return [];
    return initializeTeam2Squad(team2Players, team2Formation);
  }, [isTwoTeamMode, team2Players, team2Formation]);

  return { team1Squad, team2Squad };
};
