# 2026 북중미 월드컵 경기장 상세 페이지

Next.js App Router를 사용한 경기장 상세 페이지 프로젝트입니다.

## 기술 스택

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Sketchfab 3D Viewer**

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
- 환경변수가 설정되지 않으면 개발 서버 실행 시 에러가 발생합니다

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

**환경변수 확인:**

- 환경변수가 누락된 경우 브라우저 콘솔에 경고 메시지가 표시됩니다
- API 호출 시 실제 URL이 콘솔에 로그로 출력됩니다

## 프로젝트 구조

```
├── app/
│   ├── layout.tsx          # 루트 레이아웃
│   ├── page.tsx            # 홈 페이지
│   ├── globals.css         # 글로벌 스타일
│   └── stadiums/
│       └── [id]/
│           ├── page.tsx    # 경기장 상세 페이지
│           └── not-found.tsx
├── components/
│   └── StadiumViewer.tsx   # Sketchfab 3D 뷰어 컴포넌트
└── data/
    └── stadiums.ts         # Mock 데이터
```

## 주요 기능

- 경기장 목록 페이지
- 경기장 상세 페이지
- Sketchfab 3D 경기장 뷰어 임베드
- 반응형 디자인

## 데이터

모든 데이터는 프론트엔드에서 mock 데이터로 처리됩니다. `data/stadiums.ts` 파일에서 경기장 정보를 관리합니다.
