import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { hashPassword } from "@/lib/password";

const NAME_REGEX = /^[A-Za-z0-9 @_-]+$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  try {
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
    }

    // Accept 'name' (new) or fall back to 'username' (legacy)
    const { name, username, email, password } = body || {};
    const rawName = typeof name === "string" ? name.trim() : typeof username === "string" ? username.trim() : "";
    const rawEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
    const rawPassword = typeof password === "string" ? password : "";

    if (!rawName || !rawEmail || !rawPassword) {
      return NextResponse.json({ message: "Name, email, and password are required" }, { status: 400 });
    }

    if (!NAME_REGEX.test(rawName)) {
      return NextResponse.json({ message: "Name can only include letters, numbers, spaces, @, _ and -" }, { status: 400 });
    }

    if (rawName.length < 2 || rawName.length > 40) {
      return NextResponse.json({ message: "Name must be between 2 and 40 characters" }, { status: 400 });
    }

    if (!EMAIL_REGEX.test(rawEmail)) {
      return NextResponse.json({ message: "Please provide a valid email address" }, { status: 400 });
    }

    if (rawPassword.length < 8) {
      return NextResponse.json({ message: "Password must be at least 8 characters" }, { status: 400 });
    }

    await dbConnect();

    const existingUser = await User.findOne({ email: rawEmail });
    if (existingUser) {
      return NextResponse.json({ message: "Email already in use" }, { status: 409 });
    }

    const passwordHash = await hashPassword(rawPassword);

    const newUser = await User.create({
      name: rawName,
      email: rawEmail,
      passwordHash,
      status: "approved",
      role: "user",
    });

    // Notify all connected clients that a new member joined
    const io = (globalThis as any).__socketio;
    if (io) {
      io.emit("new-member", {
        _id: newUser._id,
        name: newUser.name,
        avatarConfig: newUser.avatarConfig,
        email: newUser.email,
      });
    }

    return NextResponse.json({ message: "Signup successful" }, { status: 201 });
  } catch (error: any) {
    console.error("[Signup] Error:", error?.message || error);
    return NextResponse.json({ message: "Signup failed" }, { status: 500 });
  }
}
