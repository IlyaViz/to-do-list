import { useState } from "react";
import { useNavigate } from "react-router";
import { register as apiRegister } from "./authApi";

const Register = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handle = async (e) => {
    e.preventDefault();

    const form = new FormData(e.target);

    try {
      await apiRegister({
        username: form.get("username"),
        email: form.get("email"),
        password: form.get("password"),
        password_confirm: form.get("password_confirm"),
      });
      
      navigate("/login");
    } catch (err) {
      setError("Registration failed");
    }
  };

  return (
    <form onSubmit={handle} className="p-6 max-w-md">
      <h2 className="text-lg font-medium">Register</h2>

      {error && <p className="text-red-600">{error}</p>}

      <label className="block mt-3">
        Username
        <input name="username" required className="block mt-1 w-full" />
      </label>

      <label className="block mt-3">
        Email
        <input
          name="email"
          type="email"
          required
          className="block mt-1 w-full"
        />
      </label>

      <label className="block mt-3">
        Password
        <input
          name="password"
          type="password"
          required
          className="block mt-1 w-full"
        />
      </label>

      <label className="block mt-3">
        Confirm Password
        <input
          name="password_confirm"
          type="password"
          required
          className="block mt-1 w-full"
        />
      </label>

      <button className="mt-4 px-3 py-2 bg-green-600 text-white">
        Register
      </button>
    </form>
  );
};

export default Register;
