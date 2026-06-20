import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask } from "./tasksApi";

const TaskForm = () => {
  const [title, setTitle] = useState("");

  const qc = useQueryClient();

  const {
    mutate: createMut,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: (payload) => createTask(payload),
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
        className="flex-1"
        disabled={isPending}
      />

      <button
        className="px-3 py-1 bg-green-600 text-white"
        disabled={isPending}
      >
        {isPending ? "Adding..." : "Add"}
      </button>

      {isError && (
        <p className="text-red-600 w-full">{error.response.data.detail}</p>
      )}
    </form>
  );
};

export default TaskForm;
