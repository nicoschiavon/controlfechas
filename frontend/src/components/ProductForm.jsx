import React, { useState, useEffect } from 'react';
import BarcodeScanner from './BarcodeScanner'; // Import BarcodeScanner
import Modal from 'react-modal'; // Import Modal for scanner

function ProductForm({ productToEdit, onSubmit, onCancel }) {
  const [product, setProduct] = useState({
    scanning: '',
    nombre: '',
    tipo: 'Lácteo' // Default value
  });
  const [isScannerOpen, setIsScannerOpen] = useState(false); // State for scanner modal

  useEffect(() => {
    if (productToEdit) {
      setProduct(productToEdit);
    } else {
      setProduct({
        scanning: '',
        nombre: '',
        tipo: 'Lácteo'
      });
    }
  }, [productToEdit]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct(prevProduct => ({
      ...prevProduct,
      [name]: value
    }));
  };

  const handleScanResult = (result) => {
    setProduct(prevProduct => ({
      ...prevProduct,
      scanning: result
    }));
    setIsScannerOpen(false); // Close scanner after scan
  };

  const handleScannerError = (err) => {
    console.error("Scanner Error:", err);
    // Optionally display an error message to the user
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(product);
  };

  return (
    <div>
      <h3>{productToEdit ? 'Editar Producto' : 'Agregar Nuevo Producto'}</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Scanning:</label>
          <input
            type="text"
            name="scanning"
            value={product.scanning}
            onChange={handleInputChange}
            required
            disabled={!!productToEdit} // Disable scanning input if editing
          />
          <button type="button" onClick={() => setIsScannerOpen(true)} style={{ marginLeft: '10px' }}>
            Escanear
          </button>
        </div>
        <div>
          <label>Nombre:</label>
          <input
            type="text"
            name="nombre"
            value={product.nombre}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Tipo:</label>
          <select name="tipo" value={product.tipo} onChange={handleInputChange} required>
            <option value="Lácteo">Lácteo</option>
            <option value="Carne">Carne</option>
            <option value="Crema">Crema</option>
          </select>
        </div>
        <button type="submit">{productToEdit ? 'Guardar Cambios' : 'Agregar Producto'}</button>
        {onCancel && <button type="button" onClick={onCancel}>Cancelar</button>}
      </form>

      <Modal
        isOpen={isScannerOpen}
        onRequestClose={() => setIsScannerOpen(false)}
        contentLabel="Barcode Scanner"
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <div className="modal-header">
          <h2>Escanear Código de Barras</h2>
          <button onClick={() => setIsScannerOpen(false)} className="modal-close-button">X</button>
        </div>
        <BarcodeScanner
          onScan={handleScanResult}
          onError={handleScannerError}
          onCancel={() => setIsScannerOpen(false)}
        />
      </Modal>
    </div>
  );
}

export default ProductForm;