"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Task } from "@prisma/client";
import { cn } from "@/lib/utils";
import TaskCard from "./TaskCard";
import AddTaskInline from "@/components/tasks/AddTaskInline";

interface Props {
  id: string;
  label: string;
  color: string;
  tasks: Task[];
  projectId: string;
  onTaskUpdate: (id: string, updates: Partial<Task>) => void;
  onTaskDelete: (id: string) => void;
  onTaskCreate: (task: Task) => void;
}

const HEADER_STYLES: Record<string, string> = {
  slate: "bg-slate-100 text-slate-700",
  amber: "bg-amber-100 text-amber-700",
  emerald: "bg-emerald-100 text-emerald-700",
};

const DOT_STYLES: Record<string, string> = {
  slate: "bg-slate-400",
  amber: "bg-amber-400",
  emerald: "bg-emerald-500",
};

export default function KanbanColumn({
  id,
  label,
  color,
  tasks,
  projectId,
  onTaskUpdate,
  onTaskDelete,
  onTaskCreate,
}: Props) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div className="flex flex-col w-72 shrink-0">
      {/* Column header */}
      <div className={cn("flex items-center gap-2 px-3 py-2 rounded-xl mb-3", HEADER_STYLES[color])}>
        <div className={cn("w-2 h-2 rounded-full", DOT_STYLES[color])} />
        <span className="text-sm font-semibold">{label}</span>
        <span className="ml-auto text-xs font-medium opacity-60">{tasks.length}</span>
      </div>

      {/* Tasks */}
      <div
        ref={setNodeRef}
        className={cn(
          "flex flex-col gap-2.5 min-h-[120px] rounded-xl p-2 transition-colors",
          isOver && "bg-indigo-50 border-2 border-dashed border-indigo-300"
        )}
      >
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onUpdate={onTaskUpdate}
              onDelete={onTaskDelete}
            />
          ))}
        </SortableContext>

        {tasks.length === 0 && !isOver && (
          <div className="flex-1 flex items-center justify-center text-slate-300 text-xs py-6">
            No tasks
          </div>
        )}
      </div>

      {/* Add task */}
      <div className="mt-2">
        <AddTaskInline
          projectId={projectId}
          status={id as "TODO" | "IN_PROGRESS" | "DONE"}
          onTaskCreate={onTaskCreate}
        />
      </div>
    </div>
  );
}
