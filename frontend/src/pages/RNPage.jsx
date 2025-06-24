import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './DiabetesPredictorSingle.css';

const features = [
  "HighBP", "HighChol", "CholCheck", "BMI", "Smoker", "Stroke", "HeartDiseaseorAttack",
  "PhysActivity", "Fruits", "Veggies", "HvyAlcoholConsump", "AnyHealthcare", "NoDocbcCost",
  "GenHlth", "MentHlth", "PhysHlth", "DiffWalk", "Sex", "Age", "Education", "Income"
];

export default function DiabetesPredictorSingle() {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState(() => {
    const initial = {};
    features.forEach(f => initial[f] = "");
    return initial;
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (feature, value) => {
    setInputs({ ...inputs, [feature]: value });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const formatted = {};
      for (const key in inputs) {
        formatted[key] = parseFloat(inputs[key]);
      }

      const response = await axios.post("http://localhost:8000/predict/", formatted);
      const clase = response.data.clase;
      setPrediction(
        clase === 0
          ? "No tiene diabetes"
          : clase === 1
            ? "Pre-diabetes"
            : clase === 2
              ? "Diabetes"
              : "Clase desconocida"
      );
    } catch (err) {
      console.error(err);
      setPrediction("Error en la predicción");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <button className="back-button" onClick={() => navigate("/")}>
        ⬅ Volver al inicio
      </button>

      <h2 className="title">Predicción de Diabetes</h2>

      <div className="form-grid">
        {features.map((feature) => (
          <div key={feature} className="form-field">
            <label>{feature}</label>
            <input
              type="number"
              value={inputs[feature]}
              onChange={(e) => handleChange(feature, e.target.value)}
            />
          </div>
        ))}
      </div>

      <button onClick={handleSubmit} disabled={loading} className="submit-button">
        {loading ? "Calculando..." : "Predecir"}
      </button>

      {prediction && (
        <div className="result">
          <strong>Resultado:</strong> {prediction}
        </div>
      )}
    </div>
  );
}


