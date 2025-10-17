import { Router } from "express";
import multer from "multer";
import {
  getClipperDashboard,
  listAvailableCreators,
  uploadClip,
  getCreatorClips,
  updateClipStatus,
} from "../controllers/clipController";
import { authenticate, authorize } from "../middleware/authMiddleware";

const upload = multer({ dest: "tmp/" });
const router = Router();

router.get(
  "/clipper/dashboard",
  authenticate,
  authorize(["clipper", "admin"]),
  getClipperDashboard
);

router.get(
  "/creators",
  authenticate,
  authorize(["clipper", "admin"]),
  listAvailableCreators
);

router.post(
  "/",
  authenticate,
  authorize(["clipper", "admin"]),
  upload.single("clip"),
  uploadClip
);

router.get(
  "/creator",
  authenticate,
  authorize(["creator", "admin"]),
  getCreatorClips
);

router.patch(
  "/:id/status",
  authenticate,
  authorize(["creator", "admin"]),
  updateClipStatus
);

export default router;
