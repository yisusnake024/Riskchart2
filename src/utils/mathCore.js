/**
 * Núcleo Matemático - RiskChart
 * 
 * Este archivo encapsula los conceptos de Matemáticas Discretas aplicados a la
 * simulación de control de calidad industrial. Modela un proceso de fabricación como 
 * una secuencia de Ensayos de Bernoulli, donde:
 *   - Éxito (en nuestro contexto, "Fallo" del producto): Probabilidad 'p'
 *   - Fracaso (producto correcto): Probabilidad '1 - p' (o 'q')
 *   - Variable Aleatoria Discreta 'X': Número de productos defectuosos en una muestra de tamaño 'n'.
 *   - Distribución Binomial: Probabilidad de obtener exactamente 'k' fallos en 'n' ensayos.
 */

/**
 * Calcula el factorial de un número.
 * Se implementa con fines pedagógicos y fallback, pero para combinatorias 
 * grandes (n > 20) se prefiere binomialCoefficient para evitar overflow.
 * 
 * @param {number} num - Entero no negativo.
 * @returns {number} Factorial del número.
 */
export function factorial(num) {
  if (num < 0) return 0;
  if (num === 0 || num === 1) return 1;
  let result = 1;
  for (let i = 2; i <= num; i++) {
    result *= i;
  }
  return result;
}

/**
 * Calcula el coeficiente binomial C(n, k) = n! / (k! * (n-k)!)
 * Utiliza la fórmula multiplicativa optimizada para prevenir desbordamiento de enteros (overflow)
 * y asegurar la máxima precisión en JavaScript para n hasta 50.
 * 
 * Fórmula: C(n, k) = Product_{i=1}^{k} ((n - k + i) / i)
 * 
 * @param {number} n - Tamaño del lote (total de ensayos).
 * @param {number} k - Número de fallos tolerados (éxitos).
 * @returns {number} Coeficiente combinatorio (número de formas de elegir k elementos de n).
 */
export function binomialCoefficient(n, k) {
  if (k < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;
  
  // Aprovecha la simetría: C(n, k) = C(n, n-k) para reducir iteraciones
  const actualK = Math.min(k, n - k);
  
  let result = 1;
  for (let i = 1; i <= actualK; i++) {
    result = (result * (n - actualK + i)) / i;
  }
  return Math.round(result);
}

/**
 * Función de Masa de Probabilidad (PMF - Probability Mass Function)
 * Calcula la probabilidad exacta de obtener exactamente 'k' fallos en un lote de tamaño 'n'.
 * 
 * Fórmula: P(X = k) = C(n, k) * p^k * (1 - p)^(n - k)
 * 
 * @param {number} n - Tamaño del lote.
 * @param {number} p - Probabilidad de fallo individual.
 * @param {number} k - Cantidad exacta de fallos defectuosos.
 * @returns {number} Probabilidad discreta en rango [0, 1].
 */
export function binomialPMF(n, p, k) {
  if (k < 0 || k > n) return 0;
  
  // Casos límite de la probabilidad p
  if (p === 0) return k === 0 ? 1 : 0;
  if (p === 1) return k === n ? 1 : 0;

  const comb = binomialCoefficient(n, k);
  const pPow = Math.pow(p, k);
  const qPow = Math.pow(1 - p, n - k);
  
  return comb * pPow * qPow;
}

/**
 * Función de Distribución Acumulada (CDF - Cumulative Distribution Function)
 * Representa el "Índice de Confianza Operativa". Calcula la probabilidad acumulada de tener
 * a lo sumo 'k' fallos (es decir, desde 0 hasta k fallos).
 * 
 * Fórmula: P(X <= k) = Sumatoria_{i=0}^{k} C(n, i) * p^i * (1 - p)^(n - i)
 * 
 * @param {number} n - Tamaño del lote.
 * @param {number} p - Probabilidad de fallo individual.
 * @param {number} k - Límite de tolerancia máxima de fallos.
 * @returns {number} Confianza operativa acumulada en rango [0, 1].
 */
export function binomialCDF(n, p, k) {
  if (k < 0) return 0;
  if (k >= n) return 1;

  let sum = 0;
  for (let i = 0; i <= k; i++) {
    sum += binomialPMF(n, p, i);
  }
  
  // Clampa el resultado para evitar imprecisiones de coma flotante de JS (ej. 1.0000000000000002)
  return Math.max(0, Math.min(1, sum));
}

/**
 * Genera el desglose dinámico paso a paso del cálculo acumulado de la CDF.
 * Útil para la terminal interactiva de aprendizaje.
 * 
 * @param {number} n - Tamaño del lote.
 * @param {number} p - Probabilidad de fallo.
 * @param {number} k - Tolerancia.
 * @returns {object} Pasos individuales y el resultado de la confianza acumulada final.
 */
export function getStepByStepCalculations(n, p, k) {
  const steps = [];
  let cumulativeSum = 0;
  
  for (let i = 0; i <= k; i++) {
    const comb = binomialCoefficient(n, i);
    const pPow = Math.pow(p, i);
    const qPow = Math.pow(1 - p, n - i);
    const pmf = comb * pPow * qPow;
    cumulativeSum += pmf;
    
    steps.push({
      i,
      comb,
      pPow,
      qPow,
      pmf,
      cumulativeSum: Math.max(0, Math.min(1, cumulativeSum))
    });
  }
  
  return {
    steps,
    finalConfidence: Math.max(0, Math.min(1, cumulativeSum))
  };
}
