"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Task } from "@prisma/client";

interface Props {
  projectId: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  onTaskCreate: (task: Task) => void;
}

export default function AddTaskInline({ projectId, status, onTaskCreate }: Props) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);

    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title.trim(), projectId, status }),
    });

    if (res.ok) {
      const task = await res.json();
      onTaskCreate(task);
      setTitle("");
      setOpen(false);
    }
    setLoading(false);
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 w-full px-2 py-1.5 rounded-lg text-xs text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
      >
        <Plus className="w-3.5 h-3.5" />
        Add task
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-indigo-300 rounded-xl p-2.5 shadow-sm">
      <input
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title..."
        className="w-full text-sm text-slate-800 outline-none placeholder-slate-400"
        maxLength={120}
        onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
      />
      <div className="flex items-center gap-1.5 mt-2">
        <button
          type="submit"
          disabled={!title.trim() || loading}
          className="text-xs font-medium bg-indigo-600 text-white px-3 py-1 rounded-lg disabled:opacity-50 hover:bg-indigo-700 transition-colors"
        >
          {loading ? "Adding..." : "Add"}
        </button>
        <button
          type="button"
          onClick={() => { setOpen(false); setTitle(""); }}
          className="text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}
