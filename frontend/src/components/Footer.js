import React from 'react';

function Footer() {
  return (
    <footer style={{ backgroundColor: '#282c34', padding: '10px', color: 'white', textAlign: 'center', position: 'fixed', bottom: '0', width: '100%' }}>
      <p>&copy; {new Date().getFullYear()} Sistema de Control de Vencimiento</p>
    </footer>
  );
}

export default Footer;