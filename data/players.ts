/**
 * 선수 데이터
 *
 * 용도: 각 국가별 선수 명단 정보 저장
 * - 선수 이름, 포지션, 나이, 소속 클럽
 * - 대한민국 선수는 한글 이름으로 저장
 *
 * 사용 위치:
 * - CountryModal: 국가 상세 정보에서 선수 명단 표시
 *
 * 주의: 대한민국 선수만 한글로 표기되어 있습니다.
 */

export interface Player {
  id: string; // 선수 고유 ID
  name: string; // 선수 이름 (대한민국은 한글, 기타 국가는 영어)
  position: string; // 포지션 (GK, DF, MF, FW)
  age: number; // 나이
  club: string; // 소속 클럽
}

/**
 * 국가별 선수 명단
 * 키: 국가 ID (countries.ts의 id와 매칭)
 * 값: 해당 국가의 선수 배열
 */
export const playersByCountry: Record<string, Player[]> = {
  usa: [
    { id: "1", name: "Christian Pulisic", position: "FW", age: 25, club: "AC Milan" },
    { id: "2", name: "Weston McKennie", position: "MF", age: 25, club: "Juventus" },
    { id: "3", name: "Tyler Adams", position: "MF", age: 25, club: "Bournemouth" },
    { id: "4", name: "Matt Turner", position: "GK", age: 30, club: "Nottingham Forest" },
    { id: "5", name: "Sergiño Dest", position: "DF", age: 23, club: "PSV" },
  ],
  canada: [
    { id: "1", name: "Alphonso Davies", position: "DF", age: 23, club: "Bayern Munich" },
    { id: "2", name: "Jonathan David", position: "FW", age: 24, club: "Lille" },
    { id: "3", name: "Cyle Larin", position: "FW", age: 29, club: "Mallorca" },
    { id: "4", name: "Milan Borjan", position: "GK", age: 36, club: "Red Star Belgrade" },
    { id: "5", name: "Stephen Eustáquio", position: "MF", age: 27, club: "Porto" },
  ],
  mexico: [
    { id: "1", name: "Hirving Lozano", position: "FW", age: 28, club: "PSV" },
    { id: "2", name: "Raúl Jiménez", position: "FW", age: 33, club: "Fulham" },
    { id: "3", name: "Guillermo Ochoa", position: "GK", age: 38, club: "Salernitana" },
    { id: "4", name: "Edson Álvarez", position: "MF", age: 26, club: "West Ham" },
    { id: "5", name: "Jesús Corona", position: "FW", age: 31, club: "Sevilla" },
  ],
  brazil: [
    { id: "1", name: "Neymar", position: "FW", age: 32, club: "Al-Hilal" },
    { id: "2", name: "Vinícius Júnior", position: "FW", age: 24, club: "Real Madrid" },
    { id: "3", name: "Casemiro", position: "MF", age: 32, club: "Manchester United" },
    { id: "4", name: "Alisson", position: "GK", age: 31, club: "Liverpool" },
    { id: "5", name: "Marquinhos", position: "DF", age: 30, club: "PSG" },
  ],
  argentina: [
    { id: "1", name: "Lionel Messi", position: "FW", age: 37, club: "Inter Miami" },
    { id: "2", name: "Ángel Di María", position: "FW", age: 36, club: "Benfica" },
    { id: "3", name: "Emiliano Martínez", position: "GK", age: 32, club: "Aston Villa" },
    { id: "4", name: "Rodrigo De Paul", position: "MF", age: 30, club: "Atlético Madrid" },
    { id: "5", name: "Cristian Romero", position: "DF", age: 26, club: "Tottenham" },
  ],
  france: [
    { id: "1", name: "Kylian Mbappé", position: "FW", age: 25, club: "PSG" },
    { id: "2", name: "Antoine Griezmann", position: "FW", age: 33, club: "Atlético Madrid" },
    { id: "3", name: "Olivier Giroud", position: "FW", age: 37, club: "AC Milan" },
    { id: "4", name: "Hugo Lloris", position: "GK", age: 37, club: "LAFC" },
    { id: "5", name: "Aurélien Tchouaméni", position: "MF", age: 24, club: "Real Madrid" },
  ],
  england: [
    { id: "1", name: "Harry Kane", position: "FW", age: 31, club: "Bayern Munich" },
    { id: "2", name: "Jude Bellingham", position: "MF", age: 21, club: "Real Madrid" },
    { id: "3", name: "Bukayo Saka", position: "FW", age: 22, club: "Arsenal" },
    { id: "4", name: "Jordan Pickford", position: "GK", age: 30, club: "Everton" },
    { id: "5", name: "Declan Rice", position: "MF", age: 25, club: "Arsenal" },
  ],
  spain: [
    { id: "1", name: "Álvaro Morata", position: "FW", age: 31, club: "Atlético Madrid" },
    { id: "2", name: "Pedri", position: "MF", age: 21, club: "Barcelona" },
    { id: "3", name: "Gavi", position: "MF", age: 20, club: "Barcelona" },
    { id: "4", name: "Unai Simón", position: "GK", age: 27, club: "Athletic Bilbao" },
    { id: "5", name: "Dani Carvajal", position: "DF", age: 32, club: "Real Madrid" },
  ],
  germany: [
    { id: "1", name: "İlkay Gündoğan", position: "MF", age: 33, club: "Barcelona" },
    { id: "2", name: "Joshua Kimmich", position: "MF", age: 29, club: "Bayern Munich" },
    { id: "3", name: "Kai Havertz", position: "FW", age: 25, club: "Arsenal" },
    { id: "4", name: "Manuel Neuer", position: "GK", age: 38, club: "Bayern Munich" },
    { id: "5", name: "Antonio Rüdiger", position: "DF", age: 31, club: "Real Madrid" },
  ],
  italy: [
    { id: "1", name: "Federico Chiesa", position: "FW", age: 26, club: "Juventus" },
    { id: "2", name: "Nicolò Barella", position: "MF", age: 27, club: "Inter Milan" },
    { id: "3", name: "Gianluigi Donnarumma", position: "GK", age: 25, club: "PSG" },
    { id: "4", name: "Leonardo Bonucci", position: "DF", age: 37, club: "Union Berlin" },
    { id: "5", name: "Lorenzo Insigne", position: "FW", age: 33, club: "Toronto FC" },
  ],
  portugal: [
    { id: "1", name: "Cristiano Ronaldo", position: "FW", age: 39, club: "Al-Nassr" },
    { id: "2", name: "Bruno Fernandes", position: "MF", age: 29, club: "Manchester United" },
    { id: "3", name: "Bernardo Silva", position: "MF", age: 29, club: "Manchester City" },
    { id: "4", name: "Diogo Costa", position: "GK", age: 24, club: "Porto" },
    { id: "5", name: "Rúben Dias", position: "DF", age: 27, club: "Manchester City" },
  ],
  netherlands: [
    { id: "1", name: "Virgil van Dijk", position: "DF", age: 33, club: "Liverpool" },
    { id: "2", name: "Frenkie de Jong", position: "MF", age: 27, club: "Barcelona" },
    { id: "3", name: "Memphis Depay", position: "FW", age: 30, club: "Atlético Madrid" },
    { id: "4", name: "Andries Noppert", position: "GK", age: 30, club: "Heerenveen" },
    { id: "5", name: "Cody Gakpo", position: "FW", age: 25, club: "Liverpool" },
  ],
  japan: [
    { id: "1", name: "Kaoru Mitoma", position: "FW", age: 27, club: "Brighton" },
    { id: "2", name: "Takefusa Kubo", position: "FW", age: 23, club: "Real Sociedad" },
    { id: "3", name: "Wataru Endo", position: "MF", age: 31, club: "Liverpool" },
    { id: "4", name: "Shuichi Gonda", position: "GK", age: 35, club: "Shimizu S-Pulse" },
    { id: "5", name: "Takehiro Tomiyasu", position: "DF", age: 25, club: "Arsenal" },
  ],
  // 🇰🇷 대한민국 선수 (한글 이름)
  southkorea: [
    // 골키퍼
    { id: "1", name: "김승규", position: "GK", age: 30, club: "Al-Shabab" },
    { id: "2", name: "조현우", position: "GK", age: 32, club: "Ulsan HD" },
    { id: "3", name: "송범근", position: "GK", age: 28, club: "Jeonbuk Motors" },
    // 수비수
    { id: "4", name: "김민재", position: "DF", age: 27, club: "Bayern Munich" },
    { id: "5", name: "김영권", position: "DF", age: 34, club: "Ulsan HD" },
    { id: "6", name: "김진수", position: "DF", age: 32, club: "Jeonbuk Motors" },
    { id: "7", name: "김태환", position: "DF", age: 28, club: "Jeonbuk Motors" },
    { id: "8", name: "정승현", position: "DF", age: 26, club: "Ulsan HD" },
    { id: "9", name: "홍철", position: "DF", age: 33, club: "Daegu FC" },
    // 미드필더
    { id: "10", name: "손흥민", position: "MF", age: 32, club: "Tottenham Hotspur" },
    { id: "11", name: "이강인", position: "MF", age: 23, club: "Paris Saint-Germain" },
    { id: "12", name: "이재성", position: "MF", age: 31, club: "Mainz 05" },
    { id: "13", name: "황인범", position: "MF", age: 28, club: "Crvena Zvezda" },
    { id: "14", name: "정우영", position: "MF", age: 27, club: "Stuttgart" },
    { id: "15", name: "백승호", position: "MF", age: 26, club: "Birmingham City" },
    { id: "16", name: "이기제", position: "MF", age: 29, club: "Suwon Samsung" },
    { id: "17", name: "황희찬", position: "MF", age: 28, club: "Wolverhampton" },
    // 공격수
    { id: "18", name: "조규성", position: "FW", age: 26, club: "Midtjylland" },
    { id: "19", name: "황의조", position: "FW", age: 32, club: "Nottingham Forest" },
    { id: "20", name: "오현규", position: "FW", age: 24, club: "Celtic" },
    { id: "21", name: "정상빈", position: "FW", age: 27, club: "Jeonbuk Motors" },
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
