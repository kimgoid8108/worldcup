/**
 * 국가 데이터 - UI 전용 매핑 테이블
 *
 * ⚠️ 중요: 이 파일은 UI 표시용 번역 테이블입니다.
 * - API 매칭은 절대 이 파일을 사용하지 않습니다.
 * - API 매칭은 team.id(number) 기반으로만 수행됩니다.
 * - countryId, countryName 문자열 기반 매칭은 사용하지 않습니다.
 *
 * 용도:
 * - team.name (영문) → 한글 이름 변환 (UI 표시용)
 * - team.name (영문) → 국기 이모지 변환 (UI 표시용)
 * - team.id → 동적 country 정보 생성
 */

export interface Country {
  teamId: number; // API team.id (필수, 유일한 식별자)
  nameKo: string; // 한글 국가명 (UI 표시용)
  nameEn: string; // 영문 국가명 (API team.name과 매칭용)
  flagEmoji: string; // 국기 이모지
  flagImageUrl?: string; // 국기 SVG 이미지 URL (이모지가 없을 때 사용)
  // 하위 호환성을 위한 필드 (기존 코드와의 호환성)
  id?: string; // 국가 고유 ID (groups.ts에서 참조, 선택적)
  code?: string; // 국가 코드 (ISO 3자리 코드, 선택적)
  latitude?: number; // 수도 위도 (선택적)
  longitude?: number; // 수도 경도 (선택적)
}

/**
 * 영문 국가명 → 한글/국기 매핑 테이블
 * ⚠️ 중요: teamId는 여기에 없습니다. API에서 받은 team.id를 사용합니다.
 */
