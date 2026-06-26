import { createContext, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  login as apiLogin,
  refresh as apiRefresh,
  logout as apiLogout,
  me as apiMe,
} from "../features/auth/authApi";
import { setAccessToken } from "../api/axios";

// eslint-disable-next-line
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setToken] = useState(
    () => localStorage.getItem("accessToken") || null,
  );
  const [isRefreshDone, setIsRefreshDone] = useState(
    () => !!localStorage.getItem("accessToken"),
  );

  const qc = useQueryClient();

  const { data: userData, isFetched } = useQuery({
    queryKey: ["me"],
    queryFn: apiMe,
    enabled: !!accessToken,
    retry: false,
  });

  const { mutateAsync: loginMutAsync } = useMutation({
    mutationFn: apiLogin,
    onSuccess: (data) => {
      if (data?.access) setToken(data.access);
    },
  });

  const { mutateAsync: logoutMutAsync } = useMutation({
    mutationFn: apiLogout,
    onSuccess: () => {
      setToken(null);
      qc.removeQueries({});
    },
  });

  const login = async ({ username, password }) =>
    loginMutAsync({ username, password });

  const logout = async () => logoutMutAsync();

  const user = userData ?? null;

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
    if (accessToken) return;

    const initRefresh = async () => {
      try {
        const data = await apiRefresh();
        if (data?.access) setToken(data.access);
      } catch (e) {
        console.warn("refresh failed", e);
      } finally {
        setIsRefreshDone(true);
      }
    };

    initRefresh();
  }, []);

  const ready = isRefreshDone && (!accessToken || isFetched);

  return (
    <AuthContext.Provider value={{ accessToken, user, login, logout, ready }}>
      {ready ? (
        children
      ) : (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>

          <p className="text-gray-500 font-medium tracking-wide">Loading...</p>
        </div>
      )}
    </AuthContext.Provider>
  );
};
