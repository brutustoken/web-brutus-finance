# TRON Wallet Integration Guide

## Overview

This application now requires users to connect their TRON wallet before playing games. The integration uses TronLink wallet extension and provides a seamless connection experience.

## Features

### 1. Wallet Connection
- **TronLink Support**: Primary wallet provider for TRON blockchain
- **Auto-detection**: Automatically detects if TronLink is installed
- **Persistent Connection**: Remembers wallet connection across sessions
- **Real-time Balance**: Displays current TRX balance
- **Account Monitoring**: Detects when users switch accounts

### 2. User Interface Components

#### WalletButton Component
Located in: `client/src/components/common/WalletButton/`

Features:
- Shows "Connect Wallet" button when disconnected
- Displays wallet address (shortened) and balance when connected
- Provides disconnect functionality
- Responsive design for mobile devices

#### Wallet Required Screen
When users try to access games without connecting:
- Clear message explaining wallet requirement
- Direct connect button
- Navigation back to games list
- Animated lock icon for visual feedback

### 3. Game Access Control

#### Game Cards
- **Locked State**: Games show a lock overlay when wallet not connected
- **Visual Feedback**: Yellow glow and lock icon indicate requirement
- **Click Handler**: Prompts user to connect wallet when clicking locked games

#### Game Play Page
- **Access Gate**: Prevents game loading without wallet connection
- **Wallet Address Integration**: Passes wallet address to game sessions
- **User Identification**: Uses wallet address as unique user ID

## Technical Implementation

### Context Providers

#### WalletContext
Located in: `client/src/contexts/WalletContext.tsx`

Provides:
```typescript
interface WalletContextType {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  balance: string | null;
  chainId: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  tronWeb: any | null;
}
```

Key Functions:
- `connect()`: Initiates wallet connection flow
- `disconnect()`: Disconnects wallet and clears state
- `checkConnection()`: Verifies existing connection on mount
- Auto-polling for account changes (1 second interval)

### Wallet Types
Located in: `client/src/types/wallet.types.ts`

Defines TypeScript interfaces for:
- Wallet state management
- TronLink wallet interface
- Global window extensions

### Integration Points

#### 1. App.tsx
```typescript
<WalletProvider>
  <GameProvider>
    <Router>
      {/* App content */}
    </Router>
  </GameProvider>
</WalletProvider>
```

#### 2. Navbar
- Displays WalletButton in navigation bar
- Always visible for easy access
- Responsive layout on mobile

#### 3. GamePlayPage
- Checks wallet connection before loading game
- Shows wallet required screen if not connected
- Passes wallet address to game initialization

#### 4. GameCard
- Visual lock indicator when wallet not connected
- Prevents navigation to game without wallet
- Prompts connection on click

## User Flow

### First Time User
1. User visits the application
2. Sees "Connect Wallet" button in navbar
3. Clicks on a game card
4. Prompted to connect wallet
5. Clicks "Connect Wallet"
6. TronLink extension opens
7. User approves connection
8. Wallet address and balance displayed
9. Games become accessible

### Returning User
1. User visits the application
2. Wallet automatically reconnects (if previously connected)
3. Games immediately accessible
4. Can disconnect anytime via navbar

## Wallet Requirements

### TronLink Installation
Users need TronLink browser extension:
- Chrome: [TronLink Chrome Extension](https://chrome.google.com/webstore/detail/tronlink/ibnejdfjmmkpcnlpebklmnkoeoihofec)
- Firefox: Available on Firefox Add-ons
- Edge: Available on Edge Add-ons

### Network Support
- **Mainnet**: Production TRON network
- **Shasta**: Testnet for development
- **Nile**: Alternative testnet

## Security Considerations

### Best Practices Implemented
1. **No Private Key Storage**: Never stores or requests private keys
2. **User Approval**: All transactions require user approval in TronLink
3. **Address Validation**: Validates wallet addresses before use
4. **Session Management**: Secure session handling with localStorage
5. **Error Handling**: Comprehensive error handling for connection failures

### User Data
- Only stores wallet address (public information)
- Balance fetched in real-time (not stored)
- No sensitive data persisted

## Development Setup

### Dependencies
```json
{
  "@walletconnect/web3-provider": "^1.8.0",
  "@walletconnect/modal": "^2.7.0",
  "tronweb": "latest"
}
```

### Environment Variables
No environment variables required for basic wallet connection.

For custom RPC endpoints (optional):
```env
VITE_TRON_RPC_URL=https://api.trongrid.io
VITE_TRON_NETWORK=mainnet
```

## Testing

### Manual Testing Checklist
- [ ] Connect wallet with TronLink installed
- [ ] Try connecting without TronLink (should show install prompt)
- [ ] Disconnect wallet
- [ ] Reconnect wallet
- [ ] Switch accounts in TronLink (should update automatically)
- [ ] Try accessing game without wallet (should show lock screen)
- [ ] Connect wallet and access game (should work)
- [ ] Check balance display
- [ ] Test on mobile devices
- [ ] Test responsive layouts

### Test Accounts
For Shasta testnet:
1. Create account at: https://www.trongrid.io/shasta
2. Get test TRX from faucet
3. Import to TronLink

## Troubleshooting

### Common Issues

#### "TronLink not detected"
**Solution**: Install TronLink browser extension

#### "Connection failed"
**Solutions**:
- Refresh the page
- Check TronLink is unlocked
- Ensure correct network selected in TronLink
- Clear browser cache

#### "Balance not showing"
**Solutions**:
- Wait a few seconds for balance to load
- Check network connection
- Verify TronLink is connected to correct network

#### "Account not updating"
**Solutions**:
- Disconnect and reconnect wallet
- Refresh the page
- Check TronLink extension is active

## Future Enhancements

### Planned Features
1. **Multi-Wallet Support**: Add support for other TRON wallets
2. **Transaction History**: Show user's game transaction history
3. **Wallet Analytics**: Display wallet statistics and achievements
4. **Token Support**: Support for TRC-20 tokens
5. **Smart Contract Integration**: Direct blockchain interactions for scores
6. **NFT Integration**: Game achievements as NFTs
7. **Wallet Connect v2**: Upgrade to latest WalletConnect protocol

### Potential Improvements
- Add wallet connection animations
- Implement wallet switching without disconnect
- Add network switching UI
- Show transaction confirmations
- Add wallet activity notifications

## API Reference

### useWallet Hook
```typescript
const {
  address,        // Current wallet address
  isConnected,    // Connection status
  isConnecting,   // Loading state
  balance,        // TRX balance
  chainId,        // Network ID
  connect,        // Connect function
  disconnect,     // Disconnect function
  tronWeb         // TronWeb instance
} = useWallet();
```

### Example Usage
```typescript
import { useWallet } from '../contexts/WalletContext';

function MyComponent() {
  const { isConnected, address, connect } = useWallet();
  
  if (!isConnected) {
    return <button onClick={connect}>Connect Wallet</button>;
  }
  
  return <div>Connected: {address}</div>;
}
```

## Support

For issues or questions:
1. Check this documentation
2. Review console logs for errors
3. Check TronLink extension status
4. Verify network connectivity
5. Contact development team

## Resources

- [TRON Documentation](https://developers.tron.network/)
- [TronWeb Documentation](https://tronweb.network/)
- [TronLink Documentation](https://docs.tronlink.org/)
- [TRON Developer Hub](https://developers.tron.network/docs)