const countryNameMapping: Record<string, Omit<Country, "teamId">> = {
  "United States": { nameKo: "미국", nameEn: "United States", flagEmoji: "🇺🇸" },
  Canada: { nameKo: "캐나다", nameEn: "Canada", flagEmoji: "🇨🇦" },
  Mexico: { nameKo: "멕시코", nameEn: "Mexico", flagEmoji: "🇲🇽" },
  Brazil: { nameKo: "브라질", nameEn: "Brazil", flagEmoji: "🇧🇷" },
  Argentina: { nameKo: "아르헨티나", nameEn: "Argentina", flagEmoji: "🇦🇷" },
  France: { nameKo: "프랑스", nameEn: "France", flagEmoji: "🇫🇷" },
  England: { nameKo: "잉글랜드", nameEn: "England", flagEmoji: "🏴", flagImageUrl: "https://flagcdn.com/w40/gb-eng.svg" },
  Spain: { nameKo: "스페인", nameEn: "Spain", flagEmoji: "🇪🇸" },
  Germany: { nameKo: "독일", nameEn: "Germany", flagEmoji: "🇩🇪" },
  Italy: { nameKo: "이탈리아", nameEn: "Italy", flagEmoji: "🇮🇹" },
  Portugal: { nameKo: "포르투갈", nameEn: "Portugal", flagEmoji: "🇵🇹" },
  Netherlands: { nameKo: "네덜란드", nameEn: "Netherlands", flagEmoji: "🇳🇱" },
  Japan: { nameKo: "일본", nameEn: "Japan", flagEmoji: "🇯🇵" },
  "South Korea": { nameKo: "대한민국", nameEn: "South Korea", flagEmoji: "🇰🇷" },
  Morocco: { nameKo: "모로코", nameEn: "Morocco", flagEmoji: "🇲🇦" },
  Senegal: { nameKo: "세네갈", nameEn: "Senegal", flagEmoji: "🇸🇳" },
  Egypt: { nameKo: "이집트", nameEn: "Egypt", flagEmoji: "🇪🇬" },
  Australia: { nameKo: "호주", nameEn: "Australia", flagEmoji: "🇦🇺" },
  Uruguay: { nameKo: "우루과이", nameEn: "Uruguay", flagEmoji: "🇺🇾" },
  Colombia: { nameKo: "콜롬비아", nameEn: "Colombia", flagEmoji: "🇨🇴" },
  Ecuador: { nameKo: "에콰도르", nameEn: "Ecuador", flagEmoji: "🇪🇨" },
  Croatia: { nameKo: "크로아티아", nameEn: "Croatia", flagEmoji: "🇭🇷" },
  Belgium: { nameKo: "벨기에", nameEn: "Belgium", flagEmoji: "🇧🇪" },
  Switzerland: { nameKo: "스위스", nameEn: "Switzerland", flagEmoji: "🇨🇭" },
  Denmark: { nameKo: "덴마크", nameEn: "Denmark", flagEmoji: "🇩🇰" },
  Poland: { nameKo: "폴란드", nameEn: "Poland", flagEmoji: "🇵🇱" },
  Sweden: { nameKo: "스웨덴", nameEn: "Sweden", flagEmoji: "🇸🇪" },
  Norway: { nameKo: "노르웨이", nameEn: "Norway", flagEmoji: "🇳🇴" },
  Türkiye: { nameKo: "튀르키예", nameEn: "Türkiye", flagEmoji: "🇹🇷" },
  Iran: { nameKo: "이란", nameEn: "Iran", flagEmoji: "🇮🇷" },
  "Saudi Arabia": { nameKo: "사우디아라비아", nameEn: "Saudi Arabia", flagEmoji: "🇸🇦" },
  Qatar: { nameKo: "카타르", nameEn: "Qatar", flagEmoji: "🇶🇦" },
  "New Zealand": { nameKo: "뉴질랜드", nameEn: "New Zealand", flagEmoji: "🇳🇿" },
  Panama: { nameKo: "파나마", nameEn: "Panama", flagEmoji: "🇵🇦" },
  Jamaica: { nameKo: "자메이카", nameEn: "Jamaica", flagEmoji: "🇯🇲" },
  "South Africa": { nameKo: "남아프리카공화국", nameEn: "South Africa", flagEmoji: "🇿🇦" },
  Haiti: { nameKo: "아이티", nameEn: "Haiti", flagEmoji: "🇭🇹" },
  Scotland: { nameKo: "스코틀랜드", nameEn: "Scotland", flagEmoji: "🏴", flagImageUrl: "https://flagcdn.com/w40/gb-sct.svg" },
  Paraguay: { nameKo: "파라과이", nameEn: "Paraguay", flagEmoji: "🇵🇾" },
  Curaçao: { nameKo: "퀴라소", nameEn: "Curaçao", flagEmoji: "🇨🇼" },
  "Ivory Coast": { nameKo: "코트디부아르", nameEn: "Ivory Coast", flagEmoji: "🇨🇮" },
  Tunisia: { nameKo: "튀니지", nameEn: "Tunisia", flagEmoji: "🇹🇳" },
  Algeria: { nameKo: "알제리", nameEn: "Algeria", flagEmoji: "🇩🇿" },
  Austria: { nameKo: "오스트리아", nameEn: "Austria", flagEmoji: "🇦🇹" },
  Jordan: { nameKo: "요르단", nameEn: "Jordan", flagEmoji: "🇯🇴" },
  Uzbekistan: { nameKo: "우즈베키스탄", nameEn: "Uzbekistan", flagEmoji: "🇺🇿" },
  Ghana: { nameKo: "가나", nameEn: "Ghana", flagEmoji: "🇬🇭" },
  "Cape Verde": { nameKo: "카보베르데", nameEn: "Cape Verde", flagEmoji: "🇨🇻" },
  // 플레이오프 참가국
  "North Macedonia": { nameKo: "북마케도니아", nameEn: "North Macedonia", flagEmoji: "🇲🇰" },
  "Czech Republic": { nameKo: "체코", nameEn: "Czech Republic", flagEmoji: "🇨🇿" },
  Ireland: { nameKo: "아일랜드", nameEn: "Ireland", flagEmoji: "🇮🇪" },
  "Northern Ireland": { nameKo: "북아일랜드", nameEn: "Northern Ireland", flagEmoji: "🏴", flagImageUrl: "https://flagcdn.com/w40/gb-nir.svg" },
  Wales: { nameKo: "웨일스", nameEn: "Wales", flagEmoji: "🏴", flagImageUrl: "https://flagcdn.com/w40/gb-wls.svg" },
  "Bosnia and Herzegovina": { nameKo: "보스니아 헤르체고비나", nameEn: "Bosnia and Herzegovina", flagEmoji: "🇧🇦" },
  Romania: { nameKo: "루마니아", nameEn: "Romania", flagEmoji: "🇷🇴" },
  Slovakia: { nameKo: "슬로바키아", nameEn: "Slovakia", flagEmoji: "🇸🇰" },
  Kosovo: { nameKo: "코소보", nameEn: "Kosovo", flagEmoji: "🇽🇰", flagImageUrl: "https://flagcdn.com/w40/xk.svg" },
  Ukraine: { nameKo: "우크라이나", nameEn: "Ukraine", flagEmoji: "🇺🇦" },
  Albania: { nameKo: "알바니아", nameEn: "Albania", flagEmoji: "🇦🇱" },
  Bolivia: { nameKo: "볼리비아", nameEn: "Bolivia", flagEmoji: "🇧🇴" },
  Suriname: { nameKo: "수리남", nameEn: "Suriname", flagEmoji: "🇸🇷" },
  Iraq: { nameKo: "이라크", nameEn: "Iraq", flagEmoji: "🇮🇶" },
  "New Caledonia": { nameKo: "누벨칼레도니", nameEn: "New Caledonia", flagEmoji: "🇳🇨" },
  "DR Congo": { nameKo: "콩고민주공화국", nameEn: "DR Congo", flagEmoji: "🇨🇩" },
};

