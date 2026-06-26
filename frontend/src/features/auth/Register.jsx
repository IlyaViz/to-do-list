import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { register } from "./authApi";
import { formatError, formatFieldErrors } from "../../utils/formatError";

const Register = () => {
  const { mutate: registerMut, isPending } = useMutation({
    mutationFn: register,
    onError: (error) => {
      toast.error(getError(error));
    },
    onSuccess: () => {
      toast.success("Registration successful! You can now log in.");
    },
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

  const getError = (error) => {
    if (error?.response?.data?.detail) {
      return <p>{formatError(error, "Registration failed")}</p>;
    }

    return formatFieldErrors(error, "Registration failed");
  };

  return (
    <form onSubmit={handle} className="p-6 max-w-md flex flex-col items-center">
      <h2 className="text-lg font-medium">Register</h2>

      <label className="block mt-3">
        Username
        <input
          name="username"
          required
          className="block mt-1 w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
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
        {isPending ? "..." : "Register"}
      </button>
    </form>
  );
};

export default Register;
