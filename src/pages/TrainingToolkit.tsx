import React, { useState } from 'react';
import App from '../App';
const TrainingToolkit = ({ onBack }: { onBack: () => void }) => {
    return (
        <div>
            <button onClick={onBack}>Back</button>
        </div>
    )
};

export default TrainingToolkit