# 2026 북중미 월드컵 정보 웹 애플리케이션

Next.js App Router + TypeScript 기반의 2026 북중미 월드컵 정보 통합 웹 애플리케이션입니다.

## 기술 스택

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion** (애니메이션)
- **Sketchfab 3D Viewer** (경기장 3D 뷰어)
- **Railway Backend API** (일부 데이터)

## 핵심 아키텍처 결정

### 데이터 소스 정책

#### 1. 백엔드 API 사용 (포트 화면만)

- **사용 위치**: `PotsTab` (포트별 팀 정보 화면)
- **API 엔드포인트**:
  - `GET /api/worldcup/teams` - 포트별 팀 목록 (team.id, team.name, team.crest)
  - `GET /api/worldcup/teams/:id/players` - 선수 명단 (포트 화면에서 국가 클릭 시)
- **매칭 기준**: `team.id` (숫자) - 유일한 식별자
- **국기 이미지**: `team.crest` (API 제공) → 로컬 `Flag` 컴포넌트로 변환

#### 2. 프론트엔드 Data 파일 사용

다음 기능들은 **모두 프론트엔드 data 파일**에서 데이터를 가져옵니다:

- **조별 경기 정보**: `data/groups.ts`
- **FIFA 랭킹**: `data/fifaRankings.ts`
- **국가 기본 정보**: `data/countries.ts` (한글명, 국기 이미지, ISO 코드 등)
- **경기장 정보**: `data/stadiums.ts`
- **포트 구성**: `data/pots.ts`

#### 3. 데이터 매칭 규칙

**⚠️ 중요: 모든 매칭은 `team.id` (숫자) 기준으로 수행됩니다.**

- ❌ 금지: `area.name`, `countryId` (문자열), 문자열 비교
- ✅ 허용: `team.id` (숫자)만 사용
- **국기 이미지**: 로컬 data 파일의 `flagImageUrl` 또는 ISO 코드 기반 flagcdn.com URL 사용
- **국가 이름**: 로컬 data 파일의 `nameKo` (한글명) 사용

## 프로젝트 구조

```
├── app/
│   ├── layout.tsx              # 루트 레이아웃
│   ├── page.tsx                # 홈 페이지 (메인 탭 네비게이션)
│   ├── globals.css             # 글로벌 스타일
│   ├── teams/
│   │   └── [id]/
│   │       └── page.tsx        # 팀 상세 페이지 (선수 명단)
│   ├── stadiums/
│   │   └── [id]/
│   │       ├── page.tsx        # 경기장 상세 페이지
│   │       └── not-found.tsx
│   └── squad/                  # 스쿼드 빌더 관련 페이지
│
├── components/
│   ├── tabs/                   # 메인 탭 컴포넌트
│   │   ├── PotsTab.tsx         # 포트별 팀 정보 (API 사용)
│   │   ├── GroupsTab.tsx       # 조별 경기 일정 (data 파일)
│   │   ├── FifaRankingsTab.tsx # FIFA 랭킹 (data 파일)
│   │   ├── StadiumsTab.tsx     # 경기장 목록 (data 파일)
│   │   └── Tabs.tsx            # 탭 네비게이션
│   │
│   ├── modals/                 # 모달 컴포넌트
│   │   ├── CountryModal.tsx    # 국가 상세 정보 모달
│   │   ├── PlayerModal.tsx     # 선수 상세 정보 모달
│   │   └── StadiumModal.tsx    # 경기장 상세 모달
│   │
│   ├── ui/                     # UI 컴포넌트
│   │   ├── Flag.tsx            # 국기 이미지 컴포넌트 (로컬 데이터 사용)
│   │   ├── PotInfo.tsx         # 포트 정보 표시
│   │   └── StadiumViewer.tsx   # Sketchfab 3D 뷰어
│   │
│   ├── cards/                  # 카드 컴포넌트
│   │   ├── CountryCard.tsx
│   │   ├── PlayerCard.tsx
│   │   └── PlayerList.tsx
│   │
│   └── squad/                  # 스쿼드 빌더 컴포넌트
│       ├── SquadBuilder.tsx
│       ├── ImageSquadBuilder.tsx
│       └── ...
│
├── data/                       # 프론트엔드 데이터 파일
│   ├── countries.ts            # 국가 정보 (한글명, 국기, ISO 코드)
│   ├── groups.ts               # 조별 경기 일정
│   ├── fifaRankings.ts         # FIFA 랭킹 데이터
│   ├── pots.ts                 # 포트 구성
│   ├── stadiums.ts             # 경기장 정보
│   └── players.ts              # 선수 데이터 (로컬용, 현재 미사용)
│
├── src/
│   ├── utils/
│   │   ├── api.ts              # API 클라이언트 (포트 화면용만)
│   │   ├── apiMappers.ts       # API 응답 변환 유틸
│   │   ├── normalizeText.ts    # 텍스트 정규화
│   │   └── team.ts             # 팀 관련 유틸
│   │
│   ├── types/
│   │   └── api.ts              # API 타입 정의
│   │
│   └── components/
│       └── SearchResults.tsx   # 검색 결과 컴포넌트
│
└── types/
    └── player.ts               # 선수 타입 정의
```

## 주요 기능

### 1. 포트(Pots) 화면

