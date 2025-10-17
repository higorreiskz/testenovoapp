import { Response } from "express";
import Clip from "../models/Clip";
import User from "../models/User";
import { AuthenticatedRequest } from "../middleware/authMiddleware";

export async function setCreatorCPM(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Usuário não autenticado" });
      return;
    }

    if (req.user.role !== "creator") {
      res.status(403).json({ message: "Apenas criadores podem definir CPM" });
      return;
    }

    const cpm = Number(req.body.cpm);

    if (!Number.isFinite(cpm) || cpm <= 0) {
      res.status(400).json({ message: "Informe um CPM válido" });
      return;
    }

    req.user.cpm = cpm;
    await req.user.save();

    res.json({ message: "CPM atualizado", cpm: req.user.cpm });
  } catch (error) {
    console.error("Erro ao atualizar CPM", error);
    res.status(500).json({ message: "Não foi possível atualizar o CPM" });
  }
}

export async function getCreatorDashboard(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Usuário não autenticado" });
      return;
    }

    const creatorId = req.user.id;

    const clips = await Clip.find({ creatorId }).populate("clipperId", "name");

    const totalClips = clips.length;
    const approvedClips = clips.filter((clip) => clip.status === "approved");
    const pendingClips = clips.filter((clip) => clip.status === "pending");
    const rejectedClips = clips.filter((clip) => clip.status === "rejected");

    const totalViews = clips.reduce((sum, clip) => sum + clip.views, 0);
    const totalEarnings = clips.reduce((sum, clip) => sum + clip.earnings, 0);

    const activeClippers = await Clip.aggregate([
      { $match: { creatorId: req.user._id } },
      {
        $group: {
          _id: "$clipperId",
          totalViews: { $sum: "$views" },
          totalEarnings: { $sum: "$earnings" },
          clips: { $sum: 1 },
        },
      },
      { $sort: { totalViews: -1 } },
      { $limit: 5 },
    ]);

    const clipperDetails = await User.find({
      _id: { $in: activeClippers.map((item) => item._id) },
    }).select("name email role portfolioUrl");

    const clipperStats = activeClippers.map((clipper) => {
      const user = clipperDetails.find((item) => item.id === String(clipper._id));
      return {
        clipperId: clipper._id,
        name: user?.name ?? "Clipper",
        portfolioUrl: user?.portfolioUrl,
        totalViews: clipper.totalViews,
        totalEarnings: clipper.totalEarnings,
        clips: clipper.clips,
      };
    });

    res.json({
      summary: {
        totalClips,
        approvedClips: approvedClips.length,
        pendingClips: pendingClips.length,
        rejectedClips: rejectedClips.length,
        totalViews,
        totalEarnings,
        currentCPM: req.user.cpm,
      },
      clips,
      clipperStats,
    });
  } catch (error) {
    console.error("Erro ao carregar dashboard do criador", error);
    res.status(500).json({ message: "Não foi possível carregar o dashboard" });
  }
}
