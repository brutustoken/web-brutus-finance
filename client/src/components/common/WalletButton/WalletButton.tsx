import React from 'react';
import { useWallet } from '../../../contexts/WalletContext';
import { Button } from '../Button/Button';
import './WalletButton.css';

export const WalletButton: React.FC = () => {
  const { address, isConnected, isConnecting, balance, connect, disconnect } = useWallet();

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatBalance = (bal: string | null) => {
    if (!bal) return '0';
    const num = parseFloat(bal);
    return num.toFixed(2);
  };

  if (isConnected && address) {
    return (
      <div className="wallet-button-container">
        <div className="wallet-info">
          <div className="wallet-balance">
            {formatBalance(balance)} TRX
          </div>
          <div className="wallet-address">
            {formatAddress(address)}
          </div>
        </div>
        <Button 
          variant="secondary" 
          onClick={disconnect}
          className="disconnect-button"
        >
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <Button 
      variant="primary" 
      onClick={connect}
      disabled={isConnecting}
      className="connect-wallet-button"
    >
      {isConnecting ? 'Connecting...' : 'Connect Wallet'}
    </Button>
  );
};