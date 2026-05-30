import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import LoginOtp from "@/models/LoginOtp";
import { verifyPassword } from "@/lib/password";
import { sendNotifyMail } from "@/lib/notifyMail";
import crypto from "node:crypto";

const hashValue = (value: string) =>
  crypto.createHash("sha256").update(value).digest("hex");

const makeCode = () => Math.floor(100000 + Math.random() * 900000).toString();

export async function POST(req: Request) {
  try {
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
    }

    const { identifier, email, username, password, adminId } = body || {};

    // ─── Admin login (no OTP) ───────────────────────────────────────────────
    const ADMIN_ID = process.env.ADMIN_ID;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

    if (adminId && password) {
      if (adminId === ADMIN_ID && password === ADMIN_PASSWORD) {
        const adminUser = {
          _id: "admin-user",
          name: "Admin",
          email: "admin@callu.com",
          mobile: ADMIN_ID,
          status: "approved",
          role: "admin",
          avatarConfig: { color: "bg-zinc-100" },
        };
        return NextResponse.json({ user: adminUser }, { status: 200 });
      }
      return NextResponse.json({ message: "Invalid admin credentials" }, { status: 401 });
    }

    // ─── Regular user login ─────────────────────────────────────────────────
    const loginId =
      (typeof identifier === "string" && identifier) ||
      (typeof email === "string" && email) ||
      (typeof username === "string" && username) ||
      "";
    const rawPassword = typeof password === "string" ? password : "";

    if (!loginId || !rawPassword) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }


    await dbConnect();

    const normalizedId = loginId.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedId }).select("+passwordHash");

    if (!user) {
      return NextResponse.json({ message: "Email is not registered." }, { status: 401 });
    }

    if (!user.passwordHash) {
      return NextResponse.json({ message: "Password not set for this account" }, { status: 400 });
    }

    if (user.status !== "approved") {
      return NextResponse.json(
        { message: "Your application is still pending review." },
        { status: 403 }
      );
    }

    const isValid = await verifyPassword(rawPassword, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    // ─── Password OK → send OTP ─────────────────────────────────────────────
    const code = makeCode();
    const codeHash = hashValue(code);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await LoginOtp.findOneAndUpdate(
      { email: normalizedId },
      { codeHash, expiresAt },
      { upsert: true, returnDocument: "after" }
    );

    console.log(`[Login] OTP generated for ${normalizedId}, expires at ${expiresAt.toISOString()}`);

    const subject = "Your CALLU verification code";
    const text = `Your CALLU verification code is ${code}. It expires in 10 minutes.`;
    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; background:#09090b; color:#ffffff; padding:32px;">
        <div style="max-width:520px;margin:0 auto;background:#18181b;border-radius:16px;padding:28px;border:1px solid #27272a;">
          <h1 style="margin:0 0 12px;font-size:22px;">CALLU verification</h1>
          <p style="margin:0 0 18px;color:#a1a1aa;">Use this code to complete your sign in. It expires in 10 minutes.</p>
          <div style="font-size:32px;font-weight:700;letter-spacing:8px;background:#0f172a;border:1px solid #1f2937;border-radius:12px;padding:16px;text-align:center;">
            ${code}
          </div>
          <p style="margin:16px 0 0;color:#71717a;font-size:12px;">If you didn't request this, someone may have your password — consider changing it.</p>
        </div>
      </div>
    `;

    try {
      await sendNotifyMail({ to: normalizedId, subject, text, html });
      console.log(`[Login] ✅ OTP sent to ${normalizedId}`);
    } catch (emailError: any) {
      console.error(`[Login] ❌ Failed to send OTP to ${normalizedId}:`, emailError?.message);
      return NextResponse.json(
        { message: "Failed to send verification code. Please try again." },
        { status: 503 }
      );
    }

    // Tell the client to show the OTP step
    return NextResponse.json(
      {
        requiresOtp: true,
        email: normalizedId,
        message: `A verification code has been sent to ${normalizedId}`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Login] Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
