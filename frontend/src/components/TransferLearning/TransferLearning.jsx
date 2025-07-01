import React, { useState, useRef } from 'react';
import './TransferLearning.css'; // Asegúrate que el nombre del CSS coincida

const TransferLearningPage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageChange = (file) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
      setPrediction(null);
      setConfidence(null);
      setError(null);
    } else {
      setError("Por favor selecciona un archivo de imagen válido.");
      setSelectedImage(null);
      setPreviewImage(null);
    }
  };

  const handleSubmit = async () => {
    if (!selectedImage) {
      setError("Por favor selecciona una imagen primero.");
      return;
    }
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', selectedImage);

    try {
      const response = await fetch('http://localhost:8000/imagepredict', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

      const data = await response.json();
      setPrediction(data.prediction);
      // Convertimos la confianza (ej: 0.95) a un string con % (ej: "95.00%")
      setConfidence(`${(parseFloat(data.confidence))}%`);
    } catch (error) {
      console.error("Error al enviar la imagen:", error);
      setError("Error al obtener la predicción. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnter = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };
  const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageChange(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="tl-container">
      <header className="tl-header">
        <h2>Clasificador de Imágenes con Transfer Learning</h2>
        <p>Sube una imagen de una comida para que el modelo la identifique.</p>
      </header>

      <div className="tl-content-grid">
        <div className="tl-widget">
          <h4>Cargar Imagen</h4>
          <div 
            className={`drop-zone ${isDragging ? 'dragging' : ''}`}
            onClick={() => fileInputRef.current.click()}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="file-input"
              onChange={(e) => handleImageChange(e.target.files[0])}
            />
            <p>Arrastra y suelta una imagen aquí, o <span>haz clic para seleccionar</span>.</p>
          </div>
          <button 
            className="form-button-primary" 
            onClick={handleSubmit} 
            disabled={!selectedImage || loading}
            style={{width: '100%', marginTop: '1rem'}}
          >
            {loading ? "Clasificando..." : "Clasificar Comida"}
          </button>
        </div>

        <div className="tl-widget">
          <h4>Vista Previa y Resultado</h4>
          <div className="result-content-area">
            {error && <div className="error-message">{error}</div>}
            {!previewImage && !error && <p className="initial-text">Selecciona una imagen para comenzar.</p>}
            {previewImage && (
              <div className="preview-container">
                <img src={previewImage} alt="Vista previa" className="preview-image" />
              </div>
            )}
            {loading && <div className="loading-text">Analizando...</div>}
            {prediction && confidence && (
              <div className="results-container">
                <p className="prediction-text">Predicción: <span>{prediction}</span></p>
                <div className="confidence-meter">
                  <label>Confianza: {confidence}</label>
                  <div className="confidence-bar-bg">
                    <div className="confidence-bar-fill" style={{ width: confidence }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransferLearningPage;