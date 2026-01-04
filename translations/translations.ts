export type TranslationKey = 
  // 메인 페이지
  | "main.title"
  | "main.subtitle"
  | "main.matchSchedule"
  | "main.stadiumMap"
  | "main.participatingCountries"
  | "main.hostNations"
  | "main.stadiumCount"
  | "main.participatingCountriesCount"
  | "main.tournamentStart"
  | "main.majorStadiums"
  | "main.capacity"
  | "main.people"
  | "main.worldCup2026"
  | "main.next"
  | "main.roadTo2026"
  | "main.nations"
  | "main.hostCities"
  // 탭
  | "tabs.matchSchedule"
  | "tabs.stadiums"
  | "tabs.pots"
  | "tabs.fifaRankings"
  // 경기 일정
  | "groups.searchPlayersAndCountries"
  | "groups.searchByCountryName"
  | "groups.searchResults"
  | "groups.countries"
  | "groups.noSearchResults"
  | "groups.searchByCountryNameForMatch"
  | "groups.searchByDate"
  | "groups.resetDate"
  | "groups.fullMatchSchedule"
  | "groups.year"
  | "groups.month"
  | "groups.day"
  | "groups.weekdays"
  | "groups.squad"
  | "groups.playerList"
  | "groups.stadiumInfo"
  | "groups.stadiumName"
  | "groups.location"
  | "groups.capacity"
  | "groups.matchTime"
  | "groups.description"
  | "groups.vs"
  | "groups.noResults"
  // 포트
  | "pots.potTeams"
  | "pots.searchByTeamName"
  | "pots.noSearchResults"
  | "pots.loadingPlayers"
  | "pots.error"
  | "pots.noPlayers"
  | "pots.playerList"
  | "pots.teamInfoError"
  | "pots.playoffWinner"
  // 경기장
  | "stadiums.stadiumInfo"
  | "stadiums.searchPlaceholder"
  | "stadiums.stadiumMap"
  | "stadiums.mapDescription"
  | "stadiums.totalStadiums"
  | "stadiums.searchResults"
  | "stadiums.noSearchResults"
  // 공통
  | "common.close"
  | "common.search"
  | "common.loading"
  | "common.error"
  | "common.cancel"
  | "common.confirm"
  | "common.yes"
  | "common.no"
  // 언어 선택
  | "language.korean"
  | "language.english"
  | "language.selectLanguage"
  // FIFA 랭킹
  | "fifa.rankings"
  | "fifa.rank"
  | "fifa.country"
  | "fifa.currentPoints"
  | "fifa.previousPoints"
  | "fifa.change"
  | "fifa.more"
  | "fifa.searchByTeamName"
  | "fifa.allRankings"
  | "fifa.noResults"
  | "fifa.all"
  | "fifa.asia"
  | "fifa.europe"
  | "fifa.southamerica"
  | "fifa.northamerica"
  | "fifa.africa"
  | "fifa.oceania"
  | "fifa.ranking"
  | "fifa.rankShort"
  | "fifa.points"
  // 경기장
  | "stadium.capacity"
  | "stadium.people"
  | "stadium.viewer3d"
  | "stadium.description";

