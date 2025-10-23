# API Documentation

## 🌐 Base URL

```
Development: http://localhost:3000/api
Production: https://api.brutusarcade.com/api
```

## 🔐 Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Token Refresh

Tokens expire after 24 hours. Use the refresh endpoint to get a new token.

---

## 📚 API Endpoints

### Authentication

#### Register User

```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "username": "player123",
  "email": "player@example.com",
  "password": "SecurePass123!"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "username": "player123",
      "email": "player@example.com",
      "avatar": null,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "stats": {
        "totalGamesPlayed": 0,
        "totalPlayTime": 0,
        "totalScore": 0,
        "level": 1,
        "experience": 0
      }
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Username already exists",
    "details": {
      "field": "username"
    }
  }
}
```

---

#### Login User

```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "player@example.com",
  "password": "SecurePass123!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "username": "player123",
      "email": "player@example.com",
      "avatar": "https://cdn.brutusarcade.com/avatars/player123.png",
      "stats": {
        "totalGamesPlayed": 42,
        "totalPlayTime": 7200,
        "totalScore": 125000,
        "level": 15,
        "experience": 3500
      },
      "achievements": ["FIRST_BLOOD", "SCORE_MASTER"],
      "preferences": {
        "theme": "neon",
        "soundEnabled": true
      }
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

#### Refresh Token

```http
POST /api/auth/refresh
```

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

#### Get Current User

```http
GET /api/auth/me
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "username": "player123",
    "email": "player@example.com",
    "avatar": "https://cdn.brutusarcade.com/avatars/player123.png",
    "stats": {
      "totalGamesPlayed": 42,
      "totalPlayTime": 7200,
      "totalScore": 125000,
      "level": 15,
      "experience": 3500
    },
    "achievements": ["FIRST_BLOOD", "SCORE_MASTER", "SPEED_DEMON"],
    "preferences": {
      "theme": "neon",
      "soundEnabled": true
    }
  }
}
```

---

#### Logout

```http
POST /api/auth/logout
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### Games

#### Get All Games

```http
GET /api/games
```

**Query Parameters:**
- `category` (optional): Filter by category (arcade, shooter, puzzle, runner, strategy)
- `difficulty` (optional): Filter by difficulty (easy, medium, hard)
- `sort` (optional): Sort by (popular, newest, rating)
- `limit` (optional): Number of results (default: 20)
- `page` (optional): Page number (default: 1)

**Example:**
```http
GET /api/games?category=arcade&difficulty=medium&sort=popular&limit=10
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "games": [
      {
        "id": "flapcat-steampunk",
        "name": "FlapCat Steampunk",
        "slug": "flapcat",
        "description": "Navigate through steampunk obstacles",
        "thumbnail": "https://cdn.brutusarcade.com/games/flapcat-thumb.png",
        "banner": "https://cdn.brutusarcade.com/games/flapcat-banner.png",
        "category": "arcade",
        "difficulty": "medium",
        "tags": ["flying", "endless", "retro"],
        "rating": 4.5,
        "playCount": 15420,
        "features": {
          "hasLeaderboard": true,
          "hasAchievements": true,
          "supportsSaveState": true
        },
        "metadata": {
          "developer": "Filippi Leonardo",
          "releaseDate": "2024-01-01",
          "version": "1.0.0"
        }
      }
    ],
    "pagination": {
      "total": 3,
      "page": 1,
      "limit": 10,
      "pages": 1
    }
  }
}
```

---

#### Get Game Details

