import React, { useState } from 'react';
import EditRepertiores from './pages/EditRepertiores';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import TrainingToolkit from './pages/TrainingToolkit';
import { toast } from "react-toastify";


const App = () => {
  const [page, setPage] = useState('home');

  if (page === 'repertoires') return <EditRepertiores onBack={() => setPage('home')} />;
  if (page === 'analytics') return <Analytics onBack={() => setPage('home')} />;
  if (page === 'tools') return <TrainingToolkit onBack={() => setPage('home')} />;
  if (page === 'settings') return <Settings onBack={() => setPage('home')} />;

 return (
  <div className="app-layout">
    <aside className="sidebar">
      <div className="sidebar-logo">
        <i className="fa-solid fa-chess-knight"></i>
        <span>CTT</span>
      </div>
      <nav className="sidebar-nav">
        <button onClick={() => setPage('repertoires')}>
          <i className="fa-solid fa-book-open"></i>
          <span>Repertoires</span>
        </button>
        <button onClick={() => setPage('analytics')}>
          <i className="fa-solid fa-chart-line"></i>
          <span>Analytics</span>
        </button>
        <button onClick={() => setPage('tools')}>
          <i className="fa-solid fa-dumbbell"></i>
          <span>Training</span>
        </button>
      </nav>
       <div className="sidebar-bottom">
           <button>
            <i className="fa-solid fa-house"></i>
            <span>Home</span>
          </button>
          <button onClick={() => setPage('settings')}>
            <i className="fa-solid fa-gear"></i>
            <span>Settings</span>
          </button>
        </div>
    </aside>
    <main className="main-content">
      <h1>Chess Training Toolkit</h1>
    </main>
  </div>
);
}

export default App;