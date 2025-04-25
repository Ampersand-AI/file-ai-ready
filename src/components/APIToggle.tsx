import React, { useState, useEffect } from 'react';
import { claudeApiConfig, toggleRealAPI, isApiConfigured } from '../config/api-config';

interface APIToggleProps {
  className?: string;
}

/**
 * APIToggle Component
 * 
 * A toggle switch component that allows users to switch between real API calls 
 * and simulated responses for the Claude 3.7 Sonnet integration.
 */
const APIToggle: React.FC<APIToggleProps> = ({ className = '' }) => {
  const [useRealAPI, setUseRealAPI] = useState(claudeApiConfig.USE_REAL_API);
  const [isConfigured, setIsConfigured] = useState(isApiConfigured());

  useEffect(() => {
    // Update the state when the configuration changes externally
    setUseRealAPI(claudeApiConfig.USE_REAL_API);
    setIsConfigured(isApiConfigured());
  }, [claudeApiConfig.USE_REAL_API]);

  const handleToggle = () => {
    if (!isConfigured && !useRealAPI) {
      alert('API key not configured. Please add a valid API key to use real API calls.');
      return;
    }
    
    const newState = toggleRealAPI();
    setUseRealAPI(newState);
  };

  return (
    <div className={`api-toggle-container ${className}`}>
      <div className="api-toggle-label">
        API Mode: {useRealAPI ? 'Real API' : 'Simulation'}
      </div>
      <label className="switch">
        <input 
          type="checkbox" 
          checked={useRealAPI}
          onChange={handleToggle}
          disabled={!isConfigured && !useRealAPI}
        />
        <span className="slider round"></span>
      </label>
      <style jsx>{`
        .api-toggle-container {
          display: flex;
          align-items: center;
          margin: 10px 0;
        }
        
        .api-toggle-label {
          margin-right: 10px;
          font-size: 14px;
        }
        
        .switch {
          position: relative;
          display: inline-block;
          width: 60px;
          height: 34px;
        }
        
        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }
        
        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: .4s;
        }
        
        .slider:before {
          position: absolute;
          content: "";
          height: 26px;
          width: 26px;
          left: 4px;
          bottom: 4px;
          background-color: white;
          transition: .4s;
        }
        
        input:checked + .slider {
          background-color: #2196F3;
        }
        
        input:disabled + .slider {
          background-color: #e0e0e0;
          cursor: not-allowed;
        }
        
        input:focus + .slider {
          box-shadow: 0 0 1px #2196F3;
        }
        
        input:checked + .slider:before {
          transform: translateX(26px);
        }
        
        .slider.round {
          border-radius: 34px;
        }
        
        .slider.round:before {
          border-radius: 50%;
        }
      `}</style>
    </div>
  );
};

export default APIToggle; 