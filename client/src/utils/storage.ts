// LocalStorage utility functions for data persistence

const STORAGE_PREFIX = 'brutus_arcade_';

export const storage = {
  // Generic get/set
  get: <T>(key: string): T | null => {
    try {
      const item = localStorage.getItem(STORAGE_PREFIX + key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  },

  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  },

  remove: (key: string): void => {
    try {
      localStorage.removeItem(STORAGE_PREFIX + key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },

  clear: (): void => {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(STORAGE_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },

  // Game-specific storage
  getGameScore: (gameId: string): number => {
    return storage.get<number>(`game_score_${gameId}`) || 0;
  },

  setGameScore: (gameId: string, score: number): void => {
    const currentHighScore = storage.getGameScore(gameId);
    if (score > currentHighScore) {
      storage.set(`game_score_${gameId}`, score);
    }
  },

  getGameState: (gameId: string): any => {
    return storage.get(`game_state_${gameId}`);
  },

  setGameState: (gameId: string, state: any): void => {
    storage.set(`game_state_${gameId}`, state);
  },

  getGameStats: (gameId: string): any => {
    return storage.get(`game_stats_${gameId}`) || {
      totalPlays: 0,
      highScore: 0,
      totalPlayTime: 0,
      lastPlayed: null
    };
  },

  updateGameStats: (gameId: string, score: number, playTime: number): void => {
    const stats = storage.getGameStats(gameId);
    stats.totalPlays += 1;
    stats.totalPlayTime += playTime;
    stats.lastPlayed = new Date().toISOString();
    if (score > stats.highScore) {
      stats.highScore = score;
    }
    storage.set(`game_stats_${gameId}`, stats);
  },

  // User preferences
  getUserPreferences: () => {
    return storage.get('user_preferences') || {
      theme: 'dark',
      soundEnabled: true,
      musicEnabled: true,
      volume: 0.7
    };
  },

  setUserPreferences: (preferences: any): void => {
    storage.set('user_preferences', preferences);
  },

  // Achievements
  getUnlockedAchievements: (): string[] => {
    return storage.get<string[]>('achievements') || [];
  },

  unlockAchievement: (achievementCode: string): boolean => {
    const achievements = storage.getUnlockedAchievements();
    if (!achievements.includes(achievementCode)) {
      achievements.push(achievementCode);
      storage.set('achievements', achievements);
      return true;
    }
    return false;
  },

  // User stats
  getUserStats: () => {
    return storage.get('user_stats') || {
      totalGamesPlayed: 0,
      totalPlayTime: 0,
      totalScore: 0,
      level: 1,
      experience: 0
    };
  },

  updateUserStats: (gamesPlayed: number, playTime: number, score: number): void => {
    const stats: any = storage.getUserStats();
    stats.totalGamesPlayed += gamesPlayed;
    stats.totalPlayTime += playTime;
    stats.totalScore += score;
    
    // Simple level calculation
    const experienceGained = Math.floor(score / 10);
    stats.experience += experienceGained;
    
    // Level up every 1000 experience
    const newLevel = Math.floor(stats.experience / 1000) + 1;
    if (newLevel > stats.level) {
      stats.level = newLevel;
    }
    
    storage.set('user_stats', stats);
  }
};