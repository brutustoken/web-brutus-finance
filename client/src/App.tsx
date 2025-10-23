import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WalletProvider } from './contexts/WalletContext';
import { NFTProvider } from './contexts/NFTContext';
import { GameProvider } from './contexts/GameContext';
import { Landing } from './pages/Landing/Landing';
import { GamesPage } from './pages/Games/GamesPage';
import { GamePlayPage } from './pages/GamePlay/GamePlayPage';
import { NFTCollectionPage } from './pages/NFTCollection/NFTCollectionPage';
import { Navbar } from './components/common/Navbar/Navbar';
import './styles/global.css';

const App: React.FC = () => {
  // Debug: Log all route attempts
  React.useEffect(() => {
    console.log('[Router Debug] Current location:', window.location.pathname);
  }, []);

  return (
    <WalletProvider>
      <NFTProvider>
        <GameProvider>
          <Router>
            <div className="app">
              <Navbar />
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/games" element={<GamesPage />} />
                <Route path="/play/:slug" element={<GamePlayPage />} />
                <Route path="/nft-collection" element={<NFTCollectionPage />} />
                {/* Debug route to catch unmatched paths */}
                <Route path="*" element={
                  <div style={{ padding: '2rem', color: 'white' }}>
                    <h1>Route Debug Info</h1>
                    <p>Attempted path: {window.location.pathname}</p>
                    <p>This path did not match any defined routes</p>
                  </div>
                } />
              </Routes>
            </div>
          </Router>
        </GameProvider>
      </NFTProvider>
    </WalletProvider>
  );
};

export default App;
