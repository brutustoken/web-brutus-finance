# Game Integration Guide

## 🎮 Overview

This guide explains how to integrate HTML5 games into the Brutus Arcade platform, enabling communication between the React frontend and game iframes using the postMessage API.

## 📋 Integration Checklist

- [ ] Game files prepared and organized
- [ ] Game added to manifest configuration
- [ ] postMessage handlers implemented in game
- [ ] Thumbnail and assets created
- [ ] Game tested in iframe environment
- [ ] Score submission verified
- [ ] Leaderboard integration confirmed

## 🔧 Step-by-Step Integration

### Step 1: Prepare Game Files

1. **Export your game** from Construct 3 or your game engine
2. **Organize files** in the following structure:

```
public/games/[game-slug]/
├── gameplay/
│   ├── index.html
│   ├── style.css
│   ├── data.json
│   ├── scripts/
│   ├── images/
│   ├── media/
│   └── icons/
└── assets/
    ├── thumbnail.png
    ├── banner.png
    └── screenshots/
```

### Step 2: Add Game to Manifest

Edit [`client/src/config/games.config.ts`](client/src/config/games.config.ts):

```typescript
export const GAMES_MANIFEST = [
  // ... existing games
  {
    id: 'your-game-id',
    name: 'Your Game Name',
    slug: 'your-game-slug',
    description: 'Brief description of your game',
    thumbnail: '/assets/games/your-game-thumb.png',
    banner: '/assets/games/your-game-banner.png',
    path: '/games/your-game-slug/gameplay/',
    category: 'arcade' | 'shooter' | 'puzzle' | 'runner' | 'strategy',
    difficulty: 'easy' | 'medium' | 'hard',
    tags: ['tag1', 'tag2', 'tag3'],
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
      version: '1.0.0',
      minPlayTime: 60, // seconds
      maxPlayTime: 300 // seconds
    },
    scoring: {
      type: 'points' | 'time' | 'survival',
      multiplier: 1,
      bonusThresholds: [1000, 5000, 10000]
    }
  }
];
```

### Step 3: Implement postMessage Communication

Add this JavaScript code to your game's main script or [`index.html`](index.html):

