import api, { setAccessToken } from "../../api/axios";

export const login = async ({ username, password }) => {
  const resp = await api.post("/auth/token/", { username, password });

  const data = resp.data;

  if (data?.access) setAccessToken(data.access);

  return data;
};

export const refresh = async () => {
  const resp = await api.post("/auth/token/refresh/", {});

  const data = resp.data;

  if (data?.access) setAccessToken(data.access);

  return data;
};

export const logout = async () => {
  await api.post("/auth/token/logout/");

  setAccessToken(null);
};

export const me = async () => {
  const resp = await api.get("/auth/me/");

  return resp.data;
};

export const register = async ({
  username,
  email,
  password,
  passwordConfirm,
}) => {
  const resp = await api.post("/auth/register/", {
    username,
    email,
    password,
    password_confirm: passwordConfirm,
  });

  return resp.data;
};
