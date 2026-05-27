import { NextResponse } from "next/server";
import crypto from "node:crypto";
import dbConnect from "@/lib/db";
import LoginSession from "@/models/LoginSession";
import User from "@/models/User";

const hashValue = (value: string) =>
  crypto.createHash("sha256").update(value).digest("hex");

export async function POST(req: Request) {
  try {
    const { token, name, email, mobile, avatarConfig, pttKeycode, muteKeycode } = await req.json();

    if (!token) {
      return NextResponse.json({ message: "Authentication required" }, { status: 401 });
    }

    if (!name || !email) {
      return NextResponse.json({ message: "Name and email are required" }, { status: 400 });
    }

    await dbConnect();
    const tokenHash = hashValue(token);
    const session = await LoginSession.findOne({ tokenHash });

    if (!session || session.expiresAt.getTime() < Date.now()) {
      return NextResponse.json({ message: "Invalid or expired session" }, { status: 401 });
    }

    const userId = session.userId;

    // Check if new email already exists for another user
    const existingEmail = await User.findOne({ email, _id: { $ne: userId } });
    if (existingEmail) {
      return NextResponse.json({ message: "Email is already taken" }, { status: 400 });
    }



    // Build update object
    const updateFields: Record<string, unknown> = { name, email, avatarConfig };
    if (mobile !== undefined) updateFields.mobile = mobile;
    if (pttKeycode !== undefined) updateFields.pttKeycode = pttKeycode;
    if (muteKeycode !== undefined) updateFields.muteKeycode = muteKeycode;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user: updatedUser }, { status: 200 });
  } catch (error: any) {
    console.error("[User Update] Error updating user profile:", error);
    return NextResponse.json({ message: error?.message || "Failed to update profile" }, { status: 500 });
  }
}
