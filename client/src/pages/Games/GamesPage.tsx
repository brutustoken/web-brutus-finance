import React from 'react';
import { GlitchText } from '../../components/common/GlitchText/GlitchText';
import { GameCard } from '../../components/game/GameCard/GameCard';
import { GAMES_MANIFEST } from '../../config/games.config';
import './GamesPage.css';

export const GamesPage: React.FC = () => {
  return (
    <div className="games-page">
      <div className="games-header">
        <div className="container">
          <GlitchText text="ALL GAMES" className="games-title" intensity="medium" />
          <p className="games-subtitle">
            Choose your challenge. Master the arcade.
          </p>
        </div>
      </div>
      
      <div className="games-content">
        <div className="container">
          <div className="games-grid">
            {GAMES_MANIFEST.map(game => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};