import React from 'react';
import WorkCard from '../WorkCard/WorkCard';
import './HomePage.css';

const HomePage = () => {
  const weeklyWorks = [
    {
      id: 1,
      name: "Algoritmo Genético",
      icon: "🧬",
      description: "Optimización basada en evolución natural.",
      tag: "Metaheurística",
      path: "/genetic-algorithm"
    },
    {
      id: 2,
      name: "Naive Bayes",
      icon: "📊",
      description: "Clasificación basada en probabilidad.",
      tag: "Estadística",
      path: "/naive-bayes"
    },
    {
      id: 3,
      name: "Redes Neuronales",
      icon: "🤖",
      description: "Modelos inspirados en el cerebro humano.",
      tag: "Deep Learning",
      path: "/redes-neuronales"
    },
    {
      id: 4,
      name: "Transfer Learning",
      icon: "👨‍🏫",
      description: "Reutilización del conocimiento preentrenado.",
      tag: "Aprendizaje Automático",
      path: "/transfer-learning"
    },
    {
      id: 5,
      name: "NLP",
      icon: "👨‍🏫",
      description: "Procesamiento de lenguaje natural para la clasificación de incidencias.",
      tag: "Procesamiento de Lenguaje Natural",
      path: "/predictnlp"
    }
  ];

  return (
    <div className="home-container">
      <header>
        <h1>Mis Trabajos de Software Inteligente</h1>
        <p>Un portafolio de proyectos del G5.</p>
      </header>

      <div className="works-grid">
        {weeklyWorks.map((work) => (
          <WorkCard key={work.id} {...work} />
        ))}
      </div>

      <footer>
        <p>© {new Date().getFullYear()} - Construido con React y FastAPI</p>
      </footer>
    </div>
  );
};

export default HomePage;
