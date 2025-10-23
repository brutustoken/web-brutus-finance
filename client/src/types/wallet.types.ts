export interface WalletState {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  balance: string | null;
  chainId: string | null;
}

export interface WalletContextType extends WalletState {
  connect: () => Promise<void>;
  disconnect: () => void;
  tronWeb: any | null;
}

export interface TronLinkWallet {
  ready: boolean;
  tronWeb?: any;
  request?: (args: { method: string; params?: any[] }) => Promise<any>;
}

declare global {
  interface Window {
    tronLink?: TronLinkWallet;
    tronWeb?: any;
  }
}