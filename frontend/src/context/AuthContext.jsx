import { createContext, useEffect, useState } from "react";
import {
  login as apiLogin,
  refresh as apiRefresh,
  logout as apiLogout,
  me as apiMe,
} from "../features/auth/authApi";
import { setAccessToken } from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setToken] = useState(
    () => localStorage.getItem("accessToken") || null,
  );
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
      setAccessToken(accessToken);
    } else {
      localStorage.removeItem("accessToken");
      setAccessToken(null);
    }
  }, [accessToken]);

  useEffect(() => {
    const tryRefresh = async () => {
      try {
        const data = await apiRefresh();
        if (data?.access) setToken(data.access);
      } catch (err) {
        console.warn("refresh failed", err);
      } finally {
        setReady(true);
      }
    };
    if (!accessToken) tryRefresh();
  }, []);

  useEffect(() => {
    if (!accessToken) return;
    let mounted = true;
    (async () => {
      try {
        const u = await apiMe();
        if (mounted) setUser(u);
      } catch (err) {
        console.warn("me fetch failed", err);
      } finally {
        if (mounted) setReady(true);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [accessToken]);

  const login = async ({ username, password }) => {
    const data = await apiLogin({ username, password });
    if (data?.access) setToken(data.access);
    return data;
  };

  const logout = async () => {
    try {
      await apiLogout();
    } catch (e) {}
    
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ accessToken, user, login, logout, ready }}>
      {ready ? children : <div className="p-6">Loading…</div>}
    </AuthContext.Provider>
  );
};
