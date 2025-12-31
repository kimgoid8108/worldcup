/**
 * SquadBuilder 컴포넌트
 *
 * 용도: 축구장 배경 위에 선수들을 포메이션에 맞춰 배치하는 스쿼드 빌더
 * - 4-3-3, 4-4-2 포메이션 지원
 * - 선수 카드 드래그 앤 드롭
 * - 선수 클릭으로 교체
 * - 커스텀 모드
 */

"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Player } from "@/data/players";

export type Formation = "4-3-3" | "4-4-2";

interface Position {
  x: number; // 0-100 (퍼센트)
  y: number; // 0-100 (퍼센트)
}

interface SquadPlayer {
  player: Player | null;
  position: Position;
  isCustom: boolean; // 커스텀 모드에서 이동된 선수인지
}

interface SquadBuilderProps {
  players: Player[];
  formation?: Formation;
  onPlayerClick?: (player: Player | null, position: string, e?: React.MouseEvent) => void;
  flip?: boolean; // 축구장을 180도 회전시킬지 여부
  // 두 팀 모드
  team2Players?: Player[];
  team2Formation?: Formation;
  onTeam2PlayerClick?: (player: Player | null, position: string, e?: React.MouseEvent) => void;
}

// 포메이션별 기본 위치 설정 (x, y 좌표 - 퍼센트)
// 두 팀 모드: 왼쪽 팀은 하단에서 상단으로, 오른쪽 팀은 상단에서 하단으로 배치
const FORMATION_POSITIONS: Record<Formation, Position[]> = {
  "4-3-3": [
    // GK (중앙 하단)
    { x: 50, y: 90 },
    // DF (4명) - 위아래로 배치
    { x: 25, y: 75 }, // 상단 왼쪽
    { x: 50, y: 80 }, // 상단 중앙
    { x: 75, y: 75 }, // 상단 오른쪽
    { x: 50, y: 70 }, // 하단 중앙
    // MF (3명) - 중간 라인
    { x: 30, y: 50 },
    { x: 50, y: 50 },
    { x: 70, y: 50 },
    // FW (3명) - 상단 라인
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
const getPlayersByPosition = (players: Player[], position: string): Player[] => {
  return players.filter((p) => p.position === position);
};

export default function SquadBuilder({ players, formation = "4-3-3", onPlayerClick, flip = false, team2Players, team2Formation = "4-3-3", onTeam2PlayerClick }: SquadBuilderProps) {
  const [squadPlayers, setSquadPlayers] = useState<SquadPlayer[]>([]);
  const [team2SquadPlayers, setTeam2SquadPlayers] = useState<SquadPlayer[]>([]);
  const pitchRef = useRef<HTMLDivElement>(null);
  const isTwoTeamMode = !!team2Players;

  // 드래그 상태
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [draggedTeam, setDraggedTeam] = useState<"team1" | "team2" | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  /**
   * 홈 팀(왼쪽) 선수 위치 계산
   * - GK: 왼쪽 끝 (3%), y는 그대로 (하단)
   * - DF: 골대 근처 (x: 8-15%), y는 그대로 (70-80%)
   * - MF: 중간 (x: 20-35%), y는 그대로 (50%)
   * - FW: 중앙선 근처 (x: 40-48%), y는 그대로 (20-25%) (공격수가 중앙선을 향함)
   */
  // 홈팀 선수 위치 계산을 쉽게 설명:
  // - 골키퍼는 골대 왼쪽 끝(3%)에 위치함.
  // - 수비수는 골대 근처(8~15%)에 자동 정렬됨.
  // - 미드필더는 가운데(20~35%)에 자동 정렬됨.
  // - 공격수는 중앙선 근처(40~48%)에 자동 정렬됨.
  // 선수의 y 값(가로선 위치/세로방향)은 그대로 쓰고,
  // x 값(세로선 위치/가로방향)만 각 포지션에 맞게 바꿔줌.

  // 각 포지션 index 별로 구분해서 각각 따로 위치 조정 (한 번에 옮기지 않음)
  const calculateHomeTeamPosition = useCallback((pos: Position, positionIndex: number): Position => {
    // positionIndex 기반으로 포지션 구분
    // 0: GK, 1~4: DF, 5~8: MF, 9~10: FW (4-4-2/4-3-3 기준)
    if (positionIndex === 0) {
      // GK (골키퍼)
      return { x: 9, y: 50 };
    } else if (positionIndex >= 1 && positionIndex <= 4) {
      // DF (수비수)
      // DF들은 골대 근처 고정 위치 - 4인 기준 수평 분포
      // x값을 4등분으로 분할(8, 9.5, 11, 12.5 등) 혹은 그대로 활용
      const dfSpots = [8, 10, 12, 14];
      return {
        x: dfSpots[positionIndex - 1] ?? 10,
        y: pos.y,
      };
    } else if (positionIndex >= 5 && positionIndex <= 8) {
      // MF (미드필더)
      // MF들은 중앙 부근 고정 4명 포지션 - 20, 25, 30, 35 등 분포
      const mfSpots = [20, 23, 30, 35];
      return {
        x: mfSpots[positionIndex - 5] ?? 25,
        y: pos.y,
      };
    } else {
      // FW (공격수)
      // FW들은 중앙 부근 2명 포지션 - 42/48%, 예외적으로 3명: 41,44,47 또는 spread
      const fwSpots = [42, 48];
      return {
        x: fwSpots[positionIndex - 9] ?? 45,
        y: pos.y,
      };
    }
  }, []);

  /**
   * 어웨이 팀(오른쪽) 선수 위치 계산 - 홈 팀과 완전 대칭
   * - GK: 오른쪽 끝 (97%), y는 반전 (상단: 10%)
   * - 나머지 선수: 홈 팀 위치를 기준으로 대칭 계산
   *   - x: 100 - 홈팀 x (왼쪽/오른쪽 반전)
   *   - y: 100 - 홈팀 y (상단/하단 반전) - 공격수가 중앙선을 향하도록
   */
  const calculateAwayTeamPosition = useCallback(
    (pos: Position, positionIndex: number): Position => {
      // 1단계: 홈 팀과 동일한 방식으로 왼쪽 절반 위치 계산
      const homeTeamPos = calculateHomeTeamPosition(pos, positionIndex);

      // 2단계: 대칭 계산
      if (pos.y > 85) {
        // 골키퍼는 오른쪽 끝에 고정, y는 상단으로 반전 (90% -> 10%)
        return { x: 97, y: 10 };
      } else {
        // 나머지 선수들은 완전 대칭 위치에 배치
        // x: 왼쪽/오른쪽 반전, y: 상단/하단 반전
        return {
          x: 100 - homeTeamPos.x, // 완전 대칭: left = 100 - 홈팀 left
          y: 100 - homeTeamPos.y, // 완전 대칭: top = 100 - 홈팀 top
        };
      }
    },
    [calculateHomeTeamPosition]
  );

  /**
   * 포메이션 변경 시 스쿼드 초기화
   * - 페이지 로드 시 자동으로 기본 포메이션(4-3-3 또는 4-4-2)과 선수 명단이 배치됨
   * - 선수 데이터가 전달되면 포지션별로 자동 배치
   * - 각 선수 카드는 드래그하여 개별 위치 변경 가능
   */
  useEffect(() => {
    const positions = FORMATION_POSITIONS[formation];

    // 팀1 스쿼드 초기화 (항상 11명 자리 생성) - 홈 팀 (왼쪽)
    setSquadPlayers(() => {
      const newSquad: SquadPlayer[] = positions.map((pos, index) => {
        // 두 팀 모드일 때는 홈 팀 위치 계산 함수 사용
        const adjustedPos = isTwoTeamMode ? calculateHomeTeamPosition(pos, index) : pos;
        return { player: null, position: adjustedPos, isCustom: false };
      });

      // 포지션별로 선수 자동 배치 (초기 로드 시 자동 배치)
      // 선수 데이터가 있으면 포지션(GK, DF, MF, FW)에 맞춰 자동으로 배치
      if (players && players.length > 0) {
        const gkPlayers = getPlayersByPosition(players, "GK");
        const dfPlayers = getPlayersByPosition(players, "DF");
        const mfPlayers = getPlayersByPosition(players, "MF");
        const fwPlayers = getPlayersByPosition(players, "FW");

        let gkIndex = 0,
          dfIndex = 0,
          mfIndex = 0,
          fwIndex = 0;

        if (formation === "4-3-3") {
          // GK (0)
          if (gkPlayers.length > 0) newSquad[0].player = gkPlayers[gkIndex++];
          // DF (1-4)
          for (let i = 1; i <= 4 && dfIndex < dfPlayers.length; i++) {
            newSquad[i].player = dfPlayers[dfIndex++];
          }
          // MF (5-7)
          for (let i = 5; i <= 7 && mfIndex < mfPlayers.length; i++) {
            newSquad[i].player = mfPlayers[mfIndex++];
          }
          // FW (8-10)
          for (let i = 8; i <= 10 && fwIndex < fwPlayers.length; i++) {
            newSquad[i].player = fwPlayers[fwIndex++];
          }
        } else if (formation === "4-4-2") {
          // GK (0)
          if (gkPlayers.length > 0) newSquad[0].player = gkPlayers[gkIndex++];
          // DF (1-4)
          for (let i = 1; i <= 4 && dfIndex < dfPlayers.length; i++) {
            newSquad[i].player = dfPlayers[dfIndex++];
          }
          // MF (5-8)
          for (let i = 5; i <= 8 && mfIndex < mfPlayers.length; i++) {
            newSquad[i].player = mfPlayers[mfIndex++];
          }
          // FW (9-10)
          for (let i = 9; i <= 10 && fwIndex < fwPlayers.length; i++) {
            newSquad[i].player = fwPlayers[fwIndex++];
          }
        }
      }

      return newSquad;
    });

    // 팀2 스쿼드 초기화 (두 팀 모드일 때만, 항상 11명 자리 생성) - 어웨이 팀 (오른쪽)
    if (isTwoTeamMode) {
      const team2Positions = FORMATION_POSITIONS[team2Formation];
      setTeam2SquadPlayers(() => {
        const newSquad: SquadPlayer[] = team2Positions.map((pos, index) => {
          // 어웨이 팀: 홈 팀과 완전 대칭(Mirror) 배치
          // 커스텀 모드와 관계없이 항상 자동으로 대칭 계산
          const adjustedPos = calculateAwayTeamPosition(pos, index);
          return { player: null, position: adjustedPos, isCustom: false };
        });

        // 포지션별로 선수 자동 배치 (초기 로드 시 자동 배치)
        // 선수 데이터가 있으면 포지션(GK, DF, MF, FW)에 맞춰 자동으로 배치
        if (team2Players && team2Players.length > 0) {
          const gkPlayers = getPlayersByPosition(team2Players, "GK");
          const dfPlayers = getPlayersByPosition(team2Players, "DF");
          const mfPlayers = getPlayersByPosition(team2Players, "MF");
          const fwPlayers = getPlayersByPosition(team2Players, "FW");

          let gkIndex = 0,
            dfIndex = 0,
            mfIndex = 0,
            fwIndex = 0;

          if (team2Formation === "4-3-3") {
            // GK (0)
            if (gkPlayers.length > 0) newSquad[0].player = gkPlayers[gkIndex++];
            // DF (1-4)
            for (let i = 1; i <= 4 && dfIndex < dfPlayers.length; i++) {
              newSquad[i].player = dfPlayers[dfIndex++];
            }
            // MF (5-7)
            for (let i = 5; i <= 7 && mfIndex < mfPlayers.length; i++) {
              newSquad[i].player = mfPlayers[mfIndex++];
            }
            // FW (8-10)
            for (let i = 8; i <= 10 && fwIndex < fwPlayers.length; i++) {
              newSquad[i].player = fwPlayers[fwIndex++];
            }
          } else if (team2Formation === "4-4-2") {
            // GK (0)
            if (gkPlayers.length > 0) newSquad[0].player = gkPlayers[gkIndex++];
            // DF (1-4)
            for (let i = 1; i <= 4 && dfIndex < dfPlayers.length; i++) {
              newSquad[i].player = dfPlayers[dfIndex++];
            }
            // MF (5-8)
            for (let i = 5; i <= 8 && mfIndex < mfPlayers.length; i++) {
              newSquad[i].player = mfPlayers[mfIndex++];
            }
            // FW (9-10)
            for (let i = 9; i <= 10 && fwIndex < fwPlayers.length; i++) {
              newSquad[i].player = fwPlayers[fwIndex++];
            }
          }
        }

        return newSquad;
      });
    }
  }, [formation, players, isTwoTeamMode, team2Players, team2Formation, calculateHomeTeamPosition, calculateAwayTeamPosition]);

  // 선수 클릭 핸들러 (드래그가 아닐 때만 실행)
  const handlePlayerCardClick = useCallback(
    (index: number, e: React.MouseEvent) => {
      e.stopPropagation();
      // 선수 상세 정보 표시
      if (onPlayerClick) {
        onPlayerClick(squadPlayers[index].player, `${formation}-${index}`, e);
      }
    },
    [onPlayerClick, squadPlayers, formation]
  );

  // 팀2 선수 클릭 핸들러 (드래그가 아닐 때만 실행)
  const handleTeam2PlayerCardClick = useCallback(
    (index: number, e: React.MouseEvent) => {
      e.stopPropagation();
      // 선수 상세 정보 표시
      if (onTeam2PlayerClick) {
        onTeam2PlayerClick(team2SquadPlayers[index].player, `${team2Formation}-${index}`, e);
      }
    },
    [onTeam2PlayerClick, team2SquadPlayers, team2Formation]
  );

  // 드래그 시작 핸들러 (항상 활성화)
  const handleDragStart = useCallback((index: number, team: "team1" | "team2", e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setDraggedIndex(index);
    setDraggedTeam(team);

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const pitchRect = pitchRef.current?.getBoundingClientRect();
    if (pitchRect) {
      setDragOffset({
        x: e.clientX - rect.left - rect.width / 2,
        y: e.clientY - rect.top - rect.height / 2,
      });
    }
  }, []);

  // 드래그 중 핸들러
  const handleDrag = useCallback(
    (e: MouseEvent) => {
      if (draggedIndex === null || draggedTeam === null || !pitchRef.current) return;

      const pitchRect = pitchRef.current.getBoundingClientRect();
      const x = ((e.clientX - pitchRect.left - dragOffset.x) / pitchRect.width) * 100;
      const y = ((e.clientY - pitchRect.top - dragOffset.y) / pitchRect.height) * 100;

      if (draggedTeam === "team1") {
        setSquadPlayers((prev) => {
          const newSquad = [...prev];
          newSquad[draggedIndex] = {
            ...newSquad[draggedIndex],
            position: { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) },
            isCustom: true,
          };
          return newSquad;
        });
      } else {
        setTeam2SquadPlayers((prev) => {
          const newSquad = [...prev];
          newSquad[draggedIndex] = {
            ...newSquad[draggedIndex],
            position: { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) },
            isCustom: true,
          };
          return newSquad;
        });
      }
    },
    [draggedIndex, draggedTeam, dragOffset]
  );

  // 드래그 종료 핸들러
  const handleDragEnd = useCallback(() => {
    setDraggedIndex(null);
    setDraggedTeam(null);
    setDragOffset({ x: 0, y: 0 });
  }, []);

  // 드래그 이벤트 리스너
  useEffect(() => {
    if (draggedIndex !== null) {
      const handleMouseMove = (e: MouseEvent) => {
        requestAnimationFrame(() => handleDrag(e));
      };
      const handleMouseUp = () => {
        handleDragEnd();
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [draggedIndex, handleDrag, handleDragEnd]);

  return (
    <div className="w-full">
      {/* 축구장 배경 */}
      <div
        ref={pitchRef}
        className="relative w-full bg-gradient-to-b from-green-600 to-green-700 rounded-lg overflow-hidden select-none"
        style={{
          aspectRatio: isTwoTeamMode ? "16/9" : "3/4",
          minHeight: "300px",
          maxHeight: isTwoTeamMode ? "500px" : "450px",
          transform: flip ? "rotate(180deg)" : "none",
        }}>
        {/* 축구장 라인 */}
        <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: "none" }}>
          {/* 중앙 원 */}
          {isTwoTeamMode ? (
            <>
              {/* 중앙 원 (가로로 긴 타원형) */}
              <ellipse cx="50%" cy="50%" rx="8%" ry="20%" fill="none" stroke="white" strokeWidth="2" opacity="0.8" />
              {/* 중앙점 */}
              <circle cx="50%" cy="50%" r="2" fill="white" opacity="0.8" />
            </>
          ) : (
            <>
              <circle cx="50%" cy="50%" r="15%" fill="none" stroke="white" strokeWidth="2" opacity="0.8" />
              {/* 중앙점 */}
              <circle cx="50%" cy="50%" r="2" fill="white" opacity="0.8" />
            </>
          )}
          {/* 페널티 박스와 골 에어리어 */}
          {isTwoTeamMode ? (
            <>
              {/* 왼쪽 팀 페널티 박스 (왼쪽 끝) */}
              <rect x="0%" y="20%" width="18%" height="60%" fill="none" stroke="white" strokeWidth="2" opacity="0.8" />
              {/* 왼쪽 팀 골 에어리어 (왼쪽 끝) */}
              <rect x="0%" y="35%" width="6%" height="30%" fill="none" stroke="white" strokeWidth="2" opacity="0.8" />
              {/* 오른쪽 팀 페널티 박스 (오른쪽 끝) */}
              <rect x="82%" y="20%" width="18%" height="60%" fill="none" stroke="white" strokeWidth="2" opacity="0.8" />
              {/* 오른쪽 팀 골 에어리어 (오른쪽 끝) */}
              <rect x="94%" y="35%" width="6%" height="30%" fill="none" stroke="white" strokeWidth="2" opacity="0.8" />
            </>
          ) : (
            <>
              {/* 페널티 박스 (상단) */}
              <rect x="20%" y="5%" width="60%" height="20%" fill="none" stroke="white" strokeWidth="2" opacity="0.8" />
              {/* 페널티 박스 (하단) */}
              <rect x="20%" y="75%" width="60%" height="20%" fill="none" stroke="white" strokeWidth="2" opacity="0.8" />
              {/* 골 에어리어 (상단) */}
              <rect x="35%" y="5%" width="30%" height="10%" fill="none" stroke="white" strokeWidth="2" opacity="0.8" />
              {/* 골 에어리어 (하단) */}
              <rect x="35%" y="85%" width="30%" height="10%" fill="none" stroke="white" strokeWidth="2" opacity="0.8" />
            </>
          )}
          {/* 중앙선 (세로선 - 두 팀 모드일 때) */}
          {isTwoTeamMode ? (
            <line x1="50%" y1="0%" x2="50%" y2="100%" stroke="white" strokeWidth="3" opacity="0.9" />
          ) : (
            <line x1="0%" y1="50%" x2="100%" y2="50%" stroke="white" strokeWidth="2" opacity="0.8" />
          )}
        </svg>

        {/* 팀1 선수 카드들 */}
        {squadPlayers.map((squadPlayer, index) => {
          const isDragging = draggedIndex === index && draggedTeam === "team1";
          return (
            <div
              key={`team1-${index}`}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center cursor-move ${isDragging ? "" : "transition-transform duration-150 hover:scale-110"}`}
              style={{
                left: `${squadPlayer.position.x}%`,
                top: `${squadPlayer.position.y}%`,
                transform: flip ? "translateX(-50%) translateY(-50%) rotate(270deg)" : "translateX(-50%) translateY(-50%) rotate(90deg)",
                transition: isDragging ? "none" : "transform 0.15s",
              }}
              onMouseDown={(e) => {
                handleDragStart(index, "team1", e);
              }}
              onClick={(e) => {
                // 드래그가 아닐 때만 클릭 이벤트 실행 (마우스 이동 거리가 작을 때)
                if (!isDragging && draggedIndex === null) {
                  handlePlayerCardClick(index, e);
                }
              }}>
              {/* 내부 텍스트는 정상 방향으로 보이도록 반전 */}
              <div style={{ transform: flip ? "rotate(-270deg)" : "rotate(-90deg)" }} className="relative group">
                {squadPlayer.player ? (
                  <>
                    <div className="bg-white rounded-full w-16 h-16 shadow-lg border-2 border-blue-500 flex items-center justify-center hover:shadow-xl transition-all duration-200 hover:scale-105">
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">{index + 1}</div>
                        <div className="text-[10px] text-gray-500 mt-0.5">{squadPlayer.player.position}</div>
                      </div>
                    </div>
                    <div className="mt-1 text-xs font-semibold text-white bg-black/60 px-2 py-0.5 rounded max-w-[80px] truncate text-center">{squadPlayer.player.name}</div>
                    {/* Hover Tooltip */}
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block z-50 pointer-events-none">
                      <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 shadow-lg whitespace-nowrap">
                        <div className="font-bold">{squadPlayer.player.name}</div>
                        <div className="text-gray-300 mt-1">
                          포지션: {squadPlayer.player.position}
                          {squadPlayer.player.age && ` | 나이: ${squadPlayer.player.age}`}
                          {squadPlayer.player.club && ` | 소속: ${squadPlayer.player.club}`}
                        </div>
                        <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-gray-200 rounded-full w-16 h-16 shadow-md border-2 border-gray-400 flex items-center justify-center opacity-60">
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-500">{index + 1}</div>
                        <div className="text-[10px] text-gray-400 mt-0.5">빈 슬롯</div>
                      </div>
                    </div>
                    <div className="mt-1 text-xs text-gray-400 bg-black/40 px-2 py-0.5 rounded max-w-[80px] truncate text-center">빈 슬롯</div>
                  </>
                )}
              </div>
            </div>
          );
        })}

        {/* 팀2 선수 카드들 (두 팀 모드일 때만) */}
        {isTwoTeamMode &&
          team2SquadPlayers.map((squadPlayer, index) => {
            const isDragging = draggedIndex === index && draggedTeam === "team2";
            return (
              <div
                key={`team2-${index}`}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center cursor-move ${isDragging ? "" : "transition-transform duration-150 hover:scale-110"}`}
                style={{
                  left: `${squadPlayer.position.x}%`,
                  top: `${squadPlayer.position.y}%`,
                  transform: "translateX(-50%) translateY(-50%) scaleX(-1) rotate(-90deg)", // 수평 반전 + 90도 회전
                  transition: isDragging ? "none" : "transform 0.15s",
                }}
                onMouseDown={(e) => {
                  handleDragStart(index, "team2", e);
                }}
                onClick={(e) => {
                  // 드래그가 아닐 때만 클릭 이벤트 실행 (마우스 이동 거리가 작을 때)
                  if (!isDragging && draggedIndex === null) {
                    handleTeam2PlayerCardClick(index, e);
                  }
                }}>
                {/* 내부 텍스트는 정상 방향으로 보이도록 반전 (대칭 + 회전 반전) */}
                <div style={{ transform: "scaleX(-1) rotate(-90deg)" }} className="relative group">
                  {squadPlayer.player ? (
                    <>
                      <div className="bg-white rounded-full w-16 h-16 shadow-lg border-2 border-red-500 flex items-center justify-center hover:shadow-xl transition-all duration-200 hover:scale-105">
                        <div className="text-center">
                          <div className="text-lg font-bold text-red-600">{index + 1}</div>
                          <div className="text-[10px] text-gray-500 mt-0.5">{squadPlayer.player.position}</div>
                        </div>
                      </div>
                      <div className="mt-1 text-xs font-semibold text-white bg-black/60 px-2 py-0.5 rounded max-w-[80px] truncate text-center">{squadPlayer.player.name}</div>
                      {/* Hover Tooltip */}
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block z-50 pointer-events-none">
                        <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 shadow-lg whitespace-nowrap">
                          <div className="font-bold">{squadPlayer.player.name}</div>
                          <div className="text-gray-300 mt-1">
                            포지션: {squadPlayer.player.position}
                            {squadPlayer.player.age && ` | 나이: ${squadPlayer.player.age}`}
                            {squadPlayer.player.club && ` | 소속: ${squadPlayer.player.club}`}
                          </div>
                          <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="bg-gray-200 rounded-full w-16 h-16 shadow-md border-2 border-gray-400 flex items-center justify-center opacity-60">
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-500">{index + 1}</div>
                          <div className="text-[10px] text-gray-400 mt-0.5">빈 슬롯</div>
                        </div>
                      </div>
                      <div className="mt-1 text-xs text-gray-400 bg-black/40 px-2 py-0.5 rounded max-w-[80px] truncate text-center">빈 슬롯</div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