const translations: Record<string, Record<"ko" | "en", string>> = {
  // 메인 페이지
  "main.title": {
    ko: "2026 북중미 월드컵 경기장 & 데이터 플랫폼",
    en: "2026 North America World Cup Stadium & Data Platform",
  },
  "main.subtitle": {
    ko: "경기장, 국가, 선수 정보를 지도와 3D 모델로 한눈에 확인하세요.",
    en: "View stadium, country, and player information at a glance with maps and 3D models.",
  },
  "main.matchSchedule": {
    ko: "경기 일정",
    en: "Match Schedule",
  },
  "main.stadiumMap": {
    ko: "경기장 지도 보기",
    en: "View Stadium Map",
  },
  "main.participatingCountries": {
    ko: "참가 국가",
    en: "Participating Countries",
  },
  "main.hostNations": {
    ko: "개최국",
    en: "Host Nations",
  },
  "main.stadiumCount": {
    ko: "경기장 수",
    en: "Stadiums",
  },
  "main.participatingCountriesCount": {
    ko: "참가국",
    en: "Participants",
  },
  "main.tournamentStart": {
    ko: "대회 시작",
    en: "Tournament Start",
  },
  "main.majorStadiums": {
    ko: "주요 경기장",
    en: "Major Stadiums",
  },
  "main.capacity": {
    ko: "수용 인원",
    en: "Capacity",
  },
  "main.people": {
    ko: "명",
    en: "people",
  },
  "main.worldCup2026": {
    ko: "2026 북중미 월드컵",
    en: "2026 North America World Cup",
  },
  "main.next": {
    ko: "다음",
    en: "Next",
  },
  "main.roadTo2026": {
    ko: "Road to 2026",
    en: "Road to 2026",
  },
  "main.nations": {
    ko: " Nations",
    en: " Nations",
  },
  "main.hostCities": {
    ko: " Host Cities",
    en: " Host Cities",
  },
  // 탭
  "tabs.matchSchedule": {
    ko: "경기 일정",
    en: "Match Schedule",
  },
  "tabs.stadiums": {
    ko: "경기장",
    en: "Stadiums",
  },
  "tabs.pots": {
    ko: "포트",
    en: "Pots",
  },
  "tabs.fifaRankings": {
    ko: "FIFA 랭킹 순위",
    en: "FIFA Rankings",
  },
  // 경기 일정
  "groups.searchPlayersAndCountries": {
    ko: "선수 및 국가 검색",
    en: "Search Players and Countries",
  },
  "groups.searchByCountryName": {
    ko: "국가 이름으로 검색...",
    en: "Search by country name...",
  },
  "groups.searchResults": {
    ko: "검색된 국가",
    en: "Search Results",
  },
  "groups.countries": {
    ko: "개)",
    en: " countries)",
  },
  "groups.noSearchResults": {
    ko: "검색 결과가 없습니다. 국가 이름으로 검색해주세요.",
    en: "No search results. Please search by country name.",
  },
  "groups.searchByCountryNameForMatch": {
    ko: "국가 이름으로 경기 검색",
    en: "Search matches by country name",
  },
  "groups.searchByDate": {
    ko: "날짜로 경기 검색",
    en: "Search matches by date",
  },
  "groups.resetDate": {
    ko: "날짜 초기화",
    en: "Reset Date",
  },
  "groups.fullMatchSchedule": {
    ko: "전체 경기 일정",
    en: "Full Match Schedule",
  },
  "groups.year": {
    ko: "년",
    en: "",
  },
  "groups.month": {
    ko: "월",
    en: "",
  },
  "groups.day": {
    ko: "일",
    en: "",
  },
  "groups.weekdays": {
    ko: "일월화수목금토",
    en: "SunMonTueWedThuFriSat",
  },
  "groups.squad": {
    ko: "스쿼드",
    en: "Squad",
  },
  "groups.playerList": {
    ko: "선수 명단",
    en: "Player List",
  },
  "groups.stadiumInfo": {
    ko: "경기장 정보",
    en: "Stadium Information",
  },
  "groups.stadiumName": {
    ko: "경기장명",
    en: "Stadium Name",
  },
  "groups.location": {
    ko: "위치",
    en: "Location",
  },
  "groups.capacity": {
    ko: "수용 인원",
    en: "Capacity",
  },
  "groups.matchTime": {
    ko: "경기 시간",
    en: "Match Time",
  },
  "groups.description": {
    ko: "설명",
    en: "Description",
  },
  "groups.vs": {
    ko: "VS",
    en: "VS",
  },
  "groups.noResults": {
    ko: "검색 결과가 없습니다.",
    en: "No search results.",
  },
  // 포트
  "pots.potTeams": {
    ko: "포트별 팀 정보",
    en: "Pot Teams Information",
  },
  "pots.searchByTeamName": {
    ko: "팀 이름으로 검색...",
    en: "Search by team name...",
  },
  "pots.noSearchResults": {
    ko: "검색 결과가 없습니다.",
    en: "No search results.",
  },
  "pots.loadingPlayers": {
    ko: "선수 명단을 불러오는 중...",
    en: "Loading player list...",
  },
  "pots.error": {
    ko: "⚠️ 오류 발생",
    en: "⚠️ Error",
  },
  "pots.noPlayers": {
    ko: "선수 명단이 없습니다.",
    en: "No player list available.",
  },
  "pots.playerList": {
    ko: "선수 명단",
    en: "Player List",
  },
  "pots.teamInfoError": {
    ko: "⚠️ 팀 정보를 불러올 수 없습니다",
    en: "⚠️ Unable to load team information",
  },
  "pots.playoffWinner": {
    ko: " 플레이오프 승자",
    en: " Playoff Winner",
  },
  // 경기장
  "stadiums.stadiumInfo": {
    ko: "경기장 정보",
    en: "Stadium Information",
  },
  "stadiums.searchPlaceholder": {
    ko: "경기장 이름, 도시, 국가로 검색...",
    en: "Search by stadium name, city, country...",
  },
  "stadiums.stadiumMap": {
    ko: "경기장 지도",
    en: "Stadium Map",
  },
  "stadiums.mapDescription": {
    ko: "지도에서 경기장 위치를 확인할 수 있습니다. 경기장 마커를 클릭하거나 아래 목록에서 경기장을 클릭하면 상세 정보를 볼 수 있습니다.",
    en: "You can check the stadium locations on the map. Click on a stadium marker or select a stadium from the list below to view detailed information.",
  },
  "stadiums.totalStadiums": {
    ko: "총",
    en: "Total",
  },
  "stadiums.searchResults": {
    ko: "개 경기장",
    en: " stadiums",
  },
  "stadiums.noSearchResults": {
    ko: "검색 결과가 없습니다.",
    en: "No search results.",
  },
  // 공통
  "common.close": {
    ko: "닫기",
    en: "Close",
  },
  "common.search": {
    ko: "검색",
    en: "Search",
  },
  "common.loading": {
    ko: "로딩 중...",
    en: "Loading...",
  },
  "common.error": {
    ko: "오류",
    en: "Error",
  },
  "common.cancel": {
    ko: "취소",
    en: "Cancel",
  },
  "common.confirm": {
    ko: "확인",
    en: "Confirm",
  },
  "common.yes": {
    ko: "예",
    en: "Yes",
  },
  "common.no": {
    ko: "아니오",
    en: "No",
  },
  // 언어 선택
  "language.korean": {
    ko: "한국어",
    en: "Korean",
  },
  "language.english": {
    ko: "English",
    en: "English",
  },
  "language.selectLanguage": {
    ko: "언어 선택",
    en: "Select Language",
  },
  // FIFA 랭킹
  "fifa.rankings": {
    ko: "FIFA 랭킹 순위",
    en: "FIFA Rankings",
  },
  "fifa.rank": {
    ko: "랭킹",
    en: "Rank",
  },
  "fifa.country": {
    ko: "국가",
    en: "Country",
  },
  "fifa.currentPoints": {
    ko: "현재 포인트",
    en: "Current Points",
  },
  "fifa.previousPoints": {
    ko: "이전 포인트",
    en: "Previous Points",
  },
  "fifa.change": {
    ko: "변동",
    en: "Change",
  },
  "fifa.more": {
    ko: "더보기",
    en: "More",
  },
  "fifa.searchByTeamName": {
    ko: "팀 이름으로 검색...",
    en: "Search by team name...",
  },
  "fifa.allRankings": {
    ko: "전체 랭킹 보기",
    en: "Show All Rankings",
  },
  "fifa.noResults": {
    ko: "검색 결과가 없습니다.",
    en: "No search results.",
  },
  "fifa.all": {
    ko: "전체",
    en: "All",
  },
  "fifa.asia": {
    ko: "아시아",
    en: "Asia",
  },
  "fifa.europe": {
    ko: "유럽",
    en: "Europe",
  },
  "fifa.southamerica": {
    ko: "남미",
    en: "South America",
  },
  "fifa.northamerica": {
    ko: "북중미",
    en: "North America",
  },
  "fifa.africa": {
    ko: "아프리카",
    en: "Africa",
  },
  "fifa.oceania": {
    ko: "오세아니아",
    en: "Oceania",
  },
  "fifa.ranking": {
    ko: "FIFA 랭킹",
    en: "FIFA Ranking",
  },
  "fifa.rankShort": {
    ko: "위",
    en: "",
  },
  "fifa.points": {
    ko: "점",
    en: "points",
  },
  // 경기장
  "stadium.capacity": {
    ko: "수용 인원",
    en: "Capacity",
  },
  "stadium.people": {
    ko: "명",
    en: "people",
  },
  "stadium.viewer3d": {
    ko: "3D 경기장 뷰어",
    en: "3D Stadium Viewer",
  },
  "stadium.description": {
    ko: "2026 북중미 월드컵 개최 경기장",
    en: "2026 North America World Cup Venue",
  },
};

export default translations;

