import { Router } from "express";
import authRoutes from "./authRoutes";
import clipRoutes from "./clipRoutes";
import creatorRoutes from "./creatorRoutes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/clips", clipRoutes);
router.use("/creator", creatorRoutes);

export default router;
