import React from 'react';
import { Link } from 'react-router-dom';
import { GlitchText } from '../../components/common/GlitchText/GlitchText';
import { Button } from '../../components/common/Button/Button';
import { GameCard } from '../../components/game/GameCard/GameCard';
import { GAMES_MANIFEST } from '../../config/games.config';
import './Landing.css';

export const Landing: React.FC = () => {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <GlitchText text="BRUTUS ARCADE" className="hero-title" intensity="high" />
          <p className="hero-subtitle">
            <span className="text-glow-cyan">ENTER THE DIGITAL WASTELAND</span>
          </p>
          <p className="hero-description">
            A brutalist gaming platform where retro meets chaos.
            Play HTML5 games, compete on leaderboards, unlock achievements.
          </p>
          <div className="hero-actions">
            <Link to="/games">
              <Button variant="primary" size="large">
                START PLAYING
              </Button>
            </Link>
            <Link to="/leaderboard">
              <Button variant="neon" size="large">
                LEADERBOARD
              </Button>
            </Link>
          </div>
        </div>
        <div className="hero-stats">
          <div className="stat-item">
            <span className="stat-value text-glow-cyan">{GAMES_MANIFEST.length}</span>
            <span className="stat-label">GAMES</span>
          </div>
          <div className="stat-item">
            <span className="stat-value text-glow-magenta">∞</span>
            <span className="stat-label">PLAYERS</span>
          </div>
          <div className="stat-item">
            <span className="stat-value text-glow-yellow">24/7</span>
            <span className="stat-label">ONLINE</span>
          </div>
        </div>
      </section>

      {/* Featured Games Section */}
      <section className="featured-section">
        <div className="container">
          <h2 className="section-title">
            <GlitchText text="FEATURED GAMES" intensity="medium" />
          </h2>
          <div className="games-grid">
            {GAMES_MANIFEST.map(game => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">
            <GlitchText text="FEATURES" intensity="low" />
          </h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎮</div>
              <h3 className="feature-title">INSTANT PLAY</h3>
              <p className="feature-description">
                No downloads, no installs. Just click and play HTML5 games directly in your browser.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🏆</div>
              <h3 className="feature-title">LEADERBOARDS</h3>
              <p className="feature-description">
                Compete globally. Track your scores and climb the ranks to become the ultimate champion.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💾</div>
              <h3 className="feature-title">SAVE PROGRESS</h3>
              <p className="feature-description">
                Your game state is automatically saved. Pick up right where you left off, anytime.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3 className="feature-title">ACHIEVEMENTS</h3>
              <p className="feature-description">
                Unlock achievements, earn points, and level up your profile as you master each game.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <GlitchText text="READY TO PLAY?" className="cta-title" intensity="high" />
          <p className="cta-description">
            Join the arcade revolution. No registration required.
          </p>
          <Link to="/games">
            <Button variant="primary" size="large">
              BROWSE ALL GAMES
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};