import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css'; 

const HomePage = () => {
  const navigate = useNavigate();

  // Lista de tus trabajos semanales
  const weeklyWorks = [
    { id: 1, name: "Algoritmo Genético", path: "/genetic-algorithm" },
  ];

  return (
    <div className="home-container">
      <header>
        <h1>Mis Trabajos de Software Inteligente</h1>
        <p>Ciclo 2025-1 - UNMSM</p>
      </header>

      <div className="works-grid">
        {weeklyWorks.map((work) => (
          <button 
            key={work.id}
            className="work-card"
            onClick={() => navigate(work.path)}
          >
            <span>{work.name}</span>
          </button>
        ))}
      </div>

      <footer>
        <p>© {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default HomePage;