import React, { useState } from 'react';
import App from '../App';

const Analytics = ({ onBack }: { onBack: () => void }) => {
    return (
        <div>
            <button onClick={onBack}>Back</button>
        </div>
    )
};

export default Analytics