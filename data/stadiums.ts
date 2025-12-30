/**
 * 경기장 데이터
 *
 * 용도: 2026 북중미 월드컵 개최 경기장 정보 저장
 * - 경기장 ID, 이름, 위치, 설명
 * - Sketchfab 3D 모델 ID 및 제작자 정보
 *
 * 사용 위치:
 * - StadiumMapOverlay: 지도에 마커 표시
 * - StadiumModal: 경기장 상세 정보 표시
 * - StadiumsTab: 경기장 목록 표시
 */

/**
 * 경기장 정보 인터페이스
 */
export interface Stadium {
  id: string; // 경기장 고유 ID (지도 마커 위치 매핑에 사용)
  name: string; // 경기장 이름
  city: string; // 도시명
  country: string; // 국가명 (USA, Canada, Mexico)
  description: string; // 경기장 설명
  capacity: number; // 수용 인원
  sketchfabModelId: string; // Sketchfab 3D 모델 ID
  author?: string; // 3D 모델 제작자 이름
}

/**
 * 2026 북중미 월드컵 개최 경기장 목록
 * 총 16개 경기장 (미국 11개, 캐나다 2개, 멕시코 3개)
 */
export const stadiums: Stadium[] = [
  // 🇺🇸 미국 경기장 (11개)
  {
    id: "sofi",
    name: "SoFi Stadium",
    city: "Inglewood, CA",
    country: "USA",
    description: "2026 북중미 월드컵 개최 경기장",
    capacity: 70240,
    sketchfabModelId: "845f056711a740129b590279cf2a0a0a",
    author: "1Quad",
  },
  {
    id: "metlife",
    name: "MetLife Stadium",
    city: "East Rutherford, NJ",
    country: "USA",
    description: "2026 북중미 월드컵 개최 경기장",
    capacity: 82500,
    sketchfabModelId: "bd8d240863ab42bab8e7fc512396b7ae",
    author: "nuralam018",
  },
  {
    id: "att",
    name: "AT&T Stadium",
    city: "Arlington, TX",
    country: "USA",
    description: "2026 북중미 월드컵 개최 경기장",
    capacity: 80000,
    sketchfabModelId: "c8d40da56c53466e96268597464f6e09",
    author: "Shin Xiba 3D",
  },
  {
    id: "arrowhead",
    name: "Arrowhead Stadium",
    city: "Kansas City, MO",
    country: "USA",
    description: "2026 북중미 월드컵 개최 경기장",
    capacity: 76416,
    sketchfabModelId: "8aa4ad611c594fc28a2017a50c52f5fd",
    author: "Shin Xiba 3D",
  },
  {
    id: "gillette",
    name: "Gillette Stadium",
    city: "Foxborough, MA",
    country: "USA",
    description: "2026 북중미 월드컵 개최 경기장",
    capacity: 65878,
    sketchfabModelId: "a63d411b60a0486c88f8c4fc0af04594",
    author: "nuralam018",
  },
  {
    id: "mercedes",
    name: "Mercedes-Benz Stadium",
    city: "Atlanta, GA",
    country: "USA",
    description: "2026 북중미 월드컵 개최 경기장",
    capacity: 71000,
    sketchfabModelId: "01ae2f2bc88c4588b532fadf86ba017a",
    author: "1Quad",
  },
  {
    id: "nrg",
    name: "NRG Stadium",
    city: "Houston, TX",
    country: "USA",
    description: "2026 북중미 월드컵 개최 경기장",
    capacity: 72220,
    sketchfabModelId: "5ca7a08bb23942829a74f3c736b8167f",
    author: "nuralam018",
  },
  {
    id: "lumen",
    name: "Lumen Field",
    city: "Seattle, WA",
    country: "USA",
    description: "2026 북중미 월드컵 개최 경기장",
    capacity: 68740,
    sketchfabModelId: "42a902af022243518c95c8d12b70311a",
    author: "nuralam018",
  },
  {
    id: "levis",
    name: "Levi's Stadium",
    city: "Santa Clara, CA",
    country: "USA",
    description: "2026 북중미 월드컵 개최 경기장",
    capacity: 68500,
    sketchfabModelId: "12d0e9759d0340d4a98e1f4f0934a1e1",
    author: "nuralam018",
  },
  {
    id: "hardrock",
    name: "Hard Rock Stadium",
    city: "Miami, FL",
    country: "USA",
    description: "2026 북중미 월드컵 개최 경기장",
    capacity: 65326,
    sketchfabModelId: "7098e5cec3a641338c75bf371b18d482",
    author: "nuralam018",
  },
  {
    id: "lincoln",
    name: "Lincoln Financial Field",
    city: "Philadelphia, PA",
    country: "USA",
    description: "2026 북중미 월드컵 개최 경기장",
    capacity: 69596,
    sketchfabModelId: "6dbada6a197e44d98d54cecc6efbf7c4",
    author: "nuralam018",
  },

  // 🇨🇦 캐나다 경기장 (2개)
  {
    id: "bmo",
    name: "BMO Field",
    city: "Toronto, ON",
    country: "Canada",
    description: "2026 북중미 월드컵 개최 경기장",
    capacity: 30000,
    sketchfabModelId: "89046e63f0eb4d74b4c5c6c52fe174fe",
    author: "nuralam018",
  },
  {
    id: "bcplace",
    name: "BC Place",
    city: "Vancouver, BC",
    country: "Canada",
    description: "2026 북중미 월드컵 개최 경기장",
    capacity: 54500,
    sketchfabModelId: "fb65bf95e1a04f0791d410b2361fe16e",
    author: "Shin Xiba 3D",
  },

  // 🇲🇽 멕시코 경기장 (3개)
  {
    id: "azteca",
    name: "Estadio Azteca",
    city: "Mexico City",
    country: "Mexico",
    description: "2026 북중미 월드컵 개최 경기장",
    capacity: 87523,
    sketchfabModelId: "83ca580566054b1b9d780289f4372d68",
    author: "Shin Xiba 3D",
  },
  {
    id: "akron",
    name: "Estadio Akron",
    city: "Guadalajara",
    country: "Mexico",
    description: "2026 북중미 월드컵 개최 경기장",
    capacity: 49000,
    sketchfabModelId: "91718497a838442a8cd312c448f687e6",
    author: "nuralam018",
  },
  {
    id: "bbva",
    name: "Estadio BBVA",
    city: "Monterrey",
    country: "Mexico",
    description: "2026 북중미 월드컵 개최 경기장",
    capacity: 53460,
    sketchfabModelId: "7ae5e6c6393947948776c1314fbbeefd",
    author: "Shin Xiba 3D",
  },
];
