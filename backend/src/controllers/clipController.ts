import { Response } from "express";
import Clip from "../models/Clip";
import User from "../models/User";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import cloudinary from "../config/cloudinary";

function calculateEarnings(views: number, cpm: number): number {
  return Math.round(((views || 0) * (cpm || 0)) / 1000 * 100) / 100;
}

export async function uploadClip(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Usuário não autenticado" });
      return;
    }

    if (req.user.role !== "clipper") {
      res.status(403).json({ message: "Apenas clipadores podem enviar clipes" });
      return;
    }

    const { creatorId, title, views, videoUrl } = req.body;

    if (!creatorId || !title) {
      res.status(400).json({ message: "Creator e título são obrigatórios" });
      return;
    }

    const creator = await User.findById(creatorId);

    if (!creator || creator.role !== "creator") {
      res.status(404).json({ message: "Criador não encontrado" });
      return;
    }

    let finalVideoUrl = videoUrl;

    if (!finalVideoUrl && req.file?.path) {
      try {
        const uploadResult = await cloudinary.uploader.upload(req.file.path, {
          resource_type: "video",
          folder: "clipzone",
          overwrite: false,
        });
        finalVideoUrl = uploadResult.secure_url;
      } catch (uploadError) {
        console.error("Erro ao enviar vídeo para o Cloudinary", uploadError);
        res.status(500).json({ message: "Falha no upload do vídeo" });
        return;
      }
    }

    if (!finalVideoUrl) {
      res.status(400).json({ message: "URL do vídeo não informada" });
      return;
    }

    const parsedViews = Number(views) || 0;
    const cpm = creator.cpm ?? 5;
    const earnings = calculateEarnings(parsedViews, cpm);

    const clip = await Clip.create({
      creatorId,
      clipperId: req.user.id,
      title,
      videoUrl: finalVideoUrl,
      views: parsedViews,
      status: "pending",
      cpm,
      earnings,
    });

    res.status(201).json({ clip });
  } catch (error) {
    console.error("Erro ao enviar clip", error);
    res.status(500).json({ message: "Não foi possível enviar o clip" });
  }
}

export async function getClipperDashboard(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Usuário não autenticado" });
      return;
    }

    const clips = await Clip.find({ clipperId: req.user.id }).populate(
      "creatorId",
      "name email role cpm profilePic"
    );

    const totalViews = clips.reduce((acc, clip) => acc + clip.views, 0);
    const totalEarnings = clips.reduce((acc, clip) => acc + clip.earnings, 0);
    const approved = clips.filter((clip) => clip.status === "approved");

    res.json({
      summary: {
        totalClips: clips.length,
        approvedClips: approved.length,
        totalViews,
        totalEarnings,
        balance: req.user.balance,
      },
      clips,
    });
  } catch (error) {
    console.error("Erro ao carregar dashboard do clipper", error);
    res.status(500).json({ message: "Não foi possível carregar o dashboard" });
  }
}

export async function listAvailableCreators(
  _req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const creators = await User.find({ role: "creator" }).select(
      "name email role cpm profilePic socialLinks"
    );

    res.json({ creators });
  } catch (error) {
    console.error("Erro ao listar criadores", error);
    res.status(500).json({ message: "Não foi possível listar os criadores" });
  }
}

export async function getCreatorClips(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Usuário não autenticado" });
      return;
    }

    const clips = await Clip.find({ creatorId: req.user.id }).populate(
      "clipperId",
      "name email role portfolioUrl"
    );

    res.json({ clips });
  } catch (error) {
    console.error("Erro ao carregar clipes do criador", error);
    res.status(500).json({ message: "Não foi possível carregar os clipes" });
  }
}

export async function updateClipStatus(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Usuário não autenticado" });
      return;
    }

    if (req.user.role !== "creator") {
      res.status(403).json({ message: "Apenas criadores podem moderar clipes" });
      return;
    }

    const { id } = req.params;
    const { status, views } = req.body as {
      status: "pending" | "approved" | "rejected";
      views?: number;
    };

    if (!status || !["pending", "approved", "rejected"].includes(status)) {
      res.status(400).json({ message: "Status inválido" });
      return;
    }

    const clip = await Clip.findById(id);

    if (!clip) {
      res.status(404).json({ message: "Clip não encontrado" });
      return;
    }

    if (String(clip.creatorId) !== req.user.id) {
      res.status(403).json({ message: "Clip não pertence a este criador" });
      return;
    }

    const previousStatus = clip.status;

    if (typeof views === "number") {
      clip.views = views;
    }

    clip.status = status;
    clip.cpm = req.user.cpm ?? clip.cpm;
    clip.earnings = calculateEarnings(clip.views, clip.cpm);

    await clip.save();

    if (previousStatus !== "approved" && status === "approved") {
      const clipper = await User.findById(clip.clipperId);
      if (clipper) {
        clipper.balance += clip.earnings;
        await clipper.save();
      }
    }

    res.json({ clip });
  } catch (error) {
    console.error("Erro ao atualizar clip", error);
    res.status(500).json({ message: "Não foi possível atualizar o clip" });
  }
}
