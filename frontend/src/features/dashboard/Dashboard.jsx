import TaskList from "../tasks/TaskList";
import TaskForm from "../tasks/TaskForm";
import ShareModal from "../invites/ShareModal";

const Dashboard = () => {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold">Dashboard</h2>

      <div className="mt-4">
        <TaskForm />
        <TaskList />
      </div>

      <ShareModal />
    </div>
  );
};

export default Dashboard;
