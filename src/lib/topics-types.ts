export interface QueuedTopic {
  id: string;
  keyword: string;
  searchVolume: number;
  competition: number;
  competitionLevel: string;
  trendingUp: boolean;
  category: string;
  suggestedTitle: string;
  suggestedSlug: string;
  trademarkSafe: boolean;
  notes: string;
  status: "pending" | "approved" | "rejected" | "published";
  priority: number;
  addedAt: string;
  approvedAt?: string;
}
