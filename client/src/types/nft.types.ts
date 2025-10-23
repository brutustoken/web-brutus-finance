export interface NFTMetadata {
  name: string;
  description?: string;
  image: string;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
  external_url?: string;
}

export interface NFTToken {
  tokenId: string;
  owner: string;
  tokenURI?: string;
  metadata?: NFTMetadata;
  contractAddress: string;
}

export interface NFTVerificationState {
  isVerifying: boolean;
  hasNFT: boolean;
  nftBalance: number;
  ownedNFTs: NFTToken[];
  error: string | null;
  lastVerified: number | null;
}

export interface NFTContextType {
  isVerifying: boolean;
  hasNFT: boolean;
  nftBalance: number;
  ownedNFTs: NFTToken[];
  error: string | null;
  verifyNFTOwnership: () => Promise<void>;
  refreshNFTs: () => Promise<void>;
  isLoading: boolean;
}

export interface NFTContractConfig {
  address: string;
  abi: any[];
  network: 'mainnet' | 'shasta' | 'nile';
}

// TRC-721 Standard ABI (minimal interface needed)
export const TRC721_ABI = [
  {
    "constant": true,
    "inputs": [{"name": "owner", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "", "type": "uint256"}],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [{"name": "owner", "type": "address"}, {"name": "index", "type": "uint256"}],
    "name": "tokenOfOwnerByIndex",
    "outputs": [{"name": "", "type": "uint256"}],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [{"name": "tokenId", "type": "uint256"}],
    "name": "tokenURI",
    "outputs": [{"name": "", "type": "string"}],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [{"name": "tokenId", "type": "uint256"}],
    "name": "ownerOf",
    "outputs": [{"name": "", "type": "address"}],
    "type": "function"
  }
];

// NFT Contract Configuration
export const NFT_CONTRACT_ADDRESS = 'TGpQ3qap18rN1vMJj3pveMfqTeXDaKaDE7';
export const NFT_REQUIRED_BALANCE = 1; // Minimum NFTs required to play
export const NFT_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache
export const NFT_REVALIDATION_INTERVAL = 30 * 1000; // 30 seconds revalidation