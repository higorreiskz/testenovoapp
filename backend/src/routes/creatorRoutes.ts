import { Router } from "express";
import {
  getCreatorDashboard,
  setCreatorCPM,
} from "../controllers/creatorController";
import { authenticate, authorize } from "../middleware/authMiddleware";

const router = Router();

router.use(authenticate, authorize(["creator", "admin"]));

router.get("/dashboard", getCreatorDashboard);
router.post("/cpm", setCreatorCPM);

export default router;
