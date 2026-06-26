import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { sendInvite } from "./invitesApi";
import { formatError } from "../../utils/formatError";

const ShareModal = () => {
  const [email, setEmail] = useState("");

  const {
    mutate: sendMut,
    isPending,
    isError,
    error,
    isSuccess,
  } = useMutation({
    mutationFn: sendInvite,
    onSuccess: () => {
      setEmail("");
    },
    onError: (error) => {
      toast.error(formatError(error, "Failed to send invite"));
    },
  });

  const send = (e) => {
    e.preventDefault();

    sendMut(email);
  };

  return (
    <div className="mt-6 p-4 border rounded max-w-md flex flex-col items-center">
      <h3 className="font-medium">Share your list</h3>

      <form onSubmit={send} className="mt-2 flex flex-col items-center">
        <input
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="friend@example.com"
          className="w-full text-center border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        <div className="mt-2">
          <button
            className="px-3 py-1 bg-blue-600 text-white"
            disabled={isPending}
          >
            {isPending ? "..." : "Send invite"}
          </button>
        </div>
      </form>

      {isSuccess && <p className="text-green-600 mt-2">Invitation sent</p>}
    </div>
  );
};

export default ShareModal;
