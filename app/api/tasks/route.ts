import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createSchema = z.object({
  title: z.string().min(1, "Title is required").max(120),
  description: z.string().max(500).optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).default("TODO"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
  projectId: z.string().cuid(),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const data = createSchema.parse(body);

    // Verify user owns the project
    const project = await prisma.project.findFirst({
      where: { id: data.projectId, userId: session.user.id },
    });
    if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

    // Get max order in the target column
    const maxOrder = await prisma.task.aggregate({
      where: { projectId: data.projectId, status: data.status },
      _max: { order: true },
    });

    const task = await prisma.task.create({
      data: { ...data, order: (maxOrder._max.order ?? -1) + 1 },
    });

    return NextResponse.json(task, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
