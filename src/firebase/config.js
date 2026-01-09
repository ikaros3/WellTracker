// Firebase SDK 초기화 설정
import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, enableIndexedDbPersistence } from 'firebase/firestore';

// Firebase 설정 - Firebase Console에서 복사한 값으로 교체하세요
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "YOUR_API_KEY",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "YOUR_MESSAGING_SENDER_ID",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "YOUR_APP_ID",
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "YOUR_MEASUREMENT_ID"
};

// Firebase 앱 초기화
const app = initializeApp(firebaseConfig);

// Config 검증
if (!firebaseConfig.apiKey || firebaseConfig.apiKey.includes("YOUR_")) {
    console.error("❌ Firebase 설정이 올바르지 않습니다. 환경 변수(.env 또는 GitHub Secrets)가 누락되었습니다.");
    console.error("현재 설정값:", firebaseConfig);
}


// Firebase 서비스 인스턴스
export const auth = getAuth(app);
export const db = getFirestore(app);

// 오프라인 데이터 지속성 활성화
enableIndexedDbPersistence(db)
    .catch((err) => {
        if (err.code == 'failed-precondition') {
            console.warn('⚠️ 오프라인 지속성 실패: 여러 탭이 열려있습니다.');
        } else if (err.code == 'unimplemented') {
            console.warn('⚠️ 브라우저가 오프라인 지속성을 지원하지 않습니다.');
        }
    });

// Analytics는 프로덕션 환경에서만 초기화 (에뮬레이터는 지원하지 않음)
let analytics = null;
if (!import.meta.env.DEV || import.meta.env.VITE_USE_FIREBASE_EMULATOR !== 'true') {
    try {
        const { getAnalytics } = await import('firebase/analytics');
        analytics = getAnalytics(app);
        console.log('📊 Firebase Analytics 초기화 완료');
    } catch (e) {
        console.warn('⚠️ Firebase Analytics 초기화 실패 (무시해도 됩니다):', e.message);
    }
}
export { analytics };

// 개발 환경에서 에뮬레이터 연결
if (import.meta.env.DEV && import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true') {
    console.log('🔥 Firebase Emulator에 연결 시도 중...');
    try {
        connectAuthEmulator(auth, 'http://127.0.0.1:9099');
        connectFirestoreEmulator(db, '127.0.0.1', 8080);
        console.log('✅ Firebase Emulator 연결 성공 (Auth: 9099, Firestore: 8080)');
    } catch (e) {
        console.error('❌ Firebase Emulator 연결 실패:', e);
    }
}

export default app;
