import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../firebase/config';

// 인증 Context 생성
const AuthContext = createContext(null);

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// AuthProvider 컴포넌트
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 인증 상태 변경 리스너
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            console.log('👤 인증 상태 변경:', currentUser ? `로그인됨 (${currentUser.uid})` : '로그아웃됨');
            setUser(currentUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Google 로그인
    const loginWithGoogle = async () => {
        try {
            setError(null);
            const result = await signInWithPopup(auth, googleProvider);
            return result.user;
        } catch (err) {
            console.error('Google 로그인 오류:', err);
            setError(err.message);
            throw err;
        }
    };

    // 로그아웃
    const logout = async () => {
        try {
            setError(null);
            await signOut(auth);
        } catch (err) {
            console.error('로그아웃 오류:', err);
            setError(err.message);
            throw err;
        }
    };

    const value = {
        user,
        loading,
        error,
        loginWithGoogle,
        logout,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

// useAuth 훅
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export default AuthContext;
