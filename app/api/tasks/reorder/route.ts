import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  taskId: z.string().cuid(),
  newStatus: z.enum(["TODO", "IN_PROGRESS", "DONE"]),
  newOrder: z.number().int().min(0),
});

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { taskId, newStatus, newOrder } = schema.parse(body);

    const task = await prisma.task.findFirst({
      where: { id: taskId, project: { userId: session.user.id } },
    });
    if (!task) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Shift orders in the target column to make room
    await prisma.task.updateMany({
      where: {
        projectId: task.projectId,
        status: newStatus,
        order: { gte: newOrder },
        id: { not: taskId },
      },
      data: { order: { increment: 1 } },
    });

    const updated = await prisma.task.update({
      where: { id: taskId },
      data: { status: newStatus, order: newOrder },
    });

    return NextResponse.json(updated);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
