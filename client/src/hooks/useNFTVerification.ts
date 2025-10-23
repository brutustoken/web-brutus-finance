import { useState, useEffect, useCallback } from 'react';
import { useWallet } from '../contexts/WalletContext';
import {
  NFTToken,
  NFTMetadata,
  TRC721_ABI,
  NFT_CONTRACT_ADDRESS,
  NFT_CACHE_DURATION,
  NFT_REVALIDATION_INTERVAL,
} from '../types/nft.types';

interface UseNFTVerificationReturn {
  isVerifying: boolean;
  hasNFT: boolean;
  nftBalance: number;
  ownedNFTs: NFTToken[];
  error: string | null;
  verifyNFTOwnership: () => Promise<void>;
  refreshNFTs: () => Promise<void>;
  isLoading: boolean;
}

export const useNFTVerification = (): UseNFTVerificationReturn => {
  const { address, tronWeb, isConnected } = useWallet();
  const [isVerifying, setIsVerifying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasNFT, setHasNFT] = useState(false);
  const [nftBalance, setNftBalance] = useState(0);
  const [ownedNFTs, setOwnedNFTs] = useState<NFTToken[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [lastVerified, setLastVerified] = useState<number | null>(null);

  // Fetch NFT metadata from tokenURI
  const fetchNFTMetadata = async (tokenURI: string): Promise<NFTMetadata | null> => {
    try {
      // Handle IPFS URLs
      let url = tokenURI;
      if (tokenURI.startsWith('ipfs://')) {
        url = tokenURI.replace('ipfs://', 'https://ipfs.io/ipfs/');
      }

      const response = await fetch(url);
      if (!response.ok) {
        console.warn(`Failed to fetch metadata from ${url}`);
        return null;
      }

      const metadata: NFTMetadata = await response.json();
      
      // Handle IPFS image URLs
      if (metadata.image && metadata.image.startsWith('ipfs://')) {
        metadata.image = metadata.image.replace('ipfs://', 'https://ipfs.io/ipfs/');
      }

      return metadata;
    } catch (error) {
      console.error('Error fetching NFT metadata:', error);
      return null;
    }
  };

  // Verify NFT ownership
  const verifyNFTOwnership = useCallback(async () => {
    if (!isConnected || !address || !tronWeb) {
      setHasNFT(false);
      setNftBalance(0);
      setOwnedNFTs([]);
      return;
    }

    // Check cache
    const now = Date.now();
    if (lastVerified && (now - lastVerified) < NFT_CACHE_DURATION) {
      console.log('[NFT] Using cached verification result');
      return;
    }

    setIsVerifying(true);
    setError(null);

    try {
      // Get contract instance
      const contract = await tronWeb.contract(TRC721_ABI, NFT_CONTRACT_ADDRESS);

      // Get balance
      const balance = await contract.balanceOf(address).call();
      const balanceNumber = parseInt(balance.toString());

      console.log(`[NFT] User has ${balanceNumber} NFTs`);

      setNftBalance(balanceNumber);
      setHasNFT(balanceNumber > 0);

      // Fetch owned NFTs
      if (balanceNumber > 0) {
        const nfts: NFTToken[] = [];
        
        // Limit to first 50 NFTs for performance
        const maxNFTs = Math.min(balanceNumber, 50);
        
        for (let i = 0; i < maxNFTs; i++) {
          try {
            const tokenId = await contract.tokenOfOwnerByIndex(address, i).call();
            const tokenIdString = tokenId.toString();

            // Get token URI
            let tokenURI: string | undefined;
            let metadata: NFTMetadata | undefined;

            try {
              tokenURI = await contract.tokenURI(tokenIdString).call();
              
              // Fetch metadata
              if (tokenURI) {
                const fetchedMetadata = await fetchNFTMetadata(tokenURI);
                if (fetchedMetadata) {
                  metadata = fetchedMetadata;
                }
              }
            } catch (uriError) {
              console.warn(`Failed to get tokenURI for token ${tokenIdString}:`, uriError);
            }

            nfts.push({
              tokenId: tokenIdString,
              owner: address,
              tokenURI,
              metadata,
              contractAddress: NFT_CONTRACT_ADDRESS,
            });
          } catch (tokenError) {
            console.error(`Error fetching token at index ${i}:`, tokenError);
          }
        }

        setOwnedNFTs(nfts);
        console.log(`[NFT] Loaded ${nfts.length} NFTs`);
      } else {
        setOwnedNFTs([]);
      }

      setLastVerified(now);
    } catch (err: any) {
      console.error('[NFT] Verification error:', err);
      setError(err.message || 'Failed to verify NFT ownership');
      setHasNFT(false);
      setNftBalance(0);
      setOwnedNFTs([]);
    } finally {
      setIsVerifying(false);
    }
  }, [address, tronWeb, isConnected, lastVerified]);

  // Refresh NFTs (force revalidation)
  const refreshNFTs = useCallback(async () => {
    setLastVerified(null);
    setIsLoading(true);
    await verifyNFTOwnership();
    setIsLoading(false);
  }, [verifyNFTOwnership]);

  // Initial verification when wallet connects
  useEffect(() => {
    if (isConnected && address && tronWeb) {
      verifyNFTOwnership();
    }
  }, [isConnected, address, tronWeb, verifyNFTOwnership]);

  // Periodic revalidation
  useEffect(() => {
    if (!isConnected || !address) return;

    const interval = setInterval(() => {
      console.log('[NFT] Periodic revalidation');
      verifyNFTOwnership();
    }, NFT_REVALIDATION_INTERVAL);

    return () => clearInterval(interval);
  }, [isConnected, address, verifyNFTOwnership]);

  return {
    isVerifying,
    hasNFT,
    nftBalance,
    ownedNFTs,
    error,
    verifyNFTOwnership,
    refreshNFTs,
    isLoading,
  };
};