```http
GET /api/games/:gameId
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "flapcat-steampunk",
    "name": "FlapCat Steampunk",
    "slug": "flapcat",
    "description": "Navigate through steampunk obstacles with your flying cat",
    "longDescription": "Embark on a steampunk adventure...",
    "thumbnail": "https://cdn.brutusarcade.com/games/flapcat-thumb.png",
    "banner": "https://cdn.brutusarcade.com/games/flapcat-banner.png",
    "screenshots": [
      "https://cdn.brutusarcade.com/games/flapcat/screenshot-1.png",
      "https://cdn.brutusarcade.com/games/flapcat/screenshot-2.png"
    ],
    "category": "arcade",
    "difficulty": "medium",
    "tags": ["flying", "endless", "retro"],
    "rating": 4.5,
    "playCount": 15420,
    "controls": {
      "mouse": true,
      "touch": true,
      "keyboard": false
    },
    "features": {
      "hasLeaderboard": true,
      "hasAchievements": true,
      "supportsSaveState": true
    },
    "achievements": [
      {
        "code": "FIRST_FLIGHT",
        "name": "First Flight",
        "description": "Complete your first game",
        "icon": "🎮",
        "rarity": "common",
        "points": 10
      }
    ],
    "leaderboard": {
      "topScores": [
        {
          "rank": 1,
          "username": "ProGamer",
          "score": 9999,
          "date": "2024-01-15T10:30:00.000Z"
        }
      ]
    },
    "metadata": {
      "developer": "Filippi Leonardo",
      "releaseDate": "2024-01-01",
      "version": "1.0.0",
      "lastUpdated": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

---

#### Start Game Session

```http
POST /api/games/:gameId/play
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "loadSavedState": true
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "sessionId": "session_abc123",
    "gameId": "flapcat-steampunk",
    "userId": "507f1f77bcf86cd799439011",
    "startedAt": "2024-01-15T10:30:00.000Z",
    "savedState": {
      "level": 5,
      "score": 1250,
      "position": { "x": 100, "y": 200 }
    }
  }
}
```

---

#### Submit Score

```http
POST /api/games/:gameId/score
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "sessionId": "session_abc123",
  "score": 5000,
  "playTime": 180,
  "metadata": {
    "level": 10,
    "enemiesDefeated": 50,
    "accuracy": 85.5
  },
  "state": {
    "level": 10,
    "inventory": ["shield", "sword"]
  }
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "scoreId": "score_xyz789",
    "gameId": "flapcat-steampunk",
    "userId": "507f1f77bcf86cd799439011",
    "score": 5000,
    "playTime": 180,
    "rank": 42,
    "isPersonalBest": true,
    "experienceGained": 250,
    "newLevel": 16,
    "achievementsUnlocked": ["SCORE_5000"],
    "submittedAt": "2024-01-15T10:33:00.000Z"
  }
}
```

---

#### Get User's Game Scores

```http
GET /api/games/:gameId/scores
```

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `limit` (optional): Number of results (default: 10)
- `sort` (optional): Sort by (score, date) (default: score)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "scores": [
      {
        "id": "score_xyz789",
        "score": 5000,
        "playTime": 180,
        "rank": 42,
        "completedAt": "2024-01-15T10:33:00.000Z",
        "metadata": {
          "level": 10,
          "enemiesDefeated": 50
        }
      }
    ],
    "stats": {
      "totalPlays": 15,
      "highScore": 5000,
      "averageScore": 3200,
      "totalPlayTime": 2700
    }
  }
}
```

---

### Leaderboard

#### Get Global Leaderboard

```http
GET /api/leaderboard/global
```

**Query Parameters:**
- `timeframe` (optional): all, today, week, month (default: all)
- `limit` (optional): Number of results (default: 100)
- `page` (optional): Page number (default: 1)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "leaderboard": [
      {
        "rank": 1,
        "userId": "507f1f77bcf86cd799439011",
        "username": "ProGamer",
        "avatar": "https://cdn.brutusarcade.com/avatars/progamer.png",
        "totalScore": 250000,
        "level": 50,
        "gamesPlayed": 150,
        "achievements": 45
      },
      {
        "rank": 2,
        "userId": "507f1f77bcf86cd799439012",
        "username": "SpeedRunner",
        "avatar": "https://cdn.brutusarcade.com/avatars/speedrunner.png",
        "totalScore": 240000,
        "level": 48,
        "gamesPlayed": 120,
        "achievements": 42
      }
    ],
    "pagination": {
      "total": 1000,
      "page": 1,
      "limit": 100,
      "pages": 10
    },
    "userRank": {
      "rank": 42,
      "score": 125000
    }
  }
}
```

---

#### Get Game Leaderboard

```http
GET /api/leaderboard/game/:gameId
```

**Query Parameters:**
- `timeframe` (optional): all, today, week, month (default: all)
- `limit` (optional): Number of results (default: 100)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "gameId": "flapcat-steampunk",
    "gameName": "FlapCat Steampunk",
    "leaderboard": [
      {
        "rank": 1,
        "userId": "507f1f77bcf86cd799439011",
        "username": "ProGamer",
        "avatar": "https://cdn.brutusarcade.com/avatars/progamer.png",
        "score": 9999,
        "playTime": 300,
        "achievedAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "userBest": {
      "rank": 42,
      "score": 5000,
      "achievedAt": "2024-01-15T10:33:00.000Z"
    }
  }
}
```

