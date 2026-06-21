import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask } from "./tasksApi";
import { formatError } from "../../utils/formatError";

const TaskForm = () => {
  const [title, setTitle] = useState("");

  const qc = useQueryClient();

  const {
    mutate: createMut,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      setTitle("");
      qc.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const submit = (e) => {
    e.preventDefault();

    if (!title.trim()) return;

    createMut({ title });
  };

  return (
    <form onSubmit={submit} className="flex gap-2">
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

      {isError && (
        <p className="text-red-600 w-full">
          {formatError(error, "Failed to add task")}
        </p>
      )}
    </form>
  );
};

export default TaskForm;
