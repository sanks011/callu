import { Schema, model, models } from "mongoose";

const LoginOtpSchema = new Schema(
  {
    email: { type: String, required: true, index: true, unique: true },
    codeHash: { type: String, required: true },
    expiresAt: { type: Date, required: true, index: true },
    // "signup" = email not yet in DB, "login" = existing user
    purpose: { type: String, enum: ["signup", "login"], default: "login" },
    // Only set for signup OTPs — holds the data to create the user after verification
    pendingUser: {
      name: { type: String, default: null },
      passwordHash: { type: String, default: null },
    },
  },
  { timestamps: true }
);

// Force re-registration of the model to pick up schema changes
// (avoids stale cached model issues during development)
if (models.LoginOtp) {
  delete (models as any).LoginOtp;
}

export default model("LoginOtp", LoginOtpSchema);
