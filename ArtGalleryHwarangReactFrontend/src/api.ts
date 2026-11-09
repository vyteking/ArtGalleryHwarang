import axios from 'axios';
import { evictAccount, getCurrentUserIndex } from './session';

export const API_BASE: string = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/';

// Names the logged-in account a request is for. Its token is in an HttpOnly cookie that scripts cannot read.
const ACCOUNT_HEADER = 'X-Hwarang-Account';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export class InvalidIdError extends Error {}

// Every id in the API is a UUID. Checking this before an id goes into a path stops a crafted
// link (e.g. /p/..%2F..%2Fu%2Fx) from sending an authenticated request to a different endpoint.
export function idSegment(value: unknown): string {
    const id = String(value);
    if (!UUID_PATTERN.test(id)) throw new InvalidIdError(`Invalid id: ${id}`);
    return id;
}

export function GetServerAPIAddress(type: string, submitvalue: string = ''): string {
    return API_BASE + type + '/' + submitvalue;
}

const clientConfig = { withCredentials: true, timeout: 30000 };

// Login, signup and logout. These must not act on whichever account is currently selected.
export const publicApi = axios.create(clientConfig);

// Everything else: sends the selected account, and forgets an account whose session has ended.
export const api = axios.create(clientConfig);

api.interceptors.request.use((config) => {
    const account = getCurrentUserIndex();
    if (account) config.headers.set(ACCOUNT_HEADER, account);
    return config;
});

api.interceptors.response.use(undefined, (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
        const account = error.config?.headers.get(ACCOUNT_HEADER);
        if (account) evictAccount(String(account));
    }
    return Promise.reject(error);
});

export function revokeServerSession(account: string | number) {
    return publicApi.post(GetServerAPIAddress('u', 'api/logout'), null, {
        headers: { [ACCOUNT_HEADER]: String(account) },
    });
}

// True when a request ended because its page was left or its data is no longer wanted.
export function isCancelled(error: unknown): boolean {
    return axios.isCancel(error);
}

export function isNotFound(error: unknown): boolean {
    return error instanceof InvalidIdError || (axios.isAxiosError(error) && error.response?.status === 404);
}

// Returns the normalised URL of user-supplied media, or null unless it is plain http(s).
export function safeMediaUrl(url: string | null | undefined): string | null {
    if (!url) return null;
    try {
        const parsed = new URL(url, API_BASE);
        return parsed.protocol === 'http:' || parsed.protocol === 'https:' ? parsed.href : null;
    } catch {
        return null;
    }
}

// CSS background value for user-supplied media. URL parsing percent-encodes quotes,
// so the value cannot break out of the url("...") wrapper.
export function cssImageUrl(url: string | null | undefined): string | undefined {
    const safe = safeMediaUrl(url);
    return safe ? `url("${safe}")` : undefined;
}
