import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { WalletContextType, WalletState } from '../types/wallet.types';

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

interface WalletProviderProps {
  children: React.ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [walletState, setWalletState] = useState<WalletState>({
    address: null,
    isConnected: false,
    isConnecting: false,
    balance: null,
    chainId: null,
  });

  const [tronWeb, setTronWeb] = useState<any>(null);

  // Check if wallet is already connected on mount
  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      // Check for TronLink
      if (window.tronLink && window.tronLink.ready) {
        const tronWebInstance = window.tronWeb;
        if (tronWebInstance && tronWebInstance.defaultAddress.base58) {
          const address = tronWebInstance.defaultAddress.base58;
          setTronWeb(tronWebInstance);
          
          // Get balance
          const balance = await tronWebInstance.trx.getBalance(address);
          const balanceInTRX = tronWebInstance.fromSun(balance);
          
          setWalletState({
            address,
            isConnected: true,
            isConnecting: false,
            balance: balanceInTRX.toString(),
            chainId: 'mainnet', // or 'shasta' for testnet
          });
        }
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error);
    }
  };

  const connect = useCallback(async () => {
    setWalletState(prev => ({ ...prev, isConnecting: true }));

    try {
      // Check if TronLink is installed
      if (!window.tronLink) {
        alert('Please install TronLink wallet extension to continue');
        window.open('https://www.tronlink.org/', '_blank');
        setWalletState(prev => ({ ...prev, isConnecting: false }));
        return;
      }

      // Request account access
      const res = await window.tronLink.request?.({
        method: 'tron_requestAccounts'
      });

      if (!res) {
        throw new Error('Failed to request accounts');
      }

      if (res.code === 200) {
        // Wait for TronWeb to be injected
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const tronWebInstance = window.tronWeb;
        
        if (tronWebInstance && tronWebInstance.defaultAddress.base58) {
          const address = tronWebInstance.defaultAddress.base58;
          setTronWeb(tronWebInstance);
          
          // Get balance
          const balance = await tronWebInstance.trx.getBalance(address);
          const balanceInTRX = tronWebInstance.fromSun(balance);
          
          setWalletState({
            address,
            isConnected: true,
            isConnecting: false,
            balance: balanceInTRX.toString(),
            chainId: 'mainnet',
          });

          // Store connection in localStorage
          localStorage.setItem('tron_wallet_connected', 'true');
        } else {
          throw new Error('TronWeb not properly initialized');
        }
      } else {
        throw new Error('User rejected the connection');
      }
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      alert(error.message || 'Failed to connect wallet. Please try again.');
      setWalletState({
        address: null,
        isConnected: false,
        isConnecting: false,
        balance: null,
        chainId: null,
      });
    }
  }, []);

  const disconnect = useCallback(() => {
    setWalletState({
      address: null,
      isConnected: false,
      isConnecting: false,
      balance: null,
      chainId: null,
    });
    setTronWeb(null);
    localStorage.removeItem('tron_wallet_connected');
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (window.tronLink) {
      const handleAccountsChanged = () => {
        checkConnection();
      };

      // TronLink doesn't have a standard event listener, so we poll
      const interval = setInterval(() => {
        if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
          const currentAddress = window.tronWeb.defaultAddress.base58;
          if (walletState.address && currentAddress !== walletState.address) {
            handleAccountsChanged();
          }
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [walletState.address]);

  const value: WalletContextType = {
    ...walletState,
    connect,
    disconnect,
    tronWeb,
  };


  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};