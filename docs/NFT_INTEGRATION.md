# NFT-Based Access Control Integration

## Overview

This document describes the NFT-based access control system implemented for the gaming platform. Users must own at least one NFT from the specified TRC-721 contract to access and play games.

## Contract Information

- **Contract Address**: `TGpQ3qap18rN1vMJj3pveMfqTeXDaKaDE7`
- **Standard**: TRC-721 (TRON NFT Standard)
- **Network**: TRON Mainnet
- **Minimum Required**: 1 NFT

## Architecture

### Core Components

#### 1. NFT Types (`client/src/types/nft.types.ts`)

Defines TypeScript interfaces and constants:
- `NFTMetadata`: NFT metadata structure (name, image, attributes)
- `NFTToken`: Individual NFT token data
- `NFTVerificationState`: Verification state management
- `NFTContextType`: Context API interface
- `TRC721_ABI`: Minimal TRC-721 ABI for contract interaction
- Contract configuration constants

#### 2. NFT Verification Hook (`client/src/hooks/useNFTVerification.ts`)

Custom React hook that handles:
- Real-time NFT ownership verification
- Balance checking via `balanceOf()`
- Token enumeration via `tokenOfOwnerByIndex()`
- Metadata fetching from `tokenURI()`
- IPFS URL resolution
- Caching (5-minute cache duration)
- Periodic revalidation (30-second intervals)
- Error handling and retry logic

**Key Functions:**
```typescript
const {
  isVerifying,      // Loading state
  hasNFT,           // Boolean: owns at least 1 NFT
  nftBalance,       // Total NFT count
  ownedNFTs,        // Array of NFT tokens
  error,            // Error message if any
  verifyNFTOwnership, // Manual verification trigger
  refreshNFTs,      // Force refresh
  isLoading         // Manual refresh loading state
} = useNFTVerification();
```

#### 3. NFT Context (`client/src/contexts/NFTContext.tsx`)

React Context Provider that:
- Wraps the verification hook
- Provides NFT state globally
- Manages verification lifecycle
- Integrates with wallet connection

#### 4. NFT Gallery Component (`client/src/components/nft/NFTGallery/`)

Visual display of user's NFT collection:
- Grid layout with responsive design
- NFT cards showing image, name, ID, attributes
- Loading and error states
- Empty state with acquisition links
- Refresh functionality
- Displays up to 50 NFTs (performance optimization)

#### 5. NFT Status Indicator (`client/src/components/nft/NFTStatus/`)

Navbar component showing:
- ✓ Verified: Green indicator with NFT count
- ⏳ Verifying: Loading state
- ⚠️ NFT Required: Warning state
- Only visible when wallet connected

#### 6. NFT Collection Page (`client/src/pages/NFTCollection/`)

Dedicated page for viewing NFT collection:
- Full gallery view
- Wallet connection requirement
- Navigation integration
- Responsive design

## Access Control Flow

### 1. Wallet Connection
```
User visits site → Connects TRON wallet → TronLink approval
```

### 2. NFT Verification
```
Wallet connected → NFTContext initializes → useNFTVerification hook
→ Calls balanceOf(address) → Checks if balance > 0
→ If yes: Fetches token IDs and metadata
→ Updates hasNFT state
```

### 3. Game Access Control

#### Game Cards (`client/src/components/game/GameCard/`)
- Shows lock overlay if no NFT
- Different icons: 🔒 (no wallet) vs 🎨 (no NFT)
- Click handler prompts appropriate action
- Visual feedback with yellow glow for NFT requirement

#### Game Play Page (`client/src/pages/GamePlay/`)
Three-tier verification:
1. **Wallet Check**: Must be connected
2. **NFT Verification**: Shows loading during check
3. **NFT Requirement**: Blocks access if no NFT

