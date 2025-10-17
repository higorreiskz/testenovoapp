import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User, { UserRole } from "../models/User";
import { signToken } from "../utils/token";
import { AuthenticatedRequest } from "../middleware/authMiddleware";

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { name, email, password, role, profilePic, portfolioUrl, socialLinks } =
      req.body;

    if (!name || !email || !password) {
      res.status(400).json({ message: "Nome, email e senha são obrigatórios" });
      return;
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(409).json({ message: "E-mail já cadastrado" });
      return;
    }

    const normalizedRoleInput =
      typeof role === "string" ? (role.toLowerCase() as UserRole) : undefined;
    const normalizedRole: UserRole =
      normalizedRoleInput === "creator" || normalizedRoleInput === "clipper"
        ? normalizedRoleInput
        : "clipper";

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: normalizedRole,
      profilePic,
      portfolioUrl,
      socialLinks,
    });

    const token = signToken({ id: user.id, role: user.role });

    res.status(201).json({ token, user: user.toJSON() });
  } catch (error) {
    console.error("Erro no registro", error);
    res.status(500).json({ message: "Não foi possível registrar o usuário" });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Credenciais inválidas" });
      return;
    }

    const user = await User.findOne({ email });

    if (!user) {
      res.status(401).json({ message: "Usuário ou senha inválidos" });
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      res.status(401).json({ message: "Usuário ou senha inválidos" });
      return;
    }

    const token = signToken({ id: user.id, role: user.role });

    res.json({ token, user: user.toJSON() });
  } catch (error) {
    console.error("Erro no login", error);
    res.status(500).json({ message: "Não foi possível autenticar" });
  }
}

export function getProfile(req: AuthenticatedRequest, res: Response): void {
  if (!req.user) {
    res.status(401).json({ message: "Usuário não autenticado" });
    return;
  }

  res.json({ user: req.user.toJSON() });
}
