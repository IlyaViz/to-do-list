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
      className={`flex flex-col gap-2 ${parentId ? "text-sm" : ""}`}
    >
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          className="flex-1 min-w-[150px] border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-shadow"
          required
          disabled={isPending}
        />

        <input
          type="datetime-local"
          value={dueAt}
          onChange={(e) => setDueAt(e.target.value)}
          className="w-full sm:w-auto border border-gray-300 rounded-lg px-3 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-shadow"
          disabled={isPending}
        />

        <button
          className={`w-full sm:w-auto px-5 py-2 font-medium text-white rounded-lg shadow-sm transition-colors ${
            inputIsValid
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-300 cursor-not-allowed"
          }`}
          disabled={isPending || !inputIsValid}
        >
          {isPending ? "..." : parentId ? "Add Subtask" : "Add Task"}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
