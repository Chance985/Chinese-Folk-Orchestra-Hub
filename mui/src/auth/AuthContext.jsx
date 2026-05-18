import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { apiRequest, getStoredToken, setStoredToken } from '../api/client.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(getStoredToken()));

  useEffect(() => {
    let active = true;
    async function loadUser() {
      if (!getStoredToken()) {
        setLoading(false);
        return;
      }
      try {
        const data = await apiRequest('/auth/me');
        if (active) setUser(data.user);
      } catch (_error) {
        setStoredToken(null);
        if (active) setUser(null);
      } finally {
        if (active) setLoading(false);
      }
    }
    loadUser();
    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (username, password) => {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: { username, password },
    });
    setStoredToken(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    setStoredToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAdmin: user?.role === 'admin',
      isPresident: user?.role === 'president',
      isMember: user?.role === 'member',
      login,
      logout,
    }),
    [user, loading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider.');
  return context;
}
