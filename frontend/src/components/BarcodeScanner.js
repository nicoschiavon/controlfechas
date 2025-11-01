import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';

function BarcodeScanner({ onScan, onError, onCancel }) {
  const [facingMode, setFacingMode] = useState('environment'); // 'user' for front camera, 'environment' for rear camera

  const handleScan = (data) => {
    if (data) {
      onScan(data);
    }
  };

  const handleError = (err) => {
    console.error(err);
    if (onError) {
      onError(err);
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}>
      <h3>Escanear Código de Barras</h3>
      <QrReader
        onResult={(result, error) => {
          if (!!result) {
            handleScan(result?.text);
          }

          if (!!error) {
            handleError(error);
          }
        }}
        constraints={{ facingMode: facingMode }}
        scanDelay={300} // Delay between scans
        videoContainerStyle={{ width: '100%', paddingTop: '100%' }} // Maintain aspect ratio
        videoStyle={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      />
      <div style={{ marginTop: '10px' }}>
        <button onClick={() => setFacingMode(prevMode => prevMode === 'user' ? 'environment' : 'user')}>
          Cambiar Cámara ({facingMode === 'user' ? 'Frontal' : 'Trasera'})
        </button>
        <button onClick={onCancel} style={{ marginLeft: '10px', backgroundColor: '#e74c3c' }}>
          Cancelar
        </button>
      </div>
    </div>
  );
}

export default BarcodeScanner;