import React, { useState, useEffect, useCallback } from 'react';
import './GeneticAlgorithm.css';
import { useNavigate } from "react-router-dom";

const fitnessFunctions = {
  "x*sin(y) + y*cos(x)": ([x, y]) => x * Math.sin(y) + y * Math.cos(x),
  "x^2 + y^2": ([x, y]) => -(x ** 2 + y ** 2),
  "sin(x*y)": ([x, y]) => Math.sin(x * y),
  "x*y + cos(x+y)": ([x, y]) => x * y + Math.cos(x + y)
};

const GeneticAlgorithm = () => {
  const navigate = useNavigate();

  const [selectedFunc, setSelectedFunc] = useState("x*sin(y) + y*cos(x)");

  const [config, setConfig] = useState({
    populationSize: 50,
    generations: 100,
    mutationRate: 0.1,
    bounds: [-10, 10]
  });

  const [population, setPopulation] = useState([]);
  const [currentGen, setCurrentGen] = useState(0);
  const [bestIndividual, setBestIndividual] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [history, setHistory] = useState([]);

  const fitness = useCallback(([x, y]) => {
    return fitnessFunctions[selectedFunc]([x, y]);
  }, [selectedFunc]);

  const createIndividual = useCallback(() => {
    const range = config.bounds[1] - config.bounds[0];
    return [
      Math.random() * range + config.bounds[0],
      Math.random() * range + config.bounds[0]
    ];
  }, [config.bounds]);

  const initializePopulation = useCallback(() => {
    return Array.from({ length: config.populationSize }, createIndividual);
  }, [config.populationSize, createIndividual]);

  const selection = useCallback((pop) => {
    return [...pop]
      .sort((a, b) => fitness(b) - fitness(a))
      .slice(0, Math.floor(pop.length / 2));
  }, [fitness]);

  const crossover = useCallback((p1, p2) => {
    return [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2];
  }, []);

  const mutate = useCallback((individual) => {
    return individual.map(val => {
      if (Math.random() < config.mutationRate) {
        const mutation = (Math.random() - 0.5) * 2;
        return Math.max(
          Math.min(val + mutation, config.bounds[1]),
          config.bounds[0]
        );
      }
      return val;
    });
  }, [config.mutationRate, config.bounds]);

  const runGeneration = useCallback((pop) => {
    const selected = selection(pop);
    const newPop = [];

    while (newPop.length < config.populationSize) {
      const p1 = selected[Math.floor(Math.random() * selected.length)];
      const p2 = selected[Math.floor(Math.random() * selected.length)];
      let child = crossover(p1, p2);
      child = mutate(child);
      newPop.push(child);
    }

    return newPop;
  }, [config.populationSize, selection, crossover, mutate]);

  const toggleAlgorithm = () => {
    if (!isRunning) {
      setPopulation(initializePopulation());
      setCurrentGen(0);
      setHistory([]);
    }
    setIsRunning(!isRunning);
  };

  useEffect(() => {
    if (!isRunning || currentGen >= config.generations) return;

    const timer = setTimeout(() => {
      const newPop = runGeneration(population);
      const best = [...newPop].sort((a, b) => fitness(b) - fitness(a))[0];

      setPopulation(newPop);
      setBestIndividual(best);
      setHistory(prev => [...prev, fitness(best)]);
      setCurrentGen(prev => prev + 1);
    }, 100);

    return () => clearTimeout(timer);
  }, [isRunning, currentGen, population, config.generations, runGeneration, fitness]);

  return (
    <div className="genetic-algorithm">
      <button onClick={() => navigate('/')} style={{ marginBottom: "1rem" }}>
        Volver al inicio
      </button>

      <h2>Algoritmo Genético de Optimización</h2>

      <div style={{ marginBottom: "1rem" }}>
        <label>Selecciona función: </label>
        <select
          value={selectedFunc}
          onChange={(e) => setSelectedFunc(e.target.value)}
          disabled={isRunning}
        >
          {Object.keys(fitnessFunctions).map(fn => (
            <option key={fn} value={fn}>{fn}</option>
          ))}
        </select>
      </div>

      <div className="controls">
        <button onClick={toggleAlgorithm}>
          {isRunning ? 'Detener' : 'Iniciar'}
        </button>

        <div className="config">
          <label>
            Tamaño población:
            <input
              type="number"
              value={config.populationSize}
              onChange={(e) => setConfig({ ...config, populationSize: parseInt(e.target.value) })}
              disabled={isRunning}
            />
          </label>

          <label>
            Tasa mutación:
            <input
              type="number"
              step="0.01"
              min="0"
              max="1"
              value={config.mutationRate}
              onChange={(e) => setConfig({ ...config, mutationRate: parseFloat(e.target.value) })}
              disabled={isRunning}
            />
          </label>
        </div>
      </div>

      <div className="stats">
        <p>Generación: {currentGen}/{config.generations}</p>
        {bestIndividual && (
          <p>
            Mejor solución: x = {bestIndividual[0].toFixed(4)}, y = {bestIndividual[1].toFixed(4)}<br />
            Fitness = {fitness(bestIndividual).toFixed(4)}
          </p>
        )}
      </div>

      <div className="visualization">
        <h3>Progreso del fitness</h3>
        <div className="chart">
          {history.map((val, i) => (
            <div
              key={i}
              className="bar"
              style={{ height: `${Math.max(0, val * 5)}px` }}
              title={`Gen ${i}: ${val.toFixed(2)}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GeneticAlgorithm;
