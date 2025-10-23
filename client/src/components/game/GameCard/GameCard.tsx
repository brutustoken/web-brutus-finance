import React from 'react';
import { Link } from 'react-router-dom';
import { GameConfig } from '../../../config/games.config';
import './GameCard.css';

interface GameCardProps {
  game: GameConfig;
}

export const GameCard: React.FC<GameCardProps> = ({ game }) => {
  return (
    <Link to={`/play/${game.slug}`} className="game-card">
      <div className="game-card-image">
        <img src={game.thumbnail} alt={game.name} />
        <div className="game-card-overlay">
          <span className="play-icon">▶</span>
        </div>
      </div>
      <div className="game-card-content">
        <h3 className="game-card-title">{game.name}</h3>
        <p className="game-card-description">{game.description}</p>
        <div className="game-card-meta">
          <span className="game-card-category">{game.category}</span>
          <span className="game-card-difficulty">{game.difficulty}</span>
        </div>
        <div className="game-card-tags">
          {game.tags.slice(0, 3).map(tag => (
            <span key={tag} className="game-card-tag">{tag}</span>
          ))}
        </div>
      </div>
    </Link>
  );
};