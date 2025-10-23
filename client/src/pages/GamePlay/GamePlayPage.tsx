import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGame } from '../../contexts/GameContext';
import { getGameBySlug } from '../../config/games.config';
import { GameResponse } from '../../types/game.types';
import { Button } from '../../components/common/Button/Button';
import './GamePlayPage.css';

export const GamePlayPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { startSession, endSession, saveScore, saveGameState } = useGame();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [currentScore, setCurrentScore] = useState(0);
  const [playTime, setPlayTime] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const game = slug ? getGameBySlug(slug) : null;

  useEffect(() => {
    console.log('[GamePlay Debug] Slug from URL:', slug);
    console.log('[GamePlay Debug] Game found:', game);
    console.log('[GamePlay Debug] Game path:', game?.path);
    
    if (!game) {
      console.error('[GamePlay Debug] No game found for slug:', slug);
      navigate('/games');
      return;
    }

    // Start game session
    startSession(game.id, 'guest');

    // Play time tracker
    const timer = setInterval(() => {
      setPlayTime(prev => prev + 1);
    }, 1000);

    // Listen for messages from game iframe
    const handleMessage = (event: MessageEvent) => {
      const data: GameResponse = event.data;

      switch (data.type) {
        case 'READY':
          console.log('Game ready:', data);
          // Send init message to game
          sendMessageToGame('INIT', {
            userId: 'guest',
            gameId: game.id
          });
          break;

        case 'SCORE_UPDATE':
          if (data.payload.score !== undefined) {
            setCurrentScore(data.payload.score);
          }
          break;

        case 'GAME_OVER':
          if (data.payload.score !== undefined) {
            saveScore(game.id, data.payload.score, playTime, data.payload.stats);
            setCurrentScore(data.payload.score);
          }
          break;

        case 'STATE_CHANGE':
          if (data.payload.state) {
            saveGameState(game.id, data.payload.state);
          }
          break;

        case 'ACHIEVEMENT_UNLOCKED':
          console.log('Achievement unlocked:', data.payload.achievementCode);
          break;

        case 'ERROR':
          console.error('Game error:', data.payload.message);
          break;
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      clearInterval(timer);
      window.removeEventListener('message', handleMessage);
      endSession();
    };
  }, [game, navigate, startSession, endSession, saveScore, saveGameState, slug]);

  const sendMessageToGame = (type: string, payload?: any) => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { type, payload },
        '*'
      );
    }
  };

  const toggleFullscreen = () => {
    const container = document.querySelector('.game-container');
    if (!document.fullscreenElement && container) {
      container.requestFullscreen();
      setIsFullscreen(true);
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!game) {
    return null;
  }

  return (
    <div className="gameplay-page">
      <div className="gameplay-header">
        <div className="gameplay-info">
          <Button variant="secondary" size="small" onClick={() => navigate('/games')}>
            ← BACK
          </Button>
          <h1 className="gameplay-title">{game.name}</h1>
        </div>
        <div className="gameplay-stats">
          <div className="stat">
            <span className="stat-label">SCORE</span>
            <span className="stat-value text-glow-cyan">{currentScore}</span>
          </div>
          <div className="stat">
            <span className="stat-label">TIME</span>
            <span className="stat-value text-glow-magenta">{formatTime(playTime)}</span>
          </div>
          <Button 
            variant="neon" 
            size="small" 
            onClick={toggleFullscreen}
          >
            {isFullscreen ? '⊗ EXIT' : '⛶ FULLSCREEN'}
          </Button>
        </div>
      </div>

      <div className="game-container">
        <iframe
          ref={iframeRef}
          src={game.path}
          title={game.name}
          className="game-iframe"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onLoad={() => console.log('[GamePlay Debug] Iframe loaded:', game.path)}
          onError={(e) => console.error('[GamePlay Debug] Iframe error:', e)}
        />
      </div>

      <div className="gameplay-footer">
        <div className="game-controls">
          <div className="control-info">
            <span className="control-label">CONTROLS:</span>
            {game.controls.mouse && <span className="control-badge">🖱️ MOUSE</span>}
            {game.controls.touch && <span className="control-badge">👆 TOUCH</span>}
            {game.controls.keyboard && <span className="control-badge">⌨️ KEYBOARD</span>}
          </div>
        </div>
      </div>
    </div>
  );
};