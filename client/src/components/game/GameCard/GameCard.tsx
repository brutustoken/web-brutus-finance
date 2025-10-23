import React from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '../../../contexts/WalletContext';
import { useNFT } from '../../../contexts/NFTContext';
import { GameConfig } from '../../../config/games.config';
import './GameCard.css';

interface GameCardProps {
  game: GameConfig;
}

export const GameCard: React.FC<GameCardProps> = ({ game }) => {
  const { isConnected, connect } = useWallet();
  const { hasNFT, isVerifying } = useNFT();
  

  const isLocked = !isConnected || !hasNFT;

  const handleClick = (e: React.MouseEvent) => {
    if (!isConnected) {
      e.preventDefault();
      const shouldConnect = window.confirm(
        'You need to connect your TRON wallet to play games. Connect now?'
      );
      if (shouldConnect) {
        connect();
      }
    } else if (!hasNFT && !isVerifying) {
      e.preventDefault();
      const shouldGetNFT = window.confirm(
        'You need to own an NFT from our collection to play games. Would you like to get one?'
      );
      if (shouldGetNFT) {
        window.open('https://apenft.io', '_blank');
      }
    }
  };

  const getLockMessage = () => {
    if (!isConnected) return 'Connect Wallet';
    if (isVerifying) return 'Verifying...';
    if (!hasNFT) return 'NFT Required';
    return '';
  };

  return (
    <Link
      to={`/play/${game.slug}`}
      className={`game-card ${isLocked ? 'game-card-locked' : ''}`}
      onClick={handleClick}
    >
      <div className="game-card-image">
        <img src={game.thumbnail} alt={game.name} />
        <div className="game-card-overlay">
          {!isLocked ? (
            <span className="play-icon">▶</span>
          ) : (
            <div className="wallet-lock-overlay">
              <span className="lock-icon">{!isConnected ? '🔒' : '🎨'}</span>
              <span className="lock-text">{getLockMessage()}</span>
            </div>
          )}
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