import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { api } from '../lib/api.js';

const AuthContext = createContext(null);

const HAS_SESSION_KEY = 'launchweb_has_session';
const ACCESS_TOKEN_KEY = 'launchweb_access_token';
const USER_KEY = 'launchweb_user';

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const bootstrapOnceRef = useRef(false);

  useEffect(() => {
    let canceled = false;

    async function bootstrap() {
      if (bootstrapOnceRef.current) {
        if (!canceled) setReady(true);
        return;
      }
      bootstrapOnceRef.current = true;

      const storedAccessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
      const storedUserRaw = localStorage.getItem(USER_KEY);
      if (storedAccessToken && !canceled) {
        setAccessToken(storedAccessToken);
      }
      if (storedUserRaw && !canceled) {
        try {
          setUser(JSON.parse(storedUserRaw));
        } catch {
          localStorage.removeItem(USER_KEY);
        }
      }

      const hasSession = localStorage.getItem(HAS_SESSION_KEY) === '1';
      if (!hasSession) {
        if (!canceled) setReady(true);
        return;
      }

      try {
        const { data } = await api.post('/auth/refresh');
        if (!canceled) {
          setAccessToken(data.accessToken);
          if (data.user) setUser(data.user);
        }
      } catch (err) {
        const status = err?.response?.status;
        if (status === 401) {
          localStorage.removeItem(HAS_SESSION_KEY);
          if (!canceled) {
            setAccessToken(null);
            setUser(null);
          }
        }
      } finally {
        if (!canceled) setReady(true);
      }
    }

    bootstrap();

    return () => {
      canceled = true;
    };
  }, []);

  useEffect(() => {
    api.setAccessToken(accessToken);

    if (accessToken) {
      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    } else {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
    }
  }, [accessToken]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  }, [user]);

  const value = useMemo(
    () => ({
      ready,
      accessToken,
      user,
      setUser,
      login: async ({ email, password }) => {
        const { data } = await api.post('/auth/login', { email, password });
        setAccessToken(data.accessToken);
        setUser(data.user);
        localStorage.setItem(HAS_SESSION_KEY, '1');
        return data.user;
      },
      register: async ({ email, password, name }) => {
        const { data } = await api.post('/auth/register', { email, password, name });
        return data.user;
      },
      logout: async () => {
        await api.post('/auth/logout');
        setAccessToken(null);
        setUser(null);
        localStorage.removeItem(HAS_SESSION_KEY);
      },
    }),
    [accessToken, ready, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
