/**
 * 포트(Pot) 데이터
 *
 * 용도: 2026 FIFA 월드컵 조 추첨을 위한 포트별 팀 분류 정보
 * - 각 Pot에 속한 팀 목록
 * - 플레이오프 승자는 placeholder로 표시
 *
 * 사용 위치:
 * - PotInfo 컴포넌트: 포트별 팀 정보 표시
 */

export interface Pot {
  id: number; // Pot 번호 (1, 2, 3, 4)
  name: string; // Pot 이름
  teams: string[]; // 팀 목록 (국가 ID 또는 플레이오프 승자)
}

/**
 * 2026 FIFA 월드컵 포트별 팀 분류
 * 각 Pot당 12개 팀
 */
export const pots: Pot[] = [
  {
    id: 1,
    name: "Pot 1",
    teams: [
      "canada",
      "mexico",
      "usa",
      "spain",
      "argentina",
      "france",
      "england",
      "brazil",
      "portugal",
      "netherlands",
      "belgium",
      "germany",
    ],
  },
  {
    id: 2,
    name: "Pot 2",
    teams: [
      "croatia",
      "morocco",
      "colombia",
      "uruguay",
      "switzerland",
      "japan",
      "senegal",
      "iran",
      "southkorea",
      "ecuador",
      "austria",
      "australia",
    ],
  },
  {
    id: 3,
    name: "Pot 3",
    teams: [
      "norway",
      "panama",
      "egypt",
      "algeria",
      "scotland",
      "paraguay",
      "tunisia",
      "ivorycoast",
      "uzbekistan",
      "qatar",
      "saudiarabia",
      "southafrica",
    ],
  },
  {
    id: 4,
    name: "Pot 4",
    teams: [
      "jordan",
      "capeverde",
      "ghana",
      "curacao",
      "haiti",
      "newzealand",
      "playoff_europe_1",
      "playoff_europe_2",
      "playoff_europe_3",
      "playoff_europe_4",
      "playoff_intercontinental_1",
      "playoff_intercontinental_2",
    ],
  },
];

/**
 * Pot ID로 Pot 정보 조회
 * @param potId - Pot 번호 (1, 2, 3, 4)
 * @returns Pot 정보 또는 undefined
 */
export const getPotById = (potId: number): Pot | undefined => {
  return pots.find((p) => p.id === potId);
};

/**
 * 모든 Pot 정보 조회
 * @returns 모든 Pot 배열
 */
export const getAllPots = (): Pot[] => {
  return pots;
};
