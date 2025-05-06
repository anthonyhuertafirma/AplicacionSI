import React, { useState, useEffect, useCallback } from 'react';
import './GeneticAlgorithm.css'; 
const GeneticAlgorithm = () => {
  // Configuración del algoritmo
  const [config, setConfig] = useState({
    populationSize: 50,
    generations: 100,
    mutationRate: 0.1,
    bounds: [-10, 10]
  });

  // Estado del algoritmo
  const [population, setPopulation] = useState([]);
  const [currentGen, setCurrentGen] = useState(0);
  const [bestIndividual, setBestIndividual] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [history, setHistory] = useState([]);

  // Función de fitness
  const fitness = useCallback(([x, y]) => {
    return x * Math.sin(y) + y * Math.cos(x);
  }, []);

  // Crear individuo aleatorio
  const createIndividual = useCallback(() => {
    const range = config.bounds[1] - config.bounds[0];
    return [
      Math.random() * range + config.bounds[0],
      Math.random() * range + config.bounds[0]
    ];
  }, [config.bounds]);

  // Inicializar población
  const initializePopulation = useCallback(() => {
    return Array.from({ length: config.populationSize }, createIndividual);
  }, [config.populationSize, createIndividual]);

  // Selección (torneo)
  const selection = useCallback((pop) => {
    return [...pop]
      .sort((a, b) => fitness(b) - fitness(a))
      .slice(0, Math.floor(pop.length / 2));
  }, [fitness]);

  // Cruce (punto medio)
  const crossover = useCallback((parent1, parent2) => {
    return [
      (parent1[0] + parent2[0]) / 2,
      (parent1[1] + parent2[1]) / 2
    ];
  }, []);

  // Mutación
  const mutate = useCallback((individual) => {
    return individual.map(value => {
      if (Math.random() < config.mutationRate) {
        const mutation = (Math.random() - 0.5) * 2;
        return Math.max(
          Math.min(
            value + mutation, 
            config.bounds[1]
          ), 
          config.bounds[0]
        );
      }
      return value;
    });
  }, [config.mutationRate, config.bounds]);

  // Ejecutar una generación
  const runGeneration = useCallback((currentPop) => {
    const selected = selection(currentPop);
    const newPopulation = [];

    while (newPopulation.length < config.populationSize) {
      const parent1 = selected[Math.floor(Math.random() * selected.length)];
      const parent2 = selected[Math.floor(Math.random() * selected.length)];
      let child = crossover(parent1, parent2);
      child = mutate(child);
      newPopulation.push(child);
    }

    return newPopulation;
  }, [config.populationSize, selection, crossover, mutate]);

  // Iniciar/detener el algoritmo
  const toggleAlgorithm = () => {
    if (!isRunning) {
      setPopulation(initializePopulation());
      setCurrentGen(0);
      setHistory([]);
    }
    setIsRunning(!isRunning);
  };

  // Efecto para ejecutar el algoritmo
  useEffect(() => {
    if (!isRunning || currentGen >= config.generations) return;

    const timer = setTimeout(() => {
      const newPopulation = runGeneration(population);
      const currentBest = [...newPopulation]
        .sort((a, b) => fitness(b) - fitness(a))[0];

      setPopulation(newPopulation);
      setBestIndividual(currentBest);
      setHistory(prev => [...prev, fitness(currentBest)]);
      setCurrentGen(prev => prev + 1);
    }, 100);

    return () => clearTimeout(timer);
  }, [isRunning, currentGen, population, config.generations, runGeneration, fitness]);

  // Renderizado
  return (
    <div className="genetic-algorithm">
      <h2>Algoritmo Genético Optimización</h2>
      <p>Función: f(x,y) = x*sin(y) + y*cos(x)</p>

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
              onChange={(e) => setConfig({...config, populationSize: parseInt(e.target.value)})}
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
              onChange={(e) => setConfig({...config, mutationRate: parseFloat(e.target.value)})}
              disabled={isRunning}
            />
          </label>
        </div>
      </div>

      <div className="stats">
        <p>Generación: {currentGen}/{config.generations}</p>
        {bestIndividual && (
          <p>
            Mejor solución: 
            x = {bestIndividual[0].toFixed(4)}, 
            y = {bestIndividual[1].toFixed(4)}, 
            Fitness = {fitness(bestIndividual).toFixed(4)}
          </p>
        )}
      </div>

      <div className="visualization">
        <h3>Progreso del fitness</h3>
        <div className="chart">
          {history.map((value, idx) => (
            <div 
              key={idx} 
              className="bar" 
              style={{ height: `${Math.max(0, value * 5)}px` }}
              title={`Gen ${idx}: ${value.toFixed(2)}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GeneticAlgorithm;