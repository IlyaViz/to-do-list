import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask } from "./tasksApi";

const TaskForm = () => {
  const [title, setTitle] = useState("");
  const qc = useQueryClient();

  const createMut = useMutation({
    mutationFn: (payload) => createTask(payload),
    onSuccess: () => {
      setTitle("");
      qc.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const submit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    createMut.mutate({ title });
  };

  return (
    <form onSubmit={submit} className="flex gap-2">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="New task"
        className="flex-1"
      />
      <button className="px-3 py-1 bg-green-600 text-white">Add</button>
    </form>
  );
};

export default TaskForm;
