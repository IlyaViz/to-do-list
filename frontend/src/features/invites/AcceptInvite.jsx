import { useMutation } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router";
import { acceptInvite } from "./invitesApi";
import { formatError } from "../../utils/formatError";

const AcceptInvite = () => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const {
    mutate: acceptInviteMut,
    isLoading,
    error,
  } = useMutation({
    mutationFn: acceptInvite,
    onSuccess: () => {
      navigate("/dashboard");
    },
  });

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {error && (
        <p className="text-red-600">
          {formatError(error, "Failed to accept invite")}
        </p>
      )}

      <button
        onClick={() => acceptInviteMut(token)}
        className="px-4 py-2 bg-blue-600 text-white rounded"
        disabled={isLoading}
      >
        {isLoading ? "Accepting..." : "Accept Invite"}
      </button>
    </div>
  );
};

export default AcceptInvite;
