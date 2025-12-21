# WellTracker

혈압과 혈당을 기록하고 관리하는 건강 추적 애플리케이션입니다.

## 📋 주요 기능

### 🩺 혈압 관리
- 수축기/이완기 혈압 기록 및 추적
- 시각적 라인 차트로 추이 분석
- 정상/주의/고혈압 상태 자동 판정
- 혈압약 복용 여부 기록

### 🩸 혈당 관리
- 혈당 수치 기록 (공복, 식후 1시간, 식후 2시간 등)
- 시각적 라인 차트로 추이 분석
- 측정 시점별 상태 자동 평가
- 당뇨약/인슐린 복용 여부 기록

### 👤 프로필 관리
- 기본 정보 (이름, 생년월일, 키, 체중, 성별)
- 복용 중인 약물 체크 (혈압약, 당뇨약, 고지혈증약, 아스피린)

### 🤖 AI 건강 코치
- Gemini AI 기반 건강 분석
- 최근 기록 데이터 기반 맞춤형 건강 가이드
- 식단 및 운동 제안

### 💾 데이터 관리
- 브라우저 로컬 저장소 자동 저장
- JSON 파일로 데이터 내보내기/가져오기
- CSV(엑셀) 형식 다운로드

---

## 📁 프로젝트 구조

```
src/
├── components/
│   ├── common/          # 공통 UI 컴포넌트
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Checkbox.jsx
│   │   ├── Input.jsx
│   │   ├── Modal.jsx
│   │   ├── PaginationControls.jsx
│   │   └── index.js
│   ├── charts/          # 차트 관련 컴포넌트
│   │   ├── CustomBPDot.jsx
│   │   ├── CustomGlucoseDot.jsx
│   │   ├── CustomTooltip.jsx
│   │   ├── CustomXAxisTick.jsx
│   │   ├── CustomYAxisTick.jsx
│   │   └── index.js
│   └── sections/        # 페이지 섹션 컴포넌트
│       ├── AIInsightSection.jsx
│       ├── BackupRestoreCard.jsx
│       ├── BPSection.jsx
│       ├── GlucoseSection.jsx
│       ├── ProfileSection.jsx
│       ├── ReferenceGuide.jsx
│       └── index.js
├── constants/           # 상수 정의
│   └── index.js
├── hooks/               # 커스텀 훅
│   └── useChartScroll.js
├── services/            # 외부 API 서비스
│   └── geminiApi.js
├── utils/               # 유틸리티 함수
│   └── fileHelpers.js
├── App.jsx              # 메인 앱 컴포넌트
├── main.jsx             # 앱 진입점
└── styles.css           # 전역 스타일
```

---

## 🚀 시작하기

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:5173`을 열어 앱을 확인하세요.

### 프로덕션 빌드

```bash
npm run build
```

빌드된 파일은 `dist/` 디렉토리에 생성됩니다.

---

## 🛠️ 기술 스택

| 카테고리 | 기술 |
|---------|------|
| **프레임워크** | React 19 |
| **빌드 도구** | Vite 6 |
| **차트 라이브러리** | Recharts 3 |
| **아이콘** | Lucide React |
| **스타일링** | Tailwind CSS (CDN) |
| **백엔드** | Firebase 11 |

---

## ☁️ CodeSandbox

이 프로젝트는 CodeSandbox에서 바로 실행할 수 있습니다:

1. GitHub 저장소를 CodeSandbox에 import
2. 자동으로 `npm install` 및 `npm run dev` 실행
3. 미리보기 창에서 앱 확인

```
https://codesandbox.io/s/github/[your-username]/WellTracker
```

---

## 📁 파일 설명

### 주요 컴포넌트

| 파일 | 설명 |
|------|------|
| `App.jsx` | 메인 앱 컴포넌트, 상태 관리 및 라우팅 |
| `BPSection.jsx` | 혈압 기록/차트/목록 섹션 |
| `GlucoseSection.jsx` | 혈당 기록/차트/목록 섹션 |
| `ProfileSection.jsx` | 사용자 프로필 관리 섹션 |
| `AIInsightSection.jsx` | AI 건강 분석 섹션 |

### 공통 컴포넌트

| 파일 | 설명 |
|------|------|
| `Button.jsx` | 다양한 스타일 지원 버튼 |
| `Card.jsx` | 카드 래퍼 컴포넌트 |
| `Modal.jsx` | 모달 다이얼로그 |
| `Input.jsx` | 레이블이 있는 입력 필드 |
| `Checkbox.jsx` | 체크박스 컴포넌트 |
| `PaginationControls.jsx` | 페이지네이션 컨트롤 |

### 차트 컴포넌트

| 파일 | 설명 |
|------|------|
| `CustomBPDot.jsx` | 혈압 차트 포인트 (상태별 색상) |
| `CustomGlucoseDot.jsx` | 혈당 차트 포인트 (상태별 색상) |
| `CustomTooltip.jsx` | 차트 툴팁 |
| `CustomXAxisTick.jsx` | X축 커스텀 틱 (날짜/시간) |
| `CustomYAxisTick.jsx` | Y축 커스텀 틱 |

---

## 📊 데이터 구조

### 혈압 기록 (BP Record)
```javascript
{
  id: number,          // 고유 ID (타임스탬프)
  date: string,        // 날짜 (YYYY-MM-DD)
  time: string,        // 시간 (HH:MM)
  systolic: string,    // 수축기 혈압
  diastolic: string,   // 이완기 혈압
  medsTaken: boolean   // 혈압약 복용 여부
}
```

### 혈당 기록 (Glucose Record)
```javascript
{
  id: number,          // 고유 ID (타임스탬프)
  date: string,        // 날짜 (YYYY-MM-DD)
  time: string,        // 시간 (HH:MM)
  level: string,       // 혈당 수치 (mg/dL)
  mealStatus: string,  // 측정 시점 (fasting, one_hour_after, etc.)
  medsTaken: boolean   // 당뇨약 복용 여부
}
```

---

## 🔒 로컬 저장소 키

| 키 | 설명 |
|----|------|
| `health_profile` | 사용자 프로필 정보 |
| `health_bp` | 혈압 기록 배열 |
| `health_glucose` | 혈당 기록 배열 |

---

## 📄 라이선스

MIT

---

## 🤝 기여

버그 리포트, 기능 제안, 풀 리퀘스트 환영합니다!
