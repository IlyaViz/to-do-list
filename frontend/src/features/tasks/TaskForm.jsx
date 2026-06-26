import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createTask } from "./tasksApi";
import { formatError } from "../../utils/formatError";

const TaskForm = ({ parentId }) => {
  const [title, setTitle] = useState("");
  const [dueAt, setDueAt] = useState("");

  const qc = useQueryClient();

  const { mutate: createMut, isPending } = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      setTitle("");
      setDueAt("");
      qc.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (error) => {
      toast.error(formatError(error, "Failed to create task"));
    },
  });

  const submit = (e) => {
    e.preventDefault();

    const formattedDueAt = dueAt ? new Date(dueAt).toISOString() : null;

    createMut({ title, due_at: formattedDueAt, parent_task: parentId });
  };

  const inputIsValid = title.trim() !== "";

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
          className="flex-1 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
          disabled={isPending}
        />

        <input
          type="datetime-local"
          value={dueAt}
          onChange={(e) => setDueAt(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
          disabled={isPending}
        />

        <button
          className={`px-3 py-1 text-white  ${inputIsValid ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400 cursor-not-allowed"} rounded`}
          disabled={isPending || !inputIsValid}
        >
          {isPending ? "Adding..." : "Add"}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
