import React, { useState } from 'react';
import EditRepertiores from './pages/EditRepertiores';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import TrainingToolkit from './pages/TrainingToolkit';

const App = () => {
  const [page, setPage] = useState('home');

  if (page === 'repertoires') return <EditRepertiores onBack={() => setPage('home')} />;
  if (page === 'analytics') return <Analytics onBack={() => setPage('home')} />;
  if (page === 'tools') return <TrainingToolkit onBack={() => setPage('home')} />;
  if (page === 'settings') return <Settings onBack={() => setPage('home')} />;

 return (
  <div className="home">
    <h1>Chess Training Toolkit</h1>
    <div className="menu">
      <button onClick={() => setPage('repertoires')}>Edit Repertoires</button>
      <button onClick={() => setPage('analytics')}>Game Analytics</button>
      <button onClick={() => setPage('tools')}>Training Toolkit</button>
      <button onClick={() => setPage('settings')}>Settings</button>
    </div>
  </div>
);
}

export default App;