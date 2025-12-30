/**
 * 경기 데이터
 *
 * 용도: 2026 FIFA 월드컵 조별 경기 일정 정보 저장
 * - 각 조(A~L)의 참가국 및 경기 일정
 * - 경기 날짜, 시간, 대전 팀, 경기장 정보
 *
 * 사용 위치:
 * - GroupsTab: 조별 경기 정보 표시
 *
 * 참고: 나무위키 2026 FIFA 월드컵 조 추첨 정보 기준
 */

/**
 * 경기 정보 인터페이스
 */
export interface Match {
  id: string; // 경기 고유 ID (예: "A1", "A2")
  date: string; // 경기 날짜 (YYYY-MM-DD 형식)
  time: string; // 경기 시간 (HH:MM 형식)
  team1: string; // 팀1 국가 ID (countries.ts의 id 참조)
  team2: string; // 팀2 국가 ID (countries.ts의 id 참조)
  stadium: string; // 경기장 ID (stadiums.ts의 id 참조)
}

/**
 * 조 정보 인터페이스
 */
export interface Group {
  id: string; // 조 ID (A~L)
  name: string; // 조 이름 (예: "조 A")
  countries: string[]; // 참가국 ID 배열 (countries.ts의 id 참조)
  matches: Match[]; // 경기 일정 배열 (각 조당 6경기)
}

