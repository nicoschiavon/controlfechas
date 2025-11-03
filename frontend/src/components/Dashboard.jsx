import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import Calendar from 'react-calendar'; // Import Calendar
import 'react-calendar/dist/Calendar.css'; // Import Calendar CSS
import ProductList from './ProductList';
import ProductForm from './ProductForm';
import VencimientoList from './VencimientoList';
import VencimientoForm from './VencimientoForm';
import Header from './Header';
import Footer from './Footer';
import {
  getProducts, createProduct, updateProduct, deleteProduct,
  getVencimientosPriorityList, createVencimiento, updateVencimiento, deleteVencimiento
} from '../api';

Modal.setAppElement('#root');

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [vencimientos, setVencimientos] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingVencimiento, setEditingVencimiento] = useState(null);
  const [activeSection, setActiveSection] = useState('main'); // 'main', 'products', or 'vencimientos'

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isVencimientoModalOpen, setIsVencimientoModalOpen] = useState(false);

  const [calendarDate, setCalendarDate] = useState(new Date()); // State for calendar

  // --- Product CRUD Operations ---
  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleProductSubmit = async (productData) => {
    try {
      if (editingProduct) {
        await updateProduct(productData.scanning, productData);
      } else {
        await createProduct(productData);
      }
      fetchProducts();
      setEditingProduct(null);
      setIsProductModalOpen(false);
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleProductDelete = async (scanning) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        await deleteProduct(scanning);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  // --- Vencimiento CRUD Operations ---
  const fetchVencimientos = async () => {
    try {
      const data = await getVencimientosPriorityList();
      setVencimientos(data);
    } catch (error) {
      console.error('Error fetching vencimientos:', error);
    }
  };

  useEffect(() => {
    fetchVencimientos();
  }, []);

  const handleVencimientoSubmit = async (vencimientoData) => {
    try {
      if (editingVencimiento) {
        await updateVencimiento(vencimientoData.id, vencimientoData);
      } else {
        await createVencimiento(vencimientoData);
      }
      fetchVencimientos();
      setEditingVencimiento(null);
      setIsVencimientoModalOpen(false);
    } catch (error) {
      console.error('Error saving vencimiento:', error);
    }
  };

  const handleVencimientoDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este vencimiento?')) {
      try {
        await deleteVencimiento(id);
        fetchVencimientos();
      } catch (error) {
        console.error('Error deleting vencimiento:', error);
      }
    }
  };

  // Functions to open/close modals
  const openProductModal = (product = null) => {
    setEditingProduct(product);
    setIsProductModalOpen(true);
  };

  const closeProductModal = () => {
    setEditingProduct(null);
    setIsProductModalOpen(false);
  };

  const openVencimientoModal = (vencimiento = null) => {
    setEditingVencimiento(vencimiento);
    setIsVencimientoModalOpen(true);
  };

  const closeVencimientoModal = () => {
    setEditingVencimiento(null);
    setIsVencimientoModalOpen(false);
  };

  // Calendar tile content
  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dayVencimientos = vencimientos.filter(v => {
        const vencimientoDate = new Date(v.fecha_vencimiento);
        return vencimientoDate.getDate() === date.getDate() &&
               vencimientoDate.getMonth() === date.getMonth() &&
               vencimientoDate.getFullYear() === date.getFullYear();
      });

      if (dayVencimientos.length > 0) {
        return <p style={{ fontSize: '10px', margin: 0, color: 'red' }}>{dayVencimientos.length} items</p>;
      }
    }
    return null;
  };

  return (
    <div>
      <Header />
      <div style={{ padding: '20px' }}>
        <nav style={{ marginBottom: '20px' }}>
          <button onClick={() => setActiveSection('main')} style={{ marginRight: '10px', padding: '10px', cursor: 'pointer' }}>
            Inicio
          </button>
          <button onClick={() => setActiveSection('products')} style={{ marginRight: '10px', padding: '10px', cursor: 'pointer' }}>
            Gestión de Productos
          </button>
          <button onClick={() => setActiveSection('vencimientos')} style={{ padding: '10px', cursor: 'pointer' }}>
            Gestión de Vencimientos
          </button>
        </nav>

        {activeSection === 'main' && (
          <section>
            <h2>Calendario de Vencimientos Próximos</h2>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
              <Calendar
                onChange={setCalendarDate}
                value={calendarDate}
                tileContent={tileContent}
                className="react-calendar-custom" // Custom class for styling
              />
            </div>
            {/* Optionally display details for selected date */}
            {calendarDate && (
              <div style={{ marginTop: '20px' }}>
                <h3>Vencimientos para {calendarDate.toLocaleDateString()}</h3>
                <ul>
                  {vencimientos.filter(v => {
                    const vencimientoDate = new Date(v.fecha_vencimiento);
                    return vencimientoDate.getDate() === calendarDate.getDate() &&
                           vencimientoDate.getMonth() === calendarDate.getMonth() &&
                           vencimientoDate.getFullYear() === calendarDate.getFullYear();
                  }).map(v => (
                    <li key={v.id}>
                      {v.scanning_producto_nombre} - Lote: {v.lote} - Cantidad: {v.cantidad}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}

        {activeSection === 'products' && (
          <section>
            <h2>Gestión de Productos</h2>
            <button onClick={() => openProductModal()} style={{ marginBottom: '20px' }}>Agregar Producto</button>
            <ProductList
              products={products}
              onEdit={openProductModal}
              onDelete={handleProductDelete}
            />

            <Modal
              isOpen={isProductModalOpen}
              onRequestClose={closeProductModal}
              contentLabel="Product Form"
              className="modal-content"
              overlayClassName="modal-overlay"
            >
              <div className="modal-header">
                <h2>{editingProduct ? 'Editar Producto' : 'Agregar Nuevo Producto'}</h2>
                <button onClick={closeProductModal} className="modal-close-button">X</button>
              </div>
              <ProductForm
                productToEdit={editingProduct}
                onSubmit={handleProductSubmit}
                onCancel={closeProductModal}
              />
            </Modal>
          </section>
        )}

        {activeSection === 'vencimientos' && (
          <section>
            <h2>Gestión de Vencimientos</h2>
            <button onClick={() => openVencimientoModal()} style={{ marginBottom: '20px' }}>Agregar Vencimiento</button>
            <VencimientoList
              vencimientos={vencimientos}
              onEdit={openVencimientoModal}
              onDelete={handleVencimientoDelete}
            />

            <Modal
              isOpen={isVencimientoModalOpen}
              onRequestClose={closeVencimientoModal}
              contentLabel="Vencimiento Form"
              className="modal-content"
              overlayClassName="modal-overlay"
            >
              <div className="modal-header">
                <h2>{editingVencimiento ? 'Editar Vencimiento' : 'Agregar Nuevo Vencimiento'}</h2>
                <button onClick={closeVencimientoModal} className="modal-close-button">X</button>
              </div>
              <VencimientoForm
                vencimientoToEdit={editingVencimiento}
                productos={products}
                onSubmit={handleVencimientoSubmit}
                onCancel={closeVencimientoModal}
              />
            </Modal>
          </section>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Dashboard;