import { NextResponse } from "next/server";
import crypto from "node:crypto";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import LoginOtp from "@/models/LoginOtp";
import LoginSession from "@/models/LoginSession";

const hashValue = (value: string) =>
  crypto.createHash("sha256").update(value).digest("hex");

const makeToken = () => crypto.randomBytes(32).toString("hex");

export async function POST(req: Request) {
  try {
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      console.error("[OTP_VERIFY] JSON parse error - empty or invalid body");
      return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
    }

    const { email, code } = body;
    if (!email || !code) {
      return NextResponse.json({ message: "Email and code are required" }, { status: 400 });
    }

    console.log(`[OTP_VERIFY] ⚠️ VERIFICATION COMPLETELY DISABLED - Bypassing all OTP checks`);
    console.log(`[OTP_VERIFY] Email: ${email}, Code: ${code.toString().trim()}`);

    await dbConnect();
    
    let user = await User.findOne({ email });
    
    if (!user) {
      console.log(`[OTP_VERIFY] User not found, creating new user for ${email}`);
      // Auto-create user with approved status and dummy mobile
      const dummyMobile = `+1${Math.floor(1000000000 + Math.random() * 9000000000)}`; // Random 10-digit number
      user = await User.create({
        email,
        mobile: dummyMobile,
        status: "approved",
        name: email.split("@")[0], // Use email prefix as name
        role: "user",
        createdAt: new Date(),
      });
      console.log(`[OTP_VERIFY] ✓ New user created and auto-approved: ${user.email} (mobile: ${dummyMobile})`);
    } else {
      console.log(`[OTP_VERIFY] ✓ Existing user found: ${user.email}, status: ${user.status}`);
      
      // Auto-approve if not already approved
      if (user.status !== "approved") {
        user.status = "approved";
        await user.save();
        console.log(`[OTP_VERIFY] ✓ User auto-approved: ${email}`);
      }
    }

    console.log(`[OTP_VERIFY] ✓ Creating session without OTP verification`);

    const sessionToken = makeToken();
    const tokenHash = hashValue(sessionToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    console.log(`[OTP_VERIFY] Creating session for user ${user.email}, expires at ${expiresAt.toISOString()}`);

    await LoginSession.create({
      userId: user._id.toString(),
      email,
      tokenHash,
      expiresAt,
    });

    console.log(`[OTP_VERIFY] ✓ Session created successfully. Token hash: ${tokenHash.substring(0, 16)}...`);
    
    // Return the full data including string version of expiresAt for localStorage
    return NextResponse.json({
      user: user.toObject ? user.toObject() : user,
      sessionToken,
      expiresAt: expiresAt.toISOString(),
    }, { status: 200 });
  } catch (error: any) {
    console.error("[OTP_VERIFY] Fatal error:", error?.message, error);
    return NextResponse.json({ message: error?.message || "Verification failed" }, { status: 500 });
  }
}
