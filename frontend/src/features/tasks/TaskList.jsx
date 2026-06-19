import { useQuery } from "@tanstack/react-query";
import { getTasks } from "./tasksApi";
import TaskItem from "./TaskItem";

const TaskList = () => {
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

  return (
    <div className="mt-4">
      {tasks.length === 0 && <p>No tasks yet.</p>}
      <ul>
        {tasks.map((t) => (
          <TaskItem key={t.id} task={t} />
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