**Access Denied Screens:**
- Wallet not connected → Connect wallet prompt
- Verifying NFTs → Loading spinner
- No NFT → NFT requirement screen with:
  - Contract address display
  - Current balance (0 NFTs)
  - "Get NFT" button (links to marketplace)
  - "Refresh Status" button
  - "Back to Games" button

## Technical Implementation

### Contract Interaction

Uses TronWeb to interact with TRC-721 contract:

```typescript
// Get NFT balance
const balance = await contract.balanceOf(address).call();

// Get token ID by index
const tokenId = await contract.tokenOfOwnerByIndex(address, index).call();

// Get token metadata URI
const tokenURI = await contract.tokenURI(tokenId).call();

// Fetch metadata from URI
const metadata = await fetch(tokenURI).then(r => r.json());
```

### Caching Strategy

**Cache Duration**: 5 minutes
- Prevents excessive blockchain calls
- Reduces API rate limiting
- Improves performance

**Revalidation**: Every 30 seconds
- Keeps data fresh
- Detects new NFT acquisitions
- Updates balance automatically

**Manual Refresh**: Available via UI
- "Refresh" button in gallery
- "Refresh Status" in access denied screens
- Bypasses cache

### IPFS Support

Automatically handles IPFS URLs:
```typescript
// Converts ipfs:// to https://
if (url.startsWith('ipfs://')) {
  url = url.replace('ipfs://', 'https://ipfs.io/ipfs/');
}
```

### Error Handling

Comprehensive error handling for:
- Contract call failures
- Network issues
- Invalid metadata
- Missing token URIs
- IPFS gateway timeouts

## User Experience

### Visual Indicators

1. **NFT Status Badge** (Navbar)
   - Green with checkmark: NFT verified
   - Yellow with warning: NFT required
   - Gray with hourglass: Verifying

2. **Game Cards**
   - Unlocked: Play icon (▶)
   - Locked (no wallet): Lock icon (🔒) + "Connect Wallet"
   - Locked (no NFT): Art icon (🎨) + "NFT Required"

3. **Access Screens**
   - Clear messaging
   - Actionable buttons
   - Contract information
   - Visual feedback

### User Flows

#### First-Time User
```
1. Visit site
2. See locked games
3. Click game → Prompted to connect wallet
4. Connect wallet → NFT verification starts
5. If no NFT → See NFT requirement screen
6. Click "Get NFT" → Opens marketplace
7. After acquiring NFT → Click "Refresh Status"
8. NFT verified → Games unlocked
```

#### Returning User with NFT
```
1. Visit site
2. Wallet auto-connects
3. NFT auto-verified (from cache or fresh check)
4. Games immediately accessible
5. Can view collection in "MY NFTs" page
```

## Security Considerations

### Best Practices

1. **No Private Keys**: Never stores or requests private keys
2. **Read-Only Operations**: Only reads blockchain data
3. **Client-Side Verification**: All checks happen in browser
4. **No Backend Dependency**: Fully decentralized verification
5. **Contract Immutability**: Uses fixed contract address

### Potential Attack Vectors

1. **Contract Address Spoofing**: Mitigated by hardcoded address
2. **False Verification**: Prevented by direct blockchain calls
3. **Cache Poisoning**: Cache only stores verified data
4. **Replay Attacks**: Not applicable (read-only operations)

## Configuration

### Contract Address

Update in `client/src/types/nft.types.ts`:
```typescript
export const NFT_CONTRACT_ADDRESS = 'TGpQ3qap18rN1vMJj3pveMfqTeXDaKaDE7';
```

### Cache Settings

```typescript
export const NFT_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
export const NFT_REVALIDATION_INTERVAL = 30 * 1000; // 30 seconds
```

### Required Balance

```typescript
export const NFT_REQUIRED_BALANCE = 1; // Minimum NFTs required
```

## Testing

### Manual Testing Checklist

