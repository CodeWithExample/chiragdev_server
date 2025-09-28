import speakeasy from "speakeasy";
import User from "../models/User.js";
import { generateAccessToken, generateRefreshToken } from "../services/auth.service.js";

export const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "Email already registered" });

    user = new User({ email });
    await user.setPassword(password);
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password, twoFACode } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    if (user.isLocked()) {
      return res.status(403).json({ message: "Account locked. Try later." });
    }

    const validPassword = await user.verifyPassword(password);
    if (!validPassword) {
      user.failedLoginAttempts += 1;
      if (user.failedLoginAttempts >= 5) {
        user.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
      }
      await user.save();
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Reset failed attempts
    user.failedLoginAttempts = 0;
    user.lockUntil = null;

    // If 2FA enabled, verify TOTP
    if (user.twoFA.enabled) {
      const verified = speakeasy.totp.verify({
        secret: user.twoFA.secret,
        encoding: "base32",
        token: twoFACode
      });
      if (!verified) return res.status(401).json({ message: "Invalid 2FA code" });
    }

    await user.save();

    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);

    res.json({ accessToken, refreshToken });
  } catch (err) {
    next(err);
  }
};
