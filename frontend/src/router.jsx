import { createBrowserRouter } from "react-router";
import App from "./App";
import Dashboard from "./features/dashboard/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute";
import AcceptInvite from "./features/invites/AcceptInvite";
import Auth from "./features/auth/Auth";

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
        children: [{ index: true, element: <Auth /> }],
      },
    ],
  },
]);

export default router;
