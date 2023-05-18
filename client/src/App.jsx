import { useState } from 'react'

import './App.css'

function App() {
  const [approvalUrl, setApprovalUrl] = useState('');

  const handleCrearPago = async () => {
    try {
      const response = await fetch('http://localhost:3000/crear-pago', {
        method: 'POST',
      });

      const data = await response.json();
      setApprovalUrl(data.approvalUrl);
      
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Aplicación de Prueba</h1>
      {approvalUrl ? (
        <a href={approvalUrl}>Realizar Pago</a>
      ) : (
        <button onClick={handleCrearPago}>Crear Pago</button>
      )}
    </div>
  );
};


export default App
