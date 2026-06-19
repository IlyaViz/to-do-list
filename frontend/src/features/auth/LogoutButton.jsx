import { useMutation } from "@tanstack/react-query";
import { logout } from "./authApi";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const LogoutButton = () => {
  const { logout: contextLogout } = useContext(AuthContext);

  const { mutate, isPending } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      contextLogout();
    },
  });

  return (
    <button
      onClick={() => mutate()}
      disabled={isPending}
      className={`text-white px-4 py-2 rounded ${isPending ? "bg-gray-500" : "bg-red-500"}`}
    >
      Logout
    </button>
  );
};

export default LogoutButton;
