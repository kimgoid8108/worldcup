/**
 * 2026 FIFA World Cup (North America) Group Stage Dataset
 * 12 groups (A to L) with 4 teams per group
 */

export interface Team {
  name: string;
  flag: string; // Emoji flag for consistency with existing codebase
  players: string[];
  countryId?: string; // Optional reference to existing country IDs
}

export interface WorldCupGroup {
  group: string;
  teams: Team[];
}

export const worldCupGroups: WorldCupGroup[] = [
  {
    group: 'A',
    teams: [
      {
        name: 'United States',
        flag: '🇺🇸',
        players: ['Christian Pulisic', 'Weston McKennie', 'Tyler Adams', 'Matt Turner', 'Sergiño Dest'],
        countryId: 'usa',
      },
      {
        name: 'Netherlands',
        flag: '🇳🇱',
        players: ['Virgil van Dijk', 'Frenkie de Jong', 'Memphis Depay', 'Cody Gakpo', 'Andries Noppert'],
        countryId: 'netherlands',
      },
      {
        name: 'Japan',
        flag: '🇯🇵',
        players: ['Kaoru Mitoma', 'Takefusa Kubo', 'Wataru Endo', 'Shuichi Gonda', 'Takehiro Tomiyasu'],
        countryId: 'japan',
      },
      {
        name: 'Costa Rica',
        flag: '🇨🇷',
        players: ['Keylor Navas', 'Joel Campbell', 'Bryan Ruiz', 'Celso Borges', 'Francisco Calvo'],
        countryId: 'costa',
      },
    ],
  },
  {
    group: 'B',
    teams: [
      {
        name: 'Mexico',
        flag: '🇲🇽',
        players: ['Hirving Lozano', 'Raúl Jiménez', 'Guillermo Ochoa', 'Edson Álvarez', 'Jesús Corona'],
        countryId: 'mexico',
      },
      {
        name: 'England',
        flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
        players: ['Harry Kane', 'Jude Bellingham', 'Bukayo Saka', 'Jordan Pickford', 'Declan Rice'],
        countryId: 'england',
      },
      {
        name: 'South Korea',
        flag: '🇰🇷',
        players: ['손흥민', '이강인', '김민재', '조현우', '황희찬'],
        countryId: 'southkorea',
      },
      {
        name: 'Morocco',
        flag: '🇲🇦',
        players: ['Achraf Hakimi', 'Youssef En-Nesyri', 'Sofyan Amrabat', 'Bono', 'Hakim Ziyech'],
        countryId: 'morocco',
      },
    ],
  },
  {
    group: 'C',
    teams: [
      {
        name: 'Brazil',
        flag: '🇧🇷',
        players: ['Neymar', 'Vinícius Júnior', 'Casemiro', 'Alisson', 'Marquinhos'],
        countryId: 'brazil',
      },
      {
        name: 'Spain',
        flag: '🇪🇸',
        players: ['Álvaro Morata', 'Pedri', 'Gavi', 'Unai Simón', 'Dani Carvajal'],
        countryId: 'spain',
      },
      {
        name: 'Canada',
        flag: '🇨🇦',
        players: ['Alphonso Davies', 'Jonathan David', 'Cyle Larin', 'Milan Borjan', 'Stephen Eustáquio'],
        countryId: 'canada',
      },
      {
        name: 'Senegal',
        flag: '🇸🇳',
        players: ['Sadio Mané', 'Édouard Mendy', 'Kalidou Koulibaly', 'Ismaïla Sarr', 'Idrissa Gueye'],
        countryId: 'senegal',
      },
    ],
  },
  {
    group: 'D',
    teams: [
      {
        name: 'Argentina',
        flag: '🇦🇷',
        players: ['Lionel Messi', 'Ángel Di María', 'Emiliano Martínez', 'Rodrigo De Paul', 'Cristian Romero'],
        countryId: 'argentina',
      },
      {
        name: 'France',
        flag: '🇫🇷',
        players: ['Kylian Mbappé', 'Antoine Griezmann', 'Olivier Giroud', 'Hugo Lloris', 'Aurélien Tchouaméni'],
        countryId: 'france',
      },
      {
        name: 'Uruguay',
        flag: '🇺🇾',
        players: ['Luis Suárez', 'Edinson Cavani', 'Federico Valverde', 'José Giménez', 'Darwin Núñez'],
        countryId: 'uruguay',
      },
      {
        name: 'Australia',
        flag: '🇦🇺',
        players: ['Mathew Ryan', 'Aaron Mooy', 'Jackson Irvine', 'Mitch Duke', 'Harry Souttar'],
        countryId: 'australia',
      },
    ],
  },
  {
    group: 'E',
    teams: [
      {
        name: 'Germany',
        flag: '🇩🇪',
        players: ['İlkay Gündoğan', 'Joshua Kimmich', 'Kai Havertz', 'Manuel Neuer', 'Antonio Rüdiger'],
        countryId: 'germany',
      },
      {
        name: 'Portugal',
        flag: '🇵🇹',
        players: ['Cristiano Ronaldo', 'Bruno Fernandes', 'Bernardo Silva', 'Diogo Costa', 'Rúben Dias'],
        countryId: 'portugal',
      },
      {
        name: 'Colombia',
        flag: '🇨🇴',
        players: ['James Rodríguez', 'Radamel Falcao', 'David Ospina', 'Juan Cuadrado', 'Luis Díaz'],
        countryId: 'colombia',
      },
      {
        name: 'Egypt',
        flag: '🇪🇬',
        players: ['Mohamed Salah', 'Mohamed Elneny', 'Ahmed Hegazi', 'Mohamed El-Shenawy', 'Trézéguet'],
        countryId: 'egypt',
      },
  },
  {
    group: 'F',
    teams: [
      {
        name: 'Italy',
        flag: '🇮🇹',
        players: ['Federico Chiesa', 'Nicolò Barella', 'Gianluigi Donnarumma', 'Leonardo Bonucci', 'Lorenzo Insigne'],
        countryId: 'italy',
      },
      {
        name: 'Croatia',
        flag: '🇭🇷',
        players: ['Luka Modrić', 'Ivan Perišić', 'Marcelo Brozović', 'Dominik Livaković', 'Joško Gvardiol'],
        countryId: 'croatia',
      },
      {
        name: 'Ecuador',
        flag: '🇪🇨',
        players: ['Enner Valencia', 'Moisés Caicedo', 'Pervis Estupiñán', 'Hernán Galíndez', 'Jeremy Sarmiento'],
        countryId: 'ecuador',
      },
      {
        name: 'Saudi Arabia',
        flag: '🇸🇦',
        players: ['Salem Al-Dawsari', 'Mohammed Al-Owais', 'Sultan Al-Ghannam', 'Firas Al-Buraikan', 'Salman Al-Faraj'],
        countryId: 'saudiarabia',
      },
    ],
  },
  {
    group: 'G',
    teams: [
      {
        name: 'Belgium',
        flag: '🇧🇪',
        players: ['Kevin De Bruyne', 'Romelu Lukaku', 'Thibaut Courtois', 'Eden Hazard', 'Youri Tielemans'],
        countryId: 'belgium',
      },
      {
        name: 'Switzerland',
        flag: '🇨🇭',
        players: ['Granit Xhaka', 'Xherdan Shaqiri', 'Yann Sommer', 'Manuel Akanji', 'Breel Embolo'],
        countryId: 'switzerland',
      },
      {
        name: 'Chile',
        flag: '🇨🇱',
        players: ['Alexis Sánchez', 'Arturo Vidal', 'Claudio Bravo', 'Gary Medel', 'Eduardo Vargas'],
        countryId: 'chile',
      },
      {
        name: 'Panama',
        flag: '🇵🇦',
        players: ['Aníbal Godoy', 'Alberto Quintero', 'Luis Mejía', 'Fidel Escobar', 'Gabriel Torres'],
        countryId: 'panama',
      },
    ],
  },
  {
    group: 'H',
    teams: [
      {
        name: 'Denmark',
        flag: '🇩🇰',
        players: ['Christian Eriksen', 'Kasper Schmeichel', 'Simon Kjær', 'Pierre-Emile Højbjerg', 'Rasmus Højlund'],
        countryId: 'denmark',
      },
      {
        name: 'Poland',
        flag: '🇵🇱',
        players: ['Robert Lewandowski', 'Wojciech Szczęsny', 'Piotr Zieliński', 'Kamil Glik', 'Arkadiusz Milik'],
        countryId: 'poland',
      },
      {
        name: 'Peru',
        flag: '🇵🇪',
        players: ['Paolo Guerrero', 'Christian Cueva', 'Pedro Gallese', 'Renato Tapia', 'André Carrillo'],
        countryId: 'peru',
      },
      {
        name: 'Jamaica',
        flag: '🇯🇲',
        players: ['Leon Bailey', 'Michail Antonio', 'Andre Blake', 'Bobby Reid', 'Damion Lowe'],
        countryId: 'jamaica',
      },
    ],
  },
  {
    group: 'I',
    teams: [
      {
        name: 'Sweden',
        flag: '🇸🇪',
        players: ['Zlatan Ibrahimović', 'Emil Forsberg', 'Robin Olsen', 'Victor Lindelöf', 'Alexander Isak'],
        countryId: 'sweden',
      },
      {
        name: 'Iran',
        flag: '🇮🇷',
        players: ['Sardar Azmoun', 'Alireza Jahanbakhsh', 'Alireza Beiranvand', 'Mehdi Taremi', 'Ehsan Hajsafi'],
        countryId: 'iran',
      },
      {
        name: 'Qatar',
        flag: '🇶🇦',
        players: ['Akram Afif', 'Almoez Ali', 'Saad Al-Sheeb', 'Hassan Al-Haydos', 'Boualem Khoukhi'],
        countryId: 'qatar',
      },
      {
        name: 'New Zealand',
        flag: '🇳🇿',
        players: ['Chris Wood', 'Winston Reid', 'Stefan Marinović', 'Ryan Thomas', 'Marco Rojas'],
        countryId: 'newzealand',
      },
    ],
  },
  {
    group: 'J',
    teams: [
      {
        name: 'Turkiye',
        flag: '🇹🇷',
        players: ['Hakan Çalhanoğlu', 'Cenk Tosun', 'Uğurcan Çakır', 'Çağlar Söyüncü', 'Burak Yılmaz'],
        countryId: 'turkiye',
      },
      {
        name: 'United Arab Emirates',
        flag: '🇦🇪',
        players: ['Ali Mabkhout', 'Omar Abdulrahman', 'Khalid Eisa', 'Ahmed Khalil', 'Ismail Matar'],
        countryId: 'uae',
      },
      {
        name: 'China',
        flag: '🇨🇳',
        players: ['Wu Lei', 'Zhang Yuning', 'Yan Junling', 'Zhang Linpeng', 'Wei Shihao'],
        countryId: 'china',
      },
      {
        name: 'Thailand',
        flag: '🇹🇭',
        players: ['Teerasil Dangda', 'Chanathip Songkrasin', 'Kawin Thamsatchanan', 'Theerathon Bunmathan', 'Supachok Sarachat'],
        countryId: 'thailand',
      },
    ],
  },
  {
    group: 'K',
    teams: [
      {
        name: 'Norway',
        flag: '🇳🇴',
        players: ['Erling Haaland', 'Martin Ødegaard', 'André Hansen', 'Ole Selnæs', 'Alexander Sørloth'],
        countryId: 'norway',
      },
      {
        name: 'Vietnam',
        flag: '🇻🇳',
        players: ['Nguyễn Quang Hải', 'Nguyễn Công Phượng', 'Đặng Văn Lâm', 'Quế Ngọc Hải', 'Nguyễn Văn Toàn'],
        countryId: 'vietnam',
      },
      {
        name: 'India',
        flag: '🇮🇳',
        players: ['Sunil Chhetri', 'Gurpreet Singh Sandhu', 'Sandesh Jhingan', 'Anirudh Thapa', 'Udanta Singh'],
        countryId: 'india',
      },
      {
        name: 'Russia',
        flag: '🇷🇺',
        players: ['Artem Dzyuba', 'Aleksandr Golovin', 'Igor Akinfeev', 'Mario Fernandes', 'Denis Cheryshev'],
        countryId: 'russia',
      },
    ],
  },
  {
    group: 'L',
    teams: [
      {
        name: 'Wales',
        flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿',
        players: ['Gareth Bale', 'Aaron Ramsey', 'Wayne Hennessey', 'Ben Davies', 'Daniel James'],
        countryId: 'wales',
      },
      {
        name: 'Ghana',
        flag: '🇬🇭',
        players: ['Mohammed Kudus', 'Thomas Partey', 'André Ayew', 'Richard Ofori', 'Jordan Ayew'],
        countryId: 'ghana',
      },
      {
        name: 'Tunisia',
        flag: '🇹🇳',
        players: ['Wahbi Khazri', 'Youssef Msakni', 'Aymen Mathlouthi', 'Dylan Bronn', 'Anis Ben Slimane'],
        countryId: 'tunisia',
      },
      {
        name: 'Paraguay',
        flag: '🇵🇾',
        players: ['Miguel Almirón', 'Antonio Sanabria', 'Roberto Fernández', 'Gustavo Gómez', 'Ángel Romero'],
        countryId: 'paraguay',
      },
    ],
  },
];

// Helper function to get group by letter
export const getGroupByLetter = (letter: string): WorldCupGroup | undefined => {
  return worldCupGroups.find((g) => g.group.toUpperCase() === letter.toUpperCase());
};

// Helper function to get all teams
export const getAllTeams = (): Team[] => {
  return worldCupGroups.flatMap((group) => group.teams);
};

// Helper function to get team by name
export const getTeamByName = (name: string): Team | undefined => {
  return getAllTeams().find((team) => team.name === name);
};
