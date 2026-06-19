import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router";

const Login = () => {
  const [error, setError] = useState(null);

  const { login } = useContext(AuthContext);

  const navigate = useNavigate();

  const handle = async (e) => {
    e.preventDefault();

    const form = new FormData(e.target);

    try {
      await login({
        username: form.get("username"),
        password: form.get("password"),
      });
      navigate("/dashboard");
    } catch (err) {
      setError("Login failed");
    }
  };

  return (
    <form onSubmit={handle} className="p-6 max-w-md flex flex-col items-center">
      <h2 className="text-lg font-medium">Login</h2>
      {error && <p className="text-red-600">{error}</p>}
      <label className="block mt-3">
        Username
        <input
          name="username"
          type="text"
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
      <button className="mt-4 px-3 py-2 bg-blue-600 text-white">Sign in</button>
    </form>
  );
};

export default Login;
