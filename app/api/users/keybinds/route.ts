import { NextResponse } from "next/server";
import crypto from "node:crypto";
import dbConnect from "@/lib/db";
import LoginSession from "@/models/LoginSession";
import User from "@/models/User";

const hashValue = (v: string) => crypto.createHash("sha256").update(v).digest("hex");

// PATCH /api/users/keybinds — save pttKeycode and/or muteKeycode
export async function PATCH(req: Request) {
  try {
    const { token, pttKeycode, muteKeycode } = await req.json();

    if (!token) {
      return NextResponse.json({ message: "Authentication required" }, { status: 401 });
    }

    await dbConnect();
    const session = await LoginSession.findOne({ tokenHash: hashValue(token) });

    if (!session || session.expiresAt.getTime() < Date.now()) {
      return NextResponse.json({ message: "Invalid or expired session" }, { status: 401 });
    }

    const updateFields: Record<string, number> = {};
    if (pttKeycode !== undefined) updateFields.pttKeycode = pttKeycode;
    if (muteKeycode !== undefined) updateFields.muteKeycode = muteKeycode;

    if (Object.keys(updateFields).length === 0) {
      return NextResponse.json({ message: "No keybinds provided" }, { status: 400 });
    }

    const updatedUser = await User.findByIdAndUpdate(
      session.userId,
      { $set: updateFields },
      { new: true }
    );

    return NextResponse.json({ user: updatedUser }, { status: 200 });
  } catch (err: any) {
    console.error("[Keybinds] Error:", err?.message);
    return NextResponse.json({ message: "Failed to save keybinds" }, { status: 500 });
  }
}
