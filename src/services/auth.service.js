import jwt from "jsonwebtoken";
import RefreshToken from "../models/RefreshToken.js";
import env from "../config/env.js";

export const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, roles: user.roles },
    env.jwtSecret,
    { expiresIn: "15m" }
  );
};

export const generateRefreshToken = async (user) => {
  const token = jwt.sign(
    { id: user._id },
    env.jwtRefreshSecret,
    { expiresIn: "7d" }
  );

  const refresh = new RefreshToken({
    user: user._id,
    token,
    expires: new Date(Date.now() + 7*24*60*60*1000)
  });

  await refresh.save();
  return token;
};
