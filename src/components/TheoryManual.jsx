import React from 'react';
import { BookOpen, Cpu, BarChart3, Database, Sigma, Terminal, Settings, Hash, Percent, Target, SlidersHorizontal, LineChart, PlaySquare, SaveAll, CheckSquare } from 'lucide-react';

const TheoryManual = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 md:p-8 font-sans selection:bg-cyan-500/30">
      
      {/* Header */}
      <header className="mb-12 border-b border-slate-800 pb-8">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="w-8 h-8 text-cyan-400" />
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-violet-400 to-amber-400 bg-clip-text text-transparent">
            Manual Teórico de Arquitectura
          </h1>
        </div>
        <p className="text-slate-400 text-lg max-w-3xl leading-relaxed">
          Comprende el núcleo matemático que rige RiskChart. Descubre cómo las Matemáticas Discretas, 
          los Ensayos de Bernoulli y la Distribución Binomial gobiernan la lógica de simulación, 
          el sistema de alertas y la persistencia de datos estructurados.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Panel Izquierdo: Especificaciones Rápidas (Glosario) */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
            <div className="flex items-center gap-2 mb-6">
              <Settings className="w-5 h-5 text-amber-400" />
              <h2 className="text-xl font-semibold text-slate-100">Parámetros Discretos</h2>
            </div>
            
            <div className="space-y-4">
              {/* Parámetro n */}
              <div className="group p-4 bg-slate-950 rounded-xl border border-slate-800/60 hover:border-cyan-500/50 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="bg-slate-900 p-2 rounded-lg group-hover:bg-cyan-500/10 transition-colors">
                    <Hash className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-lg font-bold text-cyan-400">n</span>
                      <span className="text-sm font-medium text-slate-300">Tamaño de Muestra</span>
                    </div>
                    <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                      Cantidad total de ensayos de Bernoulli independientes (piezas evaluadas en la cinta).
                    </p>
                  </div>
                </div>
              </div>

              {/* Parámetro p */}
              <div className="group p-4 bg-slate-950 rounded-xl border border-slate-800/60 hover:border-violet-500/50 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="bg-slate-900 p-2 rounded-lg group-hover:bg-violet-500/10 transition-colors">
                    <Percent className="w-5 h-5 text-violet-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-lg font-bold text-violet-400">p</span>
                      <span className="text-sm font-medium text-slate-300">Probabilidad de Éxito</span>
                    </div>
                    <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                      Probabilidad inherente de que un ensayo singular resulte en la condición buscada.
                    </p>
                  </div>
                </div>
              </div>

              {/* Parámetro k */}
              <div className="group p-4 bg-slate-950 rounded-xl border border-slate-800/60 hover:border-amber-500/50 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="bg-slate-900 p-2 rounded-lg group-hover:bg-amber-500/10 transition-colors">
                    <Target className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-lg font-bold text-amber-400">k</span>
                      <span className="text-sm font-medium text-slate-300">Variable Aleatoria</span>
                    </div>
                    <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                      Número de éxitos observados dentro de los <span className="font-mono text-cyan-400 text-xs">n</span> ensayos. Define nuestro vector de estado.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Panel Derecho: Contenido Teórico */}
        <main className="lg:col-span-2 space-y-8">
          
          {/* Pilar 1: Fundamentación de Variables Discretas */}
          <section className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-6 md:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-32 bg-cyan-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-cyan-500/10 p-2.5 rounded-xl border border-cyan-500/20">
                <BarChart3 className="w-6 h-6 text-cyan-400" />
              </div>
              <h2 className="text-2xl font-semibold text-slate-100">Fundamentación de Variables Discretas</h2>
            </div>
            
            <div className="prose prose-invert max-w-none text-slate-400 leading-relaxed space-y-4">
              <p>
                Cada elemento que transita por la cinta transportadora se modela matemáticamente como un 
                <strong className="text-slate-200 font-medium"> Ensayo de Bernoulli</strong> estricto. Esto implica un espacio muestral binario donde solo existen dos estados mutuamente excluyentes:
              </p>
              <div className="bg-slate-950 py-3 px-5 rounded-xl font-mono text-sm border border-slate-800 inline-block text-cyan-200">
                S = {'{'} Éxito, Fracaso {'}'}
              </div>
              <p>
                A través del conteo acumulativo de estos ensayos independientes, instanciamos la Variable Aleatoria Discreta <span className="font-mono text-amber-400">X</span>. 
                Dado que no puede haber fracciones de pieza, el rango de <span className="font-mono text-amber-400">X</span> pertenece estrictamente al conjunto de los números enteros 
                no negativos: <span className="font-mono text-slate-300">R_X = {'{'}0, 1, 2, ..., n{'}'}</span>. Este mapeo nos permite transicionar de la manufactura 
                física a un modelo probabilístico riguroso.
              </p>
            </div>
          </section>

          {/* Caja de Fórmulas */}
          <section className="bg-slate-950 rounded-2xl border border-slate-800 p-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="flex flex-col items-center justify-center space-y-6">
              <div className="flex items-center gap-2 text-slate-500 mb-2">
                <Sigma className="w-4 h-4" />
                <span className="text-sm font-semibold tracking-wider uppercase">Distribución Binomial Acumulada</span>
              </div>
              <div className="font-mono text-2xl md:text-4xl text-slate-100 tracking-tight flex items-center gap-4">
                <span className="text-amber-400">P(X ≤ k)</span> 
                <span className="text-slate-500">=</span> 
                <div className="flex items-center gap-2">
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-slate-400 mb-1">k</span>
                    <Sigma className="w-8 h-8 text-violet-400" />
                    <span className="text-xs text-slate-400 mt-1">i=0</span>
                  </div>
                  <span className="text-cyan-400">
                    <span className="text-slate-300">(</span>
                    <sup className="text-sm">n</sup>C<sub className="text-sm">i</sub>
                    <span className="text-slate-300">)</span>
                  </span>
                  <span>
                    <span className="text-violet-400">p</span><sup className="text-sm text-slate-400">i</sup>
                  </span>
                  <span>
                    <span className="text-slate-300">(</span>1-p<span className="text-slate-300">)</span><sup className="text-sm text-slate-400">n-i</sup>
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Pilar 2: Muestreo Estadístico Empírico */}
          <section className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-6 md:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-32 bg-violet-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-violet-500/10 p-2.5 rounded-xl border border-violet-500/20">
                <Cpu className="w-6 h-6 text-violet-400" />
              </div>
              <h2 className="text-2xl font-semibold text-slate-100">Muestreo Estadístico Empírico</h2>
            </div>
            
            <div className="prose prose-invert max-w-none text-slate-400 leading-relaxed space-y-4">
              <p>
                Para emular la estocasticidad del mundo real dentro del DOM de React, inyectamos entropía mediante el 
                generador pseudoaleatorio <code className="text-violet-300 bg-violet-500/10 px-1.5 py-0.5 rounded">Math.random()</code>. 
                Este método devuelve un valor flotante uniforme en el intervalo <span className="font-mono text-slate-300">[0, 1)</span>.
              </p>
              <p>
                En cada ciclo de reloj del simulador, este valor flotante es condicionado por nuestro parámetro de diseño <span className="font-mono text-violet-400">p</span>. 
                Si el valor generado es menor o igual a <span className="font-mono text-violet-400">p</span>, la función de transferencia clasifica la iteración como un Éxito, 
                triggeando la actualización de estado que ilumina los nodos SVG en verde neón. En el caso contrario, 
                registramos un Fracaso, iluminando la alerta en rojo y aplicando las funciones de penalidad en tiempo real.
              </p>
            </div>
          </section>

          {/* Pilar 3: Esquema de Datos Local (Terminal Mac) */}
          <section className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
                <Database className="w-6 h-6 text-amber-400" />
              </div>
              <h2 className="text-2xl font-semibold text-slate-100">Persistencia y Esquema JSON</h2>
            </div>
            
            <div className="prose prose-invert max-w-none text-slate-400 leading-relaxed mb-6">
              <p>
                Para garantizar latencia cero y operaciones I/O síncronas bloqueantes, el historial de simulaciones se serializa a 
                formato <strong className="text-slate-200 font-medium">JSON</strong> y se persiste directamente en la API de <code className="text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded">localStorage</code> del cliente. 
                Este enfoque arquitectónico elimina el overhead de red y previene la degradación del performance durante ráfagas de simulaciones masivas.
              </p>
            </div>

            {/* Terminal Mac Simulator */}
            <div className="rounded-xl overflow-hidden border border-slate-700 shadow-2xl bg-black">
              {/* Terminal Header */}
              <div className="bg-slate-800/80 px-4 py-3 flex items-center gap-2 border-b border-slate-700">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                    <Terminal className="w-3 h-3" />
                    <span>schema.json — zsh</span>
                  </div>
                </div>
              </div>
              {/* Terminal Body */}
              <div className="p-5 font-mono text-sm leading-loose overflow-x-auto">
                <div className="text-slate-300">
                  <span className="text-pink-400">const</span> <span className="text-blue-400">schemaDefinition</span> = {'{'}
                  <div className="pl-6">
                    <span className="text-cyan-300">"id"</span>: <span className="text-green-400">"uuid-v4"</span>,
                    <br/>
                    <span className="text-cyan-300">"timestamp"</span>: <span className="text-green-400">"{new Date().toISOString()}"</span>,
                    <br/>
                    <span className="text-cyan-300">"parameters"</span>: {'{'}
                    <div className="pl-6">
                      <span className="text-cyan-300">"n"</span>: <span className="text-amber-300">100</span>, <span className="text-slate-500 italic">// Integer size</span>
                      <br/>
                      <span className="text-cyan-300">"p"</span>: <span className="text-amber-300">0.85</span> <span className="text-slate-500 italic">// Float probability</span>
                    </div>
                    {'},'}
                    <br/>
                    <span className="text-cyan-300">"metrics"</span>: {'{'}
                    <div className="pl-6">
                      <span className="text-cyan-300">"successCount"</span>: <span className="text-amber-300">82</span>,
                      <br/>
                      <span className="text-cyan-300">"binomialProbability"</span>: <span className="text-amber-300">0.1245</span>
                    </div>
                    {'}'}
                  </div>
                  {'}'};
                </div>
                <div className="mt-4 flex items-center gap-2 text-green-400">
                  <span>➜</span>
                  <span className="text-cyan-400">~</span>
                  <span className="text-slate-300">localStorage.setItem(</span>
                  <span className="text-amber-300">'riskchart_logs'</span>
                  <span className="text-slate-300">, JSON.stringify(data))</span>
                  <span className="animate-pulse w-2 h-4 bg-slate-300 inline-block align-middle ml-1"></span>
                </div>
              </div>
            </div>
          </section>

        </main>
      </div>

      {/* ================= SECCIÓN: INTERPRETACIÓN DE MÉTRICAS ================= */}
      <section className="mt-12 bg-slate-900/40 border border-slate-800 rounded-2xl p-6 md:p-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 p-32 bg-amber-500/5 rounded-full blur-3xl -ml-16 -mt-16 pointer-events-none"></div>
        
        <div className="flex items-center gap-3 mb-10 relative z-10">
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 shadow-inner">
            <BarChart3 className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-100 tracking-tight">Interpretación de Métricas y Resultados</h2>
            <p className="text-slate-400 mt-1 text-sm">Desglose a detalle de lo que significa cada indicador técnico en el Dashboard.</p>
          </div>
        </div>

        <div className="space-y-6 relative z-10">
          
          {/* Card 1: Confianza Operativa */}
          <div className="flex flex-col md:flex-row gap-6 bg-slate-950/80 p-6 rounded-xl border border-slate-800 hover:border-emerald-500/30 transition-colors">
            <div className="md:w-1/3 border-b md:border-b-0 md:border-r border-slate-800 pb-4 md:pb-0 md:pr-6 flex flex-col justify-center">
              <h3 className="text-lg font-bold text-slate-200 mb-2">Confianza Operativa P(X≤k)</h3>
              <div className="text-3xl font-mono font-extrabold text-emerald-400">≥ 95%</div>
              <span className="text-xs text-slate-500 mt-2 uppercase tracking-wider font-semibold">Umbral de Seguridad</span>
            </div>
            <div className="md:w-2/3 text-slate-400 text-sm leading-relaxed space-y-3">
              <p>
                Representa la <strong className="text-slate-200">probabilidad acumulada</strong> de que el número de piezas defectuosas en el lote sea menor o igual a tu tolerancia máxima (<code className="text-cyan-400">k</code>). 
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                <li><strong className="text-emerald-400">Aprobación Asegurada:</strong> Si el porcentaje es 95% o superior, el modelo asume que el riesgo de liberar piezas defectuosas está estadísticamente controlado bajo normas de calidad.</li>
                <li><strong className="text-red-400">Riesgo Fuera de Control:</strong> Si cae por debajo del 95%, la alerta roja parpadeante te indica que matemáticamente, es muy probable que se rechace el lote real en planta.</li>
              </ul>
            </div>
          </div>

          {/* Card 2: Gráfica PMF */}
          <div className="flex flex-col md:flex-row gap-6 bg-slate-950/80 p-6 rounded-xl border border-slate-800 hover:border-cyan-500/30 transition-colors">
            <div className="md:w-1/3 border-b md:border-b-0 md:border-r border-slate-800 pb-4 md:pb-0 md:pr-6 flex flex-col justify-center">
              <h3 className="text-lg font-bold text-slate-200 mb-2">Gráfica PMF (Barras)</h3>
              <div className="flex items-baseline gap-1 mt-2 h-12">
                <div className="w-3 h-full bg-cyan-500/40 rounded-t-sm border-t-2 border-cyan-400"></div>
                <div className="w-3 h-4/5 bg-violet-500/40 rounded-t-sm border-t-2 border-violet-400"></div>
                <div className="w-3 h-2/5 bg-cyan-500/40 rounded-t-sm border-t-2 border-cyan-400"></div>
              </div>
              <span className="text-xs text-slate-500 mt-2 uppercase tracking-wider font-semibold">Masa de Probabilidad</span>
            </div>
            <div className="md:w-2/3 text-slate-400 text-sm leading-relaxed space-y-3">
              <p>
                La <strong className="text-slate-200">Función de Masa de Probabilidad (PMF)</strong> desglosa el cálculo global. Cada barra individual representa la probabilidad exacta de tener <strong className="text-slate-200">precisamente</strong> ese número de defectos en el eje X.
              </p>
              <p>
                Al visualizar ambos escenarios simultáneamente, puedes observar el sesgo estadístico: el escenario cuya gráfica se concentra más hacia la izquierda representa una manufactura más limpia y segura (menos probabilidad de defectos).
              </p>
            </div>
          </div>

          {/* Card 3: Terminal de Logs */}
          <div className="flex flex-col md:flex-row gap-6 bg-slate-950/80 p-6 rounded-xl border border-slate-800 hover:border-violet-500/30 transition-colors">
            <div className="md:w-1/3 border-b md:border-b-0 md:border-r border-slate-800 pb-4 md:pb-0 md:pr-6 flex flex-col justify-center">
              <h3 className="text-lg font-bold text-slate-200 mb-2">Terminal de Desglose</h3>
              <div className="font-mono text-xs text-violet-400 bg-violet-950/30 p-3 rounded border border-violet-900/50 mt-2">
                &gt; Caso exacto i=2: 14.5%<br/>
                &gt; Acumulada CDF: 88.2%
              </div>
            </div>
            <div className="md:w-2/3 text-slate-400 text-sm leading-relaxed space-y-3">
              <p>
                La consola oscura no es solo decorativa; expone al desnudo el <strong className="text-slate-200">Motor Matemático Subyacente</strong> operando paso a paso.
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                <li><strong className="text-violet-300">Caso Exacto:</strong> Ejecuta internamente la combinación binomial <code className="text-slate-400 font-mono text-[10px]">nCr * p^r * (1-p)^(n-r)</code> iterando por cada escenario.</li>
                <li><strong className="text-violet-300">Acumulada:</strong> Es la sumatoria de las probabilidades exactas desde 0 hasta el valor de <code className="text-cyan-400">k</code>. Es esta sumatoria la que dicta el porcentaje final de confianza del panel de control principal.</li>
              </ul>
            </div>
          </div>

        </div>
      </section>

      {/* ================= SECCIÓN DE GUÍA DE OPERACIÓN ================= */}
      <section className="mt-12 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 md:p-10 relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-violet-500/5 pointer-events-none"></div>
        
        <div className="flex items-center gap-3 mb-10 relative z-10">
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 shadow-inner">
            <CheckSquare className="w-6 h-6 text-slate-200" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-100 tracking-tight">Guía Rápida de Operación</h2>
            <p className="text-slate-400 mt-1 text-sm">Aprende a utilizar el dashboard de RiskChart en 4 pasos sencillos.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          
          {/* Paso 1 */}
          <div className="bg-slate-950 p-6 rounded-xl border border-slate-800/80 hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] transition-all duration-300 group">
            <div className="bg-cyan-500/10 w-12 h-12 flex items-center justify-center rounded-full mb-5 group-hover:scale-110 transition-transform duration-300 border border-cyan-500/20">
              <SlidersHorizontal className="w-5 h-5 text-cyan-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-200 mb-3 flex items-center gap-2">
              <span className="text-cyan-400 font-mono text-sm bg-cyan-950 px-2 py-0.5 rounded">01</span>
              Configurar
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Usa los sliders principales para definir el tamaño de muestra (<code className="text-cyan-400">n</code>), probabilidad histórica de fallo (<code className="text-cyan-400">p</code>) y la tolerancia máxima (<code className="text-cyan-400">k</code>) para los Escenarios A y B.
            </p>
          </div>

          {/* Paso 2 */}
          <div className="bg-slate-950 p-6 rounded-xl border border-slate-800/80 hover:border-violet-500/50 hover:shadow-[0_0_20px_rgba(139,92,246,0.15)] transition-all duration-300 group">
            <div className="bg-violet-500/10 w-12 h-12 flex items-center justify-center rounded-full mb-5 group-hover:scale-110 transition-transform duration-300 border border-violet-500/20">
              <LineChart className="w-5 h-5 text-violet-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-200 mb-3 flex items-center gap-2">
              <span className="text-violet-400 font-mono text-sm bg-violet-950 px-2 py-0.5 rounded">02</span>
              Analizar PMF
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Observa la superposición de la gráfica de barras central para entender visualmente la distribución de probabilidad y determinar qué configuración ofrece un nivel de seguridad aceptable.
            </p>
          </div>

          {/* Paso 3 */}
          <div className="bg-slate-950 p-6 rounded-xl border border-slate-800/80 hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] transition-all duration-300 group">
            <div className="bg-emerald-500/10 w-12 h-12 flex items-center justify-center rounded-full mb-5 group-hover:scale-110 transition-transform duration-300 border border-emerald-500/20">
              <PlaySquare className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-200 mb-3 flex items-center gap-2">
              <span className="text-emerald-400 font-mono text-sm bg-emerald-950 px-2 py-0.5 rounded">03</span>
              Muestreo Real
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Selecciona uno de los escenarios y ejecuta la simulación en tiempo real. Esto correrá un proceso iterativo de Monte Carlo emulando la evaluación del lote pieza por pieza en la cinta.
            </p>
          </div>

          {/* Paso 4 */}
          <div className="bg-slate-950 p-6 rounded-xl border border-slate-800/80 hover:border-amber-500/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)] transition-all duration-300 group">
            <div className="bg-amber-500/10 w-12 h-12 flex items-center justify-center rounded-full mb-5 group-hover:scale-110 transition-transform duration-300 border border-amber-500/20">
              <SaveAll className="w-5 h-5 text-amber-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-200 mb-3 flex items-center gap-2">
              <span className="text-amber-400 font-mono text-sm bg-amber-950 px-2 py-0.5 rounded">04</span>
              Auditar Logs
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Usa el botón "Guardar" para almacenar la evaluación en el historial y revisa la "Terminal" para leer el log de cálculos del motor matemático desglosado paso a paso.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
};

export default TheoryManual;
