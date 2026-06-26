import { useMutation } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router";
import toast from "react-hot-toast";
import { acceptInvite } from "./invitesApi";
import { formatError } from "../../utils/formatError";

const AcceptInvite = () => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const {
    mutate: acceptInviteMut,
    isPending,
    error,
  } = useMutation({
    mutationFn: acceptInvite,
    onSuccess: () => {
      navigate("/dashboard");
    },
    onError: (error) => {
      toast.error(formatError(error, "Failed to accept invite"));
    },
  });

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <button
        onClick={() => acceptInviteMut(token)}
        className="px-4 py-2 bg-blue-600 text-white rounded"
        disabled={isPending}
      >
        {isPending ? "..." : "Accept Invite"}
      </button>
    </div>
  );
};

export default AcceptInvite;
