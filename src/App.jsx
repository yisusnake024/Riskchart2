import { useState, useCallback, useMemo } from 'react';
import {
  Settings,
  TrendingUp,
  Terminal as TerminalIcon,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Info,
  Layers,
  Trash2,
  History,
  Save,
  Download
} from 'lucide-react';
import { binomialCDF, getStepByStepCalculations } from './utils/mathCore';
import ComparisonChart from './components/ComparisonChart';

export default function App() {
  // --- Estados de los Escenarios A y B ---
  const [nA, setNA] = useState(15);
  const [pA, setPA] = useState(0.08);
  const [kA, setKA] = useState(2);

  const [nB, setNB] = useState(15);
  const [pB, setPB] = useState(0.18);
  const [kB, setKB] = useState(2);

  // --- Confianzas Operativas (P(X <= k)) ---
  const confidenceA = binomialCDF(nA, pA, kA);
  const confidenceB = binomialCDF(nB, pB, kB);

  const isSafeA = confidenceA >= 0.95;
  const isSafeB = confidenceB >= 0.95;

  // --- Estado de la Terminal de Desglose Matemático ---
  const [activeTerminalTab, setActiveTerminalTab] = useState('A');

  // --- Estado del Módulo de Muestreo de Monte Carlo ---
  const [simScenario, setSimScenario] = useState('A');
  const [simulating, setSimulating] = useState(false);
  const [simSample, setSimSample] = useState([]);
  const [simFailCount, setSimFailCount] = useState(0);
  const [simResult, setSimResult] = useState(null); // 'ACCEPTED', 'REJECTED' o null

  // --- Estado del Historial de Cálculos ---
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('riskchart_history');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error(e);
      return [];
    }
  });

  const handleSaveCalculation = (scenario) => {
    const isA = scenario === 'A';
    const n = isA ? nA : nB;
    const p = isA ? pA : pB;
    const k = isA ? kA : kB;
    const confidence = isA ? confidenceA : confidenceB;

    const newCalc = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      type: 'calculation',
      scenario,
      n,
      p,
      k,
      confidence
    };

    setHistory(prev => {
      const updated = [newCalc, ...prev];
      localStorage.setItem('riskchart_history', JSON.stringify(updated));
      return updated;
    });
  };

  const handleLoadHistoryItem = (item) => {
    if (item.scenario === 'A') {
      setNA(item.n);
      setPA(item.p);
      setKA(item.k);
    } else {
      setNB(item.n);
      setPB(item.p);
      setKB(item.k);
    }
  };

  const handleDeleteHistoryItem = (id) => {
    setHistory(prev => {
      const updated = prev.filter(item => item.id !== id);
      localStorage.setItem('riskchart_history', JSON.stringify(updated));
      return updated;
    });
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('riskchart_history');
  };

  const historyStats = useMemo(() => {
    const calcs = history.filter(item => item.type === 'calculation');
    const sims = history.filter(item => item.type === 'simulation');

    const avgConfidence = calcs.length > 0
      ? (calcs.reduce((acc, curr) => acc + (curr.confidence || 0), 0) / calcs.length * 100).toFixed(1)
      : '0.0';

    const acceptedSims = sims.filter(item => item.result === 'ACCEPTED').length;
    const acceptanceRate = sims.length > 0
      ? ((acceptedSims / sims.length) * 100).toFixed(1)
      : '0.0';

    return {
      total: history.length,
      calcsCount: calcs.length,
      simsCount: sims.length,
      avgConfidence,
      acceptanceRate
    };
  }, [history]);

  // Inicia la simulación interactiva paso a paso
  const handleStartSimulation = useCallback(() => {
    const isA = simScenario === 'A';
    const n = isA ? nA : nB;
    const p = isA ? pA : pB;
    const k = isA ? kA : kB;

    setSimulating(true);
    setSimSample([]);
    setSimFailCount(0);
    setSimResult(null);

    let currentIndex = 0;
    let fails = 0;
    const localSample = [];

    // Animación de evaluación secuencial de componentes del lote (ensayos de Bernoulli)
    const interval = setInterval(() => {
      if (currentIndex < n) {
        // Ensayo de Bernoulli: Éxito/Fallo con probabilidad p
        const isDefective = Math.random() < p;
        if (isDefective) fails++;

        localSample.push({ id: currentIndex + 1, isDefective });

        setSimSample([...localSample]);
        setSimFailCount(fails);

        currentIndex++;
      } else {
        clearInterval(interval);
        const finalResult = fails <= k ? 'ACCEPTED' : 'REJECTED';
        setSimResult(finalResult);
        setSimulating(false);

        // Guardar automáticamente la simulación en el historial
        const newSimRun = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          type: 'simulation',
          scenario: simScenario,
          n,
          p,
          k,
          fails,
          result: finalResult
        };

        setHistory(prev => {
          const updated = [newSimRun, ...prev];
          localStorage.setItem('riskchart_history', JSON.stringify(updated));
          return updated;
        });
      }
    }, 80); // 80ms de retraso por pieza para dar sensación de cinta transportadora real
  }, [simScenario, nA, pA, kA, nB, pB, kB]);

  const terminalLines = useMemo(() => {
    const isA = activeTerminalTab === 'A';
    const n = isA ? nA : nB;
    const p = isA ? pA : pB;
    const k = isA ? kA : kB;
    const activeConf = isA ? confidenceA : confidenceB;

    const { steps } = getStepByStepCalculations(n, p, k);
    const lines = [];

    lines.push(`$ motor-matematico --evaluar --escenario ${activeTerminalTab}`);
    lines.push(`[ INICIANDO ANÁLISIS SIMPLIFICADO DE PROBABILIDAD ]`);
    lines.push(`------------------------------------------------------------`);
    lines.push(`Datos de tu evaluación:`);
    lines.push(`* Lote total a revisar (n): ${n} piezas`);
    lines.push(`* Probabilidad de que una pieza falle (p): ${(p * 100).toFixed(2)}%`);
    lines.push(`* Probabilidad de que funcione bien (1 - p): ${((1 - p) * 100).toFixed(2)}%`);
    lines.push(`* Máximo de fallos permitidos para aceptar el lote (k): ${k} piezas`);
    lines.push(`------------------------------------------------------------`);
    lines.push(`OBJETIVO: Descubrir la probabilidad de tener ${k} fallos o menos.`);
    lines.push(`¿Cómo lo calculamos? Sumamos la probabilidad de tener exactamente 0 fallos,`);
    lines.push(`más la de tener 1 fallo, y así sucesivamente hasta llegar a los ${k} fallos permitidos.`);
    lines.push(``);
    lines.push(`CÁLCULO PASO A PASO:`);

    steps.forEach((step) => {
      const pmfPercent = (step.pmf * 100).toFixed(4);
      const cdfPercent = (step.cumulativeSum * 100).toFixed(4);
      lines.push(`\n> Calculando el caso donde tenemos EXACTAMENTE ${step.i} piezas con fallo:`);
      lines.push(`  - Formas distintas en las que pueden aparecer ${step.i} piezas falladas entre las ${n}: ${step.comb}`);
      lines.push(`  - Probabilidad de que suceda este caso exacto: ${pmfPercent}%`);
      lines.push(`  - Probabilidad acumulada (suma de las probabilidades de 0 a ${step.i} fallos): ${cdfPercent}%`);
    });

    const confidencePct = (activeConf * 100).toFixed(4);
    const riskPct = ((1 - activeConf) * 100).toFixed(4);
    const isTermSafe = activeConf >= 0.95;

    lines.push(``);
    lines.push(`============================================================`);
    lines.push(`RESULTADO FINAL (ESCENARIO ${activeTerminalTab}):`);
    lines.push(`- Confianza de que el lote sea bueno (Probabilidad de aceptación): ${confidencePct}%`);
    lines.push(`- Riesgo (Probabilidad de que el lote tenga más de ${k} fallos): ${riskPct}%`);
    lines.push(`- CONCLUSIÓN: ${isTermSafe ? '✅ LOTE ACEPTABLE (Nivel de Seguridad >= 95%)' : '❌ LOTE EN ALERTA (Nivel de Seguridad < 95%)'}`);
    lines.push(`============================================================`);

    return lines;
  }, [activeTerminalTab, nA, pA, kA, nB, pB, kB, confidenceA, confidenceB]);

  // --- Funciones para restaurar configuraciones iniciales (Preset) ---
  const handleReset = () => {
    setNA(15);
    setPA(0.08);
    setKA(2);
    setNB(15);
    setPB(0.18);
    setKB(2);
    setSimScenario('A');
    setSimSample([]);
    setSimResult(null);
    setSimFailCount(0);
  };

  return (
    <div className="min-h-screen pb-16 px-4 md:px-8 max-w-7xl mx-auto flex flex-col justify-start">

      {/* ================= HEADER RESPONSIVO ================= */}
      <header className="flex flex-col md:flex-row items-center justify-between py-8 border-b border-slate-800/80 mb-8 gap-4">
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="relative p-3 bg-gradient-to-tr from-cyan-600 to-violet-600 rounded-2xl shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <Settings className="w-8 h-8 text-white animate-spin-slow" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 via-indigo-300 to-violet-400 bg-clip-text text-transparent">
              RiskChart
            </h1>
            <p className="text-sm text-slate-400 font-medium">
              Dashboard de Control de Calidad Predictivo · Distribución Binomial Acumulada
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="btn-reset-all"
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-800 text-slate-300 rounded-xl text-sm transition-all duration-200"
          >
            <RotateCcw className="w-4 h-4" />
            Reiniciar Valores
          </button>
          <div className="px-3 py-1 text-[11px] bg-slate-950 text-slate-500 border border-slate-900 font-mono rounded-lg">
            v1.2.0-stable
          </div>
        </div>
      </header>

      {/* ================= MARCO DE INTRODUCCIÓN TEÓRICA ================= */}
      <div className="glass-card mb-8 p-5 bg-gradient-to-r from-cyan-950/20 to-purple-950/20">
        <div className="flex gap-3 items-start">
          <Info className="w-5 h-5 text-cyan-400 mt-0.5 shrink-0" />
          <div>
            <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-1">Fundamentos Matemáticos Discretos</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              El análisis evalúa lotes de piezas mediante <strong>Ensayos de Bernoulli</strong> independientes.
              La probabilidad de que una pieza resulte fallida es constante (<code className="text-cyan-400">p</code>).
              La variable aleatoria discreta <code className="text-cyan-400">X</code> modela el número total de fallos en la muestra (<code className="text-cyan-400">n</code>).
              Para aceptar el lote, la confianza operativa (probabilidad de que haya a lo sumo <code className="text-cyan-400">k</code> fallos) debe ser mayor o igual al <strong>95%</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* ================= PANEL DE CONTROLES A/B (DOBLE ESCENARIO) ================= */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

        {/* ESCENARIO A (CIAN) */}
        <div className={`glass-card relative flex flex-col justify-between overflow-hidden transition-all duration-500 border-2 ${isSafeA
            ? 'border-emerald-500/20 hover:border-emerald-500/40 shadow-glow-green'
            : 'border-red-500/30 hover:border-red-500/50 shadow-glow-red animate-pulse-slow'
          }`}>
          {/* Banner de Estado Operativo */}
          <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-cyan-500/80 to-blue-500/80" />

          <div>
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-400 px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/20 rounded">
                    Escenario Comparativo A
                  </span>
                  <button
                    onClick={() => handleSaveCalculation('A')}
                    className="flex items-center gap-1 px-2 py-0.5 bg-slate-900/80 hover:bg-cyan-950/40 border border-slate-800 hover:border-cyan-500/30 text-slate-400 hover:text-cyan-400 rounded text-[10px] font-semibold transition-all duration-200"
                    title="Guardar este cálculo en el historial"
                  >
                    <Save className="w-3 h-3" />
                    Guardar
                  </button>
                </div>
                <h2 className="text-xl font-bold mt-2 text-slate-100">Simulación Base</h2>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 block uppercase font-bold">Confianza P(X≤k)</span>
                <span className={`text-2xl font-mono font-extrabold ${isSafeA ? 'text-emerald-400' : 'text-red-400'}`}>
                  {(confidenceA * 100).toFixed(2)}%
                </span>
              </div>
            </div>

            {/* Sliders Reactivos */}
            <div className="space-y-6">
              {/* Slider n */}
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    Tamaño de lote (<code className="text-cyan-400 font-bold">n_A</code>)
                  </span>
                  <span className="font-mono font-bold text-slate-200">{nA} unidades</span>
                </div>
                <input
                  id="slider-na"
                  type="range"
                  min="1"
                  max="50"
                  value={nA}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    setNA(val);
                    if (kA > val) setKA(val);
                  }}
                  className="slider-cyan"
                />
                <span className="text-[10px] text-slate-500 block mt-1">Total de ensayos de Bernoulli independientes.</span>
              </div>

              {/* Slider p */}
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    Probabilidad de fallo (<code className="text-cyan-400 font-bold">p_A</code>)
                  </span>
                  <span className="font-mono font-bold text-slate-200">{(pA * 100).toFixed(1)}% ({pA.toFixed(2)})</span>
                </div>
                <input
                  id="slider-pa"
                  type="range"
                  min="0"
                  max="100"
                  value={pA * 100}
                  onChange={(e) => setPA(parseFloat(e.target.value) / 100)}
                  className="slider-cyan"
                />
                <span className="text-[10px] text-slate-500 block mt-1">Tasa esperada de componentes defectuosos en el proceso.</span>
              </div>

              {/* Slider k */}
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    Tolerancia máxima (<code className="text-cyan-400 font-bold">k_A</code>)
                  </span>
                  <span className="font-mono font-bold text-slate-200">{kA} fallos</span>
                </div>
                <input
                  id="slider-ka"
                  type="range"
                  min="0"
                  max={nA}
                  value={kA}
                  onChange={(e) => setKA(parseInt(e.target.value, 10))}
                  className="slider-cyan"
                />
                <span className="text-[10px] text-slate-500 block mt-1">Lote aceptado si el número de fallos es menor o igual a k.</span>
              </div>
            </div>
          </div>

          {/* Tarjeta de Status Inferior */}
          <div className={`mt-8 p-4 rounded-xl border flex items-center gap-3 transition-all duration-300 ${isSafeA
              ? 'bg-emerald-950/20 border-emerald-500/20 text-emerald-400'
              : 'bg-red-950/20 border-red-500/20 text-red-400'
            }`}>
            {isSafeA ? (
              <>
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider">Aprobación Asegurada</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">El lote es altamente aceptable. Confianza Operativa &gt;= 95%.</p>
                </div>
              </>
            ) : (
              <>
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider">Riesgo Fuera de Control</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Riesgo crítico de liberar lote defectuoso (Confianza &lt; 95%).</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ESCENARIO B (PÚRPURA) */}
        <div className={`glass-card relative flex flex-col justify-between overflow-hidden transition-all duration-500 border-2 ${isSafeB
            ? 'border-emerald-500/20 hover:border-emerald-500/40 shadow-glow-green'
            : 'border-red-500/30 hover:border-red-500/50 shadow-glow-red animate-pulse-slow'
          }`}>
          {/* Banner de Estado Operativo */}
          <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-violet-500/80 to-purple-500/80" />

          <div>
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-violet-400 px-2 py-0.5 bg-violet-500/10 border border-violet-500/20 rounded">
                    Escenario Comparativo B
                  </span>
                  <button
                    onClick={() => handleSaveCalculation('B')}
                    className="flex items-center gap-1 px-2 py-0.5 bg-slate-900/80 hover:bg-violet-950/40 border border-slate-800 hover:border-violet-500/30 text-slate-400 hover:text-violet-400 rounded text-[10px] font-semibold transition-all duration-200"
                    title="Guardar este cálculo en el historial"
                  >
                    <Save className="w-3 h-3" />
                    Guardar
                  </button>
                </div>
                <h2 className="text-xl font-bold mt-2 text-slate-100">Simulación Alternativa</h2>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 block uppercase font-bold">Confianza P(X≤k)</span>
                <span className={`text-2xl font-mono font-extrabold ${isSafeB ? 'text-emerald-400' : 'text-red-400'}`}>
                  {(confidenceB * 100).toFixed(2)}%
                </span>
              </div>
            </div>

            {/* Sliders Reactivos */}
            <div className="space-y-6">
              {/* Slider n */}
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    Tamaño de lote (<code className="text-violet-400 font-bold">n_B</code>)
                  </span>
                  <span className="font-mono font-bold text-slate-200">{nB} unidades</span>
                </div>
                <input
                  id="slider-nb"
                  type="range"
                  min="1"
                  max="50"
                  value={nB}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    setNB(val);
                    if (kB > val) setKB(val);
                  }}
                  className="slider-purple"
                />
                <span className="text-[10px] text-slate-500 block mt-1">Total de ensayos de Bernoulli independientes.</span>
              </div>

              {/* Slider p */}
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    Probabilidad de fallo (<code className="text-violet-400 font-bold">p_B</code>)
                  </span>
                  <span className="font-mono font-bold text-slate-200">{(pB * 100).toFixed(1)}% ({pB.toFixed(2)})</span>
                </div>
                <input
                  id="slider-pb"
                  type="range"
                  min="0"
                  max="100"
                  value={pB * 100}
                  onChange={(e) => setPB(parseFloat(e.target.value) / 100)}
                  className="slider-purple"
                />
                <span className="text-[10px] text-slate-500 block mt-1">Tasa esperada de componentes defectuosos en el proceso.</span>
              </div>

              {/* Slider k */}
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    Tolerancia máxima (<code className="text-violet-400 font-bold">k_B</code>)
                  </span>
                  <span className="font-mono font-bold text-slate-200">{kB} fallos</span>
                </div>
                <input
                  id="slider-kb"
                  type="range"
                  min="0"
                  max={nB}
                  value={kB}
                  onChange={(e) => setKB(parseInt(e.target.value, 10))}
                  className="slider-purple"
                />
                <span className="text-[10px] text-slate-500 block mt-1">Lote aceptado si el número de fallos es menor o igual a k.</span>
              </div>
            </div>
          </div>

          {/* Tarjeta de Status Inferior */}
          <div className={`mt-8 p-4 rounded-xl border flex items-center gap-3 transition-all duration-300 ${isSafeB
              ? 'bg-emerald-950/20 border-emerald-500/20 text-emerald-400'
              : 'bg-red-950/20 border-red-500/20 text-red-400'
            }`}>
            {isSafeB ? (
              <>
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider">Aprobación Asegurada</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">El lote es altamente aceptable. Confianza Operativa &gt;= 95%.</p>
                </div>
              </>
            ) : (
              <>
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider">Riesgo Fuera de Control</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Riesgo crítico de liberar lote defectuoso (Confianza &lt; 95%).</p>
                </div>
              </>
            )}
          </div>
        </div>

      </section>

      {/* ================= SECCIÓN GRÁFICA CENTRAL ================= */}
      <section className="glass-card mb-8 relative">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-3">
          <div className="flex items-center gap-2.5">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="text-lg font-bold text-slate-100">Superposición de Masa de Probabilidad (PMF)</h2>
              <p className="text-xs text-slate-400">Comparativa directa de la distribución del número de defectos entre Escenarios A y B</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5 text-cyan-400">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-cyan-400" />
              <span>Escenario A (n={nA}, p={pA.toFixed(2)})</span>
            </div>
            <div className="flex items-center gap-1.5 text-violet-400">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-violet-400" />
              <span>Escenario B (n={nB}, p={pB.toFixed(2)})</span>
            </div>
          </div>
        </div>

        {/* Gráfico de Barras y Tolerancias */}
        <ComparisonChart
          nA={nA} pA={pA} kA={kA}
          nB={nB} pB={pB} kB={kB}
        />
      </section>

      {/* ================= SECCIÓN 3: MÓDULO DE SIMULACIÓN Y CONSOLA DE CÁLCULO ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* MÓDULO DE SIMULACIÓN DE MUESTREO DE PLANTA (MONTE CARLO) */}
        <div className="lg:col-span-5 glass-card flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Layers className="w-5 h-5 text-cyan-400" />
              <div>
                <h3 className="text-base font-bold text-slate-100">Muestreo en Tiempo Real</h3>
                <p className="text-xs text-slate-400">Simulación del control de calidad en planta física</p>
              </div>
            </div>

            {/* Selector de escenario para simular */}
            <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800/80 mb-6 text-xs font-semibold">
              <button
                id="btn-select-sim-a"
                onClick={() => { if (!simulating) setSimScenario('A'); }}
                disabled={simulating}
                className={`flex-1 py-1.5 text-center rounded-md transition-all ${simScenario === 'A'
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                    : 'text-slate-400 hover:text-slate-200 disabled:opacity-50'
                  }`}
              >
                Simular Escenario A
              </button>
              <button
                id="btn-select-sim-b"
                onClick={() => { if (!simulating) setSimScenario('B'); }}
                disabled={simulating}
                className={`flex-1 py-1.5 text-center rounded-md transition-all ${simScenario === 'B'
                    ? 'bg-violet-500/10 text-violet-400 border border-violet-500/20'
                    : 'text-slate-400 hover:text-slate-200 disabled:opacity-50'
                  }`}
              >
                Simular Escenario B
              </button>
            </div>

            {/* Panel de Muestreo de LEDs */}
            <div className="mb-6">
              <div className="flex justify-between text-xs text-slate-400 mb-2">
                <span>Lote Evaluado: {simScenario === 'A' ? nA : nB} unidades</span>
                <span>Procesado: {simSample.length} / {simScenario === 'A' ? nA : nB}</span>
              </div>

              <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-5 gap-2.5 p-4 bg-slate-950/60 rounded-xl border border-slate-850 min-h-[140px] max-h-[180px] overflow-y-auto">
                {Array.from({ length: simScenario === 'A' ? nA : nB }).map((_, idx) => {
                  const item = simSample[idx];
                  if (!item) {
                    return (
                      <div
                        key={idx}
                        className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800/80 flex items-center justify-center text-[10px] text-slate-600 font-mono"
                      >
                        {idx + 1}
                      </div>
                    );
                  }
                  return (
                    <div
                      key={idx}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold font-mono transition-all duration-300 ${item.isDefective
                          ? 'bg-red-500/10 border-2 border-red-500 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.25)] animate-pulse'
                          : 'bg-emerald-500/10 border border-emerald-500/50 text-emerald-400'
                        }`}
                    >
                      {idx + 1}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Métricas Simuladas en Tiempo Real */}
            <div className="bg-slate-950/40 border border-slate-850 p-4 rounded-xl mb-6 space-y-2.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Piezas Defectuosas (X_sim):</span>
                <span className={`font-bold ${simFailCount > (simScenario === 'A' ? kA : kB) ? 'text-red-400' : 'text-emerald-400'}`}>
                  {simFailCount} de {simScenario === 'A' ? nA : nB}
                </span>
              </div>
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Tolerancia Máxima (k):</span>
                <span className="text-slate-200 font-bold">{simScenario === 'A' ? kA : kB} fallos</span>
              </div>
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Resultado de Fábrica:</span>
                {simResult === 'ACCEPTED' && (
                  <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 rounded text-emerald-400 font-bold text-[10px] uppercase">
                    Aceptado
                  </span>
                )}
                {simResult === 'REJECTED' && (
                  <span className="px-2 py-0.5 bg-red-500/10 border border-red-500/30 rounded text-red-400 font-bold text-[10px] uppercase">
                    Rechazado
                  </span>
                )}
                {!simResult && (
                  <span className="text-slate-500 font-bold">
                    {simulating ? 'Analizando...' : 'Esperando Ensayo'}
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            id="btn-run-simulation"
            onClick={handleStartSimulation}
            disabled={simulating}
            className={`w-full py-3 flex items-center justify-center gap-2 rounded-xl text-sm font-semibold tracking-wide transition-all ${simulating
                ? 'bg-slate-900 border border-slate-800 text-slate-500 cursor-not-allowed'
                : simScenario === 'A'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                  : 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-[0_0_15px_rgba(139,92,246,0.2)]'
              }`}
          >
            <Play className={`w-4 h-4 ${simulating ? '' : 'fill-current'}`} />
            {simulating ? 'Evaluando Piezas...' : 'Iniciar Muestreo de Lote'}
          </button>
        </div>

        {/* TERMINAL DE DESGLOSE MATEMÁTICO */}
        <div className="lg:col-span-7 flex flex-col">
          {/* Header de la Terminal MacOS */}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-t border-r border-l border-slate-800 rounded-t-2xl">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-[#ff5f56] rounded-full inline-block" />
              <span className="w-3 h-3 bg-[#ffbd2e] rounded-full inline-block" />
              <span className="w-3 h-3 bg-[#27c93f] rounded-full inline-block" />
              <span className="text-xs text-slate-400 font-mono ml-2 flex items-center gap-1.5">
                <TerminalIcon className="w-3.5 h-3.5 text-slate-500" />
                math_engine.py
              </span>
            </div>

            {/* Tabs para seleccionar el desglose del Escenario */}
            <div className="flex gap-2">
              <button
                id="btn-terminal-tab-a"
                onClick={() => setActiveTerminalTab('A')}
                className={`px-3 py-1 font-mono text-[10px] font-bold rounded-lg border transition-all ${activeTerminalTab === 'A'
                    ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                    : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300'
                  }`}
              >
                Ver Cálculo A
              </button>
              <button
                id="btn-terminal-tab-b"
                onClick={() => setActiveTerminalTab('B')}
                className={`px-3 py-1 font-mono text-[10px] font-bold rounded-lg border transition-all ${activeTerminalTab === 'B'
                    ? 'bg-violet-500/10 border-violet-500/30 text-violet-400'
                    : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300'
                  }`}
              >
                Ver Cálculo B
              </button>
            </div>
          </div>

          {/* Cuerpo de la Terminal */}
          <div className="p-5 bg-slate-950 border border-slate-800 border-t-0 rounded-b-2xl flex-1 font-mono text-[12px] leading-relaxed text-slate-300 overflow-x-auto max-h-[460px] min-h-[400px] overflow-y-auto">
            {terminalLines.map((line, idx) => {
              // Estilizar selectores dinámicos en consola
              let styleClass = "text-slate-300";
              if (line.startsWith("$")) {
                styleClass = "text-cyan-400 font-semibold";
              } else if (line.startsWith("[INICIALIZANDO") || line.startsWith("OBJETIVO:") || line.startsWith("CÁLCULO DEL DESGLOSE")) {
                styleClass = "text-yellow-400 font-bold";
              } else if (line.includes("X ~ Binomial")) {
                styleClass = "text-sky-300 font-semibold";
              } else if (line.startsWith("==================") || line.startsWith("------------------")) {
                styleClass = "text-slate-700";
              } else if (line.startsWith("[i = ")) {
                styleClass = activeTerminalTab === 'A' ? "text-cyan-300 font-bold" : "text-violet-300 font-bold";
              } else if (line.includes("CDF Acumulada") || line.includes("P(X <=")) {
                styleClass = "text-emerald-400";
              } else if (line.includes("ESTADO OPERATIVO:")) {
                styleClass = line.includes("CUMPLIDO") ? "text-emerald-400 font-bold" : "text-red-400 font-bold animate-pulse";
              } else if (line.startsWith("RESUMEN PREDICTIVO")) {
                styleClass = "text-pink-400 font-bold";
              }

              return (
                <div key={idx} className={`${styleClass} whitespace-pre`}>
                  {line}
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* ================= SECCIÓN DE HISTORIAL Y MÉTRICAS ================= */}
      <section className="glass-card mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* LISTA DEL HISTORIAL */}
          <div className="lg:col-span-8 flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="flex items-center gap-2.5">
                  <History className="w-5 h-5 text-cyan-400" />
                  <div>
                    <h2 className="text-lg font-bold text-slate-100">Historial de Análisis y Ensayos</h2>
                    <p className="text-xs text-slate-400">Registro persistente de configuraciones guardadas y simulaciones en planta</p>
                  </div>
                </div>

                <button
                  onClick={handleClearHistory}
                  disabled={history.length === 0}
                  className="flex items-center gap-2 px-3 py-1.5 bg-red-950/20 border border-red-500/20 hover:border-red-500/50 text-red-400 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg text-xs font-semibold transition-all duration-200"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Limpiar Historial
                </button>
              </div>

              {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4 border border-dashed border-slate-800/60 rounded-xl bg-slate-950/20 text-slate-500 text-center">
                  <History className="w-10 h-10 mb-3 opacity-30" />
                  <p className="text-sm font-medium text-slate-400">No hay registros en el historial</p>
                  <p className="text-xs mt-1 text-slate-500">Guarda configuraciones usando el botón "Guardar" o inicia simulaciones en planta.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[380px] overflow-y-auto pr-2">
                  {history.map((item) => {
                    const isCalc = item.type === 'calculation';
                    const isA = item.scenario === 'A';

                    // Clases para badges
                    const statusBadge = isCalc ? (
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${(item.confidence || 0) >= 0.95
                          ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.15)]'
                          : 'bg-red-500/10 border border-red-500/20 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.15)]'
                        }`}>
                        {(item.confidence || 0) >= 0.95 ? 'Seguro' : 'Alerta'}
                      </span>
                    ) : (
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${item.result === 'ACCEPTED'
                          ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.15)]'
                          : 'bg-red-500/10 border border-red-500/20 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.15)]'
                        }`}>
                        {item.result === 'ACCEPTED' ? 'Aceptado' : 'Rechazado'}
                      </span>
                    );

                    return (
                      <div
                        key={item.id}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 bg-slate-950/60 border border-slate-900 hover:border-slate-800 rounded-xl transition-all duration-200 gap-4"
                      >
                        {/* Tipo de Registro e Info General */}
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                          <div className={`p-2 rounded-lg ${isCalc
                              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            }`} title={isCalc ? 'Cálculo Manual Guardado' : 'Simulación de Planta'}>
                            {isCalc ? <Save className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`text-[10px] uppercase font-extrabold px-1.5 py-0.2 rounded border ${isA
                                  ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'
                                  : 'bg-violet-500/10 border-violet-500/20 text-violet-400'
                                }`}>
                                Escenario {item.scenario}
                              </span>
                              <span className="text-[10px] text-slate-500 font-mono">{item.timestamp}</span>
                            </div>
                            <div className="text-xs font-mono text-slate-400 mt-1">
                              n={item.n} · p={(item.p * 100).toFixed(0)}% · k={item.k}
                            </div>
                          </div>
                        </div>

                        {/* Métrica / Resultados y Acciones */}
                        <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto border-t sm:border-t-0 pt-2.5 sm:pt-0 border-slate-900">
                          {/* Métrica */}
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <span className="text-[10px] text-slate-500 block uppercase font-bold">
                                {isCalc ? 'Confianza' : 'Resultado'}
                              </span>
                              <span className="text-xs font-mono text-slate-200 font-bold">
                                {isCalc
                                  ? `${((item.confidence || 0) * 100).toFixed(2)}%`
                                  : `Fallas: ${item.fails}`
                                }
                              </span>
                            </div>
                            {statusBadge}
                          </div>

                          {/* Acciones */}
                          <div className="flex items-center gap-1.5">
                            {isCalc && (
                              <button
                                onClick={() => handleLoadHistoryItem(item)}
                                className="p-1.5 bg-slate-900 hover:bg-cyan-950/40 border border-slate-800 hover:border-cyan-500/30 text-slate-400 hover:text-cyan-400 rounded-lg transition-all duration-150"
                                title="Cargar parámetros en sliders"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteHistoryItem(item.id)}
                              className="p-1.5 bg-slate-900 hover:bg-red-950/40 border border-slate-800 hover:border-red-500/30 text-slate-400 hover:text-red-400 rounded-lg transition-all duration-150"
                              title="Eliminar registro"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* ESTADÍSTICAS DEL HISTORIAL */}
          <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-slate-800/80 pt-6 lg:pt-0 lg:pl-8 flex flex-col justify-between gap-6">
            <div>
              <h3 className="text-base font-bold text-slate-100 mb-4">Métricas Consolidadas</h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
                {/* Total de Análisis */}
                <div className="p-4 bg-slate-950/60 border border-slate-900 rounded-xl">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Total Registros</span>
                  <span className="text-2xl font-mono font-extrabold text-cyan-400">{historyStats.total}</span>
                  <div className="text-[10px] text-slate-400 mt-1 font-medium">
                    {historyStats.calcsCount} cálculos / {historyStats.simsCount} simulaciones
                  </div>
                </div>

                {/* Confianza Promedio */}
                <div className="p-4 bg-slate-950/60 border border-slate-900 rounded-xl">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Confianza Promedio</span>
                  <span className="text-2xl font-mono font-extrabold text-emerald-400">{historyStats.avgConfidence}%</span>
                  <div className="text-[10px] text-slate-400 mt-1 font-medium">
                    De cálculos guardados manualmente
                  </div>
                </div>

                {/* Tasa de Aceptación */}
                <div className="p-4 bg-slate-950/60 border border-slate-900 rounded-xl">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Tasa Aceptación Lotes</span>
                  <span className="text-2xl font-mono font-extrabold text-violet-400">{historyStats.acceptanceRate}%</span>
                  <div className="text-[10px] text-slate-400 mt-1 font-medium">
                    En base a las simulaciones en planta
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-slate-900/40 border border-slate-850 rounded-xl">
              <p className="text-[11px] text-slate-400 leading-normal">
                💡 <strong>Información de almacenamiento:</strong> Los datos se guardan localmente en el almacenamiento del navegador (`localStorage`) y se conservarán hasta que limpies el historial o borres los datos del sitio.
              </p>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
