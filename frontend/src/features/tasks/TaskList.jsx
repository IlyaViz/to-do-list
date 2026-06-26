import { useQuery } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { getTasks } from "./tasksApi";
import { AuthContext } from "../../context/AuthContext";
import TaskItem from "./TaskItem";

const TaskList = () => {
  const [filter, setFilter] = useState("all");
  const [userFilter, setUserFilter] = useState("all");

  const { user: currentUser } = useContext(AuthContext);

  const {
    data: tasks = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });

  if (isLoading) return <p className="mt-4">Loading tasks…</p>;

  if (isError)
    return <p className="mt-4 text-red-600">Failed to load tasks.</p>;

  const allUniqueUsers = [...new Set(tasks.map((t) => t.owner))];

  const filteredTasks = tasks.filter((task) => {
    if (userFilter !== "all" && task.owner !== userFilter) return false;

    if (filter === "active") return !task.is_completed;
    if (filter === "completed") return task.is_completed;
    if (filter === "overdue") {
      return (
        !task.is_completed && task.due_at && new Date(task.due_at) < new Date()
      );
    }

    return true;
  });

  const uniqueTaskUsers = [...new Set(filteredTasks.map((t) => t.owner))];

  return (
    <div className="mt-2">
      <div className="flex flex-wrap gap-4 mb-8 justify-between items-center pb-6 border-b border-gray-100">
        <div className="flex gap-2 flex-wrap justify-center">
          {["all", "active", "completed", "overdue"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md capitalize transition-colors ${
                filter === f
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {allUniqueUsers.length > 1 && (
          <select
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm cursor-pointer"
          >
            <option value="all">All Users</option>

            {allUniqueUsers.map((user) => (
              <option key={user} value={user}>
                {user === currentUser.username ? "Me" : user}
              </option>
            ))}
          </select>
        )}
      </div>

      {filteredTasks.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <span className="text-4xl mb-4">📭</span>

          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            No tasks found
          </h3>

          <p className="text-sm text-gray-500 text-center max-w-sm">
            {filter === "all" && userFilter === "all"
              ? "You don't have any tasks right now. Create one above to get started!"
              : "No tasks match your current filters. Try changing them."}
          </p>
        </div>
      )}

      <ul className="space-y-6">
        {uniqueTaskUsers.map((user) => {
          const userRootTasks = filteredTasks.filter(
            (t) => t.owner === user && t.parent_task === null,
          );

          if (userRootTasks.length === 0) return null;

          return (
            <li
              key={user}
              className="bg-gray-50 rounded-xl p-5 border border-gray-200"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                  {user.charAt(0).toUpperCase()}
                </div>

                <h3 className="font-semibold text-gray-800 text-lg">
                  {currentUser.username === user
                    ? "My Tasks"
                    : `${user}'s Tasks`}
                </h3>
              </div>

              <ul className="space-y-3">
                {userRootTasks.map((t) => (
                  <TaskItem key={t.id} task={t} allTasks={tasks} depth={0} />
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default TaskList;
