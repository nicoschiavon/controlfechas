import React from 'react';

function VencimientoList({ vencimientos, onEdit, onDelete }) {
  const getPriorityColor = (status) => {
    switch (status) {
      case 'Rojo':
        return 'red';
      case 'Amarillo':
        return 'yellow';
      case 'Verde':
        return 'green';
      default:
        return 'white';
    }
  };

  return (
    <div>
      <h3>Lista de Vencimientos</h3>
      <div className="table-responsive"> {/* Added responsive wrapper */}
        <table>
          <thead>
            <tr>
              <th>Producto (Scanning)</th>
              <th>Nombre</th>
              <th>Tipo</th>
              <th>Fecha Vencimiento</th>
              <th>Lote</th>
              <th>Cantidad</th>
              <th>Fecha Retiro</th>
              <th>Prioridad</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {vencimientos.map(vencimiento => (
              <tr key={vencimiento.id} style={{ backgroundColor: getPriorityColor(vencimiento.estado_prioridad) }}>
                <td>{vencimiento.scanning_producto_scanning}</td>
                <td>{vencimiento.scanning_producto_nombre}</td>
                <td>{vencimiento.scanning_producto_tipo}</td>
                <td>{vencimiento.fecha_vencimiento}</td>
                <td>{vencimiento.lote}</td>
                <td>{vencimiento.cantidad}</td>
                <td>{vencimiento.fecha_retiro}</td>
                <td>{vencimiento.estado_prioridad}</td>
                <td>
                  <button onClick={() => onEdit(vencimiento)}>Editar</button>
                  <button onClick={() => onDelete(vencimiento.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default VencimientoList;