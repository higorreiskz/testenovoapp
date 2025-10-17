import jwt from "jsonwebtoken";

interface TokenPayload {
  id: string;
  role: string;
}

export function signToken(payload: TokenPayload, expiresIn = "7d"): string {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET não configurado");
  }

  return jwt.sign(payload, secret, { expiresIn });
}

export function verifyToken(token: string): TokenPayload {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET não configurado");
  }

  return jwt.verify(token, secret) as TokenPayload;
}
