import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import KanbanBoard from "@/components/kanban/KanbanBoard";
import NewTaskButton from "@/components/tasks/NewTaskButton";

export const dynamic = "force-dynamic";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;

  const project = await prisma.project.findFirst({
    where: { id, userId: session.user.id },
    include: {
      tasks: {
        orderBy: [{ order: "asc" }, { createdAt: "asc" }],
      },
    },
  });

  if (!project) notFound();

  const todo = project.tasks.filter((t) => t.status === "TODO");
  const inProgress = project.tasks.filter((t) => t.status === "IN_PROGRESS");
  const done = project.tasks.filter((t) => t.status === "DONE");

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-4">
        <Link
          href="/dashboard"
          className="text-slate-400 hover:text-slate-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex items-center gap-3 flex-1">
          <div
            className="w-3 h-3 rounded-full shrink-0"
            style={{ backgroundColor: project.color }}
          />
          <h1 className="font-bold text-slate-900 text-lg">{project.name}</h1>
          {project.description && (
            <span className="text-slate-400 text-sm hidden sm:block">
              · {project.description}
            </span>
          )}
        </div>
        <NewTaskButton projectId={project.id} />
      </div>

      {/* Board */}
      <div className="flex-1 overflow-auto p-6">
        <KanbanBoard
          projectId={project.id}
          initialTodo={todo}
          initialInProgress={inProgress}
          initialDone={done}
        />
      </div>
    </div>
  );
}
