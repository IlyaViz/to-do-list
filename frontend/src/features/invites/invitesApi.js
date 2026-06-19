import api from "../../api/axios";

export const sendInvite = async (email) => {
  const resp = await api.post("/invites/", { recipient_email: email });

  return resp.data;
};
