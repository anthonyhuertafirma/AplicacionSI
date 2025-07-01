import React, { useState, useEffect, useCallback } from 'react';
import './GeneticAlgorithm.css';

const fitnessFunctions = {
    "x*sin(y) + y*cos(x)": ([x, y]) => x * Math.sin(y) + y * Math.cos(x),
    "x^2 + y^2": ([x, y]) => -(x ** 2 + y ** 2),
    "sin(x*y)": ([x, y]) => Math.sin(x * y),
    "x*y + cos(x+y)": ([x, y]) => x * y + Math.cos(x + y)
};

const GeneticAlgorithm = () => {
    const [selectedFunc, setSelectedFunc] = useState("x*sin(y) + y*cos(x)");
    const [config, setConfig] = useState({ populationSize: 50, generations: 100, mutationRate: 0.1, bounds: [-10, 10] });
    const [population, setPopulation] = useState([]);
    const [currentGen, setCurrentGen] = useState(0);
    const [bestIndividual, setBestIndividual] = useState(null);
    const [isRunning, setIsRunning] = useState(false);
    const [history, setHistory] = useState([]);
    const fitness = useCallback(([x, y]) => fitnessFunctions[selectedFunc]([x, y]), [selectedFunc]);
    const createIndividual = useCallback(() => [Math.random() * (config.bounds[1] - config.bounds[0]) + config.bounds[0], Math.random() * (config.bounds[1] - config.bounds[0]) + config.bounds[0]], [config.bounds]);
    const initializePopulation = useCallback(() => Array.from({ length: config.populationSize }, createIndividual), [config.populationSize, createIndividual]);
    const selection = useCallback((pop) => [...pop].sort((a, b) => fitness(b) - fitness(a)).slice(0, Math.floor(pop.length / 2)), [fitness]);
    const crossover = useCallback((p1, p2) => [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2], []);
    const mutate = useCallback((individual) => individual.map(val => Math.random() < config.mutationRate ? Math.max(Math.min(val + (Math.random() - 0.5) * 2, config.bounds[1]), config.bounds[0]) : val), [config.mutationRate, config.bounds]);
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
        if (!isRunning || currentGen >= config.generations) {
            if (currentGen >= config.generations) setIsRunning(false);
            return;
        };
        const timer = setTimeout(() => {
            const newPop = runGeneration(population);
            const best = [...newPop].sort((a, b) => fitness(b) - fitness(a))[0];
            setPopulation(newPop);
            setBestIndividual(best);
            setHistory(prev => [...prev, fitness(best)]);
            setCurrentGen(prev => prev + 1);
        }, 50);
        return () => clearTimeout(timer);
    }, [isRunning, currentGen, population, config.generations, runGeneration, fitness]);

    return (
        <div className="ga-container">
            <div className="ga-header">
                <h2>Algoritmo Genético de Optimización</h2>
                <p>Ajusta los parámetros y observa cómo el algoritmo encuentra la solución óptima para la función matemática.</p>
            </div>

            <div className="ga-main-content">
                <div className="ga-controls-widget">
                    <h4>Controles</h4>
                    <div className="form-group">
                        <label>Función de Fitness</label>
                        <select className="form-select" value={selectedFunc} onChange={(e) => setSelectedFunc(e.target.value)} disabled={isRunning}>
                            {Object.keys(fitnessFunctions).map(fn => <option key={fn} value={fn}>{fn}</option>)}
                        </select>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Tamaño Población</label>
                            <input className="form-input" type="number" value={config.populationSize} onChange={(e) => setConfig({ ...config, populationSize: parseInt(e.target.value) })} disabled={isRunning} />
                        </div>
                        <div className="form-group">
                            <label>Tasa Mutación</label>
                            <input className="form-input" type="number" step="0.01" min="0" max="1" value={config.mutationRate} onChange={(e) => setConfig({ ...config, mutationRate: parseFloat(e.target.value) })} disabled={isRunning} />
                        </div>
                    </div>
                    <button className="form-button-primary" onClick={toggleAlgorithm} disabled={isRunning && currentGen < config.generations}>
                        {isRunning ? 'Detener Simulación' : 'Iniciar Simulación'}
                    </button>
                </div>

                <div className="ga-results-widget">
                    <h4>Resultados en Vivo</h4>
                    <p><strong>Generación:</strong> {currentGen} / {config.generations}</p>
                    {bestIndividual ? (
                        <div>
                            <p><strong>Mejor Solución:</strong></p>
                            <p className="result-coords">x = {bestIndividual[0].toFixed(4)}, y = {bestIndividual[1].toFixed(4)}</p>
                            <p><strong>Valor Fitness:</strong> <span className="fitness-value">{fitness(bestIndividual).toFixed(4)}</span></p>
                        </div>
                    ) : (
                        <p>Inicia la simulación para ver los resultados.</p>
                    )}
                </div>
            </div>

            <div className="ga-visualization-widget">
                <h4>Progreso del Fitness por Generación</h4>
                <div className="chart-container">
                    {history.map((val, i) => (
                        <div key={i} className="bar" style={{ height: `${Math.max(0, val * 10 + 5)}px` }} title={`Gen ${i}: ${val.toFixed(2)}`} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GeneticAlgorithm;