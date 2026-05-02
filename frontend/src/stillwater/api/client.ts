import axios from 'axios';

export const swApi = axios.create({
  baseURL: '/api/stillwater',
});

const TOKEN_KEY = 'stillwater_token';

export function setStillwaterToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export function getStillwaterToken() {
  return localStorage.getItem(TOKEN_KEY);
}

swApi.interceptors.request.use((config) => {
  const token = getStillwaterToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

swApi.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      // Don't auto-clear on every 401 — only on /me
      if (err.config?.url?.includes('/auth/me')) {
        setStillwaterToken(null);
      }
    }
    return Promise.reject(err);
  }
);

export type Principal =
  | { id: string; type: 'seeker'; name?: string; mobile?: string; email?: string }
  | { id: string; type: 'student'; name: string; provider: string }
  | { id: string; type: 'provider'; name: string; email: string; studioName: string; slug: string }
  | { id: string; type: 'admin'; name: string; email: string };

export async function fetchMe(): Promise<Principal | null> {
  if (!getStillwaterToken()) return null;
  try {
    const { data } = await swApi.get<Principal>('/auth/me');
    return data;
  } catch {
    return null;
  }
}
