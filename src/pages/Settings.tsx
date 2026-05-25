import React, { useState } from 'react';
import App from '../App';

const Settings = ({ onBack }: { onBack: () => void }) => {
  return (
    <div>
      <button onClick={onBack}>Back</button>
    </div>
  );
};

export default Settings