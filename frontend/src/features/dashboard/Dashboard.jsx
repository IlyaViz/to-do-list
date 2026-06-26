import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import TaskList from "../tasks/TaskList";
import TaskForm from "../tasks/TaskForm";
import ShareModal from "../invites/ShareModal";

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Welcome back{user?.username ? `, ${user.username}` : ""}! 👋
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage your tasks, collaborate, and stay productive.
            </p>
          </div>
          
          <ShareModal />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <TaskForm />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <TaskList />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
