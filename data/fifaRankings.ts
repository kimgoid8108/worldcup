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
  // 1-10위
  spain: 1877, // 1위
  argentina: 1873, // 2위
  france: 1870, // 3위
  england: 1834, // 4위
  brazil: 1760, // 5위
  portugal: 1760, // 6위
  netherlands: 1756, // 7위
  belgium: 1730, // 8위
  germany: 1724, // 9위
  croatia: 1716, // 10위
  morocco: 1716, // 11위
  italy: 1702, // 12위
  colombia: 1701, // 13위
  usa: 1681, // 14위
  mexico: 1675, // 15위
  uruguay: 1672, // 16위
  switzerland: 1654, // 17위
  japan: 1650, // 18위
  senegal: 1648, // 19위
  iran: 1617, // 20위
  denmark: 1616, // 21위
  southkorea: 1599, // 22위
  ecuador: 1591, // 23위
  austria: 1585, // 24위
  turkiye: 1582, // 25위 (튀르키예)
  australia: 1574, // 26위
  canada: 1559, // 27위
  ukraine: 1557, // 28위
  norway: 1553, // 29위
  panama: 1540, // 30위
  poland: 1532, // 31위
  wales: 1529, // 32위
  algeria: 1517, // 34위
  egypt: 1515, // 35위
  scotland: 1506, // 36위
  paraguay: 1501, // 39위
  tunisia: 1494, // 41위
  ivorycoast: 1489, // 42위
  sweden: 1487, // 43위
  czechrepublic: 1487, // 44위
  slovakia: 1485, // 45위
  romania: 1465, // 47위
  uzbekistan: 1462, // 50위
  qatar: 1454, // 54위
  congodr: 1444, // 56위
  iraq: 1436, // 58위
  ireland: 1436, // 59위
  saudiarabia: 1429, // 60위
  southafrica: 1426, // 61위
  albania: 1401, // 63위
  jordan: 1388, // 64위
  northmacedonia: 1378, // 66위
  capeverde: 1370, // 67위
  northernireland: 1366, // 69위
  jamaica: 1362, // 70위
  bosnia: 1362, // 71위
  ghana: 1351, // 72위
  bolivia: 1329, // 76위
  kosovo: 1308, // 80위
  curacao: 1302, // 82위
  haiti: 1294, // 84위
  newzealand: 1279, // 87위
  suriname: 1140, // 123위
  newcaledonia: 1042, // 150위
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