/**
 * 하위 호환성: 기존 countries 배열 (id 기반 조회용)
 * ⚠️ 경고: 이 배열은 하위 호환성을 위해 유지됩니다.
 * 새로운 코드에서는 getCountryByTeamId를 사용하세요.
 */
export const countries: Country[] = [];

/**
 * API team.id와 team.name을 기반으로 Country 객체 생성
 *
 * ⚠️ 중요: 이 함수는 API 데이터를 기반으로 동적으로 Country를 생성합니다.
 *
 * @param teamId - API team.id (number)
 * @param teamName - API team.name (영문, string)
 * @returns Country 객체 또는 undefined (매칭 실패 시)
 */
export function createCountryFromTeam(teamId: number | null | undefined, teamName: string | undefined): Country | undefined {
  if (!teamId || teamId === 0 || !teamName) {
    return undefined;
  }

  // 영문 이름으로 매핑 테이블에서 찾기
  const mapping = countryNameMapping[teamName];
  if (!mapping) {
    console.warn("[createCountryFromTeam] 매핑 실패 - 영문 이름을 찾을 수 없음", { teamId, teamName });
    return undefined;
  }

  // ISO 코드 조회
  const code = nameEnToCodeMapping[teamName];

  return {
    teamId,
    ...mapping,
    code: code,
  };
}

/**
 * API teams 배열을 기반으로 countries 배열 생성
 *
 * ⚠️ 중요: 이 함수는 API 데이터를 기반으로 동적으로 countries 배열을 생성합니다.
 *
 * @param teams - API에서 받은 FrontTeam 배열
 * @returns Country 배열
 */
export function createCountriesFromTeams(teams: Array<{ id: number | null; name: string }>): Country[] {
  const countriesList: Country[] = [];

  for (const team of teams) {
    if (!team.id || team.id === 0 || !team.name) {
      continue;
    }

    const country = createCountryFromTeam(team.id, team.name);
    if (country) {
      countriesList.push(country);
    }
  }

  return countriesList;
}

/**
 * team.id로 국가 정보 조회 (UI 전용)
 *
 * ⚠️ 중요: 이 함수는 동적으로 생성된 countries 배열을 사용합니다.
 * API teams 데이터를 먼저 로드한 후 사용해야 합니다.
 *
 * @param teamId - API team.id (number)
 * @param countriesList - 동적으로 생성된 countries 배열 (선택적)
 * @returns 국가 정보 또는 undefined
 */
export const getCountryByTeamId = (teamId: number | null | undefined, countriesList?: Country[]): Country | undefined => {
  if (teamId === null || teamId === undefined || teamId === 0) {
    return undefined;
  }

  // countriesList가 제공되면 사용, 없으면 빈 배열에서 찾기 (항상 undefined 반환)
  const searchList = countriesList || countries;
  return searchList.find((c) => c.teamId === teamId);
};

/**
 * team.id로 한글 국가명 조회 (UI 전용)
 *
 * @param teamId - API team.id (number)
 * @param countriesList - 동적으로 생성된 countries 배열 (선택적)
 * @returns 한글 국가명 또는 undefined
 */
