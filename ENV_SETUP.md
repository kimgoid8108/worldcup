# 환경변수 설정 가이드

## 로컬 개발 환경

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```bash
NEXT_PUBLIC_API_BASE_URL=https://worldcupback-production.up.railway.app
```

### 파일 생성 방법

```bash
# Windows (PowerShell)
echo "NEXT_PUBLIC_API_BASE_URL=https://worldcupback-production.up.railway.app" > .env.local

# macOS / Linux
echo "NEXT_PUBLIC_API_BASE_URL=https://worldcupback-production.up.railway.app" > .env.local
```

또는 텍스트 에디터로 직접 생성:

1. 프로젝트 루트 디렉토리에 `.env.local` 파일 생성
2. 다음 내용 추가:
   ```
   NEXT_PUBLIC_API_BASE_URL=https://worldcupback-production.up.railway.app
   ```
3. 파일 저장

## Vercel 배포 환경

Vercel 대시보드에서 환경변수를 설정하세요:

1. Vercel 프로젝트 대시보드 접속
2. **Settings** → **Environment Variables** 이동
3. 다음 환경변수 추가:
   - **Name**: `NEXT_PUBLIC_API_BASE_URL`
   - **Value**: `https://worldcupback-production.up.railway.app`
   - **Environment**: Production, Preview, Development 모두 선택
4. **Save** 클릭
5. 배포 재실행 (자동으로 재배포됨)

## 환경변수 확인

### 개발 환경

환경변수가 누락된 경우:
- 브라우저 콘솔에 경고 메시지 표시
- 개발 서버 실행 시 에러 발생

환경변수가 정상 설정된 경우:
- API 호출 시 콘솔에 실제 URL 로그 출력
- 예: `[API 호출] fetchPlayersByTeamId { teamId: 766, url: 'https://worldcupback-production.up.railway.app/worldcup/teams/766/players' }`

### 프로덕션 환경

환경변수가 누락된 경우:
- API 호출 실패
- 에러 페이지 표시

## API 엔드포인트

환경변수 설정 후 다음 API가 사용 가능합니다:

- `GET /worldcup/standings` - 조별 포진 정보
- `GET /worldcup/teams` - 전체 참가국 목록
- `GET /worldcup/teams/:id/players` - 국가별 선수단 정보

**실제 호출 URL 예시:**
- `https://worldcupback-production.up.railway.app/worldcup/standings`
- `https://worldcupback-production.up.railway.app/worldcup/teams/766/players`

## 문제 해결

### 환경변수가 적용되지 않는 경우

1. `.env.local` 파일이 프로젝트 루트에 있는지 확인
2. 파일명이 정확한지 확인 (`.env.local` - 앞에 점 포함)
3. 개발 서버 재시작 (`npm run dev`)
4. 브라우저 캐시 클리어

### API 호출 실패 시

1. 브라우저 콘솔에서 실제 호출 URL 확인
2. Railway 백엔드 서버 상태 확인
3. CORS 에러인 경우 백엔드 설정 확인
