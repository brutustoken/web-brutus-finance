export interface GameScore {
  id: string;
  userId: string;
  gameId: string;
  score: number;
  playTime: number;
  completedAt: Date;
  metadata?: {
    level?: number;
    achievements?: string[];
    state?: any;
  };
}

export interface GameSession {
  sessionId: string;
  gameId: string;
  userId: string;
  startedAt: Date;
  savedState?: any;
}

export interface GameMessage {
  type: 'INIT' | 'PAUSE' | 'RESUME' | 'GET_STATE' | 'LOAD_STATE';
  payload?: {
    userId?: string;
    gameId?: string;
    savedState?: any;
    state?: any;
  };
}

export interface GameResponse {
  type: 'READY' | 'SCORE_UPDATE' | 'GAME_OVER' | 'STATE_CHANGE' | 'ACHIEVEMENT_UNLOCKED' | 'ERROR';
  payload: {
    score?: number;
    state?: any;
    achievements?: string[];
    stats?: {
      playTime: number;
      highScore: number;
    };
    achievementCode?: string;
    metadata?: any;
    message?: string;
    stack?: string;
  };
  timestamp?: number;
  gameId?: string;
}

export interface Achievement {
  code: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
  unlockedAt?: Date;
  gameId?: string;
}

export interface GameStats {
  totalPlays: number;
  highScore: number;
  averageScore: number;
  totalPlayTime: number;
  lastPlayed?: Date;
}