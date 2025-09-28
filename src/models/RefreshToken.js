import mongoose from "mongoose";

const RefreshTokenSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  token: { type: String, required: true },
  expires: { type: Date, required: true },
  revoked: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model("RefreshToken", RefreshTokenSchema);
