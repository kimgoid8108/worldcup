/**
 * 포트(Pot) 데이터
 *
 * 용도: 2026 FIFA 월드컵 조 추첨을 위한 포트별 팀 분류 정보
 * - 각 Pot에 속한 팀 목록 (team.name 영문명)
 * - 플레이오프 승자는 문자열로 표시
 *
 * ⚠️ 중요:
 * - teams 배열은 team.name(영문) 또는 플레이오프 문자열만 포함
 * - PotsTab에서 team.name으로 매칭한 후 team.id로 변환
 * - 최종 매칭은 team.id === potTeamId로만 수행
 *
 * 사용 위치:
 * - PotsTab 컴포넌트: 포트별 팀 정보 표시
 */

export interface Pot {
  id: number; // Pot 번호 (1, 2, 3, 4)
  name: string; // Pot 이름
  teams: string[]; // 팀 목록 (team.name 영문명 또는 플레이오프 문자열)
}

/**
 * 2026 FIFA 월드컵 포트별 팀 분류
 * 각 Pot당 12개 팀
 *
 * ⚠️ 중요: team.name은 API teams 데이터의 team.name과 정확히 일치해야 함
 * PotsTab에서 team.name으로 매칭한 후 team.id로 변환하여 사용
 */
export const pots: Pot[] = [
  {
    id: 1,
    name: "Pot 1",
    teams: [
      "Canada",
      "Mexico",
      "United States",
      "Spain",
      "Argentina",
      "France",
      "England",
      "Brazil",
      "Portugal",
      "Netherlands",
      "Belgium",
      "Germany",
    ],
  },
  {
    id: 2,
    name: "Pot 2",
    teams: [
      "Croatia",
      "Morocco",
      "Colombia",
      "Uruguay",
      "Switzerland",
      "Japan",
      "Senegal",
      "Iran",
      "South Korea",
      "Ecuador",
      "Austria",
      "Australia",
    ],
  },
  {
    id: 3,
    name: "Pot 3",
    teams: [
      "Norway",
      "Panama",
      "Egypt",
      "Algeria",
      "Scotland",
      "Paraguay",
      "Tunisia",
      "Ivory Coast",
      "Uzbekistan",
      "Qatar",
      "Saudi Arabia",
      "South Africa",
    ],
  },
  {
    id: 4,
    name: "Pot 4",
    teams: [
      "Jordan",
      "Cape Verde",
      "Ghana",
      "Curaçao",
      "Haiti",
      "New Zealand",
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
