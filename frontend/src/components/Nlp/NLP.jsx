import React, { useState, useEffect } from 'react';

function Nlp() {
  const [texto, setTexto] = useState('Buenas noches equipo de Soporte técnico, desde el día de ayer no puedo ni enviar ni recibir correos desde Outlook. porfavor su apoyo. Atte. RRHH.');
  const [categoria, setCategoria] = useState('');
  const [loading, setLoading] = useState(false);

  // Función para enviar el texto al backend
  const hacerPrediccion = async () => {
    setLoading(true);
    setCategoria('');

    try {
      const response = await fetch('http://localhost:8000/predictnlp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texto })
      });

      const data = await response.json();
      setCategoria(data.categoria_predicha);
    } catch (error) {
      setCategoria('Error al conectar con el servidor');
      console.error(error);
    }

    setLoading(false);
  };

  // Ejecutar al cargar la página
  useEffect(() => {
    //hacerPrediccion();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    hacerPrediccion();
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h2>Clasificador de Incidentes (NLP con BETO)</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          rows="4"
          cols="60"
          placeholder="Escribe tu problema aquí..."
          required
        />
        <br />
        <button type="submit" disabled={loading}>
          {loading ? 'Clasificando...' : 'Enviar'}
        </button>
      </form>

      {categoria && (
        <div style={{ marginTop: '1rem', fontWeight: 'bold' }}>
          Categoría predicha: <span>{categoria}</span>
        </div>
      )}
    </div>
  );
}


export default Nlp;