---

#### Get User Rankings

```http
GET /api/leaderboard/user/:userId
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "userId": "507f1f77bcf86cd799439011",
    "username": "player123",
    "globalRank": 42,
    "totalScore": 125000,
    "gameRankings": [
      {
        "gameId": "flapcat-steampunk",
        "gameName": "FlapCat Steampunk",
        "rank": 15,
        "score": 5000,
        "totalPlays": 25
      },
      {
        "gameId": "space-shoot",
        "gameName": "Space Shoot",
        "rank": 8,
        "score": 8500,
        "totalPlays": 30
      }
    ]
  }
}
```

---

### User Profile

#### Get User Profile

```http
GET /api/users/:userId
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "username": "player123",
    "avatar": "https://cdn.brutusarcade.com/avatars/player123.png",
    "level": 15,
    "experience": 3500,
    "experienceToNextLevel": 500,
    "joinedAt": "2024-01-01T00:00:00.000Z",
    "stats": {
      "totalGamesPlayed": 42,
      "totalPlayTime": 7200,
      "totalScore": 125000,
      "averageScore": 2976,
      "gamesCompleted": 38,
      "achievementsUnlocked": 15,
      "totalAchievements": 50
    },
    "recentGames": [
      {
        "gameId": "flapcat-steampunk",
        "gameName": "FlapCat Steampunk",
        "score": 5000,
        "playedAt": "2024-01-15T10:33:00.000Z"
      }
    ],
    "topGames": [
      {
        "gameId": "space-shoot",
        "gameName": "Space Shoot",
        "highScore": 8500,
        "plays": 30
      }
    ],
    "achievements": [
      {
        "code": "FIRST_BLOOD",
        "name": "First Blood",
        "description": "Defeat your first enemy",
        "icon": "⚔️",
        "rarity": "common",
        "unlockedAt": "2024-01-02T10:00:00.000Z"
      }
    ]
  }
}
```

---

#### Update User Profile

```http
PUT /api/users/:userId
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "username": "newUsername",
  "avatar": "https://cdn.brutusarcade.com/avatars/new-avatar.png",
  "preferences": {
    "theme": "dark",
    "soundEnabled": false
  }
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "username": "newUsername",
    "avatar": "https://cdn.brutusarcade.com/avatars/new-avatar.png",
    "preferences": {
      "theme": "dark",
      "soundEnabled": false
    },
    "updatedAt": "2024-01-15T10:35:00.000Z"
  }
}
```

---

#### Get User Achievements

```http
GET /api/users/:userId/achievements
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "achievements": [
      {
        "code": "FIRST_BLOOD",
        "name": "First Blood",
        "description": "Defeat your first enemy",
        "icon": "⚔️",
        "rarity": "common",
        "points": 10,
        "unlockedAt": "2024-01-02T10:00:00.000Z",
        "gameId": "flapcat-steampunk"
      }
    ],
    "stats": {
      "total": 50,
      "unlocked": 15,
      "progress": 30,
      "totalPoints": 450,
      "earnedPoints": 150
    },
    "recentlyUnlocked": [
      {
        "code": "SCORE_5000",
        "name": "Score Master",
        "unlockedAt": "2024-01-15T10:33:00.000Z"
      }
    ]
  }
}
```

---

#### Get User Statistics

```http
GET /api/users/:userId/stats
```

