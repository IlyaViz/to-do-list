import { Outlet } from "react-router";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import LogoutButton from "./features/auth/LogoutButton";
import "./index.css";

const App = () => {
  const { user } = useContext(AuthContext);

  return (
    <main>
      {user && (
        <nav className="bg-gray-800 p-2 text-white flex justify-end">
          <div className="flex items-center gap-4">
            {user.username}

            <LogoutButton />
          </div>
        </nav>
      )}

      <div className="flex justify-center">
        <Outlet />
      </div>
    </main>
  );
};

export default App;
