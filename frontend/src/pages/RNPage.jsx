import React, { useState } from 'react';
import ProbabilityChart from '../components/charts/ProbabilityChart';
import './RNPage.css'; // Usaremos el CSS que creamos en el paso anterior

const features = [
  "HighBP", "HighChol", "CholCheck", "BMI", "Smoker", "Stroke", "HeartDiseaseorAttack",
  "PhysActivity", "Fruits", "Veggies", "HvyAlcoholConsump", "AnyHealthcare", "NoDocbcCost",
  "GenHlth", "MentHlth", "PhysHlth", "DiffWalk", "Sex", "Age", "Education", "Income"
];

const RNPage = () => {
  const [inputs, setInputs] = useState(() => {
    const initial = {};
    features.forEach(f => initial[f] = "");
    return initial;
  });

  const [predictionData, setPredictionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (feature, value) => {
    setInputs({ ...inputs, [feature]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPredictionData(null);

    try {
      // Validar que todos los campos estén llenos
      for (const key in inputs) {
        if (inputs[key] === "") {
          throw new Error("Por favor, completa todos los campos.");
        }
      }

      const formatted = {};
      for (const key in inputs) {
        formatted[key] = parseFloat(inputs[key]);
      }

      // Usamos fetch para enviar los datos numéricos
      const response = await fetch("http://localhost:8000/predict-rn", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify(formatted)
      });
      
      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status}`);
      }

      const data = await response.json();
      setPredictionData(data);

    } catch (err) {
      console.error(err);
      setError(err.message || "Error en la predicción.");
    } finally {
      setLoading(false);
    }
  };

  const renderResult = () => {
    if (loading) return <p>Calculando...</p>;
    if (error) return <div className="error-message">{error}</div>;
    if (predictionData) {
      return (
        <>
          <div>
            <p>Predicción:</p>
            <div className="prediction-value">{predictionData.predicted_class}</div>
          </div>
          {predictionData.probabilities &&
            <div className="chart-wrapper">
              <ProbabilityChart probabilityData={predictionData.probabilities} />
            </div>
          }
        </>
      );
    }
    return <p>Completa todos los parámetros para predecir el riesgo de diabetes.</p>;
  };

  return (
    <div className="rn-container">
      <header className="rn-header">
        <h2>Predicción de Riesgo de Diabetes</h2>
        <p>Introduce los datos del paciente para evaluar el riesgo de diabetes usando una Red Neuronal.</p>
      </header>
      
      <div className="rn-content-grid">
        <div className="rn-form-widget">
          <h4>Parámetros del Paciente</h4>
          <form onSubmit={handleSubmit}>
            <div className="form-fields-grid">
              {features.map((feature) => (
                <div key={feature} className="form-group">
                  <label>{feature}</label>
                  <input
                    className="form-input"
                    type="number"
                    value={inputs[feature]}
                    onChange={(e) => handleChange(feature, e.target.value)}
                    placeholder="0"
                  />
                </div>
              ))}
            </div>
            <div className="submit-button-container">
              <button type="submit" disabled={loading} className="form-button-primary">
                {loading ? "Prediciendo..." : "Predecir Riesgo"}
              </button>
            </div>
          </form>
        </div>
        
        <div className="rn-results-widget">
          <h4>Resultado de la Predicción</h4>
          <div className="result-content">
            {renderResult()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RNPage;