```javascript
// game-integration.js
(function() {
  'use strict';
  
  // Configuration
  const PARENT_ORIGIN = window.location.ancestorOrigins?.[0] || '*';
  let gameState = {
    initialized: false,
    userId: null,
    gameId: null,
    score: 0,
    playTime: 0,
    isPaused: false
  };
  
  // Message Types
  const MessageTypes = {
    // Incoming from platform
    INIT: 'INIT',
    PAUSE: 'PAUSE',
    RESUME: 'RESUME',
    GET_STATE: 'GET_STATE',
    LOAD_STATE: 'LOAD_STATE',
    
    // Outgoing to platform
    READY: 'READY',
    SCORE_UPDATE: 'SCORE_UPDATE',
    GAME_OVER: 'GAME_OVER',
    STATE_CHANGE: 'STATE_CHANGE',
    ACHIEVEMENT_UNLOCKED: 'ACHIEVEMENT_UNLOCKED',
    ERROR: 'ERROR'
  };
  
  // Send message to parent
  function sendToParent(type, payload = {}) {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({
        type,
        payload,
        timestamp: Date.now(),
        gameId: gameState.gameId
      }, PARENT_ORIGIN);
    }
  }
  
  // Handle incoming messages
  function handleMessage(event) {
    // Validate origin in production
    // if (event.origin !== EXPECTED_ORIGIN) return;
    
    const { type, payload } = event.data;
    
    switch (type) {
      case MessageTypes.INIT:
        handleInit(payload);
        break;
        
      case MessageTypes.PAUSE:
        handlePause();
        break;
        
      case MessageTypes.RESUME:
        handleResume();
        break;
        
      case MessageTypes.GET_STATE:
        handleGetState();
        break;
        
      case MessageTypes.LOAD_STATE:
        handleLoadState(payload);
        break;
    }
  }
  
  // Initialize game
  function handleInit(payload) {
    gameState.userId = payload.userId;
    gameState.gameId = payload.gameId;
    gameState.initialized = true;
    
    // Load saved state if provided
    if (payload.savedState) {
      loadGameState(payload.savedState);
    }
    
    // Notify parent that game is ready
    sendToParent(MessageTypes.READY, {
      gameId: gameState.gameId,
      version: '1.0.0'
    });
    
    // Start game
    startGame();
  }
  
  // Pause game
  function handlePause() {
    gameState.isPaused = true;
    pauseGame(); // Your game's pause function
  }
  
  // Resume game
  function handleResume() {
    gameState.isPaused = false;
    resumeGame(); // Your game's resume function
  }
  
  // Get current state
  function handleGetState() {
    sendToParent(MessageTypes.STATE_CHANGE, {
      state: getCurrentGameState(),
      score: gameState.score,
      playTime: gameState.playTime
    });
  }
  
  // Load saved state
  function handleLoadState(payload) {
    if (payload.state) {
      loadGameState(payload.state);
    }
  }
  
  // Update score
  function updateScore(newScore) {
    gameState.score = newScore;
    
    // Send score update to parent
    sendToParent(MessageTypes.SCORE_UPDATE, {
      score: newScore,
      playTime: gameState.playTime
    });
  }
  
  // Game over
  function gameOver(finalScore, stats = {}) {
    sendToParent(MessageTypes.GAME_OVER, {
      score: finalScore,
      playTime: gameState.playTime,
      stats: {
        ...stats,
        completedAt: new Date().toISOString()
      }
    });
  }
  
  // Unlock achievement
  function unlockAchievement(achievementCode, metadata = {}) {
    sendToParent(MessageTypes.ACHIEVEMENT_UNLOCKED, {
      achievementCode,
      metadata,
      timestamp: Date.now()
    });
  }
  
  // Error handling
  function reportError(error) {
    sendToParent(MessageTypes.ERROR, {
      message: error.message,
      stack: error.stack
    });
  }
  
  // Listen for messages
  window.addEventListener('message', handleMessage);
  
  // Notify parent that game script is loaded
  sendToParent(MessageTypes.READY, {
    status: 'loaded',
    timestamp: Date.now()
  });
  
  // Export API for game to use
  window.BrutusArcade = {
    updateScore,
    gameOver,
    unlockAchievement,
    getState: () => gameState,
    reportError
  };
  
  // Track play time
  setInterval(() => {
    if (!gameState.isPaused && gameState.initialized) {
      gameState.playTime += 1;
    }
  }, 1000);
  
})();
```

### Step 4: Integrate with Your Game Code

#### For Construct 3 Games

Add a new JavaScript file in your project or use the Browser object:

```javascript
// In your game's event sheet or JavaScript
runtime.addEventListener("beforeprojectstart", () => {
  // Game is ready
  if (window.BrutusArcade) {
    console.log("Brutus Arcade integration active");
  }
});

// Update score
function onScoreChange(newScore) {
  if (window.BrutusArcade) {
    window.BrutusArcade.updateScore(newScore);
  }
}

// Game over
function onGameOver(finalScore) {
  if (window.BrutusArcade) {
    window.BrutusArcade.gameOver(finalScore, {
      level: currentLevel,
      enemies: enemiesDefeated,
      accuracy: hitPercentage
    });
  }
}

// Achievement
function checkAchievements(score) {
  if (score >= 1000 && window.BrutusArcade) {
    window.BrutusArcade.unlockAchievement('SCORE_1000', {
      score: score
    });
  }
}
```

#### For Custom HTML5 Games

```javascript
// In your game's main loop
class Game {
  constructor() {
    this.score = 0;
    this.brutusAPI = window.BrutusArcade;
  }
  
  updateScore(points) {
    this.score += points;
    
    // Notify platform
    if (this.brutusAPI) {
      this.brutusAPI.updateScore(this.score);
    }
  }
  
  endGame() {
    // Notify platform
    if (this.brutusAPI) {
      this.brutusAPI.gameOver(this.score, {
        duration: this.playTime,
        level: this.currentLevel
      });
    }
  }
}
```

