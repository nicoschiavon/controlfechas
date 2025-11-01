import React from 'react';

function ProductList({ products, onEdit, onDelete }) {
  return (
    <div>
      <h3>Lista de Productos</h3>
      <div className="table-responsive"> {/* Added responsive wrapper */}
        <table>
          <thead>
            <tr>
              <th>Scanning</th>
              <th>Nombre</th>
              <th>Tipo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.scanning}>
                <td>{product.scanning}</td>
                <td>{product.nombre}</td>
                <td>{product.tipo}</td>
                <td>
                  <button onClick={() => onEdit(product)}>Editar</button>
                  <button onClick={() => onDelete(product.scanning)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProductList;