import React, { useState } from 'react';

function FoodClassifier() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [error, setError] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setPrediction(null); // Clear previous prediction
      setConfidence(null); // Clear previous confidence
      setError(null); // Clear previous error
    } else {
      setPreviewImage(null);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedImage) {
      setError("Por favor selecciona una imagen primero.");
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedImage);

    try {
      const response = await fetch('http://localhost:8000/imagepredict', { 
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      setPrediction(data.prediction);
      setConfidence(data.confidence);
      setError(null); // Clear any previous errors

    } catch (error) {
      console.error("Error al enviar la imagen:", error);
      setError("Error al obtener la predicción. Por favor, inténtalo de nuevo.");
      setPrediction(null);
      setConfidence(null);
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', color: 'black' }}> {/* Aplicar color negro al contenedor principal */}
      <h1 style={{ textAlign: 'center', color: 'black' }}>Clasificador de Comida</h1> 
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', color: 'black' }} 
        />
        <button
          type="submit"
          style={{ padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' }}
        >
          Clasificar Comida
        </button>
      </form>

      {error && (
        <p style={{ color: 'red', textAlign: 'center', marginTop: '15px' }}>{error}</p>
      )}

      {previewImage && (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <h2 style={{ color: 'black' }}>Imagen Seleccionada:</h2> 
          <img
            src={previewImage}
            alt="Vista previa de la imagen seleccionada"
            style={{ maxWidth: '100%', height: 'auto', border: '1px solid #eee', borderRadius: '8px' }}
          />
        </div>
      )}

      {prediction && confidence && (
        <div style={{ marginTop: '20px', padding: '15px', border: '1px solid black', borderRadius: '8px', backgroundColor: '#f9f9f9', color: 'black' }}> 
          <h2 style={{ textAlign: 'center', color: 'black' }}>Resultado de la Predicción:</h2> 
          <p style={{ fontSize: '18px', textAlign: 'center', margin: '10px 0', color: 'black' }}> 
            <strong style={{ color: 'black' }}>Clasificación:</strong> {prediction} 
          </p>
          <p style={{ fontSize: '18px', textAlign: 'center', margin: '10px 0', color: 'black' }}> 
            <strong style={{ color: 'black' }}>Confianza:</strong> {confidence} 
          </p>
        </div>
      )}
    </div>
  );
}

export default FoodClassifier;