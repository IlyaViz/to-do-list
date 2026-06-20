import { createContext, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

  const qc = useQueryClient();

  useEffect(() => {
    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
      setAccessToken(accessToken);
    } else {
      localStorage.removeItem("accessToken");
      setAccessToken(null);
    }
  }, [accessToken]);

  const {
    data: userData,
    isSuccess,
    isError,
  } = useQuery({
    queryKey: ["me"],
    queryFn: apiMe,
    enabled: !!accessToken,
    retry: false,
  });

  useEffect(() => {
    if (isSuccess) {
      setUser(userData);
      setReady(true);
    } else if (isError) {
      setUser(null);
      setReady(true);
    }
  }, [isSuccess, isError, userData]);

  useEffect(() => {
    if (accessToken) return;

    let mounted = true;

    (async () => {
      try {
        const data = await apiRefresh();

        if (mounted && data?.access) setToken(data.access);
      } catch (e) {
        console.warn("refresh failed", e);
      } finally {
        if (mounted) setReady(true);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const loginMut = useMutation({
    mutationFn: apiLogin,
    onSuccess: (data) => {
      if (data?.access) setToken(data.access);
    },
  });

  const logoutMut = useMutation({
    mutationFn: apiLogout,
    onSuccess: () => {
      setToken(null);
      setUser(null);
      qc.removeQueries({});
    },
  });

  const login = async ({ username, password }) =>
    loginMut.mutateAsync({ username, password });

  const logout = async () => logoutMut.mutateAsync();

  return (
    <AuthContext.Provider value={{ accessToken, user, login, logout, ready }}>
      {ready ? children : <div className="p-6">Loading…</div>}
    </AuthContext.Provider>
  );
};
