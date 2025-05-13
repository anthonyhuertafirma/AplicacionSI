import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage/HomePage';
import GeneticAlgorithm from './components/GeneticAlgorithm/GeneticAlgorithm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/genetic-algorithm" element={<GeneticAlgorithm />} />
      </Routes>
    </Router>
  );
}

export default App
