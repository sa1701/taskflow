"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "@prisma/client";
import { cn, PRIORITY_COLORS, PRIORITY_LABELS } from "@/lib/utils";
import { Trash2, GripVertical, Pencil } from "lucide-react";
import EditTaskModal from "@/components/tasks/EditTaskModal";

interface Props {
  task: Task;
  isDragging?: boolean;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
}

export default function TaskCard({ task, isDragging, onUpdate, onDelete }: Props) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  async function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    setDeleting(true);
    await fetch(`/api/tasks/${task.id}`, { method: "DELETE" });
    onDelete(task.id);
  }

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={cn(
          "group bg-white border border-slate-200 rounded-xl p-3 shadow-sm cursor-default select-none",
          "hover:border-slate-300 hover:shadow-md transition-all",
          (isDragging || isSortableDragging) && "opacity-40 shadow-lg border-indigo-300"
        )}
      >
        <div className="flex items-start gap-2">
          {/* Drag handle */}
          <button
            {...attributes}
            {...listeners}
            className="mt-0.5 text-slate-300 hover:text-slate-500 cursor-grab active:cursor-grabbing transition-colors shrink-0"
          >
            <GripVertical className="w-4 h-4" />
          </button>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-800 leading-snug">{task.title}</p>
            {task.description && (
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">{task.description}</p>
            )}
            <div className="mt-2">
              <span
                className={cn(
                  "text-xs font-medium px-2 py-0.5 rounded-full",
                  PRIORITY_COLORS[task.priority]
                )}
              >
                {PRIORITY_LABELS[task.priority]}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <button
              onClick={() => setEditOpen(true)}
              className="p-1 rounded-md text-slate-300 hover:text-indigo-500 hover:bg-indigo-50 transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="p-1 rounded-md text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors"
            >
              {deleting ? (
                <div className="w-3.5 h-3.5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Trash2 className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {editOpen && (
        <EditTaskModal
          task={task}
          onClose={() => setEditOpen(false)}
          onUpdate={onUpdate}
        />
      )}
    </>
  );
}
