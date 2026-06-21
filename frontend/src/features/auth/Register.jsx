import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { register } from "./authApi";
import { formatError, formatFieldErrors } from "../../utils/formatError";

const Register = () => {
  const navigate = useNavigate();

  const {
    mutate: registerMut,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: register,
    onSuccess: () => navigate("/login"),
  });

  const handle = (e) => {
    e.preventDefault();

    const form = new FormData(e.target);

    registerMut({
      username: form.get("username"),
      email: form.get("email"),
      password: form.get("password"),
      passwordConfirm: form.get("password_confirm"),
    });
  };

  const getError = () => {
    if (error?.response?.data?.detail) {
      return <p>{formatError(error, "Registration failed")}</p>;
    }

    return formatFieldErrors(error, "Registration failed");
  };

  return (
    <form onSubmit={handle} className="p-6 max-w-md flex flex-col items-center">
      <h2 className="text-lg font-medium">Register</h2>

      {isError && <p className="text-red-600 text-center whitespace-pre-line">{getError()}</p>}

      <label className="block mt-3">
        Username
        <input name="username" required className="block mt-1 w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400" />
      </label>

      <label className="block mt-3">
        Email
        <input
          name="email"
          type="email"
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

      <label className="block mt-3">
        Confirm Password
        <input
          name="password_confirm"
          type="password"
          required
          className="block mt-1 w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </label>

      <button
        className="mt-4 px-3 py-2 bg-green-600 text-white"
        disabled={isPending}
      >
        {isPending ? "Registering..." : "Register"}
      </button>
    </form>
  );
};

export default Register;
