import React, { useState } from "react";
import './NBayesPage.css';
import ProbabilityChart from '../components/charts/ProbabilityChart';

const NBayesPage = () => {
  const [form, setForm] = useState({
    battery_power: 842, blue: 0, clock_speed: 2.2, dual_sim: 0,
    fc: 1, four_g: 0, int_memory: 7, m_dep: 0.6, mobile_wt: 188,
    n_cores: 2, pc: 2, px_height: 20, px_width: 756, ram: 2549,
    sc_h: 9, sc_w: 7, talk_time: 19, three_g: 0, touch_screen: 0,
    wifi: 1
  });

  const [predictionData, setPredictionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPredictionData(null);

    try {
      // Simulación manual de respuesta
      const simulatedResponse = {
        predicted_class: "GAMA MEDIA",
        probabilities: {
          "GAMA BAJA": 0.10,
          "GAMA MEDIA": 0.75,
          "GAMA ALTA": 0.10,
          "GAMA PREMIUM": 0.05
        }
      };

      // Simular tiempo de espera del backend
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setPredictionData(simulatedResponse);
    } catch (err) {
      console.error("Error en la simulación:", err);
      setError("No se pudo obtener la predicción simulada.");
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
            <p>Rango de Precio Predicho:</p>
            <div className="prediction-value">{predictionData.predicted_class}</div>
          </div>
          <div className="chart-wrapper">
            <ProbabilityChart probabilityData={predictionData.probabilities} />
          </div>
        </>
      );
    }
    return <p>Completa los parámetros y presiona "Predecir".</p>;
  };

  return (
    <div className="nb-container">
      <header className="nb-header">
        <h2>Predicción de Gama de Celulares con Naive Bayes</h2>
        <p>Introduce las características de un dispositivo móvil para predecir su rango de precio.</p>
      </header>

      <div className="nb-content-grid">
        <div className="nb-form-widget">
          <h4>Parámetros del Móvil</h4>
          <form onSubmit={handleSubmit}>
            <div className="form-fields-grid">
              {Object.entries(form).map(([key, value]) => (
                <div key={key} className="form-group">
                  <label>{key.replace(/_/g, " ")}</label>
                  <input
                    name={key}
                    type="number"
                    value={value}
                    onChange={handleChange}
                    step="any"
                    className="form-input"
                  />
                </div>
              ))}
            </div>
            <div className="submit-button-container">
              <button type="submit" disabled={loading} className="form-button-primary">
                {loading ? "Prediciendo..." : "Predecir Precio"}
              </button>
            </div>
          </form>
        </div>

        <div className="nb-results-widget">
          <h4>Resultado</h4>
          {renderResult()}
        </div>
      </div>
    </div>
  );
};

export default NBayesPage;
