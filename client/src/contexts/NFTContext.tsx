import React, { createContext, useContext, ReactNode } from 'react';
import { useNFTVerification } from '../hooks/useNFTVerification';
import { NFTContextType } from '../types/nft.types';

const NFTContext = createContext<NFTContextType | undefined>(undefined);

export const useNFT = () => {
  const context = useContext(NFTContext);
  if (!context) {
    throw new Error('useNFT must be used within an NFTProvider');
  }
  return context;
};

interface NFTProviderProps {
  children: ReactNode;
}

export const NFTProvider: React.FC<NFTProviderProps> = ({ children }) => {
  const nftVerification = useNFTVerification();

  const value: NFTContextType = {
    ...nftVerification,
  };

  return (
    <NFTContext.Provider value={value}>
      {children}
    </NFTContext.Provider>
  );
};