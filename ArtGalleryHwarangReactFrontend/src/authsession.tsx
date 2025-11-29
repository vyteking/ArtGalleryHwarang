import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// ---------------------------------------------------------
// 상수 및 헬퍼 함수 (전역 변수 제거 및 안전한 처리)
// ---------------------------------------------------------

const STORAGE_KEY = {
    ACCOUNTS: 'loginaccounts',
    CURRENT_INDEX: 'currentUserIndex',
    TOKEN_PREFIX: 'token_'
};

// 로컬 스토리지에서 계정 목록을 안전하게 가져오는 내부 함수
function getStoredAccounts() {
    const stored = localStorage.getItem(STORAGE_KEY.ACCOUNTS);
    if (!stored) return [];
    try {
        return JSON.parse(stored);
    } catch (e) {
        console.error("JSON Parse Error in session.tsx:", e);
        // 파싱 에러 시 빈 배열로 초기화하여 에러 방지
        localStorage.setItem(STORAGE_KEY.ACCOUNTS, JSON.stringify([]));
        return [];
    }
}

// ---------------------------------------------------------
// Export 함수들 (기존 로직 개선)
// ---------------------------------------------------------

// 현재 사용자 인덱스 가져오기
export function getCurrentUserIndex() {
    return localStorage.getItem(STORAGE_KEY.CURRENT_INDEX);
}

// 현재 사용자 인덱스 설정
export function setCurrentUserIndex(userIndex: String) {
    if (userIndex !== null && userIndex !== undefined) {
        localStorage.setItem(STORAGE_KEY.CURRENT_INDEX, String(userIndex));
    } else {
        localStorage.removeItem(STORAGE_KEY.CURRENT_INDEX);
    }
}

// 로그인된 사용자 목록 반환
export function GetLoginUsers() {
    return getStoredAccounts();
}

// 모든 로그인 세션 초기화 (로그아웃)
export function ResetLoginSessions() {
    const accounts = getStoredAccounts();
    // 저장된 토큰들도 모두 삭제
    accounts.forEach((user: { user_index_1st: any; }) => {
        if (user && user.user_index_1st) {
            localStorage.removeItem(`${STORAGE_KEY.TOKEN_PREFIX}${user.user_index_1st}`);
        }
    });
    localStorage.removeItem(STORAGE_KEY.ACCOUNTS);
    localStorage.removeItem(STORAGE_KEY.CURRENT_INDEX);
    
    // 초기화된 빈 배열 저장
    localStorage.setItem(STORAGE_KEY.ACCOUNTS, JSON.stringify([]));
}

// 로그인 처리 (사용자 추가)
export function UserLogin(loginuser: any) {
    if (!loginuser || !loginuser.user_index_1st) return;

    const existing = getStoredAccounts();
    // ID 비교 시 문자열로 변환하여 타입 불일치 방지
    const targetId = String(loginuser.user_index_1st);
    
    const isAlreadyLoggedIn = existing.some((user: { user_index_1st: any; }) => String(user.user_index_1st) === targetId);

    if (!isAlreadyLoggedIn) {
        existing.push(loginuser);
        localStorage.setItem(STORAGE_KEY.ACCOUNTS, JSON.stringify(existing));
        
        // 첫 번째 사용자가 로그인하면 현재 사용자로 설정
        if (existing.length === 1) {
            setCurrentUserIndex(targetId);
        }
    }

    // 토큰 저장
    if (loginuser.token) {
        localStorage.setItem(`${STORAGE_KEY.TOKEN_PREFIX}${targetId}`, loginuser.token);
    }
}

// 로그아웃 처리 (특정 사용자 제거)
export function UserLogout(logoutuser: any) {
    if (!logoutuser || !logoutuser.user_index_1st) return;

    const existing = getStoredAccounts();
    const logoutId = String(logoutuser.user_index_1st); // 문자열로 안전하게 변환

    // 해당 사용자 제외하고 필터링
    const updated = existing.filter((user: { user_index_1st: any; }) => String(user.user_index_1st) !== logoutId);
    
    // 스토리지 업데이트
    localStorage.setItem(STORAGE_KEY.ACCOUNTS, JSON.stringify(updated));
    localStorage.removeItem(`${STORAGE_KEY.TOKEN_PREFIX}${logoutId}`);

    // 만약 로그아웃하는 사용자가 '현재 선택된 사용자'였다면 처리
    const currentIndex = getCurrentUserIndex();
    if (currentIndex === logoutId) {
        localStorage.removeItem(STORAGE_KEY.CURRENT_INDEX);
        // 아직 로그인된 다른 사용자가 남아있다면 첫 번째 사람을 현재 사용자로 지정
        if (updated.length > 0) {
            setCurrentUserIndex(updated[0].user_index_1st);
        }
    }
}

// 현재 로그인된 세션(사용자 객체) 가져오기
export function GetCurrentLoginSession() {
    const currentIndex = getCurrentUserIndex();
    if (!currentIndex) return null;
    
    const accounts = getStoredAccounts();
    // 문자열로 변환하여 비교 (가장 중요)
    return accounts.find((user: { user_index_1st: any; }) => String(user.user_index_1st) === currentIndex) || null;
}

// 현재 사용자의 인증 토큰 가져오기
export function getAuthToken() {
    const currentUser = GetCurrentLoginSession();
    if (!currentUser) {
        return null;
    }
    return localStorage.getItem(`${STORAGE_KEY.TOKEN_PREFIX}${currentUser.user_index_1st}`);
}

// 사용자 전환
export function SwitchLoginSession(user: any) {
    if (user && user.user_index_1st) {
        setCurrentUserIndex(user.user_index_1st);
    }
}

// ---------------------------------------------------------
// React 컴포넌트들
// ---------------------------------------------------------

export function SessionManager() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/');
  }, [navigate]);

  return null;
}

export function LogoutUser() {
  const { userindex1st } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (userindex1st) {
        UserLogout({ user_index_1st: userindex1st });
        console.log(`Logging out user: ${userindex1st}`);
    }
    navigate('/');
  }, [userindex1st, navigate]);

  return null;
}

export function LogoutAll() {
  const navigate = useNavigate();

  useEffect(() => {
    ResetLoginSessions();
    console.log('모든 계정 로그아웃.');
    navigate('/');
  }, [navigate]);

  return null;
}