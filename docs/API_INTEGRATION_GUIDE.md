# API 통합 가이드

## 핵심 원칙

**"국가 정보는 standings, 선수 정보는 players, 연결 키는 team.id"**

## API 구조

### 1. GET /api/worldcup/standings
- **용도**: 조별 포진 정보 (국가 메타 정보만)
- **포함 데이터**:
  - `team.id` (null인 경우 플레이오프 국가)
  - `team.name`
  - `group` (조)
  - `position` (순위)
  - `crest` (국기 URL)
- **제외**: 선수 정보는 절대 포함되지 않음

### 2. GET /api/worldcup/teams
- **용도**: 전체 참가국 목록
- **제외**: 선수 정보 없음

### 3. GET /api/worldcup/teams/:id/players
- **용도**: 국가별 선수단 정보
- **유일한 선수 데이터 소스**
- **예시**:
  - `/api/worldcup/teams/766/players` → 일본
  - `/api/worldcup/teams/772/players` → 대한민국
  - `/api/worldcup/teams/770/players` → 잉글랜드

## 금지 사항

❌ **절대 하지 말 것:**
- 선수 데이터 하드코딩
- standings에서 선수 정보 생성/추론
- ID 없는 국가 접근 허용
- 검색 시 선수 API 호출

## 구현 흐름

### 1. 조별 / 전체 국가 리스트 페이지
```typescript
// 데이터 출처: /api/worldcup/standings
const standings = await fetchStandings();

// 표시 요소:
// - 국기 (crest URL)
// - 국가명 (team.name)
// - 조 (group)
// - 순위 (position)
```

### 2. 국가 클릭 시
```typescript
// team.id 기준으로 이동
router.push(`/teams/${team.id}`);
```

### 3. 국가 상세 / 스쿼드 페이지 (`/teams/:id`)
```typescript
// 국가 메타 정보: /api/worldcup/standings
const standings = await fetchStandings();
const teamStanding = standings.find(s => s.team.id === teamId);

// 선수단 정보: /api/worldcup/teams/:id/players
const players = await fetchPlayersByTeamId(teamId);
```

### 4. 검색 기능
```typescript
// 데이터 출처: /api/worldcup/standings
// 검색 대상: team.name만
// 검색 단계에서 players API 호출 금지
const filtered = standings.filter(standing =>
  normalizeText(standing.team.name).startsWith(normalizeText(query))
);
```

## 플레이오프 국가 처리

```typescript
// team.id === null인 경우
if (isPlayoffTeam(teamId)) {
  // 클릭 불가
  // 상세 페이지 접근 불가
  return;
}
```

## 파일 구조

```
src/
  types/
    api.ts              # API 응답 타입 정의
  utils/
    api.ts              # API 클라이언트 함수
    normalizeText.ts    # 문자열 정규화 유틸
  components/
    SearchResults.tsx   # 검색 결과 컴포넌트

app/
  teams/
    [id]/
      page.tsx          # 국가 상세 페이지
```

## 사용 예시

### 검색 기능
```typescript
import { fetchStandings } from "@/src/utils/api";
import SearchResults from "@/src/components/SearchResults";

const standings = await fetchStandings();

<SearchResults
  searchQuery={query}
  standings={standings}
/>
```

### 국가 상세 페이지
```typescript
import { fetchStandings, fetchPlayersByTeamId } from "@/src/utils/api";

// 국가 메타 정보
const standings = await fetchStandings();
const teamStanding = standings.find(s => s.team.id === teamId);

// 선수 정보 (유일한 소스)
const players = await fetchPlayersByTeamId(teamId);
```

## 국기 이미지 처리

- 모든 국기는 URL 기반 (`crest` 필드 사용)
- 잉글랜드/웨일스/스코틀랜드/북아일랜드 등도 제공된 `crest` URL 그대로 사용
- 로컬 이미지 사용 금지
