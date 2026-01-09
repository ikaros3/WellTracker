# WellTracker

혈압과 혈당을 기록하고 관리하는 건강 추적 애플리케이션입니다.

## 📋 주요 기능

### 🩺 혈압 관리
- 수축기/이완기 혈압 기록 및 추적
- 시각적 라인 차트로 추이 분석
- 정상/주의/고혈압 상태 자동 판정

### 🩸 혈당 관리
- 혈당 수치 기록 (공복, 식후 등)
- 시각적 라인 차트로 추이 분석
- 측정 시점별 상태 자동 평가

### 👤 프로필 관리
- 기본 정보 (이름, 생년월일, 키, 체중, 성별)
- 복용 중인 약물 체크

### 🤖 AI 건강 코치
- Gemini AI 기반 건강 분석
- 맞춤형 건강 가이드 제공

### ☁️ 클라우드 동기화
- Google OAuth 인증
- Firebase Firestore 데이터 동기화
- LocalStorage 실시간 백업

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

### Firebase Emulator 실행 (개발용)

```bash
npm run dev:emulator
```

또는 Vite + Emulator 동시 실행:

```bash
npm run dev:full
```

### 프로덕션 빌드

```bash
npm run build
```

---

## 🔥 Firebase 설정

### 1. Firebase 프로젝트 생성

1. [Firebase Console](https://console.firebase.google.com)에서 새 프로젝트 생성
2. Authentication > Sign-in method에서 **Google** 활성화
3. Firestore Database 생성 (프로덕션 모드)

### 2. 환경 변수 설정

`.env.example`을 `.env.local`로 복사하고 Firebase 설정값 입력:

```bash
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_USE_FIREBASE_EMULATOR=false
```

### 3. Firebase CLI 설치 및 로그인

```bash
npm install -g firebase-tools
firebase login
```

### 4. Firestore 보안 규칙 배포

```bash
firebase deploy --only firestore:rules
```

---

## 🚀 배포 (GitHub → Firebase Hosting)

### 자동 배포 설정

1. **Firebase 서비스 계정 키 생성**
   - Firebase Console > 프로젝트 설정 > 서비스 계정
   - "새 비공개 키 생성" 클릭
   - JSON 파일 다운로드

2. **GitHub Secrets 설정**
   - Repository > Settings > Secrets and variables > Actions
   - 다음 시크릿 추가:
     - `FIREBASE_SERVICE_ACCOUNT`: 서비스 계정 JSON 전체 내용
     - `VITE_FIREBASE_API_KEY`
     - `VITE_FIREBASE_AUTH_DOMAIN`
     - `VITE_FIREBASE_PROJECT_ID`
     - `VITE_FIREBASE_STORAGE_BUCKET`
     - `VITE_FIREBASE_MESSAGING_SENDER_ID`
     - `VITE_FIREBASE_APP_ID`

3. **배포**
   ```bash
   git push origin main
   ```
   GitHub Actions가 자동으로 빌드 및 배포합니다.

### 수동 배포

```bash
npm run build
firebase deploy --only hosting
```

---

## 📁 프로젝트 구조

```
src/
├── components/
│   ├── auth/           # 인증 관련 컴포넌트
│   ├── common/         # 공통 UI 컴포넌트
│   ├── charts/         # 차트 컴포넌트
│   └── sections/       # 페이지 섹션
├── contexts/
│   └── AuthContext.jsx # 인증 Context
├── firebase/
│   └── config.js       # Firebase 설정
├── hooks/
│   ├── useChartScroll.js
│   └── useSyncManager.js # 동기화 훅
├── services/
│   ├── geminiApi.js
│   └── firestoreService.js # Firestore 서비스
├── utils/
├── App.jsx
└── main.jsx
```

---

## 🛠️ 기술 스택

| 카테고리 | 기술 |
|---------|------|
| **프레임워크** | React 19 |
| **빌드 도구** | Vite 6 |
| **차트** | Recharts 3 |
| **아이콘** | Lucide React |
| **스타일링** | Tailwind CSS (CDN) |
| **백엔드** | Firebase 11 (Auth, Firestore, Hosting) |
| **CI/CD** | GitHub Actions |

---

## 📊 데이터 구조

### Firestore 구조

```
users/{userId}/
├── profile: { name, birthdate, height, weight, gender, meds }
├── bpRecords: [{ id, date, time, systolic, diastolic, medsTaken }]
└── glucoseRecords: [{ id, date, time, level, mealStatus, medsTaken }]
```

### 동기화 시점

| 이벤트 | 동작 |
|--------|------|
| 로그인 직후 | Firestore → State |
| 데이터 추가/수정 | State → Firestore + LocalStorage |
| 앱 종료/로그아웃 | State → Firestore |
| 수동 동기화 | State → Firestore |

---

## 📄 라이선스

MIT
