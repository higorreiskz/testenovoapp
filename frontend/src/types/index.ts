export type UserRole = "creator" | "clipper" | "admin";

export interface UserSummary {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  profilePic?: string;
  cpm?: number;
  balance?: number;
  portfolioUrl?: string;
  socialLinks?: {
    youtube?: string;
    twitch?: string;
    tiktok?: string;
  };
}

export type ClipStatus = "pending" | "approved" | "rejected";

export interface ClipSummary {
  _id: string;
  title: string;
  videoUrl: string;
  views: number;
  status: ClipStatus;
  cpm: number;
  earnings: number;
  creatorId: string | UserSummary;
  clipperId: string | UserSummary;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatorDashboardPayload {
  summary: {
    totalClips: number;
    approvedClips: number;
    pendingClips: number;
    rejectedClips: number;
    totalViews: number;
    totalEarnings: number;
    currentCPM?: number;
  };
  clips: ClipSummary[];
  clipperStats: Array<{
    clipperId: string;
    name: string;
    portfolioUrl?: string;
    totalViews: number;
    totalEarnings: number;
    clips: number;
  }>;
}

export interface ClipperDashboardPayload {
  summary: {
    totalClips: number;
    approvedClips: number;
    totalViews: number;
    totalEarnings: number;
    balance?: number;
  };
  clips: ClipSummary[];
}