**Query Parameters:**
- `timeframe` (optional): all, today, week, month (default: all)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalGamesPlayed": 42,
      "totalPlayTime": 7200,
      "totalScore": 125000,
      "averageScore": 2976,
      "level": 15,
      "experience": 3500
    },
    "gameBreakdown": [
      {
        "gameId": "flapcat-steampunk",
        "gameName": "FlapCat Steampunk",
        "plays": 25,
        "playTime": 3000,
        "highScore": 5000,
        "averageScore": 3200
      }
    ],
    "achievements": {
      "total": 50,
      "unlocked": 15,
      "byRarity": {
        "common": 8,
        "rare": 5,
        "epic": 2,
        "legendary": 0
      }
    },
    "progression": {
      "currentLevel": 15,
      "experience": 3500,
      "experienceToNextLevel": 500,
      "totalExperience": 15500
    },
    "rankings": {
      "globalRank": 42,
      "percentile": 95.5
    }
  }
}
```

---

## 🔌 WebSocket Events

### Connection

```javascript
const socket = io('wss://api.brutusarcade.com', {
  auth: {
    token: 'your_jwt_token'
  }
});
```

### Events

#### Leaderboard Updates

**Listen:**
```javascript
socket.on('leaderboard:update', (data) => {
  console.log('Leaderboard updated:', data);
});
```

**Data:**
```json
{
  "type": "global" | "game",
  "gameId": "flapcat-steampunk",
  "leaderboard": [
    {
      "rank": 1,
      "username": "ProGamer",
      "score": 9999
    }
  ],
  "timestamp": "2024-01-15T10:35:00.000Z"
}
```

---

#### Achievement Unlocked

**Listen:**
```javascript
socket.on('achievement:unlocked', (data) => {
  console.log('Achievement unlocked:', data);
});
```

**Data:**
```json
{
  "userId": "507f1f77bcf86cd799439011",
  "achievement": {
    "code": "SCORE_5000",
    "name": "Score Master",
    "icon": "🏆",
    "points": 50
  },
  "timestamp": "2024-01-15T10:35:00.000Z"
}
```

---

#### Level Up

**Listen:**
```javascript
socket.on('user:levelup', (data) => {
  console.log('Level up:', data);
});
```

**Data:**
```json
{
  "userId": "507f1f77bcf86cd799439011",
  "oldLevel": 15,
  "newLevel": 16,
  "rewards": {
    "experience": 250,
    "unlocks": ["new_avatar"]
  },
  "timestamp": "2024-01-15T10:35:00.000Z"
}
```

---

## ⚠️ Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `UNAUTHORIZED` | 401 | Missing or invalid token |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource already exists |
| `RATE_LIMIT` | 429 | Too many requests |
| `SERVER_ERROR` | 500 | Internal server error |

**Error Response Format:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": {
      "field": "email",
      "value": "invalid-email"
    },
    "timestamp": "2024-01-15T10:35:00.000Z"
  }
}
```

---

## 🔒 Rate Limiting

- **Authentication endpoints**: 5 requests per minute
- **Game endpoints**: 60 requests per minute
- **Leaderboard endpoints**: 30 requests per minute
- **User endpoints**: 30 requests per minute

**Rate Limit Headers:**
```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1642248000
```

---

## 📝 Notes

1. All timestamps are in ISO 8601 format (UTC)
2. All responses include a `success` boolean field
3. Pagination uses 1-based indexing
4. File uploads use multipart/form-data
5. Maximum request body size: 10MB
6. WebSocket connections auto-reconnect on disconnect

---

## 🧪 Testing

### Example cURL Requests

**Register:**
```bash
curl -X POST https://api.brutusarcade.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"Test123!"}'
```

**Login:**
```bash
curl -X POST https://api.brutusarcade.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'
```

**Get Games:**
```bash
curl -X GET https://api.brutusarcade.com/api/games \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Submit Score:**
```bash
curl -X POST https://api.brutusarcade.com/api/games/flapcat-steampunk/score \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"session_abc123","score":5000,"playTime":180}'
```

---

## 📚 Additional Resources

- [Authentication Flow](../ARCHITECTURE.md#authentication-flow)
- [Game Integration Guide](./GAME_INTEGRATION.md)
- [WebSocket Documentation](https://socket.io/docs/)

---

**API Version:** 1.0.0  
**Last Updated:** 2024-01-15