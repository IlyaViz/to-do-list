import { useState } from "react";
import Login from "./Login";
import Register from "./Register";

const Auth = () => {
  const [mode, setMode] = useState("login");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <div className="flex justify-center mb-4">
          <button
            className={`px-4 py-2 ${mode === "login" ? "bg-blue-600 text-white" : "bg-gray-200"} rounded-l`}
            onClick={() => setMode("login")}
          >
            Login
          </button>

          <button
            className={`px-4 py-2 ${mode === "register" ? "bg-blue-600 text-white" : "bg-gray-200"} rounded-r`}
            onClick={() => setMode("register")}
          >
            Register
          </button>
        </div>
        
        {mode === "login" ? <Login /> : <Register />}
      </div>
    </div>
  );
};

export default Auth;
