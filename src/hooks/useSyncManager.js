import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
    loadUserData,
    saveUserData,
    resetUserData,
    backupToLocalStorage,
    restoreFromLocalStorage,
    setPendingChanges,
    hasPendingChanges,
    clearLocalStorage
} from '../services/firestoreService';

// 기본 프로필 값
const DEFAULT_PROFILE = {
    name: "",
    birthdate: "",
    height: "",
    weight: "",
    gender: "male",
    meds: { bp: false, diabetes: false, lipid: false, aspirin: false },
};

/**
 * 데이터 동기화 관리 Hook
 * - 앱 시작 시: Firestore에서 1회 로드
 * - 데이터 변경 시: LocalStorage에 실시간 백업 + Firestore 동기화
 * - 앱 종료/로그아웃 시: Firestore에 저장
 */
export function useSyncManager() {
    const { user, isAuthenticated } = useAuth();

    // 데이터 상태
    const [profile, setProfile] = useState(DEFAULT_PROFILE);
    const [bpRecords, setBpRecords] = useState([]);
    const [glucoseRecords, setGlucoseRecords] = useState([]);

    // 동기화 상태
    const [syncStatus, setSyncStatus] = useState('idle'); // idle, loading, syncing, synced, error
    const [lastSyncedAt, setLastSyncedAt] = useState(null);
    const [isInitialized, setIsInitialized] = useState(false);

    // 변경 추적을 위한 ref
    const hasChangesRef = useRef(false);
    const isSyncingRef = useRef(false);

    // 앱 시작 시 데이터 로드 (1회)
    useEffect(() => {
        if (!isAuthenticated || !user || isInitialized) return;

        const initializeData = async () => {
            setSyncStatus('loading');

            try {
                // Firestore에서 데이터 로드 시도
                const firestoreData = await loadUserData(user.uid);

                if (firestoreData) {
                    // Firestore 데이터 존재 시 사용
                    setProfile(firestoreData.profile || DEFAULT_PROFILE);
                    setBpRecords(firestoreData.bpRecords || []);
                    setGlucoseRecords(firestoreData.glucoseRecords || []);
                    setLastSyncedAt(firestoreData.lastSyncedAt?.toDate?.() || new Date());

                    // LocalStorage에도 백업
                    backupToLocalStorage({
                        profile: firestoreData.profile,
                        bpRecords: firestoreData.bpRecords,
                        glucoseRecords: firestoreData.glucoseRecords
                    });
                } else {
                    // Firestore에 데이터 없으면 LocalStorage 확인
                    const localData = restoreFromLocalStorage();
                    if (localData.profile || localData.bpRecords.length > 0 || localData.glucoseRecords.length > 0) {
                        setProfile(localData.profile || DEFAULT_PROFILE);
                        setBpRecords(localData.bpRecords);
                        setGlucoseRecords(localData.glucoseRecords);
                    }
                }

                setSyncStatus('synced');
                setPendingChanges(false);
            } catch (error) {
                console.error('데이터 초기화 오류:', error);

                // 오류 시 LocalStorage에서 복원 시도
                const localData = restoreFromLocalStorage();
                setProfile(localData.profile || DEFAULT_PROFILE);
                setBpRecords(localData.bpRecords);
                setGlucoseRecords(localData.glucoseRecords);

                setSyncStatus('error');
            }

            setIsInitialized(true);
        };

        initializeData();
    }, [isAuthenticated, user, isInitialized]);

    // Firestore에 데이터 동기화
    const syncToFirestore = useCallback(async (dataToSync = null) => {
        if (!user) {
            console.warn('⚠️ 로그인되지 않아 동기화 건너뜀');
            return false;
        }

        if (isSyncingRef.current) {
            console.log('⏳ 이미 동기화 중입니다...');
            return false;
        }

        const data = dataToSync || { profile, bpRecords, glucoseRecords };

        isSyncingRef.current = true;
        setSyncStatus('syncing');
        console.log('🔄 Firestore 동기화 시작...', data);

        try {
            await saveUserData(user.uid, data);
            setLastSyncedAt(new Date());
            setSyncStatus('synced');
            hasChangesRef.current = false;
            setPendingChanges(false);
            console.log('✅ Firestore 동기화 성공!');
            return true;
        } catch (error) {
            console.error('❌ Firestore 동기화 오류:', error);
            setSyncStatus('error');
            return false;
        } finally {
            isSyncingRef.current = false;
        }
    }, [user, profile, bpRecords, glucoseRecords]);

    // 데이터 변경 시 LocalStorage 백업 + Firestore 동기화
    const handleDataChange = useCallback((type, newData) => {
        console.log(`📝 데이터 변경 감지: ${type}`, newData);
        // LocalStorage에 즉시 백업
        backupToLocalStorage({ [type]: newData });
        hasChangesRef.current = true;
        setPendingChanges(true);

        // Firestore에도 동기화
        const currentData = { profile, bpRecords, glucoseRecords };
        currentData[type] = newData;
        syncToFirestore(currentData);
    }, [profile, bpRecords, glucoseRecords, syncToFirestore]);

    // 프로필 변경
    const updateProfile = useCallback((newProfileOrUpdater) => {
        setProfile(prev => {
            const newProfile = typeof newProfileOrUpdater === 'function'
                ? newProfileOrUpdater(prev)
                : newProfileOrUpdater;
            handleDataChange('profile', newProfile);
            return newProfile;
        });
    }, [handleDataChange]);

    // 혈압 기록 변경
    const updateBpRecords = useCallback((newRecordsOrUpdater) => {
        setBpRecords(prev => {
            const newRecords = typeof newRecordsOrUpdater === 'function'
                ? newRecordsOrUpdater(prev)
                : newRecordsOrUpdater;
            handleDataChange('bpRecords', newRecords);
            return newRecords;
        });
    }, [handleDataChange]);

    // 혈당 기록 변경
    const updateGlucoseRecords = useCallback((newRecordsOrUpdater) => {
        setGlucoseRecords(prev => {
            const newRecords = typeof newRecordsOrUpdater === 'function'
                ? newRecordsOrUpdater(prev)
                : newRecordsOrUpdater;
            handleDataChange('glucoseRecords', newRecords);
            return newRecords;
        });
    }, [handleDataChange]);

    // 수동 동기화
    const manualSync = useCallback(async () => {
        return await syncToFirestore();
    }, [syncToFirestore]);

    // 데이터 초기화
    const resetAllData = useCallback(async () => {
        if (!user) return false;

        try {
            // Firestore 데이터 삭제
            await resetUserData(user.uid);

            // LocalStorage 삭제
            clearLocalStorage();

            // 상태 초기화
            setProfile(DEFAULT_PROFILE);
            setBpRecords([]);
            setGlucoseRecords([]);
            setLastSyncedAt(null);
            hasChangesRef.current = false;

            return true;
        } catch (error) {
            console.error('데이터 초기화 오류:', error);
            return false;
        }
    }, [user]);

    // 앱 종료 시 동기화 (beforeunload)
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (hasChangesRef.current && user) {
                // Navigator.sendBeacon을 사용하여 비동기 저장 시도
                // 참고: Firestore는 sendBeacon을 직접 지원하지 않으므로 LocalStorage에 플래그 저장
                setPendingChanges(true);
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [user]);

    // 로그아웃 전 동기화
    const syncBeforeLogout = useCallback(async () => {
        if (hasChangesRef.current) {
            await syncToFirestore();
        }
    }, [syncToFirestore]);

    return {
        // 데이터
        profile,
        bpRecords,
        glucoseRecords,

        // 데이터 업데이트 함수
        setProfile: updateProfile,
        setBpRecords: updateBpRecords,
        setGlucoseRecords: updateGlucoseRecords,

        // 동기화 상태
        syncStatus,
        lastSyncedAt,
        isInitialized,

        // 동기화 함수
        manualSync,
        resetAllData,
        syncBeforeLogout,

        // 유틸리티
        hasPendingChanges: () => hasChangesRef.current
    };
}

export default useSyncManager;
