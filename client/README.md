# BRUTUS ARCADE - Gaming Platform

A React-based gaming platform with a dark brutalist aesthetic inspired by brutus.finance, featuring modular HTML5 game integration with persistent data storage and cross-game progression.

## 🎮 Features

- **Brutalist Design**: Dark, high-contrast UI with neon accents and retro arcade aesthetics
- **Modular Game Architecture**: Easy integration of HTML5 games via iframe with postMessage API
- **Data Persistence**: LocalStorage-based state management for scores, progress, and preferences
- **Glitch Effects**: Animated text effects and scanline overlays for authentic retro feel
- **Responsive Design**: Mobile-first approach with touch-optimized controls
- **Game Wrapper**: Reusable components for score tracking, timers, and state management
- **Context API**: Centralized state management for games, users, and achievements

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will be available at `http://localhost:5173`

## 📁 Project Structure

```
client/
├── public/                  # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── common/        # Reusable UI components
│   │   │   ├── Button/
│   │   │   ├── GlitchText/
│   │   │   └── Navbar/
│   │   └── game/          # Game-specific components
│   │       └── GameCard/
│   ├── contexts/          # React Context providers
│   │   └── GameContext.tsx
│   ├── pages/             # Page components
│   │   ├── Landing/
│   │   ├── Games/
│   │   └── GamePlay/
│   ├── config/            # Configuration files
│   │   └── games.config.ts
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   │   └── storage.ts
│   ├── styles/            # Global styles
│   │   ├── variables.css
│   │   ├── global.css
│   │   ├── animations.css
│   │   └── brutalist.css
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 🎯 Adding New Games

### 1. Prepare Game Files

Place your HTML5 game in the public directory:

```
public/
└── games/
    └── your-game/
        └── gameplay/
            ├── index.html
            ├── scripts/
            ├── images/
            └── media/
```

### 2. Register in Games Manifest

Edit `src/config/games.config.ts`:

```typescript
{
  id: 'your-game-id',
  name: 'Your Game Name',
  slug: 'your-game',
  description: 'Game description',
  thumbnail: '/assets/games/your-game-thumb.png',
  path: '/games/your-game/gameplay/',
  category: 'arcade',
  difficulty: 'medium',
  tags: ['tag1', 'tag2'],
  controls: {
    mouse: true,
    touch: true,
    keyboard: false
  },
  features: {
    hasLeaderboard: true,
    hasAchievements: true,
    supportsSaveState: true,
    supportsPostMessage: true
  },
  metadata: {
    developer: 'Your Name',
    releaseDate: '2024-01-01',
    version: '1.0.0'
  }
}
```

### 3. Implement postMessage Communication

Add to your game's JavaScript:

```javascript
// Listen for messages from platform
window.addEventListener('message', (event) => {
  const { type, payload } = event.data;
  
  if (type === 'INIT') {
    // Initialize game with user data
    startGame(payload.userId, payload.gameId);
  }
});

// Send score updates
function updateScore(score) {
  window.parent.postMessage({
    type: 'SCORE_UPDATE',
    payload: { score }
  }, '*');
}

// Send game over
function gameOver(finalScore) {
  window.parent.postMessage({
    type: 'GAME_OVER',
    payload: { score: finalScore }
  }, '*');
}

// Notify ready
window.parent.postMessage({
  type: 'READY',
  payload: { status: 'loaded' }
}, '*');
```

## 🎨 Design System

### Color Palette

```css
--color-bg-primary: #0a0a0a;
--color-bg-secondary: #1a1a1a;
--color-neon-cyan: #00ffff;
--color-neon-magenta: #ff00ff;
--color-neon-yellow: #ffff00;
--color-text-primary: #ffffff;
```

### Typography

- **Headings**: Monospace fonts (Courier New, Monaco)
- **Body**: System fonts with monospace fallback
- **Effects**: Glitch animations, neon glow

### Components

- **Button**: Primary, secondary, and neon variants
- **GlitchText**: Animated text with RGB split effect
- **GameCard**: Hover animations with neon borders
- **Navbar**: Fixed navigation with glitch logo

## 🔧 API Reference

### GameContext

```typescript
const { 
  startSession,
  endSession,
  saveScore,
  getGameStats,
  saveGameState,
  loadGameState 
} = useGame();
```

### Storage Utilities

```typescript
import { storage } from './utils/storage';

// Save/load game score
storage.setGameScore(gameId, score);
const highScore = storage.getGameScore(gameId);

// Save/load game state
storage.setGameState(gameId, state);
const savedState = storage.getGameState(gameId);

// User preferences
storage.setUserPreferences(preferences);
const prefs = storage.getUserPreferences();
```

## 📱 Responsive Breakpoints

- **Mobile**: 320px - 768px
- **Tablet**: 769px - 1024px
- **Desktop**: 1025px+

## 🎮 Game Integration Protocol

### Message Types

**Platform → Game:**
- `INIT`: Initialize game with user data
- `PAUSE`: Pause game
- `RESUME`: Resume game
- `GET_STATE`: Request current state
- `LOAD_STATE`: Load saved state

**Game → Platform:**
- `READY`: Game loaded and ready
- `SCORE_UPDATE`: Score changed
- `GAME_OVER`: Game ended
- `STATE_CHANGE`: State updated
- `ACHIEVEMENT_UNLOCKED`: Achievement earned
- `ERROR`: Error occurred

## 🚀 Deployment

### Build

```bash
npm run build
```

Output will be in `dist/` directory.

### Environment Variables

Create `.env` file:

```
VITE_API_URL=https://api.your-domain.com
```

## 📝 License

MIT License - See LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📚 Documentation

- [Architecture](../ARCHITECTURE.md)
- [Game Integration Guide](../docs/GAME_INTEGRATION.md)
- [API Documentation](../docs/API.md)

## 🎯 Roadmap

- [ ] User authentication system
- [ ] Backend API integration
- [ ] Real-time leaderboards
- [ ] Achievement system
- [ ] Social features
- [ ] Tournament mode
- [ ] Mobile app (React Native)

---

**Built with ⚡ by the Brutus Arcade Team**
