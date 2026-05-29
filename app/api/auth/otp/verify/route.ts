import { NextResponse } from "next/server";
import crypto from "node:crypto";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import LoginOtp from "@/models/LoginOtp";
import LoginSession from "@/models/LoginSession";

const hashValue = (value: string) =>
  crypto.createHash("sha256").update(value).digest("hex");

const makeToken = () => crypto.randomBytes(32).toString("hex");

// 30 days
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export async function POST(req: Request) {
  try {
    let body;
    try {
      body = await req.json();
    } catch {
      console.error("[OTP_VERIFY] JSON parse error");
      return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
    }

    const { email, code } = body;
    if (!email || !code) {
      return NextResponse.json({ message: "Email and code are required" }, { status: 400 });
    }

    await dbConnect();

    // ── Look up the OTP record ────────────────────────────────────────────────
    const otpRecord = await LoginOtp.findOne({ email });

    if (!otpRecord) {
      console.warn(`[OTP_VERIFY] No OTP found for ${email}`);
      return NextResponse.json(
        { message: "No verification code found. Please request a new one." },
        { status: 400 }
      );
    }

    // ── Check expiry ──────────────────────────────────────────────────────────
    if (new Date() > otpRecord.expiresAt) {
      console.warn(`[OTP_VERIFY] OTP expired for ${email}`);
      await LoginOtp.deleteOne({ email });
      return NextResponse.json(
        { message: "Verification code has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // ── Verify code hash ──────────────────────────────────────────────────────
    const inputHash = hashValue(code.toString().trim());
    if (inputHash !== otpRecord.codeHash) {
      console.warn(`[OTP_VERIFY] Invalid code for ${email}`);
      return NextResponse.json(
        { message: "Invalid verification code. Please try again." },
        { status: 400 }
      );
    }

    // ── OTP valid — consume it ────────────────────────────────────────────────
    const purpose = otpRecord.purpose || "login";
    const pendingUser = otpRecord.pendingUser;
    await LoginOtp.deleteOne({ email });
    console.log(`[OTP_VERIFY] ✅ OTP verified for ${email} (purpose: ${purpose})`);

    let user: any;

    if (purpose === "signup") {
      // ── Create the user now that email is confirmed ───────────────────────
      if (!pendingUser?.name || !pendingUser?.passwordHash) {
        console.error(`[OTP_VERIFY] Missing pendingUser data for signup OTP: ${email}`);
        return NextResponse.json(
          { message: "Signup data missing. Please sign up again." },
          { status: 400 }
        );
      }

      // Guard against race condition: check again if user already exists
      const alreadyExists = await User.findOne({ email });
      if (alreadyExists) {
        user = alreadyExists;
        console.warn(`[OTP_VERIFY] User already existed for ${email}, using existing record`);
      } else {
        user = await User.create({
          name: pendingUser.name,
          email,
          passwordHash: pendingUser.passwordHash,
          status: "approved",
          role: "user",
        });
        console.log(`[OTP_VERIFY] ✅ New user created: ${email}`);

        // Notify connected clients
        const io = (globalThis as any).__socketio;
        if (io) {
          io.emit("new-member", {
            _id: user._id,
            name: user.name,
            avatarConfig: user.avatarConfig,
            email: user.email,
          });
        }
      }
    } else {
      // ── Login: look up existing user ──────────────────────────────────────
      user = await User.findOne({ email });
      if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
      }
      if (user.status !== "approved") {
        return NextResponse.json(
          { message: "Your application is still pending review." },
          { status: 403 }
        );
      }
    }

    // ── Create 30-day session ─────────────────────────────────────────────────
    const sessionToken = makeToken();
    const tokenHash = hashValue(sessionToken);
    const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

    await LoginSession.create({
      userId: user._id.toString(),
      email,
      tokenHash,
      expiresAt,
    });

    console.log(
      `[OTP_VERIFY] ✅ Session created for ${email}, expires ${expiresAt.toISOString()}`
    );

    const userObject = user.toObject ? user.toObject() : { ...user };
    delete userObject.passwordHash;

    return NextResponse.json(
      { user: userObject, sessionToken, expiresAt: expiresAt.toISOString() },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[OTP_VERIFY] Fatal error:", error?.message, error);
    return NextResponse.json(
      { message: error?.message || "Verification failed" },
      { status: 500 }
    );
  }
}
