/**
 * 선수 데이터
 *
 * 용도: 각 국가별 선수 명단 정보 저장
 * - 선수 이름, 포지션, 나이, 소속 클럽
 * - 모든 선수 이름은 한글로 저장
 *
 * 사용 위치:
 * - CountryModal: 국가 상세 정보에서 선수 명단 표시
 */

import { type Player } from "@/types/player";

// Player 타입은 types/player.ts에서 import
// 이 파일에서는 Player 타입을 재정의하지 않고 import한 타입을 사용

/**
 * 국가별 선수 명단
 * 키: 국가 ID (countries.ts의 id와 매칭)
 * 값: 해당 국가의 선수 배열
 */
export const playersByCountry: Record<string, Player[]> = {
  usa: [
    { id: 1, name: "크리스티안 풀리시치", nameEn: "Christian Pulisic", position: "FW", age: 25, club: "AC Milan" },
    { id: 2, name: "웨스턴 맥케니", nameEn: "Weston McKennie", position: "MF", age: 25, club: "Juventus" },
    { id: 3, name: "타일러 아담스", nameEn: "Tyler Adams", position: "MF", age: 25, club: "Bournemouth" },
    { id: 4, name: "맷 터너", nameEn: "Matt Turner", position: "GK", age: 30, club: "Nottingham Forest" },
    { id: 5, name: "세르지뇨 데스트", nameEn: "Sergiño Dest", position: "DF", age: 23, club: "PSV" },
  ],
  canada: [
    { id: 1, name: "알폰소 데이비스", nameEn: "Alphonso Davies", position: "DF", age: 23, club: "Bayern Munich" },
    { id: 2, name: "조너선 데이비드", nameEn: "Jonathan David", position: "FW", age: 24, club: "Lille" },
    { id: 3, name: "카일 라린", nameEn: "Cyle Larin", position: "FW", age: 29, club: "Mallorca" },
    { id: 4, name: "밀란 보르잔", nameEn: "Milan Borjan", position: "GK", age: 36, club: "Red Star Belgrade" },
    { id: 5, name: "스티븐 유스타키오", nameEn: "Stephen Eustáquio", position: "MF", age: 27, club: "Porto" },
  ],
  mexico: [
    { id: 1, name: "히르빙 로사노", nameEn: "Hirving Lozano", position: "FW", age: 28, club: "PSV" },
    { id: 2, name: "라울 히메네스", nameEn: "Raúl Jiménez", position: "FW", age: 33, club: "Fulham" },
    { id: 3, name: "기예르모 오초아", nameEn: "Guillermo Ochoa", position: "GK", age: 38, club: "Salernitana" },
    { id: 4, name: "에드손 알바레스", nameEn: "Edson Álvarez", position: "MF", age: 26, club: "West Ham" },
    { id: 5, name: "헤수스 코로나", nameEn: "Jesús Corona", position: "FW", age: 31, club: "Sevilla" },
  ],
  brazil: [
    { id: 1, name: "네이마르", nameEn: "Neymar", position: "FW", age: 32, club: "Al-Hilal" },
    { id: 2, name: "비니시우스 주니오르", nameEn: "Vinícius Júnior", position: "FW", age: 24, club: "Real Madrid" },
    { id: 3, name: "카세미루", nameEn: "Casemiro", position: "MF", age: 32, club: "Manchester United" },
    { id: 4, name: "알리송", nameEn: "Alisson", position: "GK", age: 31, club: "Liverpool" },
    { id: 5, name: "마르키뉴스", nameEn: "Marquinhos", position: "DF", age: 30, club: "PSG" },
  ],
  argentina: [
    {
      id: 1,
      name: "리오넬 메시",
      nameEn: "Lionel Messi",
      position: "FW",
      age: 37,
      club: "Inter Miami",
      imageUrl: "https://i.namu.wiki/i/reB14NxWIsv85Ml45oTSf_qkdkK0cRzVrIfv4A4whL-kxzT_QTl3JVU6L4scvd6TV4nCf6OxtzUTixKGWOijwghKuNhuLasN0lK-9HPUME8oZYxXbQ8nkC1Gd8GqHh4-DHRXUxAainl8qY-vBKMBgQ.webp",
    },
    { id: 2, name: "앙헬 디 마리아", nameEn: "Ángel Di María", position: "FW", age: 36, club: "Benfica" },
    { id: 3, name: "에밀리아노 마르티네스", nameEn: "Emiliano Martínez", position: "GK", age: 32, club: "Aston Villa" },
    { id: 4, name: "로드리고 데 파울", nameEn: "Rodrigo De Paul", position: "MF", age: 30, club: "Atlético Madrid" },
    { id: 5, name: "크리스티안 로메로", nameEn: "Cristian Romero", position: "DF", age: 26, club: "Tottenham" },
  ],
  france: [
    { id: 1, name: "킬리안 음바페", nameEn: "Kylian Mbappé", position: "FW", age: 25, club: "PSG" },
    { id: 2, name: "앙투안 그리즈만", nameEn: "Antoine Griezmann", position: "FW", age: 33, club: "Atlético Madrid" },
    { id: 3, name: "올리비에 지루", nameEn: "Olivier Giroud", position: "FW", age: 37, club: "AC Milan" },
    { id: 4, name: "위고 로리스", nameEn: "Hugo Lloris", position: "GK", age: 37, club: "LAFC" },
    { id: 5, name: "오렐리앙 추아메니", nameEn: "Aurélien Tchouaméni", position: "MF", age: 24, club: "Real Madrid" },
  ],
  england: [
    { id: 1, name: "해리 케인", nameEn: "Harry Kane", position: "FW", age: 31, club: "Bayern Munich" },
    { id: 2, name: "주드 벨링엄", nameEn: "Jude Bellingham", position: "MF", age: 21, club: "Real Madrid" },
    { id: 3, name: "부카요 사카", nameEn: "Bukayo Saka", position: "FW", age: 22, club: "Arsenal" },
    { id: 4, name: "조던 피크포드", nameEn: "Jordan Pickford", position: "GK", age: 30, club: "Everton" },
    { id: 5, name: "데클란 라이스", nameEn: "Declan Rice", position: "MF", age: 25, club: "Arsenal" },
  ],
  spain: [
    { id: 1, name: "알바로 모라타", nameEn: "Álvaro Morata", position: "FW", age: 31, club: "Atlético Madrid" },
    { id: 2, name: "페드리", nameEn: "Pedri", position: "MF", age: 21, club: "Barcelona" },
    { id: 3, name: "가비", nameEn: "Gavi", position: "MF", age: 20, club: "Barcelona" },
    { id: 4, name: "우나이 시몬", nameEn: "Unai Simón", position: "GK", age: 27, club: "Athletic Bilbao" },
    { id: 5, name: "다니 카르바할", nameEn: "Dani Carvajal", position: "DF", age: 32, club: "Real Madrid" },
  ],
  germany: [
    { id: 1, name: "일카이 귄도안", nameEn: "İlkay Gündoğan", position: "MF", age: 33, club: "Barcelona" },
    { id: 2, name: "요슈아 키미히", nameEn: "Joshua Kimmich", position: "MF", age: 29, club: "Bayern Munich" },
    { id: 3, name: "카이 하베르츠", nameEn: "Kai Havertz", position: "FW", age: 25, club: "Arsenal" },
    { id: 4, name: "마누엘 노이어", nameEn: "Manuel Neuer", position: "GK", age: 38, club: "Bayern Munich" },
    { id: 5, name: "안토니오 뤼디거", nameEn: "Antonio Rüdiger", position: "DF", age: 31, club: "Real Madrid" },
  ],
  italy: [
    { id: 1, name: "페데리코 키에사", nameEn: "Federico Chiesa", position: "FW", age: 26, club: "Juventus" },
    { id: 2, name: "니콜로 바렐라", nameEn: "Nicolò Barella", position: "MF", age: 27, club: "Inter Milan" },
    { id: 3, name: "잔루이지 돈나룸마", nameEn: "Gianluigi Donnarumma", position: "GK", age: 25, club: "PSG" },
    { id: 4, name: "레오나르도 보누치", nameEn: "Leonardo Bonucci", position: "DF", age: 37, club: "Union Berlin" },
    { id: 5, name: "로렌초 인시녜", nameEn: "Lorenzo Insigne", position: "FW", age: 33, club: "Toronto FC" },
  ],
  portugal: [
    { id: 1, name: "크리스티아누 호날두", nameEn: "Cristiano Ronaldo", position: "FW", age: 39, club: "Al-Nassr" },
    { id: 2, name: "브루누 페르난데스", nameEn: "Bruno Fernandes", position: "MF", age: 29, club: "Manchester United" },
    { id: 3, name: "베르나르두 실바", nameEn: "Bernardo Silva", position: "MF", age: 29, club: "Manchester City" },
    { id: 4, name: "디오구 코스타", nameEn: "Diogo Costa", position: "GK", age: 24, club: "Porto" },
    { id: 5, name: "루벤 디아스", nameEn: "Rúben Dias", position: "DF", age: 27, club: "Manchester City" },
  ],
  netherlands: [
    { id: 1, name: "버질 판 다이크", nameEn: "Virgil van Dijk", position: "DF", age: 33, club: "Liverpool" },
    { id: 2, name: "프렝키 더 용", nameEn: "Frenkie de Jong", position: "MF", age: 27, club: "Barcelona" },
    { id: 3, name: "멤피스 데파이", nameEn: "Memphis Depay", position: "FW", age: 30, club: "Atlético Madrid" },
    { id: 4, name: "안드리스 노퍼트", nameEn: "Andries Noppert", position: "GK", age: 30, club: "Heerenveen" },
    { id: 5, name: "코디 학포", nameEn: "Cody Gakpo", position: "FW", age: 25, club: "Liverpool" },
  ],
  japan: [
    { id: 1, name: "미토마 가오루", nameEn: "Kaoru Mitoma", position: "FW", age: 27, club: "Brighton" },
    { id: 2, name: "구보 다케후사", nameEn: "Takefusa Kubo", position: "FW", age: 23, club: "Real Sociedad" },
    { id: 3, name: "엔도 와타루", nameEn: "Wataru Endo", position: "MF", age: 31, club: "Liverpool" },
    { id: 4, name: "곤다 슈이치", nameEn: "Shuichi Gonda", position: "GK", age: 35, club: "Shimizu S-Pulse" },
    { id: 5, name: "도미야스 다케히로", nameEn: "Takehiro Tomiyasu", position: "DF", age: 25, club: "Arsenal" },
  ],
  // 🇰🇷 대한민국 선수 (한글 이름)
  southkorea: [
    // 골키퍼
    { id: 1, name: "김승규", nameEn: "Kim Seung-gyu", position: "GK", age: 30, club: "Al-Shabab" },
    { id: 2, name: "조현우", nameEn: "Cho Hyun-woo", position: "GK", age: 32, club: "Ulsan HD" },
    { id: 3, name: "송범근", nameEn: "Song Bum-keun", position: "GK", age: 28, club: "Jeonbuk Motors" },
    // 수비수
    { id: 4, name: "김민재", nameEn: "Kim Min-jae", position: "DF", age: 27, club: "Bayern Munich" },
    { id: 5, name: "김영권", nameEn: "Kim Young-gwon", position: "DF", age: 34, club: "Ulsan HD" },
    { id: 6, name: "김진수", nameEn: "Kim Jin-su", position: "DF", age: 32, club: "Jeonbuk Motors" },
    { id: 7, name: "김태환", nameEn: "Kim Tae-hwan", position: "DF", age: 28, club: "Jeonbuk Motors" },
    { id: 8, name: "정승현", nameEn: "Jung Seung-hyun", position: "DF", age: 26, club: "Ulsan HD" },
    { id: 9, name: "홍철", nameEn: "Hong Chul", position: "DF", age: 33, club: "Daegu FC" },
    // 미드필더
    { id: 10, name: "손흥민", nameEn: "Son Heung-min", position: "MF", age: 32, club: "Tottenham Hotspur" },
    { id: 11, name: "이강인", nameEn: "Lee Kang-in", position: "MF", age: 23, club: "Paris Saint-Germain" },
    { id: 12, name: "이재성", nameEn: "Lee Jae-sung", position: "MF", age: 31, club: "Mainz 05" },
    { id: 13, name: "황인범", nameEn: "Hwang In-beom", position: "MF", age: 28, club: "Crvena Zvezda" },
    { id: 14, name: "정우영", nameEn: "Jung Woo-young", position: "MF", age: 27, club: "Stuttgart" },
    { id: 15, name: "백승호", nameEn: "Paik Seung-ho", position: "MF", age: 26, club: "Birmingham City" },
    { id: 16, name: "이기제", nameEn: "Lee Ki-je", position: "MF", age: 29, club: "Suwon Samsung" },
    { id: 17, name: "황희찬", nameEn: "Hwang Hee-chan", position: "MF", age: 28, club: "Wolverhampton" },
    // 공격수
    { id: 18, name: "조규성", nameEn: "Cho Gue-sung", position: "FW", age: 26, club: "Midtjylland" },
    { id: 19, name: "황의조", nameEn: "Hwang Ui-jo", position: "FW", age: 32, club: "Nottingham Forest" },
    { id: 20, name: "오현규", nameEn: "Oh Hyeon-gyu", position: "FW", age: 24, club: "Celtic" },
    { id: 21, name: "정상빈", nameEn: "Jung Sang-bin", position: "FW", age: 27, club: "Jeonbuk Motors" },
  ],
  // 🇿🇦 남아프리카공화국 선수
  southafrica: [
    // 골키퍼
    { id: 1, name: "론윈 윌리엄스", nameEn: "Ronwen Williams", position: "GK", age: 32, club: "Mamelodi Sundowns" },
    { id: 2, name: "비투 멜리", nameEn: "Veli Mothwa", position: "GK", age: 33, club: "AmaZulu" },
    // 수비수
    { id: 3, name: "시부시소 모코에나", nameEn: "Sibongiseni Mthethwa", position: "DF", age: 29, club: "Kaizer Chiefs" },
    { id: 4, name: "그랜트 케크", nameEn: "Grant Kekana", position: "DF", age: 31, club: "Mamelodi Sundowns" },
    { id: 5, name: "아우브레이 모디바", nameEn: "Aubrey Modiba", position: "DF", age: 29, club: "Mamelodi Sundowns" },
    { id: 6, name: "테보호 모코에나", nameEn: "Teboho Mokoena", position: "DF", age: 27, club: "Mamelodi Sundowns" },
    { id: 7, name: "니코스 타바타", nameEn: "Nkosinathi Sibisi", position: "DF", age: 28, club: "Orlando Pirates" },
    // 미드필더
    { id: 8, name: "테비조 마세코", nameEn: "Themba Zwane", position: "MF", age: 34, club: "Mamelodi Sundowns" },
    { id: 9, name: "스파헬레 음쿠", nameEn: "Sphelele Mkhulise", position: "MF", age: 27, club: "Mamelodi Sundowns" },
    { id: 10, name: "페르시 타우", nameEn: "Percy Tau", position: "MF", age: 30, club: "Al Ahly" },
    { id: 11, name: "코비 마인", nameEn: "Kobamelo Kodisang", position: "MF", age: 24, club: "Belenenses" },
    { id: 12, name: "타우다 마셀라", nameEn: "Thapelo Maseko", position: "MF", age: 20, club: "Mamelodi Sundowns" },
    // 공격수
    { id: 13, name: "이크람 아우다", nameEn: "Iqraam Rayners", position: "FW", age: 28, club: "Stellenbosch" },
    { id: 14, name: "자크 모디세", nameEn: "Zakhele Lepasa", position: "FW", age: 27, club: "Orlando Pirates" },
    { id: 15, name: "테보호 모코에나", nameEn: "Evidence Makgopa", position: "FW", age: 24, club: "Orlando Pirates" },
  ],
};

/**
 * 국가 ID로 선수 목록 조회
 * @param countryId - 국가 ID (countries.ts의 id와 매칭)
 * @returns 해당 국가의 선수 배열 또는 빈 배열
 *
 * 사용 위치:
 * - CountryModal: 국가 상세 정보에서 선수 명단 표시
 */
export const getPlayersByCountry = (countryId: string): Player[] => {
  return playersByCountry[countryId] || [];
};