- [ ] Connect wallet without NFT → See requirement screen
- [ ] Connect wallet with NFT → Games unlocked
- [ ] View NFT collection page
- [ ] Verify NFT metadata displays correctly
- [ ] Test refresh functionality
- [ ] Check cache behavior (wait 5 minutes)
- [ ] Test revalidation (wait 30 seconds)
- [ ] Verify IPFS image loading
- [ ] Test on mobile devices
- [ ] Check error handling (disconnect wallet mid-verification)

### Test Scenarios

1. **No Wallet**: Games locked, connect prompt
2. **Wallet + No NFT**: NFT requirement screen
3. **Wallet + 1 NFT**: Full access
4. **Wallet + Multiple NFTs**: Gallery shows all
5. **Network Issues**: Error handling works
6. **Slow IPFS**: Loading states display

## Troubleshooting

### Common Issues

#### "NFT Required" but user owns NFT
**Solutions:**
- Click "Refresh Status"
- Disconnect and reconnect wallet
- Check correct network (mainnet vs testnet)
- Verify contract address matches

#### NFT images not loading
**Solutions:**
- Check IPFS gateway availability
- Try alternative IPFS gateway
- Verify metadata format
- Check browser console for errors

#### Verification stuck on "Verifying..."
**Solutions:**
- Check network connection
- Verify TronLink is unlocked
- Refresh page
- Check browser console for errors

#### Balance shows 0 but NFTs exist
**Solutions:**
- Verify correct wallet connected
- Check contract address
- Ensure NFTs are TRC-721 standard
- Try manual refresh

## Performance Optimization

### Implemented Optimizations

1. **Lazy Loading**: NFTs loaded on demand
2. **Caching**: 5-minute cache reduces calls
3. **Batch Fetching**: Fetches multiple tokens efficiently
4. **Limit Display**: Shows max 50 NFTs
5. **Debouncing**: Prevents rapid re-verification
6. **Memoization**: React hooks optimize re-renders

### Future Improvements

1. **Pagination**: For users with 50+ NFTs
2. **Virtual Scrolling**: Better performance with many NFTs
3. **Image Optimization**: Compress/resize NFT images
4. **Service Worker**: Offline NFT data caching
5. **GraphQL**: More efficient data fetching
6. **WebSocket**: Real-time balance updates

## Integration with Existing Systems

### Wallet Integration
- Builds on existing `WalletContext`
- Requires wallet connection first
- Uses same TronWeb instance

### Game System
- Integrates with `GameContext`
- Passes wallet address to games
- Maintains existing game logic

### UI Components
- Extends existing component library
- Follows brutalist design system
- Maintains responsive layouts

## API Reference

### useNFT Hook

```typescript
import { useNFT } from '../contexts/NFTContext';

const MyComponent = () => {
  const {
    isVerifying,
    hasNFT,
    nftBalance,
    ownedNFTs,
    error,
    verifyNFTOwnership,
    refreshNFTs,
    isLoading
  } = useNFT();

  // Use NFT state...
};
```

### NFT Types

```typescript
interface NFTToken {
  tokenId: string;
  owner: string;
  tokenURI?: string;
  metadata?: NFTMetadata;
  contractAddress: string;
}

interface NFTMetadata {
  name: string;
  description?: string;
  image: string;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
}
```

## Resources

- [TRON Documentation](https://developers.tron.network/)
- [TRC-721 Standard](https://github.com/tronprotocol/TIPs/blob/master/tip-721.md)
- [TronWeb Documentation](https://tronweb.network/)
- [IPFS Documentation](https://docs.ipfs.io/)
- [NFT Metadata Standards](https://docs.opensea.io/docs/metadata-standards)

## Support

For issues or questions:
1. Check this documentation
2. Review browser console logs
3. Verify wallet and network status
4. Check contract on TRONSCAN
5. Contact development team

## Changelog

### Version 1.0.0 (Current)
- Initial NFT access control implementation
- TRC-721 contract integration
- NFT gallery component
- Real-time verification
- Caching and optimization
- Complete UI integration