import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../../contexts/WalletContext';
import { NFTGallery } from '../../components/nft/NFTGallery/NFTGallery';
import { Button } from '../../components/common/Button/Button';
import { GlitchText } from '../../components/common/GlitchText/GlitchText';
import './NFTCollectionPage.css';

export const NFTCollectionPage: React.FC = () => {
  const { isConnected, connect } = useWallet();
  const navigate = useNavigate();

  if (!isConnected) {
    return (
      <div className="nft-collection-page">
        <div className="nft-collection-empty">
          <div className="empty-icon">🔒</div>
          <h1 className="empty-title">Connect Your Wallet</h1>
          <p className="empty-message">
            Connect your TRON wallet to view your NFT collection.
          </p>
          <div className="empty-actions">
            <Button variant="primary" size="large" onClick={connect}>
              Connect Wallet
            </Button>
            <Button variant="secondary" size="large" onClick={() => navigate('/games')}>
              Back to Games
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="nft-collection-page">
      <div className="nft-collection-header">
        <div className="container">
          <GlitchText text="MY NFT COLLECTION" className="page-title" intensity="medium" />
          <p className="page-subtitle">
            Your exclusive NFTs that grant access to our gaming platform
          </p>
        </div>
      </div>
      
      <div className="nft-collection-content">
        <div className="container">
          <NFTGallery />
        </div>
      </div>
    </div>
  );
};