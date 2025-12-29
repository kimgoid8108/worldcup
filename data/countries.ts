/**
 * 국가 데이터
 *
 * 용도: 2026 FIFA 월드컵 참가국 정보 저장
 * - 국가 ID, 이름, 코드, 국기
 * - 국가 수도 좌표 (위도/경도) - Google Maps 표시용
 *
 * 사용 위치:
 * - GroupsTab: 조별 참가국 표시
 * - CountryModal: 국가 상세 정보 및 지도 표시
 * - groups.ts: 경기 일정의 팀 정보 참조
 *
 * 주의: 모든 좌표는 각국의 수도 좌표입니다.
 */

export interface Country {
  id: string; // 국가 고유 ID (groups.ts에서 참조)
  name: string; // 국가 한글 이름
  code: string; // 국가 코드 (ISO 3자리 코드)
  flag: string; // 국기 이모지
  latitude: number; // 수도 위도
  longitude: number; // 수도 경도
}

/**
 * 2026 FIFA 월드컵 참가국 목록
 * 모든 좌표는 각국의 수도 좌표입니다.
 */
export const countries: Country[] = [
  // 주요 국가 - 수도 좌표
  { id: "usa", name: "미국", code: "USA", flag: "🇺🇸", latitude: 38.9072, longitude: -77.0369 }, // 워싱턴 D.C.
  { id: "canada", name: "캐나다", code: "CAN", flag: "🇨🇦", latitude: 45.4215, longitude: -75.6972 }, // 오타와
  { id: "mexico", name: "멕시코", code: "MEX", flag: "🇲🇽", latitude: 19.4326, longitude: -99.1332 }, // 멕시코시티
  { id: "brazil", name: "브라질", code: "BRA", flag: "🇧🇷", latitude: -15.7942, longitude: -47.8822 }, // 브라질리아
  { id: "argentina", name: "아르헨티나", code: "ARG", flag: "🇦🇷", latitude: -34.6037, longitude: -58.3816 }, // 부에노스아이레스
  { id: "france", name: "프랑스", code: "FRA", flag: "🇫🇷", latitude: 48.8566, longitude: 2.3522 }, // 파리
  { id: "england", name: "잉글랜드", code: "ENG", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", latitude: 51.5074, longitude: -0.1278 }, // 런던
  { id: "spain", name: "스페인", code: "ESP", flag: "🇪🇸", latitude: 40.4168, longitude: -3.7038 }, // 마드리드
  { id: "germany", name: "독일", code: "GER", flag: "🇩🇪", latitude: 52.5200, longitude: 13.4050 }, // 베를린
  { id: "italy", name: "이탈리아", code: "ITA", flag: "🇮🇹", latitude: 41.9028, longitude: 12.4964 }, // 로마
  { id: "portugal", name: "포르투갈", code: "POR", flag: "🇵🇹", latitude: 38.7223, longitude: -9.1393 }, // 리스본
  { id: "netherlands", name: "네덜란드", code: "NED", flag: "🇳🇱", latitude: 52.3676, longitude: 4.9041 }, // 암스테르담
  { id: "japan", name: "일본", code: "JPN", flag: "🇯🇵", latitude: 35.6762, longitude: 139.6503 }, // 도쿄
  { id: "southkorea", name: "대한민국", code: "KOR", flag: "🇰🇷", latitude: 37.5665, longitude: 126.9780 }, // 서울
  { id: "morocco", name: "모로코", code: "MAR", flag: "🇲🇦", latitude: 34.0209, longitude: -6.8416 }, // 라바트
  { id: "senegal", name: "세네갈", code: "SEN", flag: "🇸🇳", latitude: 14.7167, longitude: -17.4677 }, // 다카르
  { id: "egypt", name: "이집트", code: "EGY", flag: "🇪🇬", latitude: 30.0444, longitude: 31.2357 }, // 카이로
  { id: "australia", name: "호주", code: "AUS", flag: "🇦🇺", latitude: -35.2809, longitude: 149.1300 }, // 캔버라
  { id: "uruguay", name: "우루과이", code: "URU", flag: "🇺🇾", latitude: -34.9011, longitude: -56.1645 }, // 몬테비데오
  { id: "colombia", name: "콜롬비아", code: "COL", flag: "🇨🇴", latitude: 4.7110, longitude: -74.0721 }, // 보고타
  { id: "chile", name: "칠레", code: "CHI", flag: "🇨🇱", latitude: -33.4489, longitude: -70.6693 }, // 산티아고
  { id: "peru", name: "페루", code: "PER", flag: "🇵🇪", latitude: -12.0464, longitude: -77.0428 }, // 리마
  { id: "ecuador", name: "에콰도르", code: "ECU", flag: "🇪🇨", latitude: -0.1807, longitude: -78.4678 }, // 키토
  { id: "croatia", name: "크로아티아", code: "CRO", flag: "🇭🇷", latitude: 45.8150, longitude: 15.9819 }, // 자그레브
  { id: "belgium", name: "벨기에", code: "BEL", flag: "🇧🇪", latitude: 50.8503, longitude: 4.3517 }, // 브뤼셀
  { id: "switzerland", name: "스위스", code: "SUI", flag: "🇨🇭", latitude: 46.9481, longitude: 7.4474 }, // 베른
  { id: "denmark", name: "덴마크", code: "DEN", flag: "🇩🇰", latitude: 55.6761, longitude: 12.5683 }, // 코펜하겐
  { id: "poland", name: "폴란드", code: "POL", flag: "🇵🇱", latitude: 52.2297, longitude: 21.0122 }, // 바르샤바
  { id: "sweden", name: "스웨덴", code: "SWE", flag: "🇸🇪", latitude: 59.3293, longitude: 18.0686 }, // 스톡홀름
  { id: "norway", name: "노르웨이", code: "NOR", flag: "🇳🇴", latitude: 59.9139, longitude: 10.7522 }, // 오슬로
  { id: "russia", name: "러시아", code: "RUS", flag: "🇷🇺", latitude: 55.7558, longitude: 37.6173 }, // 모스크바
  { id: "turkey", name: "터키", code: "TUR", flag: "🇹🇷", latitude: 39.9334, longitude: 32.8597 }, // 앙카라
  { id: "iran", name: "이란", code: "IRN", flag: "🇮🇷", latitude: 35.6892, longitude: 51.3890 }, // 테헤란
  { id: "saudiarabia", name: "사우디아라비아", code: "KSA", flag: "🇸🇦", latitude: 24.7136, longitude: 46.6753 }, // 리야드
  { id: "qatar", name: "카타르", code: "QAT", flag: "🇶🇦", latitude: 25.2854, longitude: 51.5310 }, // 도하
  { id: "uae", name: "아랍에미리트", code: "UAE", flag: "🇦🇪", latitude: 24.4539, longitude: 54.3773 }, // 아부다비
  { id: "china", name: "중국", code: "CHN", flag: "🇨🇳", latitude: 39.9042, longitude: 116.4074 }, // 베이징
  { id: "india", name: "인도", code: "IND", flag: "🇮🇳", latitude: 28.6139, longitude: 77.2090 }, // 뉴델리
  { id: "thailand", name: "태국", code: "THA", flag: "🇹🇭", latitude: 13.7563, longitude: 100.5018 }, // 방콕
  { id: "vietnam", name: "베트남", code: "VIE", flag: "🇻🇳", latitude: 21.0285, longitude: 105.8542 }, // 하노이
  { id: "newzealand", name: "뉴질랜드", code: "NZL", flag: "🇳🇿", latitude: -41.2865, longitude: 174.7762 }, // 웰링턴
  { id: "costa", name: "코스타리카", code: "CRC", flag: "🇨🇷", latitude: 9.9281, longitude: -84.0907 }, // 산호세
  { id: "panama", name: "파나마", code: "PAN", flag: "🇵🇦", latitude: 8.9824, longitude: -79.5199 }, // 파나마시티
  { id: "jamaica", name: "자메이카", code: "JAM", flag: "🇯🇲", latitude: 18.0179, longitude: -76.8099 }, // 킹스턴
  { id: "southafrica", name: "남아프리카공화국", code: "RSA", flag: "🇿🇦", latitude: -25.7479, longitude: 28.2293 }, // 프리토리아
  { id: "haiti", name: "아이티", code: "HAI", flag: "🇭🇹", latitude: 18.5944, longitude: -72.3074 }, // 포르토프랭스
  { id: "scotland", name: "스코틀랜드", code: "SCO", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", latitude: 55.9533, longitude: -3.1883 }, // 에딘버러
  { id: "paraguay", name: "파라과이", code: "PAR", flag: "🇵🇾", latitude: -25.2637, longitude: -57.5759 }, // 아순시온
  { id: "curacao", name: "퀴라소", code: "CUW", flag: "🇨🇼", latitude: 12.1091, longitude: -68.9317 }, // 빌렘스타드
  { id: "ivorycoast", name: "코트디부아르", code: "CIV", flag: "🇨🇮", latitude: 6.8276, longitude: -5.2893 }, // 야무수크로
  { id: "tunisia", name: "튀니지", code: "TUN", flag: "🇹🇳", latitude: 36.8065, longitude: 10.1815 }, // 튀니스
  { id: "algeria", name: "알제리", code: "DZA", flag: "🇩🇿", latitude: 36.7538, longitude: 3.0588 }, // 알제
  { id: "austria", name: "오스트리아", code: "AUT", flag: "🇦🇹", latitude: 48.2082, longitude: 16.3738 }, // 빈
  { id: "jordan", name: "요르단", code: "JOR", flag: "🇯🇴", latitude: 31.9539, longitude: 35.9106 }, // 암만
  { id: "uzbekistan", name: "우즈베키스탄", code: "UZB", flag: "🇺🇿", latitude: 41.2995, longitude: 69.2401 }, // 타슈켄트
  { id: "ghana", name: "가나", code: "GHA", flag: "🇬🇭", latitude: 5.6037, longitude: -0.1870 }, // 아크라
  { id: "capeverde", name: "카보베르데", code: "CPV", flag: "🇨🇻", latitude: 14.9330, longitude: -23.5133 }, // 프라이아
];

/**
 * 국가 ID로 국가 정보 조회
 * @param id - 국가 ID
 * @returns 국가 정보 또는 undefined
 *
 * 사용 위치:
 * - GroupsTab: 경기 일정의 팀 정보 조회
 * - CountryModal: 국가 상세 정보 조회
 */
export const getCountryById = (id: string): Country | undefined => {
  return countries.find((c) => c.id === id);
};
