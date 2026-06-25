import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createTask } from "./tasksApi";
import { formatError } from "../../utils/formatError";

const TaskForm = ({ parentId }) => {
  const [title, setTitle] = useState("");

  const qc = useQueryClient();

  const { mutate: createMut, isPending } = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      setTitle("");
      qc.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (error) => {
      toast.error(formatError(error, "Failed to create task"));
    },
  });

  const submit = (e) => {
    e.preventDefault();

    if (!title.trim()) return;

    createMut({ title, parent_task: parentId });
  };

  return (
    <form
      onSubmit={submit}
      className={`flex flex-col gap-2 ${parentId ? "ml-4 text-xs" : ""}`}
    >
      <div className="flex-1 flex gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New task"
          className="flex-1 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-green-400"
          disabled={isPending}
        />

        <button
          className="px-3 py-1 bg-green-600 text-white"
          disabled={isPending}
        >
          {isPending ? "Adding..." : "Add"}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
