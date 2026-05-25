import React from 'react';

const EditRepertiores = ({ onBack }: { onBack: () => void }) => {
  return (
    <div>
      <button onClick={onBack}>Back</button>
    </div>
  );
};

export default EditRepertiores