### Step 5: Test Integration

1. **Local Testing**:
```bash
cd client
npm run dev
```

2. **Navigate to**: `http://localhost:5173/games/your-game-slug`

3. **Open Browser Console** and verify:
   - postMessage events are being sent
   - Score updates are received
   - Game over event triggers correctly

4. **Test Checklist**:
   - [ ] Game loads in iframe
   - [ ] Initial READY message sent
   - [ ] Score updates transmitted
   - [ ] Game over event captured
   - [ ] Achievements unlock properly
   - [ ] State persistence works
   - [ ] Pause/resume functions

### Step 6: Create Assets

#### Thumbnail (400x300px)
```
public/assets/games/your-game-thumb.png
```
- PNG format
- 400x300 pixels
- Show gameplay screenshot
- Add neon border effect

#### Banner (1200x400px)
```
public/assets/games/your-game-banner.png
```
- PNG format
- 1200x400 pixels
- Game logo + key visual
- Brutalist aesthetic

#### Screenshots
```
public/assets/games/your-game-slug/screenshots/
├── screenshot-1.png
├── screenshot-2.png
└── screenshot-3.png
```

## 🎯 Advanced Features

### State Persistence

Save and restore game state:

```javascript
// Save state
function saveGameState() {
  const state = {
    level: currentLevel,
    score: currentScore,
    inventory: playerInventory,
    position: playerPosition
  };
  
  sendToParent(MessageTypes.STATE_CHANGE, {
    state: state,
    timestamp: Date.now()
  });
}

// Load state
function loadGameState(savedState) {
  if (savedState) {
    currentLevel = savedState.level;
    currentScore = savedState.score;
    playerInventory = savedState.inventory;
    playerPosition = savedState.position;
  }
}
```

### Achievement System

Define achievements in your game:

```javascript
const ACHIEVEMENTS = {
  FIRST_BLOOD: {
    code: 'FIRST_BLOOD',
    name: 'First Blood',
    description: 'Defeat your first enemy',
    check: (stats) => stats.enemiesDefeated >= 1
  },
  SCORE_MASTER: {
    code: 'SCORE_MASTER',
    name: 'Score Master',
    description: 'Reach 10,000 points',
    check: (stats) => stats.score >= 10000
  },
  SPEED_DEMON: {
    code: 'SPEED_DEMON',
    name: 'Speed Demon',
    description: 'Complete game in under 2 minutes',
    check: (stats) => stats.playTime < 120
  }
};

function checkAchievements(stats) {
  Object.values(ACHIEVEMENTS).forEach(achievement => {
    if (achievement.check(stats) && !unlockedAchievements.has(achievement.code)) {
      window.BrutusArcade.unlockAchievement(achievement.code);
      unlockedAchievements.add(achievement.code);
    }
  });
}
```

### Analytics Events

Track custom events:

```javascript
function trackEvent(eventName, data) {
  sendToParent('ANALYTICS_EVENT', {
    event: eventName,
    data: data,
    timestamp: Date.now()
  });
}

// Usage
trackEvent('level_complete', { level: 5, time: 120 });
trackEvent('power_up_collected', { type: 'shield' });
trackEvent('boss_defeated', { boss: 'dragon', attempts: 3 });
```

## 🐛 Debugging

### Enable Debug Mode

Add to your game's [`index.html`](index.html):

```javascript
const DEBUG = true;

function debugLog(message, data) {
  if (DEBUG) {
    console.log(`[Game Debug] ${message}`, data);
  }
}

// Use in your code
debugLog('Score updated', { score: newScore });
debugLog('Message sent to parent', { type, payload });
```

### Common Issues

#### Issue: Messages not received by parent

**Solution**: Check origin validation
```javascript
// Temporarily allow all origins for testing
const PARENT_ORIGIN = '*';

// In production, use specific origin
const PARENT_ORIGIN = 'https://your-domain.com';
```

