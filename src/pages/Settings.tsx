/*src/pages/Settings.tsx*/

import React, { useState } from 'react';
import App from '../App';

// returns raw html for settings page

const Settings = ({ onBack }: { onBack: () => void }) => {
  return (
   <div className="app-layout">
    <aside className="sidebar">
      <div className="sidebar-logo">
        <i className="fa-solid fa-chess-queen"></i>
        <span>CTT</span>
      </div>
      <nav className="sidebar-nav">
        
      </nav>
      <div className="sidebar-bottom">
        <button onClick={onBack}>Back</button>
      </div>
    </aside>
    <main className="main-content">
    </main>
  </div>
  );
};

export default Settings