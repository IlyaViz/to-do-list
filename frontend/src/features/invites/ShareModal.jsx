import { useState } from "react";
import { sendInvite as apiSend } from "./invitesApi";

const ShareModal = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);

  const send = async (e) => {
    e.preventDefault();
    try {
      await apiSend(email);

      setStatus("sent");
    } catch (e) {
      setStatus("error");
    }
  };

  return (
    <div className="mt-6 p-4 border rounded max-w-md">
      <h3 className="font-medium">Share your list</h3>

      <form onSubmit={send} className="mt-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="friend@example.com"
          className="w-full"
        />

        <div className="mt-2">
          <button className="px-3 py-1 bg-blue-600 text-white">
            Send invite
          </button>
        </div>
      </form>

      {status === "sent" && (
        <p className="text-green-600 mt-2">Invitation sent</p>
      )}

      {status === "error" && (
        <p className="text-red-600 mt-2">Failed to send</p>
      )}
    </div>
  );
};

export default ShareModal;
