import { useContext } from "react";
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import { formatError } from "../../utils/formatError";

const Login = () => {
  const { login } = useContext(AuthContext);

  const navigate = useNavigate();

  const {
    mutate: loginMutation,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: login,
    onSuccess: () => {
      navigate("/dashboard");
    },
  });

  const handle = async (e) => {
    e.preventDefault();

    const form = new FormData(e.target);

    loginMutation({
      username: form.get("username"),
      password: form.get("password"),
    });
  };

  return (
    <form onSubmit={handle} className="p-6 max-w-md flex flex-col items-center">
      <h2 className="text-lg font-medium">Login</h2>

      {isError && (
        <p className="text-red-600">{formatError(error, "Login failed")}</p>
      )}

      <label className="block mt-3">
        Username
        <input
          name="username"
          type="text"
          required
          className="block mt-1 w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </label>

      <label className="block mt-3">
        Password
        <input
          name="password"
          type="password"
          required
          className="block mt-1 w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </label>

      <button
        className="mt-4 px-3 py-2 bg-blue-600 text-white"
        disabled={isPending}
      >
        {isPending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
};

export default Login;
