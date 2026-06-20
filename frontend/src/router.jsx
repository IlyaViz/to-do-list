import { createBrowserRouter } from "react-router";
import App from "./App";
import Home from "./components/Home";
import Login from "./features/auth/Login";
import Register from "./features/auth/Register";
import Dashboard from "./features/dashboard/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute";
import AcceptInvite from "./features/invites/AcceptInvite";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          { path: "dashboard", element: <Dashboard /> },
          { path: "accept-invite", element: <AcceptInvite /> },
        ],
      },
      {
        element: <GuestRoute />,
        children: [
          { index: true, element: <Home /> },
          { path: "login", element: <Login /> },
          { path: "register", element: <Register /> },
        ],
      },
    ],
  },
]);

export default router;
