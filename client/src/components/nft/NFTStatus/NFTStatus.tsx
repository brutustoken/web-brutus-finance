import React from 'react';
import { useNFT } from '../../../contexts/NFTContext';
import { useWallet } from '../../../contexts/WalletContext';
import './NFTStatus.css';

export const NFTStatus: React.FC = () => {
  const { isConnected } = useWallet();
  const { hasNFT, nftBalance, isVerifying } = useNFT();

  if (!isConnected) {
    return null;
  }

  if (isVerifying) {
    return (
      <div className="nft-status nft-status-verifying">
        <span className="nft-status-icon">⏳</span>
        <span className="nft-status-text">Verifying NFTs...</span>
      </div>
    );
  }

  if (hasNFT) {
    return (
      <div className="nft-status nft-status-verified">
        <span className="nft-status-icon">✓</span>
        <span className="nft-status-text">{nftBalance} NFT{nftBalance !== 1 ? 's' : ''}</span>
      </div>
    );
  }

  return (
    <div className="nft-status nft-status-required">
      <span className="nft-status-icon">⚠️</span>
      <span className="nft-status-text">NFT Required</span>
    </div>
  );
};