export const getKoreanNameByTeamId = (teamId: number | null | undefined, countriesList?: Country[]): string | undefined => {
  const country = getCountryByTeamId(teamId, countriesList);
  return country?.nameKo;
};

/**
 * team.id로 영문 국가명 조회 (UI 전용)
 *
 * @param teamId - API team.id (number)
 * @param countriesList - 동적으로 생성된 countries 배열 (선택적)
 * @returns 영문 국가명 또는 undefined
 */
export const getEnglishNameByTeamId = (teamId: number | null | undefined, countriesList?: Country[]): string | undefined => {
  const country = getCountryByTeamId(teamId, countriesList);
  return country?.nameEn;
};

/**
 * 언어에 따라 국가 이름 반환 (UI 전용)
 *
 * @param country - Country 객체
 * @param language - 언어 ("ko" | "en")
 * @returns 언어에 맞는 국가명 또는 undefined
 */
export const getCountryNameByLanguage = (country: Country | undefined, language: "ko" | "en"): string | undefined => {
  if (!country) return undefined;
  return language === "ko" ? country.nameKo : country.nameEn;
};

/**
 * countryId로 언어에 따라 국가 이름 반환 (UI 전용)
 *
 * @param countryId - 국가 ID (string)
 * @param language - 언어 ("ko" | "en")
 * @returns 언어에 맞는 국가명 또는 undefined
 */
export const getCountryNameByIdAndLanguage = (countryId: string, language: "ko" | "en"): string | undefined => {
  const country = getCountryById(countryId);
  if (!country) return undefined;
  return language === "ko" ? country.nameKo : country.nameEn;
};

/**
 * countryId(string) → nameEn(string) 매핑 테이블
 * ⚠️ 중요: pots.ts의 countryId를 nameEn으로 변환하기 위한 매핑입니다.
 */
const countryIdToNameEnMapping: Record<string, string> = {
  usa: "United States",
  canada: "Canada",
  mexico: "Mexico",
  brazil: "Brazil",
  argentina: "Argentina",
  france: "France",
  england: "England",
  spain: "Spain",
  germany: "Germany",
  italy: "Italy",
  portugal: "Portugal",
  netherlands: "Netherlands",
  japan: "Japan",
  southkorea: "South Korea",
  morocco: "Morocco",
  senegal: "Senegal",
  egypt: "Egypt",
  australia: "Australia",
  uruguay: "Uruguay",
  colombia: "Colombia",
  ecuador: "Ecuador",
  croatia: "Croatia",
  belgium: "Belgium",
  switzerland: "Switzerland",
  denmark: "Denmark",
  poland: "Poland",
  sweden: "Sweden",
  norway: "Norway",
  turkiye: "Türkiye",
  iran: "Iran",
  saudiarabia: "Saudi Arabia",
  qatar: "Qatar",
  newzealand: "New Zealand",
  panama: "Panama",
  jamaica: "Jamaica",
  southafrica: "South Africa",
  haiti: "Haiti",
  scotland: "Scotland",
  paraguay: "Paraguay",
  curacao: "Curaçao",
  ivorycoast: "Ivory Coast",
  tunisia: "Tunisia",
  algeria: "Algeria",
  austria: "Austria",
  jordan: "Jordan",
  uzbekistan: "Uzbekistan",
  ghana: "Ghana",
  capeverde: "Cape Verde",
  northmacedonia: "North Macedonia",
  czechrepublic: "Czech Republic",
  ireland: "Ireland",
  northernireland: "Northern Ireland",
  wales: "Wales",
  bosnia: "Bosnia and Herzegovina",
  romania: "Romania",
  slovakia: "Slovakia",
  kosovo: "Kosovo",
  ukraine: "Ukraine",
  albania: "Albania",
  bolivia: "Bolivia",
  suriname: "Suriname",
  iraq: "Iraq",
  newcaledonia: "New Caledonia",
  congodr: "DR Congo",
};

/**
 * countryId로 nameEn 조회
 *
 * @param countryId - 국가 ID (string, pots.ts에서 사용)
 * @returns 영문 국가명 또는 undefined
 */
export const getNameEnByCountryId = (countryId: string): string | undefined => {
  return countryIdToNameEnMapping[countryId];
};