#### Issue: Game not loading in iframe

**Solution**: Check CSP headers and X-Frame-Options
```html
<!-- Remove or modify these headers -->
<meta http-equiv="X-Frame-Options" content="SAMEORIGIN">
```

#### Issue: Score not updating

**Solution**: Verify BrutusArcade API is available
```javascript
if (typeof window.BrutusArcade === 'undefined') {
  console.error('Brutus Arcade API not loaded');
}
```

## 📊 Testing Checklist

### Functional Testing
- [ ] Game loads without errors
- [ ] Initial handshake completes
- [ ] Score updates in real-time
- [ ] Game over triggers correctly
- [ ] Achievements unlock
- [ ] State saves and restores
- [ ] Pause/resume works

### Performance Testing
- [ ] Game runs at 60 FPS
- [ ] No memory leaks
- [ ] postMessage overhead minimal
- [ ] Assets load efficiently

### Cross-browser Testing
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari
- [ ] Mobile browsers

### Responsive Testing
- [ ] Desktop (1920x1080)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

## 🚀 Deployment

### Pre-deployment Checklist
- [ ] Remove debug code
- [ ] Optimize assets
- [ ] Test on production domain
- [ ] Verify CORS settings
- [ ] Check CSP headers
- [ ] Test with real users

### Post-deployment
- [ ] Monitor error logs
- [ ] Track performance metrics
- [ ] Gather user feedback
- [ ] Update documentation

## 📝 Example: Complete Integration

Here's a complete example for a simple game:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Simple Game</title>
  <style>
    body { margin: 0; background: #000; }
    canvas { display: block; }
  </style>
</head>
<body>
  <canvas id="game"></canvas>
  
  <script>
    // Game Integration
    (function() {
      const canvas = document.getElementById('game');
      const ctx = canvas.getContext('2d');
      let score = 0;
      let gameActive = false;
      
      // Resize canvas
      function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
      resize();
      window.addEventListener('resize', resize);
      
      // Listen for platform messages
      window.addEventListener('message', (event) => {
        const { type, payload } = event.data;
        
        if (type === 'INIT') {
          gameActive = true;
          startGame();
          
          // Notify ready
          window.parent.postMessage({
            type: 'READY',
            payload: { gameId: payload.gameId }
          }, '*');
        }
      });
      
      // Game loop
      function gameLoop() {
        if (!gameActive) return;
        
        // Update game
        score++;
        
        // Update score every second
        if (score % 60 === 0) {
          window.parent.postMessage({
            type: 'SCORE_UPDATE',
            payload: { score: Math.floor(score / 60) }
          }, '*');
        }
        
        // Render
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#0ff';
        ctx.font = '48px monospace';
        ctx.fillText(`Score: ${Math.floor(score / 60)}`, 50, 100);
        
        requestAnimationFrame(gameLoop);
      }
      
      function startGame() {
        gameLoop();
      }
      
      // Notify loaded
      window.parent.postMessage({
        type: 'READY',
        payload: { status: 'loaded' }
      }, '*');
    })();
  </script>
</body>
</html>
```

## 🎓 Best Practices

1. **Always validate message origins** in production
2. **Throttle score updates** to avoid spam (max 1 per second)
3. **Handle errors gracefully** and report to platform
4. **Save state frequently** for better UX
5. **Test in iframe environment** early and often
6. **Optimize assets** for fast loading
7. **Use semantic versioning** for game updates
8. **Document your game's API** for future reference

## 📚 Additional Resources

- [postMessage API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage)
- [Construct 3 JavaScript Guide](https://www.construct.net/en/make-games/manuals/construct-3)
- [Game Performance Optimization](https://web.dev/fast/)

## 🆘 Support

If you encounter issues:
1. Check the browser console for errors
2. Review this guide's debugging section
3. Test with the example integration
4. Contact the platform team

---

**Ready to integrate your game?** Follow the steps above and your game will be live on Brutus Arcade!