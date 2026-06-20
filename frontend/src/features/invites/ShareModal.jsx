import { useMutation } from "@tanstack/react-query";
import { sendInvite } from "./invitesApi";

const ShareModal = () => {
  const {
    mutate: sendMut,
    isPending,
    isError,
    error,
    isSuccess,
  } = useMutation({
    mutationFn: sendInvite,
  });

  const send = (e) => {
    e.preventDefault();

    const form = new FormData(e.target);

    const email = form.get("email");

    sendMut(email);

    e.target.reset();
  };

  return (
    <div className="mt-6 p-4 border rounded max-w-md">
      <h3 className="font-medium">Share your list</h3>

      <form onSubmit={send} className="mt-2">
        <input
          name="email"
          type="email"
          placeholder="friend@example.com"
          className="w-full"
          required
        />

        <div className="mt-2">
          <button
            className="px-3 py-1 bg-blue-600 text-white"
            disabled={isPending}
          >
            {isPending ? "Sending..." : "Send invite"}
          </button>
        </div>
      </form>

      {isSuccess && <p className="text-green-600 mt-2">Invitation sent</p>}

      {isError && (
        <p className="text-red-600 mt-2">{error.response.data.detail}</p>
      )}
    </div>
  );
};

export default ShareModal;