- 포트별 팀 정보 표시 (국기 + 국가명)
- **백엔드 API 사용**: `fetchPotsTeams()` - 팀 목록 조회
- 국가 클릭 시 **선수 명단 모달 표시** (API: `fetchPlayersByTeamId()`)
- 검색 기능: 팀 이름으로 검색
- 포트 필터: 특정 포트만 보기

### 2. 조별 경기(Groups) 화면

- 조별 경기 일정 표시 (A조 ~ L조)
- **프론트엔드 data 파일 사용**: `data/groups.ts`
- 경기 상세 정보 모달
- 국가 클릭 시 국가 상세 모달
- 날짜별 경기 일정 필터링

### 3. FIFA 랭킹 화면

- FIFA 랭킹 순위 표시
- **프론트엔드 data 파일 사용**: `data/fifaRankings.ts`
- 대륙별 필터링
- 검색 기능
- 랭킹 변동 표시 (상승/하락)

### 4. 경기장(Stadiums) 화면

- 경기장 목록 및 지도 표시
- **프론트엔드 data 파일 사용**: `data/stadiums.ts`
- 경기장 상세 모달 (3D 뷰어 포함)
- Sketchfab 3D 경기장 뷰어 임베드

### 5. 국기 이미지 시스템

- **로컬 데이터 기반**: `data/countries.ts`의 `flagImageUrl` 또는 ISO 코드 사용
- `Flag` 컴포넌트로 통일된 국기 표시
- flagcdn.com을 통한 이미지 자동 생성 (ISO 코드 기반)
- 모든 화면에서 일관된 국기 이미지 사용

### 6. 모달 스크롤 제어

- 모달이 열릴 때 배경 스크롤 자동 차단
- 모달 내부 스크롤만 활성화
- 스크롤 끝에 도달해도 배경 스크롤 방지

## 시작하기

### 설치

```bash
npm install
```

### 환경변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```bash
# Railway 백엔드 API Base URL
NEXT_PUBLIC_API_BASE_URL=https://worldcupback-production.up.railway.app
```

**주의사항:**

- `.env.local` 파일은 `.gitignore`에 포함되어 Git에 커밋되지 않습니다
- Vercel 배포 시에는 Vercel 대시보드에서 환경변수를 설정해야 합니다
- 환경변수가 설정되지 않으면 개발 서버 실행 시 에러가 발생할 수 있습니다
- **포트 화면만 API를 사용**하므로, API가 다운되어도 다른 화면(조별 경기, FIFA 랭킹)은 정상 작동합니다

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 데이터 흐름

### 포트 화면 데이터 흐름

```
1. 컴포넌트 마운트
   ↓
2. fetchPotsTeams() 호출 (API)
   ↓
3. teams 배열 수신 (team.id, team.name, team.crest)
   ↓
4. createCountriesFromTeams() - 로컬 countries 배열 생성
   ↓
5. getCountryByTeamId() - UI 표시용 country 정보 조회
   ↓
6. Flag 컴포넌트 - 로컬 flagImageUrl 또는 ISO 코드로 국기 표시
```

### 조별 경기 / FIFA 랭킹 데이터 흐름

```
1. 컴포넌트 마운트
   ↓
2. data/groups.ts 또는 data/fifaRankings.ts에서 직접 데이터 로드
   ↓
3. getCountryById() - countryId로 로컬 country 정보 조회
   ↓
4. Flag 컴포넌트 - 로컬 flagImageUrl 또는 ISO 코드로 국기 표시
```

### 선수 명단 데이터 흐름 (포트 화면)

```
1. 사용자가 포트 화면에서 국가 클릭
   ↓
2. handleTeamClick() - teamId 전달
   ↓
3. fetchPlayersByTeamId(teamId) 호출 (API)
   ↓
4. 선수 명단 모달 표시
   ↓
5. PlayerList 컴포넌트로 선수 목록 렌더링
```

## 주요 설계 원칙

### 1. API 사용 최소화

- 포트 화면에서만 API 사용
- 다른 화면은 모두 프론트엔드 data 파일 사용
- 백엔드 장애 시에도 대부분의 기능이 정상 작동

### 2. team.id 기반 매칭

- 모든 매칭은 `team.id` (숫자)로만 수행
- 문자열 기반 매칭 금지 (`countryId`, `area.name` 등)
- 타입 안정성 보장

### 3. 로컬 데이터 우선

- 국기 이미지: 로컬 `flagImageUrl` 또는 ISO 코드 사용
- 국가 이름: 로컬 `nameKo` (한글명) 사용
- API의 `team.crest`는 로컬 데이터로 변환하여 사용

### 4. 모달 스크롤 제어

- 모달이 열릴 때 배경 스크롤 차단
- 모달 내부 스크롤만 활성화
- 사용자 경험 향상

## 기술적 특징

- **TypeScript**: 타입 안정성 보장
- **컴포넌트 기반 구조**: 재사용 가능한 컴포넌트 설계
- **반응형 디자인**: 모바일/데스크톱 대응
- **애니메이션**: Framer Motion을 통한 부드러운 UI 전환
- **모달 시스템**: 일관된 모달 UI/UX
- **검색 기능**: 텍스트 정규화를 통한 유연한 검색

## 라이선스

이 프로젝트는 개인 프로젝트입니다.
