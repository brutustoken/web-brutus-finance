export interface GameConfig {
  id: string;
  name: string;
  slug: string;
  description: string;
  thumbnail: string;
  banner?: string;
  path: string;
  category: 'arcade' | 'shooter' | 'puzzle' | 'runner' | 'strategy';
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  controls: {
    mouse: boolean;
    touch: boolean;
    keyboard: boolean;
  };
  features: {
    hasLeaderboard: boolean;
    hasAchievements: boolean;
    supportsSaveState: boolean;
    supportsPostMessage: boolean;
  };
  metadata: {
    developer: string;
    releaseDate: string;
    version: string;
  };
}

export const GAMES_MANIFEST: GameConfig[] = [
  {
    id: 'flapcat-steampunk',
    name: 'FlapCat Steampunk',
    slug: 'flapcat',
    description: 'Navigate through steampunk obstacles with your flying cat',
    thumbnail: '/assets/games/flapcat-thumb.png',
    banner: '/assets/games/flapcat-banner.png',
    path: '/games/fly/play/gameplay/index.html',
    category: 'arcade',
    difficulty: 'medium',
    tags: ['flying', 'endless', 'retro', 'steampunk'],
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
      developer: 'Filippi Leonardo',
      releaseDate: '2024-01-01',
      version: '1.0.0'
    }
  },
  {
    id: 'space-shoot',
    name: 'Space Shoot',
    slug: 'space-shoot',
    description: 'Shoot targets in a cosmic carnival shooting gallery',
    thumbnail: '/assets/games/space-shoot-thumb.png',
    banner: '/assets/games/space-shoot-banner.png',
    path: '/games/space_shoot/play/gameplay/index.html',
    category: 'shooter',
    difficulty: 'easy',
    tags: ['shooting', 'arcade', 'casual', 'space'],
    controls: {
      mouse: true,
      touch: true,
      keyboard: false
    },
    features: {
      hasLeaderboard: true,
      hasAchievements: true,
      supportsSaveState: false,
      supportsPostMessage: true
    },
    metadata: {
      developer: 'Filippi Leonardo',
      releaseDate: '2024-01-01',
      version: '1.0.0'
    }
  },
  {
    id: 't-rex-runner',
    name: 'T-Rex Runner',
    slug: 't-rex',
    description: 'Classic endless runner with a prehistoric twist',
    thumbnail: '/assets/games/t-rex-thumb.png',
    banner: '/assets/games/t-rex-banner.png',
    path: '/games/t-rex/play/gameplay/index.html',
    category: 'runner',
    difficulty: 'medium',
    tags: ['running', 'endless', 'dinosaur', 'retro'],
    controls: {
      mouse: false,
      touch: true,
      keyboard: true
    },
    features: {
      hasLeaderboard: true,
      hasAchievements: true,
      supportsSaveState: false,
      supportsPostMessage: true
    },
    metadata: {
      developer: 'Filippi Leonardo',
      releaseDate: '2024-01-01',
      version: '1.0.0'
    }
  }
];

export const getGameBySlug = (slug: string): GameConfig | undefined => {
  return GAMES_MANIFEST.find(game => game.slug === slug);
};

export const getGameById = (id: string): GameConfig | undefined => {
  return GAMES_MANIFEST.find(game => game.id === id);
};

export const getGamesByCategory = (category: string): GameConfig[] => {
  return GAMES_MANIFEST.filter(game => game.category === category);
};

export const getGamesByTag = (tag: string): GameConfig[] => {
  return GAMES_MANIFEST.filter(game => game.tags.includes(tag));
};