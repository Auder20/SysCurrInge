import React from 'react';
import { Spinner } from 'react-bootstrap';

const LoadingSpinner = () => {
  return (
    <div 
      className="d-flex justify-content-center align-items-center" 
      style={{ 
        minHeight: '100vh', 
        backgroundColor: '#f8f9fa' 
      }}
    >
      <div className="text-center">
        <Spinner 
          animation="border" 
          role="status"
          style={{ 
            width: '3rem', 
            height: '3rem',
            color: '#0d6efd'
          }}
        >
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
        <p className="mt-3 text-muted">Cargando aplicación...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
