import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Componentes Principales
import Layout from './components/Layout/Layout';
import HomePage from './components/HomePage/HomePage';

// Componentes de las Páginas de Proyectos
// NOTA: Cada import apunta a su ubicación correcta
import GeneticAlgorithm from './components/GeneticAlgorithm/GeneticAlgorithm';
import TransferLearning from './components/TransferLearning/TransferLearning.jsx'
import NBayesPage from "./pages/NBayesPage.jsx";
import RNPage from "./pages/RNPage.jsx";
import Nlp from './components/Nlp/NLP.jsx'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/genetic-algorithm" element={<GeneticAlgorithm />} />
        <Route path="/naive-bayes" element={<NBayesPage />} />
        <Route path="/redes-neuronales" element={<RNPage/>} />
        <Route path="/transfer-learning" element={<TransferLearning/>} />
        <Route path="/predictnlp" element={<Nlp/>} />
      </Routes>
    </Router>
  );
}

export default App;