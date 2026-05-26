import { NextResponse } from "next/server";
import crypto from "node:crypto";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import LoginSession from "@/models/LoginSession";
import { verifyPassword } from "@/lib/password";

const hashValue = (value: string) =>
  crypto.createHash("sha256").update(value).digest("hex");

const makeToken = () => crypto.randomBytes(32).toString("hex");
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export async function POST(req: Request) {
  try {
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
    }

    const { identifier, email, username, password, adminId } = body || {};

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

    const loginId =
      (typeof identifier === "string" && identifier) ||
      (typeof email === "string" && email) ||
      (typeof username === "string" && username) ||
      "";
    const rawPassword = typeof password === "string" ? password : "";

    if (!loginId || !rawPassword) {
      return NextResponse.json(
        { message: "Email or username and password are required" },
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
      return NextResponse.json({ message: "Your application is still pending review." }, { status: 403 });
    }

    const isValid = await verifyPassword(rawPassword, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const sessionToken = makeToken();
    const tokenHash = hashValue(sessionToken);
    const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

    await LoginSession.create({
      userId: user._id.toString(),
      email: user.email,
      tokenHash,
      expiresAt,
    });

    const userObject = user.toObject();
    delete userObject.passwordHash;

    return NextResponse.json(
      { user: userObject, sessionToken, expiresAt: expiresAt.toISOString() },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Login] Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
