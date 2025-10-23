export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  createdAt: Date;
  stats: UserStats;
  achievements: string[];
  preferences: UserPreferences;
}

export interface UserStats {
  totalGamesPlayed: number;
  totalPlayTime: number;
  totalScore: number;
  level: number;
  experience: number;
  experienceToNextLevel?: number;
}

export interface UserPreferences {
  theme: 'dark' | 'neon';
  soundEnabled: boolean;
  musicEnabled?: boolean;
  volume?: number;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  avatar?: string;
  score: number;
  playTime?: number;
  achievedAt?: Date;
}

export interface GlobalLeaderboard {
  leaderboard: LeaderboardEntry[];
  userRank?: {
    rank: number;
    score: number;
  };
  pagination?: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}