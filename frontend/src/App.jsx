import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage/HomePage';
import GeneticAlgorithm from './components/GeneticAlgorithm/GeneticAlgorithm';
import TransferLearning from './components/TransferLearning/TransferLearning.jsx'
import NBayesPage from "./pages/NBayesPage.jsx";
import RNPage from "./pages/RNPage.jsx";
import Nlp from "./components/Nlp/NLP.jsx"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/genetic-algorithm" element={<GeneticAlgorithm />} />
        <Route path="/naive-bayes" element={<NBayesPage />} />
        <Route path="/redes-neuronales" element={<RNPage/>} />
        <Route path="/transfer-learning" element={<TransferLearning/>} />
        <Route path="/nlp" element={<Nlp/>} />
      </Routes>
    </Router>
  );
}

export default App
