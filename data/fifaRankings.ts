/**
 * FIFA 랭킹 데이터
 *
 * 용도: 각 국가의 FIFA 랭킹 정보 저장
 * - 국가 ID와 FIFA 랭킹 점수 매핑
 *
 * 사용 위치:
 * - CountryModal: 국가 상세 정보에서 FIFA 랭킹 표시
 * - PotInfo: 포트별 팀 정보에서 FIFA 랭킹 표시
 */

/**
 * 국가별 FIFA 랭킹 점수
 * 키: 국가 ID (countries.ts의 id와 매칭)
 * 값: FIFA 랭킹 점수
 */
export const fifaRankings: Record<string, number> = {
  argentina: 1855,
  france: 1850,
  england: 1800,
  brazil: 1780,
  belgium: 1750,
  netherlands: 1730,
  portugal: 1720,
  spain: 1710,
  italy: 1700,
  croatia: 1690,
  uruguay: 1680,
  morocco: 1670,
  colombia: 1660,
  mexico: 1650,
  usa: 1640,
  germany: 1630,
  japan: 1620,
  switzerland: 1610,
  iran: 1600,
  denmark: 1590,
  senegal: 1580,
  southkorea: 1570,
  poland: 1560,
  australia: 1550,
  egypt: 1540,
  tunisia: 1530,
  algeria: 1520,
  austria: 1510,
  norway: 1500,
  scotland: 1490,
  paraguay: 1480,
  ecuador: 1470,
  ivorycoast: 1460,
  saudiarabia: 1450,
  qatar: 1440,
  uzbekistan: 1430,
  ghana: 1420,
  capeverde: 1410,
  jordan: 1400,
  canada: 1390,
  curacao: 1380,
  haiti: 1370,
  newzealand: 1360,
  panama: 1350,
  southafrica: 1340,
};

/**
 * 국가 ID로 FIFA 랭킹 점수 조회
 * @param countryId - 국가 ID
 * @returns FIFA 랭킹 점수 또는 null
 */
export const getFifaRanking = (countryId: string): number | null => {
  return fifaRankings[countryId] || null;
};

/**
 * FIFA 랭킹 점수로 순위 계산
 * @param countryId - 국가 ID
 * @returns FIFA 랭킹 순위 또는 null
 */
export const getFifaRank = (countryId: string): number | null => {
  const ranking = getFifaRanking(countryId);
  if (ranking === null) return null;

  // 모든 랭킹을 점수 순으로 정렬하여 순위 계산
  const sortedRankings = Object.entries(fifaRankings)
    .map(([id, score]) => ({ id, score }))
    .sort((a, b) => b.score - a.score);

  const rank = sortedRankings.findIndex((r) => r.id === countryId);
  return rank >= 0 ? rank + 1 : null;
};
