import React, { useState, useEffect } from 'react';
import { FiX, FiMaximize2 } from 'react-icons/fi';
import { useQueue } from '@/hooks/useQueue';

const FloatingBox: React.FC<{ onClose: () => void; onExpand: () => void; children: React.ReactNode }> = ({ onClose, onExpand, children }) => {
  const { clearQueueAndStack } = useQueue();

  const handleClose = () => {
    clearQueueAndStack();
    onClose();
  };


  return (
    <div className="floating-box">
      <div className="media-wrapper">
        {children}
      </div>
      <div className="bg-black controls flex p-2">
        <button onClick={onExpand}><FiMaximize2 /></button>
        <button onClick={handleClose}><FiX /></button>
        
      </div>
    </div>
  );
};

export default FloatingBox;
