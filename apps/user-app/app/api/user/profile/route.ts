// app/api/user/profile/route.ts
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "@repo/db/client";
import { authOptions } from "../../../lib/auth";

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const userId = Number(session.user.id);

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        number: data.number,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}