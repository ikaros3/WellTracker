// Firestore 데이터 서비스
import {
    doc,
    getDoc,
    setDoc,
    deleteDoc,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';

// 사용자 데이터 문서 참조 가져오기
const getUserDocRef = (userId) => doc(db, 'users', userId);

/**
 * Firestore에서 사용자 데이터 로드
 * @param {string} userId - Firebase Auth 사용자 ID
 * @returns {Promise<object|null>} 사용자 데이터 또는 null
 */
export const loadUserData = async (userId) => {
    try {
        const docRef = getUserDocRef(userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            console.log('✅ Firestore에서 데이터 로드 완료');
            return {
                profile: data.profile || null,
                bpRecords: data.bpRecords || [],
                glucoseRecords: data.glucoseRecords || [],
                lastSyncedAt: data.lastSyncedAt
            };
        } else {
            console.log('📭 Firestore에 저장된 데이터 없음 (신규 사용자)');
            return null;
        }
    } catch (error) {
        console.error('❌ Firestore 데이터 로드 오류:', error);
        throw error;
    }
};

/**
 * Firestore에 사용자 데이터 저장
 * @param {string} userId - Firebase Auth 사용자 ID
 * @param {object} data - 저장할 데이터 (profile, bpRecords, glucoseRecords)
 * @returns {Promise<void>}
 */
export const saveUserData = async (userId, data) => {
    try {
        const docRef = getUserDocRef(userId);
        await setDoc(docRef, {
            profile: data.profile,
            bpRecords: data.bpRecords,
            glucoseRecords: data.glucoseRecords,
            lastSyncedAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        }, { merge: true });

        console.log('✅ Firestore에 데이터 저장 완료');
    } catch (error) {
        console.error('❌ Firestore 데이터 저장 오류:', error);
        throw error;
    }
};

/**
 * Firestore 사용자 데이터 초기화 (삭제)
 * @param {string} userId - Firebase Auth 사용자 ID
 * @returns {Promise<void>}
 */
export const resetUserData = async (userId) => {
    try {
        const docRef = getUserDocRef(userId);
        await deleteDoc(docRef);
        console.log('✅ Firestore 데이터 초기화 완료');
    } catch (error) {
        console.error('❌ Firestore 데이터 초기화 오류:', error);
        throw error;
    }
};

/**
 * LocalStorage 키 상수
 */
export const LOCAL_STORAGE_KEYS = {
    PROFILE: 'health_profile',
    BP_RECORDS: 'health_bp',
    GLUCOSE_RECORDS: 'health_glucose',
    LAST_SYNCED: 'health_last_synced',
    HAS_PENDING_CHANGES: 'health_pending_changes'
};

/**
 * LocalStorage에 데이터 백업
 * @param {object} data - 백업할 데이터
 */
export const backupToLocalStorage = (data) => {
    try {
        if (data.profile !== undefined) {
            localStorage.setItem(LOCAL_STORAGE_KEYS.PROFILE, JSON.stringify(data.profile));
        }
        if (data.bpRecords !== undefined) {
            localStorage.setItem(LOCAL_STORAGE_KEYS.BP_RECORDS, JSON.stringify(data.bpRecords));
        }
        if (data.glucoseRecords !== undefined) {
            localStorage.setItem(LOCAL_STORAGE_KEYS.GLUCOSE_RECORDS, JSON.stringify(data.glucoseRecords));
        }
    } catch (error) {
        console.error('LocalStorage 백업 오류:', error);
    }
};

/**
 * LocalStorage에서 데이터 복원
 * @returns {object} 복원된 데이터
 */
export const restoreFromLocalStorage = () => {
    try {
        const profile = localStorage.getItem(LOCAL_STORAGE_KEYS.PROFILE);
        const bpRecords = localStorage.getItem(LOCAL_STORAGE_KEYS.BP_RECORDS);
        const glucoseRecords = localStorage.getItem(LOCAL_STORAGE_KEYS.GLUCOSE_RECORDS);

        return {
            profile: profile ? JSON.parse(profile) : null,
            bpRecords: bpRecords ? JSON.parse(bpRecords) : [],
            glucoseRecords: glucoseRecords ? JSON.parse(glucoseRecords) : []
        };
    } catch (error) {
        console.error('LocalStorage 복원 오류:', error);
        return { profile: null, bpRecords: [], glucoseRecords: [] };
    }
};

/**
 * 변경사항 플래그 설정
 * @param {boolean} hasPending - 미동기화 변경사항 존재 여부
 */
export const setPendingChanges = (hasPending) => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.HAS_PENDING_CHANGES, JSON.stringify(hasPending));
};

/**
 * 변경사항 플래그 확인
 * @returns {boolean}
 */
export const hasPendingChanges = () => {
    try {
        const value = localStorage.getItem(LOCAL_STORAGE_KEYS.HAS_PENDING_CHANGES);
        return value ? JSON.parse(value) : false;
    } catch {
        return false;
    }
};

/**
 * LocalStorage 데이터 삭제
 */
export const clearLocalStorage = () => {
    Object.values(LOCAL_STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
    });
    console.log('✅ LocalStorage 데이터 삭제 완료');
};