export const groups: Group[] = [
  {
    id: "A",
    name: "A조",
    countries: ["mexico", "southafrica", "southkorea", "playoff_europe_d"], // 멕시코, 남아프리카공화국, 대한민국, 유럽 플레이오프 D조 승자
    matches: [
      {
        id: "A1",
        date: "2026-06-11",
        time: "20:00",
        team1: "mexico",
        team2: "southafrica",
        stadium: "azteca",
      },
      {
        id: "A2",
        date: "2026-06-12",
        time: "14:00",
        team1: "southkorea",
        team2: "playoff_europe_d",
        stadium: "metlife",
      },
      {
        id: "A3",
        date: "2026-06-17",
        time: "17:00",
        team1: "mexico",
        team2: "southkorea",
        stadium: "bbva",
      },
      {
        id: "A4",
        date: "2026-06-18",
        time: "20:00",
        team1: "southafrica",
        team2: "playoff_europe_d",
        stadium: "akron",
      },
      {
        id: "A5",
        date: "2026-06-23",
        time: "20:00",
        team1: "mexico",
        team2: "playoff_europe_d",
        stadium: "azteca",
      },
      {
        id: "A6",
        date: "2026-06-23",
        time: "20:00",
        team1: "southafrica",
        team2: "southkorea",
        stadium: "sofi",
      },
    ],
  },
  {
    id: "B",
    name: "B조",
    countries: ["canada", "playoff_europe_a", "qatar", "switzerland"], // 캐나다, 유럽 플레이오프 A조 승자, 카타르, 스위스
    matches: [
      {
        id: "B1",
        date: "2026-06-12",
        time: "20:00",
        team1: "canada",
        team2: "playoff_europe_a",
        stadium: "bmo",
      },
      {
        id: "B2",
        date: "2026-06-13",
        time: "14:00",
        team1: "qatar",
        team2: "switzerland",
        stadium: "bcplace",
      },
      {
        id: "B3",
        date: "2026-06-18",
        time: "17:00",
        team1: "canada",
        team2: "qatar",
        stadium: "bmo",
      },
      {
        id: "B4",
        date: "2026-06-19",
        time: "20:00",
        team1: "playoff_europe_a",
        team2: "switzerland",
        stadium: "metlife",
      },
      {
        id: "B5",
        date: "2026-06-24",
        time: "20:00",
        team1: "canada",
        team2: "switzerland",
        stadium: "bcplace",
      },
      {
        id: "B6",
        date: "2026-06-24",
        time: "20:00",
        team1: "playoff_europe_a",
        team2: "qatar",
        stadium: "lumen",
      },
    ],
  },
  {
    id: "C",
    name: "C조",
    countries: ["brazil", "morocco", "haiti", "scotland"], // 브라질, 모로코, 아이티, 스코틀랜드
    matches: [
      {
        id: "C1",
        date: "2026-06-13",
        time: "20:00",
        team1: "brazil",
        team2: "morocco",
        stadium: "mercedes",
      },
      {
        id: "C2",
        date: "2026-06-14",
        time: "14:00",
        team1: "haiti",
        team2: "scotland",
        stadium: "hardrock",
      },
      {
        id: "C3",
        date: "2026-06-19",
        time: "17:00",
        team1: "brazil",
        team2: "haiti",
        stadium: "nrg",
      },
      {
        id: "C4",
        date: "2026-06-20",
        time: "20:00",
        team1: "morocco",
        team2: "scotland",
        stadium: "lumen",
      },
      {
        id: "C5",
        date: "2026-06-25",
        time: "20:00",
        team1: "brazil",
        team2: "scotland",
        stadium: "att",
      },
      {
        id: "C6",
        date: "2026-06-25",
        time: "20:00",
        team1: "morocco",
        team2: "haiti",
        stadium: "arrowhead",
      },
    ],
  },
  {
    id: "D",
    name: "D조",
    countries: ["usa", "paraguay", "australia", "playoff_europe_c"], // 미국, 파라과이, 호주, 유럽 플레이오프 C조 승자
    matches: [
      {
        id: "D1",
        date: "2026-06-14",
        time: "20:00",
        team1: "usa",
        team2: "paraguay",
        stadium: "metlife",
      },
      {
        id: "D2",
        date: "2026-06-15",
        time: "14:00",
        team1: "australia",
        team2: "playoff_europe_c",
        stadium: "sofi",
      },
      {
        id: "D3",
        date: "2026-06-20",
        time: "17:00",
        team1: "usa",
        team2: "australia",
        stadium: "gillette",
      },
      {
        id: "D4",
        date: "2026-06-21",
        time: "20:00",
        team1: "paraguay",
        team2: "playoff_europe_c",
        stadium: "arrowhead",
      },
      {
        id: "D5",
        date: "2026-06-26",
        time: "20:00",
        team1: "usa",
        team2: "playoff_europe_c",
        stadium: "lincoln",
      },
      {
        id: "D6",
        date: "2026-06-26",
        time: "20:00",
        team1: "paraguay",
        team2: "australia",
        stadium: "nrg",
      },
    ],
  },
  {
    id: "E",
    name: "E조",
    countries: ["germany", "curacao", "ivorycoast", "ecuador"], // 독일, 퀴라소, 코트디부아르, 에콰도르
    matches: [
      {
        id: "E1",
        date: "2026-06-15",
        time: "20:00",
        team1: "germany",
        team2: "curacao",
        stadium: "lumen",
      },
      {
        id: "E2",
        date: "2026-06-16",
        time: "14:00",
        team1: "ivorycoast",
        team2: "ecuador",
        stadium: "mercedes",
      },
      {
        id: "E3",
        date: "2026-06-21",
        time: "17:00",
        team1: "germany",
        team2: "ivorycoast",
        stadium: "gillette",
      },
      {
        id: "E4",
        date: "2026-06-22",
        time: "20:00",
        team1: "curacao",
        team2: "ecuador",
        stadium: "hardrock",
      },
      {
        id: "E5",
        date: "2026-06-27",
        time: "20:00",
        team1: "germany",
        team2: "ecuador",
        stadium: "metlife",
      },
      {
        id: "E6",
        date: "2026-06-27",
        time: "20:00",
        team1: "curacao",
        team2: "ivorycoast",
        stadium: "levis",
      },
    ],
  },
  {
    id: "F",
    name: "F조",
    countries: ["netherlands", "japan", "playoff_europe_b", "tunisia"], // 네덜란드, 일본, 유럽 플레이오프 B조 승자, 튀니지
    matches: [
      {
        id: "F1",
        date: "2026-06-16",
        time: "20:00",
        team1: "netherlands",
        team2: "japan",
        stadium: "sofi",
      },
      {
        id: "F2",
        date: "2026-06-17",
        time: "14:00",
        team1: "playoff_europe_b",
        team2: "tunisia",
        stadium: "att",
      },
      {
        id: "F3",
        date: "2026-06-22",
        time: "17:00",
        team1: "netherlands",
        team2: "playoff_europe_b",
        stadium: "metlife",
      },
      {
        id: "F4",
        date: "2026-06-23",
        time: "20:00",
        team1: "japan",
        team2: "tunisia",
        stadium: "levis",
      },
      {
        id: "F5",
        date: "2026-06-28",
        time: "20:00",
        team1: "netherlands",
        team2: "tunisia",
        stadium: "gillette",
      },
      {
        id: "F6",
        date: "2026-06-28",
        time: "20:00",
        team1: "japan",
        team2: "playoff_europe_b",
        stadium: "lincoln",
      },
    ],
  },
  {
    id: "G",
    name: "G조",
    countries: ["belgium", "egypt", "iran", "newzealand"], // 벨기에, 이집트, 이란, 뉴질랜드
    matches: [
      {
        id: "G1",
        date: "2026-06-17",
        time: "20:00",
        team1: "belgium",
        team2: "egypt",
        stadium: "lincoln",
      },
      {
        id: "G2",
        date: "2026-06-18",
        time: "14:00",
        team1: "iran",
        team2: "newzealand",
        stadium: "arrowhead",
      },
      {
        id: "G3",
        date: "2026-06-23",
        time: "17:00",
        team1: "belgium",
        team2: "iran",
        stadium: "mercedes",
      },
      {
        id: "G4",
        date: "2026-06-24",
        time: "20:00",
        team1: "egypt",
        team2: "newzealand",
        stadium: "nrg",
      },
      {
        id: "G5",
        date: "2026-06-29",
        time: "20:00",
        team1: "belgium",
        team2: "newzealand",
        stadium: "hardrock",
      },
      {
        id: "G6",
        date: "2026-06-29",
        time: "20:00",
        team1: "egypt",
        team2: "iran",
        stadium: "gillette",
      },
    ],
  },
  {
    id: "H",
    name: "H조",
    countries: ["spain", "capeverde", "saudiarabia", "uruguay"], // 스페인, 카보베르데, 사우디아라비아, 우루과이
    matches: [
      {
        id: "H1",
        date: "2026-06-18",
        time: "20:00",
        team1: "spain",
        team2: "capeverde",
        stadium: "metlife",
      },
      {
        id: "H2",
        date: "2026-06-19",
        time: "14:00",
        team1: "saudiarabia",
        team2: "uruguay",
        stadium: "sofi",
      },
      {
        id: "H3",
        date: "2026-06-24",
        time: "17:00",
        team1: "spain",
        team2: "saudiarabia",
        stadium: "att",
      },
      {
        id: "H4",
        date: "2026-06-25",
        time: "20:00",
        team1: "capeverde",
        team2: "uruguay",
        stadium: "levis",
      },
      {
        id: "H5",
        date: "2026-06-30",
        time: "20:00",
        team1: "spain",
        team2: "uruguay",
        stadium: "lincoln",
      },
      {
        id: "H6",
        date: "2026-06-30",
        time: "20:00",
        team1: "capeverde",
        team2: "saudiarabia",
        stadium: "arrowhead",
      },
    ],
  },
  {
    id: "I",
    name: "I조",
    countries: ["france", "senegal", "playoff_fifa_2", "norway"], // 프랑스, 세네갈, FIFA 플레이오프 2조 승자, 노르웨이
    matches: [
      {
        id: "I1",
        date: "2026-06-19",
        time: "20:00",
        team1: "france",
        team2: "senegal",
        stadium: "gillette",
      },
      {
        id: "I2",
        date: "2026-06-20",
        time: "14:00",
        team1: "playoff_fifa_2",
        team2: "norway",
        stadium: "lincoln",
      },
      {
        id: "I3",
        date: "2026-06-25",
        time: "17:00",
        team1: "france",
        team2: "playoff_fifa_2",
        stadium: "metlife",
      },
      {
        id: "I4",
        date: "2026-06-26",
        time: "20:00",
        team1: "senegal",
        team2: "norway",
        stadium: "mercedes",
      },
      {
        id: "I5",
        date: "2026-07-01",
        time: "20:00",
        team1: "france",
        team2: "norway",
        stadium: "sofi",
      },
      {
        id: "I6",
        date: "2026-07-01",
        time: "20:00",
        team1: "senegal",
        team2: "playoff_fifa_2",
        stadium: "att",
      },
    ],
  },
  {
    id: "J",
    name: "J조",
    countries: ["argentina", "algeria", "austria", "jordan"], // 아르헨티나, 알제리, 오스트리아, 요르단
    matches: [
      {
        id: "J1",
        date: "2026-06-20",
        time: "20:00",
        team1: "argentina",
        team2: "algeria",
        stadium: "hardrock",
      },
      {
        id: "J2",
        date: "2026-06-21",
        time: "14:00",
        team1: "austria",
        team2: "jordan",
        stadium: "gillette",
      },
      {
        id: "J3",
        date: "2026-06-26",
        time: "17:00",
        team1: "argentina",
        team2: "austria",
        stadium: "lincoln",
      },
      {
        id: "J4",
        date: "2026-06-27",
        time: "20:00",
        team1: "algeria",
        team2: "jordan",
        stadium: "nrg",
      },
      {
        id: "J5",
        date: "2026-07-02",
        time: "20:00",
        team1: "argentina",
        team2: "jordan",
        stadium: "metlife",
      },
      {
        id: "J6",
        date: "2026-07-02",
        time: "20:00",
        team1: "algeria",
        team2: "austria",
        stadium: "arrowhead",
      },
    ],
  },
  {
    id: "K",
    name: "K조",
    countries: ["portugal", "playoff_fifa_1", "uzbekistan", "colombia"], // 포르투갈, FIFA 플레이오프 1조 승자, 우즈베키스탄, 콜롬비아
    matches: [
      {
        id: "K1",
        date: "2026-06-21",
        time: "20:00",
        team1: "portugal",
        team2: "playoff_fifa_1",
        stadium: "levis",
      },
      {
        id: "K2",
        date: "2026-06-22",
        time: "14:00",
        team1: "uzbekistan",
        team2: "colombia",
        stadium: "sofi",
      },
      {
        id: "K3",
        date: "2026-06-27",
        time: "17:00",
        team1: "portugal",
        team2: "uzbekistan",
        stadium: "gillette",
      },
      {
        id: "K4",
        date: "2026-06-28",
        time: "20:00",
        team1: "playoff_fifa_1",
        team2: "colombia",
        stadium: "lincoln",
      },
      {
        id: "K5",
        date: "2026-07-03",
        time: "20:00",
        team1: "portugal",
        team2: "colombia",
        stadium: "metlife",
      },
      {
        id: "K6",
        date: "2026-07-03",
        time: "20:00",
        team1: "playoff_fifa_1",
        team2: "uzbekistan",
        stadium: "mercedes",
      },
    ],
  },
  {
    id: "L",
    name: "L조",
    countries: ["england", "croatia", "ghana", "panama"], // 잉글랜드, 크로아티아, 가나, 파나마
    matches: [
      {
        id: "L1",
        date: "2026-06-22",
        time: "20:00",
        team1: "england",
        team2: "croatia",
        stadium: "metlife",
      },
      {
        id: "L2",
        date: "2026-06-23",
        time: "14:00",
        team1: "ghana",
        team2: "panama",
        stadium: "hardrock",
      },
      {
        id: "L3",
        date: "2026-06-28",
        time: "17:00",
        team1: "england",
        team2: "ghana",
        stadium: "gillette",
      },
      {
        id: "L4",
        date: "2026-06-29",
        time: "20:00",
        team1: "croatia",
        team2: "panama",
        stadium: "lincoln",
      },
      {
        id: "L5",
        date: "2026-07-04",
        time: "20:00",
        team1: "england",
        team2: "panama",
        stadium: "sofi",
      },
      {
        id: "L6",
        date: "2026-07-04",
        time: "20:00",
        team1: "croatia",
        team2: "ghana",
        stadium: "att",
      },
    ],
  },
];

export const getGroupById = (id: string): Group | undefined => {
  return groups.find((g) => g.id === id);
};
