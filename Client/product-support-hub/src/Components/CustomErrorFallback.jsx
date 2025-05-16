// CustomErrorFallback.jsx
import React from 'react';
import './ErrorFallback.css'; // Create this CSS file for styling

const CustomErrorFallback = (error, errorInfo) => {
  return (
    <div className="error-container">
      <div className="error-card">
        <h1>Oops! Something went wrong</h1>
        <p>
          We're sorry for the inconvenience. The error has been logged and we're
          working on it.
        </p>

        {process.env.NODE_ENV !== 'production' && (
          <details className="error-details">
            <summary>Technical Details</summary>
            <pre>{error?.toString()}</pre>
            <pre>{errorInfo?.componentStack}</pre>
          </details>
        )}

        <div className="error-actions">
          <button onClick={() => window.location.reload()}>Refresh Page</button>
          <button onClick={() => (window.location.href = '/')}>
            Go to Homepage
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomErrorFallback;
