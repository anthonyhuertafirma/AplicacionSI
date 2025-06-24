import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const NBayesPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    battery_power: 842,
    blue: 0,
    clock_speed: 2.2,
    dual_sim: 0,
    fc: 1,
    four_g: 0,
    int_memory: 7,
    m_dep: 0.6,
    mobile_wt: 188,
    n_cores: 2,
    pc: 2,
    px_height: 20,
    px_width: 756,
    ram: 2549,
    sc_h: 9,
    sc_w: 7,
    talk_time: 19,
    three_g: 0,
    touch_screen: 0,
    wifi: 1
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: isNaN(value) ? value : parseFloat(value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      setPrediction(data);
    } catch (err) {
      console.error("Error en la petición:", err);
      setPrediction("Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>Predicción de Precio de Celular</h1>

      <button
        onClick={() => navigate("/")}
        style={{
          marginBottom: "1.5rem",
          backgroundColor: "#ccc",
          border: "none",
          padding: "10px 20px",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        ← Volver al inicio
      </button>

      <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        {Object.entries(form).map(([key, value]) => (
          <div key={key} style={{ display: "flex", flexDirection: "column" }}>
            <label style={{ fontWeight: "bold", marginBottom: "5px" }}>{key.replace(/_/g, " ")}</label>
            <input
              name={key}
              type="number"
              value={value}
              onChange={handleChange}
              step="any"
              style={{
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                fontSize: "14px"
              }}
            />
          </div>
        ))}
        <div style={{ gridColumn: "1 / -1", textAlign: "center", marginTop: "1rem" }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: "#007bff",
              color: "#fff",
              padding: "12px 30px",
              border: "none",
              borderRadius: "5px",
              fontSize: "16px",
              cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            {loading ? "Prediciendo..." : "Predecir precio"}
          </button>
        </div>
      </form>

      {prediction !== null && (
        <div
          style={{
            marginTop: "2rem",
            padding: "1rem",
            backgroundColor: "#f1f1f1",
            borderRadius: "8px",
            textAlign: "center",
            fontSize: "18px",
            fontWeight: "bold"
          }}
        >
          Rango de precio predicho: {prediction}
        </div>
      )}
    </div>
  );
};

export default NBayesPage;