/**
 * nameEn → ISO 3166-1 alpha-3 코드 매핑 테이블
 * Flag 컴포넌트에서 flagcdn.com 이미지 URL 생성용
 */
const nameEnToCodeMapping: Record<string, string> = {
  "United States": "USA",
  Canada: "CAN",
  Mexico: "MEX",
  Brazil: "BRA",
  Argentina: "ARG",
  France: "FRA",
  England: "ENG",
  Spain: "ESP",
  Germany: "GER",
  Italy: "ITA",
  Portugal: "POR",
  Netherlands: "NED",
  Japan: "JPN",
  "South Korea": "KOR",
  Morocco: "MAR",
  Senegal: "SEN",
  Egypt: "EGY",
  Australia: "AUS",
  Uruguay: "URU",
  Colombia: "COL",
  Ecuador: "ECU",
  Croatia: "CRO",
  Belgium: "BEL",
  Switzerland: "SUI",
  Denmark: "DEN",
  Poland: "POL",
  Sweden: "SWE",
  Norway: "NOR",
  Türkiye: "TUR",
  Iran: "IRN",
  "Saudi Arabia": "KSA",
  Qatar: "QAT",
  "New Zealand": "NZL",
  Panama: "PAN",
  Jamaica: "JAM",
  "South Africa": "RSA",
  Haiti: "HAI",
  Scotland: "SCO",
  Paraguay: "PAR",
  Curaçao: "CUW",
  "Ivory Coast": "CIV",
  Tunisia: "TUN",
  Algeria: "DZA",
  Austria: "AUT",
  Jordan: "JOR",
  Uzbekistan: "UZB",
  Ghana: "GHA",
  "Cape Verde": "CPV",
  "North Macedonia": "MKD",
  "Czech Republic": "CZE",
  Ireland: "IRL",
  "Northern Ireland": "NIR",
  Wales: "WAL",
  "Bosnia and Herzegovina": "BIH",
  Romania: "ROU",
  Slovakia: "SVK",
  Kosovo: "XKX",
  Ukraine: "UKR",
  Albania: "ALB",
  Bolivia: "BOL",
  Suriname: "SUR",
  Iraq: "IRQ",
  "New Caledonia": "NCL",
  "DR Congo": "COD",
};

/**
 * team.name (영문)으로 국가 정보 조회
 *
 * @param teamName - team.name (영문, 예: "United States", "South Korea")
 * @returns 국가 정보 또는 undefined
 */
export const getCountryByTeamName = (teamName: string): { nameEn?: string; nameKo?: string; flagEmoji?: string; flagImageUrl?: string; code?: string } | undefined => {
  if (!teamName) {
    return undefined;
  }

  // team.name을 직접 countryNameMapping에서 찾기
  const mapping = countryNameMapping[teamName];
  if (!mapping) {
    return undefined;
  }

  // ISO 코드 조회
  const code = nameEnToCodeMapping[teamName];

  return {
    nameEn: mapping.nameEn,
    nameKo: mapping.nameKo,
    flagEmoji: mapping.flagEmoji,
    flagImageUrl: mapping.flagImageUrl,
    code: code,
  };
};

/**
 * 하위 호환성: countryId로 국가 정보 조회
 *
 * ⚠️ 경고: 이 함수는 하위 호환성을 위해 유지됩니다.
 * 새로운 코드에서는 getCountryByTeamId를 사용하세요.
 *
 * @param id - 국가 ID (string)
 * @returns 국가 정보 또는 undefined (nameEn만 포함하는 임시 객체)
 */
export const getCountryById = (id: string): { nameEn?: string; nameKo?: string; flagEmoji?: string; flagImageUrl?: string; code?: string } | undefined => {
  // countryId → nameEn 변환
  const nameEn = getNameEnByCountryId(id);
  if (!nameEn) {
    return undefined;
  }

  // nameEn으로 매핑 테이블에서 찾기
  const mapping = countryNameMapping[nameEn];
  if (!mapping) {
    return undefined;
  }

  // ISO 코드 조회
  const code = nameEnToCodeMapping[nameEn];

  // 임시 객체 반환 (teamId는 없음, nameEn만 사용)
  return {
    nameEn: mapping.nameEn,
    nameKo: mapping.nameKo,
    flagEmoji: mapping.flagEmoji,
    flagImageUrl: mapping.flagImageUrl,
    code: code,
  };
};
