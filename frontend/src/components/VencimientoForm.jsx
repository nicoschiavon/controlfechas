import React, { useState, useEffect } from 'react';
import BarcodeScanner from './BarcodeScanner'; // Import BarcodeScanner
import Modal from 'react-modal'; // Import Modal for scanner

function VencimientoForm({ vencimientoToEdit, productos, onSubmit, onCancel }) {
  const [vencimiento, setVencimiento] = useState({
    scanning_producto: '',
    fecha_vencimiento: '',
    cantidad: '',
    lote: '',
    tipo: '' // This will be derived
  });
  const [isScannerOpen, setIsScannerOpen] = useState(false); // State for scanner modal

  useEffect(() => {
    if (vencimientoToEdit) {
      // When editing, the scanning_producto will be the 'scanning' field of the related product
      setVencimiento({
        ...vencimientoToEdit,
        scanning_producto: vencimientoToEdit.scanning_producto_scanning
      });
    } else {
      setVencimiento({
        scanning_producto: '',
        fecha_vencimiento: '',
        cantidad: '',
        lote: '',
        tipo: ''
      });
    }
  }, [vencimientoToEdit]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVencimiento(prevVencimiento => ({
      ...prevVencimiento,
      [name]: value
    }));
  };

  const handleScanResult = (result) => {
    setVencimiento(prevVencimiento => ({
      ...prevVencimiento,
      scanning_producto: result
    }));
    setIsScannerOpen(false); // Close scanner after scan
  };

  const handleScannerError = (err) => {
    console.error("Scanner Error:", err);
    // Optionally display an error message to the user
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Find the selected product to get its 'tipo'
    const selectedProduct = productos.find(p => p.scanning === vencimiento.scanning_producto);
    const vencimientoData = {
      ...vencimiento,
      tipo: selectedProduct ? selectedProduct.tipo : '' // Set 'tipo' based on selected product
    };
    onSubmit(vencimientoData);
  };

  return (
    <div>
      <h3>{vencimientoToEdit ? 'Editar Vencimiento' : 'Agregar Nuevo Vencimiento'}</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Producto (Scanning):</label>
          <select
            name="scanning_producto"
            value={vencimiento.scanning_producto}
            onChange={handleInputChange}
            required
            disabled={!!vencimientoToEdit} // Disable product selection if editing
          >
            <option value="">Seleccione un producto</option>
            {productos.map(producto => (
              <option key={producto.scanning} value={producto.scanning}>
                {producto.nombre} ({producto.scanning})
              </option>
            ))}
          </select>
          <button type="button" onClick={() => setIsScannerOpen(true)} style={{ marginLeft: '10px' }}>
            Escanear
          </button>
        </div>
        <div>
          <label>Fecha de Vencimiento:</label>
          <input
            type="date"
            name="fecha_vencimiento"
            value={vencimiento.fecha_vencimiento}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Cantidad:</label>
          <input
            type="number"
            name="cantidad"
            value={vencimiento.cantidad}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Lote:</label>
          <input
            type="text"
            name="lote"
            value={vencimiento.lote}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">{vencimientoToEdit ? 'Guardar Cambios' : 'Agregar Vencimiento'}</button>
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

export default VencimientoForm;