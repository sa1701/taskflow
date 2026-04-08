"use client";

import { useState, useCallback } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import { Task } from "@prisma/client";
import KanbanColumn from "./KanbanColumn";
import TaskCard from "./TaskCard";

type Status = "TODO" | "IN_PROGRESS" | "DONE";

interface Props {
  projectId: string;
  initialTodo: Task[];
  initialInProgress: Task[];
  initialDone: Task[];
}

export default function KanbanBoard({
  projectId,
  initialTodo,
  initialInProgress,
  initialDone,
}: Props) {
  const [columns, setColumns] = useState<Record<Status, Task[]>>({
    TODO: initialTodo,
    IN_PROGRESS: initialInProgress,
    DONE: initialDone,
  });
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const findColumn = useCallback(
    (taskId: string): Status | null => {
      for (const [status, tasks] of Object.entries(columns)) {
        if (tasks.find((t) => t.id === taskId)) return status as Status;
      }
      return null;
    },
    [columns]
  );

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const col = findColumn(active.id as string);
    if (!col) return;
    const task = columns[col].find((t) => t.id === active.id);
    setActiveTask(task ?? null);
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const fromCol = findColumn(activeId);
    if (!fromCol) return;

    // Determine target column: over.id might be a column id or a task id
    const validStatuses: Status[] = ["TODO", "IN_PROGRESS", "DONE"];
    let toCol: Status;
    let newOrder: number;

    if (validStatuses.includes(overId as Status)) {
      // Dropped directly onto a column
      toCol = overId as Status;
      newOrder = columns[toCol].length;
    } else {
      // Dropped onto another task — find that task's column
      const targetCol = findColumn(overId);
      if (!targetCol) return;
      toCol = targetCol;
      const targetIdx = columns[toCol].findIndex((t) => t.id === overId);
      newOrder = targetIdx >= 0 ? targetIdx : columns[toCol].length;
    }

    if (fromCol === toCol && columns[fromCol].findIndex((t) => t.id === activeId) === newOrder) {
      return; // No change
    }

    // Optimistic update
    setColumns((prev) => {
      const task = prev[fromCol].find((t) => t.id === activeId)!;
      const newFrom = prev[fromCol].filter((t) => t.id !== activeId);
      const newTo = [...prev[toCol].filter((t) => t.id !== activeId)];
      newTo.splice(newOrder, 0, { ...task, status: toCol, order: newOrder });

      return {
        ...prev,
        [fromCol]: newFrom,
        [toCol]: newTo,
      };
    });

    // Persist
    await fetch("/api/tasks/reorder", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskId: activeId, newStatus: toCol, newOrder }),
    });
  }

  function handleTaskUpdate(taskId: string, updates: Partial<Task>) {
    setColumns((prev) => {
      const col = Object.keys(prev).find((k) =>
        prev[k as Status].some((t) => t.id === taskId)
      ) as Status | undefined;
      if (!col) return prev;
      return {
        ...prev,
        [col]: prev[col].map((t) => (t.id === taskId ? { ...t, ...updates } : t)),
      };
    });
  }

  function handleTaskDelete(taskId: string) {
    setColumns((prev) => {
      const col = Object.keys(prev).find((k) =>
        prev[k as Status].some((t) => t.id === taskId)
      ) as Status | undefined;
      if (!col) return prev;
      return { ...prev, [col]: prev[col].filter((t) => t.id !== taskId) };
    });
  }

  function handleTaskCreate(task: Task) {
    setColumns((prev) => ({
      ...prev,
      [task.status]: [...prev[task.status as Status], task],
    }));
  }

  const columnDefs: { id: Status; label: string; color: string }[] = [
    { id: "TODO", label: "To Do", color: "slate" },
    { id: "IN_PROGRESS", label: "In Progress", color: "amber" },
    { id: "DONE", label: "Done", color: "emerald" },
  ];

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 h-full items-start">
        {columnDefs.map((col) => (
          <KanbanColumn
            key={col.id}
            id={col.id}
            label={col.label}
            color={col.color}
            tasks={columns[col.id]}
            projectId={projectId}
            onTaskUpdate={handleTaskUpdate}
            onTaskDelete={handleTaskDelete}
            onTaskCreate={handleTaskCreate}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTask && (
          <TaskCard task={activeTask} isDragging onUpdate={() => {}} onDelete={() => {}} />
        )}
      </DragOverlay>
    </DndContext>
  );
}
