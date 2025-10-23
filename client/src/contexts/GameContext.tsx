import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { GameScore, GameSession, GameStats } from '../types/game.types';
import { storage } from '../utils/storage';

interface GameContextType {
  currentSession: GameSession | null;
  startSession: (gameId: string, userId: string) => void;
  endSession: () => void;
  saveScore: (gameId: string, score: number, playTime: number, metadata?: any) => void;
  getGameStats: (gameId: string) => GameStats;
  saveGameState: (gameId: string, state: any) => void;
  loadGameState: (gameId: string) => any;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentSession, setCurrentSession] = useState<GameSession | null>(null);

  const startSession = useCallback((gameId: string, userId: string) => {
    const session: GameSession = {
      sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      gameId,
      userId,
      startedAt: new Date(),
      savedState: storage.getGameState(gameId)
    };
    setCurrentSession(session);
  }, []);

  const endSession = useCallback(() => {
    setCurrentSession(null);
  }, []);

  const saveScore = useCallback((gameId: string, score: number, playTime: number, metadata?: any) => {
    // Save high score
    storage.setGameScore(gameId, score);
    
    // Update game stats
    storage.updateGameStats(gameId, score, playTime);
    
    // Update user stats
    storage.updateUserStats(1, playTime, score);
    
    // Create score record
    const scoreRecord: GameScore = {
      id: `score_${Date.now()}`,
      userId: currentSession?.userId || 'guest',
      gameId,
      score,
      playTime,
      completedAt: new Date(),
      metadata
    };
    
    // Store in scores history
    const scoresHistory = storage.get<GameScore[]>(`scores_history_${gameId}`) || [];
    scoresHistory.unshift(scoreRecord);
    // Keep only last 10 scores
    storage.set(`scores_history_${gameId}`, scoresHistory.slice(0, 10));
  }, [currentSession]);

  const getGameStats = useCallback((gameId: string): GameStats => {
    return storage.getGameStats(gameId);
  }, []);

  const saveGameState = useCallback((gameId: string, state: any) => {
    storage.setGameState(gameId, state);
  }, []);

  const loadGameState = useCallback((gameId: string) => {
    return storage.getGameState(gameId);
  }, []);

  const value: GameContextType = {
    currentSession,
    startSession,
    endSession,
    saveScore,
    getGameStats,
    saveGameState,
    loadGameState
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};