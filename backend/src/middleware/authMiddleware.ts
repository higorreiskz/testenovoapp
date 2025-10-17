import { NextFunction, Request, Response } from "express";
import User, { IUser, UserRole } from "../models/User";
import { verifyToken } from "../utils/token";

export interface AuthenticatedRequest extends Request {
  user?: IUser;
}

export async function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      res.status(401).json({ message: "Token não informado" });
      return;
    }

    const token = authHeader.split(" ")[1];
    const payload = verifyToken(token);

    const user = await User.findById(payload.id);

    if (!user) {
      res.status(401).json({ message: "Usuário não encontrado" });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Erro na autenticação", error);
    res.status(401).json({ message: "Token inválido" });
  }
}

export function authorize(roles: UserRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ message: "Acesso negado" });
      return;
    }

    next();
  };
}
