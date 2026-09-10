import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { name, phone, email, password } = await req.json();

    if (!name || !phone || !password) {
      return NextResponse.json(
        { error: "Name, phone, and password are required." },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({
      where: { phone },
    });

    if (existing) {
      return NextResponse.json(
        { error: "This phone number is already registered." },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        phone,
        email: email || undefined,
        passwordHash,
        role: "CUSTOMER",
      },
    });

    return NextResponse.json({ success: true, userId: user.id });
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
