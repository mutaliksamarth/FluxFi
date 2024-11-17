// app/api/updateProfile/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import prisma from "@repo/db/client";
import { z } from "zod";
import { authOptions } from "@/app/lib/auth";

const updateProfileSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().nullable(),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = updateProfileSchema.parse(body);

    // Convert string ID to number for Prisma
    const userId = parseInt(session.user.id);

    const updatedUser = await prisma.user.update({
      where: { 
        id: userId
      },
      data: {
        name: validatedData.name,
        email: validatedData.email,
         // Mark profile as completed
      },
      select: {
        id: true,
        name: true,
        email: true,
        
      }
    });

    // Update the session
    if (session.user) {
      session.user.name = updatedUser.name;
      session.user.email = updatedUser.email;
    }

    return NextResponse.json({ 
      success: true,
      user: updatedUser,
      message: "Profile updated" 
    });

  } catch (error) {
    console.error('Profile update error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: "Invalid data format" 
      }, { 
        status: 400 
      });
    }

    return NextResponse.json({ 
      error: "Failed to update profile" 
    }, { 
      status: 500 
    });
  }
}