import type { RequestHandler } from "express";
import { verifyAccessToken, type AuthTokenPayload } from "../lib/auth";

export const requireAuth: RequestHandler = (req, res, next) => {
  const header = req.header("authorization");
  const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;
  if (!token) {
    res.status(401).json({ error: "Authentication required." });
    return;
  }
  try {
    res.locals.auth = verifyAccessToken(token);
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token." });
  }
};

export function requireRole(...roles: AuthTokenPayload["role"][]): RequestHandler {
  return (_req, res, next) => {
    const auth = res.locals.auth as AuthTokenPayload | undefined;
    if (!auth || !roles.includes(auth.role)) {
      res.status(403).json({ error: "You do not have permission to access this resource." });
      return;
    }
    next();
  };
}