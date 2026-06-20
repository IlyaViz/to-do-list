import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { getTasks } from "./tasksApi";
import { AuthContext } from "../../context/AuthContext";
import TaskItem from "./TaskItem";

const TaskList = () => {
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

  const uniqueTaskUsers = [...new Set(tasks.map((t) => t.owner))];

  return (
    <div className="mt-4">
      {tasks.length === 0 && <p>No tasks yet.</p>}

      <ul>
        {uniqueTaskUsers.map((user) => (
          <li key={user} className="mb-4">
            <h3 className="font-medium text-center">
              {currentUser.username === user ? "You" : user}
            </h3>
            <ul>
              {tasks
                .filter((t) => t.owner === user)
                .map((t) => (
                  <TaskItem key={t.id} task={t} />
                ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
