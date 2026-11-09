// ---------------------------------------------------------
// 타입 정의
// ---------------------------------------------------------

export interface SessionUser {
    user_index_1st: string | number;
    user_id?: string;
    [key: string]: unknown;
}

// ---------------------------------------------------------
// 상수 및 헬퍼 함수 (전역 변수 제거 및 안전한 처리)
// ---------------------------------------------------------

const STORAGE_KEY = {
    ACCOUNTS: 'loginaccounts',
    CURRENT_INDEX: 'currentUserIndex',
    LEGACY_TOKEN_PREFIX: 'token_'
};

// Fired in this tab when an account is removed from outside React (see evictAccount).
export const SESSION_CHANGED_EVENT = 'hwarang:session-changed';

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

// Tokens now live in HttpOnly cookies. Accounts saved by the old version have no cookie,
// so remove their tokens from storage and ask those users to log in again.
function removeLegacyTokens() {
    const legacyKeys = Object.keys(localStorage).filter((key) => key.startsWith(STORAGE_KEY.LEGACY_TOKEN_PREFIX));
    if (legacyKeys.length === 0) return;
    legacyKeys.forEach((key) => localStorage.removeItem(key));
    localStorage.removeItem(STORAGE_KEY.ACCOUNTS);
    localStorage.removeItem(STORAGE_KEY.CURRENT_INDEX);
}

removeLegacyTokens();

// ---------------------------------------------------------
// Export 함수들 (기존 로직 개선)
// ---------------------------------------------------------

// 현재 사용자 인덱스 가져오기
export function getCurrentUserIndex() {
    return localStorage.getItem(STORAGE_KEY.CURRENT_INDEX);
}

// 현재 사용자 인덱스 설정
export function setCurrentUserIndex(userIndex: string | number) {
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

// 로그인 처리 (사용자 추가)
export function UserLogin(loginuser: SessionUser) {
    if (!loginuser || !loginuser.user_index_1st) return;

    const existing: SessionUser[] = getStoredAccounts();
    const targetId = String(loginuser.user_index_1st);

    const isAlreadyLoggedIn = existing.some((user) => String(user.user_index_1st) === targetId);

    if (!isAlreadyLoggedIn) {
        existing.push(loginuser);
        localStorage.setItem(STORAGE_KEY.ACCOUNTS, JSON.stringify(existing));

        // 첫 번째 사용자가 로그인하면 현재 사용자로 설정
        if (existing.length === 1) {
            setCurrentUserIndex(targetId);
        }
    }
}

// 로그아웃 처리 (특정 사용자 제거)
export function UserLogout(logoutuser: SessionUser) {
    if (!logoutuser || !logoutuser.user_index_1st) return;

    const existing: SessionUser[] = getStoredAccounts();
    const logoutId = String(logoutuser.user_index_1st);

    const updated = existing.filter((user) => String(user.user_index_1st) !== logoutId);

    // 스토리지 업데이트
    localStorage.setItem(STORAGE_KEY.ACCOUNTS, JSON.stringify(updated));

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

// Removes an account whose session the server no longer accepts.
export function evictAccount(userIndex: string) {
    UserLogout({ user_index_1st: userIndex });
    window.dispatchEvent(new Event(SESSION_CHANGED_EVENT));
}

// 현재 로그인된 세션(사용자 객체) 가져오기
export function GetCurrentLoginSession() {
    const currentIndex = getCurrentUserIndex();
    if (!currentIndex) return null;

    const accounts: SessionUser[] = getStoredAccounts();
    return accounts.find((user) => String(user.user_index_1st) === currentIndex) ?? null;
}

// 사용자 전환
export function SwitchLoginSession(user: SessionUser) {
    if (user && user.user_index_1st) {
        setCurrentUserIndex(user.user_index_1st);
    }
}
