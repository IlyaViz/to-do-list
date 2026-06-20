import api from "../../api/axios";

export const sendInvite = async (email) => {
  const resp = await api.post("/invites/", { recipient_email: email });

  return resp.data;
};

export const acceptInvite = async (token) => {
  const resp = await api.post(`/invites/accept/${token}/`);

  return resp.data;
};
