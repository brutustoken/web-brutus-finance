import React from 'react';
import { useNFT } from '../../../contexts/NFTContext';
import { NFTToken } from '../../../types/nft.types';
import { Button } from '../../common/Button/Button';
import './NFTGallery.css';

interface NFTCardProps {
  nft: NFTToken;
}

const NFTCard: React.FC<NFTCardProps> = ({ nft }) => {
  const { metadata, tokenId } = nft;

  return (
    <div className="nft-card">
      <div className="nft-card-image">
        {metadata?.image ? (
          <img src={metadata.image} alt={metadata.name || `NFT #${tokenId}`} />
        ) : (
          <div className="nft-card-placeholder">
            <span className="nft-icon">🎮</span>
          </div>
        )}
      </div>
      <div className="nft-card-content">
        <h3 className="nft-card-title">
          {metadata?.name || `Token #${tokenId}`}
        </h3>
        <p className="nft-card-id">ID: {tokenId}</p>
        {metadata?.description && (
          <p className="nft-card-description">{metadata.description}</p>
        )}
        {metadata?.attributes && metadata.attributes.length > 0 && (
          <div className="nft-card-attributes">
            {metadata.attributes.slice(0, 3).map((attr, index) => (
              <div key={index} className="nft-attribute">
                <span className="attribute-type">{attr.trait_type}</span>
                <span className="attribute-value">{attr.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const NFTGallery: React.FC = () => {
  const { ownedNFTs, isLoading, isVerifying, error, refreshNFTs, nftBalance } = useNFT();

  if (isVerifying && ownedNFTs.length === 0) {
    return (
      <div className="nft-gallery-loading">
        <div className="loading-spinner"></div>
        <p>Loading your NFTs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="nft-gallery-error">
        <div className="error-icon">⚠️</div>
        <h3>Error Loading NFTs</h3>
        <p>{error}</p>
        <Button onClick={refreshNFTs} variant="primary">
          Try Again
        </Button>
      </div>
    );
  }

  if (ownedNFTs.length === 0) {
    return (
      <div className="nft-gallery-empty">
        <div className="empty-icon">🎨</div>
        <h3>No NFTs Found</h3>
        <p>You don't own any NFTs from this collection yet.</p>
        <p className="empty-subtitle">
          You need at least one NFT to access the games.
        </p>
        <div className="empty-actions">
          <Button 
            onClick={() => window.open('https://apenft.io', '_blank')}
            variant="primary"
          >
            Get NFTs
          </Button>
          <Button onClick={refreshNFTs} variant="secondary">
            Refresh
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="nft-gallery">
      <div className="nft-gallery-header">
        <div className="gallery-title-section">
          <h2 className="gallery-title">Your NFT Collection</h2>
          <p className="gallery-subtitle">
            You own {nftBalance} NFT{nftBalance !== 1 ? 's' : ''} from this collection
          </p>
        </div>
        <Button 
          onClick={refreshNFTs} 
          variant="secondary" 
          size="small"
          disabled={isLoading}
        >
          {isLoading ? 'Refreshing...' : '🔄 Refresh'}
        </Button>
      </div>

      <div className="nft-gallery-grid">
        {ownedNFTs.map((nft) => (
          <NFTCard key={nft.tokenId} nft={nft} />
        ))}
      </div>

      {nftBalance > ownedNFTs.length && (
        <div className="nft-gallery-footer">
          <p className="gallery-note">
            Showing {ownedNFTs.length} of {nftBalance} NFTs
          </p>
        </div>
      )}
    </div>
  );
};