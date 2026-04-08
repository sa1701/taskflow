"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, CheckSquare } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Project {
  id: string;
  name: string;
  description: string | null;
  color: string;
  updatedAt: Date;
  _count: { tasks: number };
}

export default function ProjectCard({ project }: { project: Project }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
      return;
    }
    setDeleting(true);
    await fetch(`/api/projects/${project.id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <Link
      href={`/projects/${project.id}`}
      className="group relative bg-white border border-slate-200 rounded-2xl p-5 hover:border-slate-300 hover:shadow-sm transition-all"
    >
      {/* Color accent */}
      <div
        className="w-10 h-10 rounded-xl mb-4 flex items-center justify-center"
        style={{ backgroundColor: project.color + "20" }}
      >
        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: project.color }} />
      </div>

      <h3 className="font-semibold text-slate-900 mb-1 truncate pr-6">{project.name}</h3>
      {project.description && (
        <p className="text-slate-500 text-sm truncate mb-3">{project.description}</p>
      )}

      <div className="flex items-center gap-2 text-xs text-slate-400">
        <CheckSquare className="w-3.5 h-3.5" />
        <span>{project._count.tasks} task{project._count.tasks !== 1 ? "s" : ""}</span>
        <span>·</span>
        <span>{formatDate(project.updatedAt)}</span>
      </div>

      {/* Delete button */}
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="absolute top-4 right-4 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 text-slate-300 hover:text-red-500"
        title={confirmDelete ? "Click again to confirm" : "Delete project"}
      >
        {deleting ? (
          <div className="w-3.5 h-3.5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
        ) : (
          <Trash2 className="w-3.5 h-3.5" />
        )}
      </button>

      {confirmDelete && (
        <div className="absolute top-10 right-2 text-xs bg-red-600 text-white px-2 py-1 rounded-lg z-10 whitespace-nowrap">
          Click again to delete
        </div>
      )}
    </Link>
  );
}
