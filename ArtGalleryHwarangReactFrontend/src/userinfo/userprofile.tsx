// Shared pieces for the personal page and the user info page.
import { useClassNames } from '../base';
import { useLocale } from '../locale/localeoptions';
import type { LocaleTexts } from '../locale/locale.types';
import './userprofile.css';

// Response of /u/<user_index_1st>/info (UserProfileSerializer).
export interface UserProfile {
    user_index_1st: string;
    user_id: string;
    user_status: number;
    user_level: number;
    user_join_date: string;
    username: string | null;
    user_alt_name: string | null;
    user_description: string | null;
    user_profile_pic: string | null;
    user_header_image: string | null;
    following_count: number;
    followers_count: number;
}

// Response items of /u/<user_index_1st>/following and /followers (UserSummarySerializer).
export interface UserSummary {
    user_index_1st: string;
    user_id: string;
    username: string | null;
    user_profile_pic: string | null;
}

// Mirrors UserInfo.UserStatus / UserInfo.UserLevel in the Django backend.
const USER_STATUS_KEYS: Record<number, keyof LocaleTexts['userstatus']> = {
    [-1]: 'SuspendedUser',
    1: 'NormalUser',
    8: 'Admin',
    16: 'Developer',
    32: 'ProjectManager',
    64: 'Founder',
};

const USER_LEVEL_KEYS: Record<number, keyof LocaleTexts['userlevel']> = {
    1: 'UnrankedUser',
    2: 'BronzeUser',
    3: 'SilverUser',
    4: 'GoldUser',
    5: 'PlatinumUser',
};

export function Avatar({ src, name, className }: { src: string | null; name: string; className: string }) {
    const getClassNames = useClassNames();
    if (src) {
        return <img className={getClassNames(className)} src={src} alt={name} />;
    }
    return (
        <div className={getClassNames(`${className} avatar-fallback`)} aria-hidden="true">
            {name.charAt(0).toUpperCase()}
        </div>
    );
}

export function StatusBadge({ status }: { status: number }) {
    const { localeTxt } = useLocale();
    const getClassNames = useClassNames();
    const key = USER_STATUS_KEYS[status];
    return (
        <span className={getClassNames(`profile-badge status-${key ?? 'unknown'}`)}>
            {key ? localeTxt.userstatus[key] : status}
        </span>
    );
}

export function LevelBadge({ level }: { level: number }) {
    const { localeTxt } = useLocale();
    const getClassNames = useClassNames();
    const key = USER_LEVEL_KEYS[level];
    return (
        <span className={getClassNames(`profile-badge level-${key ?? 'unknown'}`)}>
            {key ? localeTxt.userlevel[key] : level}
        </span>
    );
}
