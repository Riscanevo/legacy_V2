// --- Variables Globales ---
var buffer = "0";
var memoria = 0;
var ultimo_operador;
var historial = [];

// --- Constantes (para eliminar Magic Numbers) ---
const MAX_HISTORY_ITEMS = 5;

// --- Estrategia para reemplazar condicionales (Replace Conditional with Strategy) ---
const OPERATIONS = {
  '+': (a, b) => a + b,
  '-': (a, b) => a - b,
  '*': (a, b) => a * b,
  '/': (a, b) => a / b
};

// --- Función para registrar historial (Extract Method) ---
function logHistory(logEntry) {
  historial.push(logEntry);
  if (historial.length > MAX_HISTORY_ITEMS) {
    historial.shift();
  }
  console.log(historial);
}

// --- Manejo de números ---
function handleNumber(numStr) {
  if (buffer === "0") { buffer = numStr; } 
  else { buffer += numStr; }
  updateScreen();
}

// --- Manejo de símbolos (operaciones y funciones científicas) ---
function handleSymbol(symbol) {
  switch (symbol) {
    case 'C':
      buffer = "0";
      memoria = 0;
      ultimo_operador = null;
      break;

    case '=':
      if (ultimo_operador === null) return;
      const intBuffer = parseInt(buffer);
      const memoriaPrevia = memoria;
      flushOperation(intBuffer);

      // Registro de historial (ahora separado)
      const logEntryEq = `${memoriaPrevia} ${ultimo_operador} ${intBuffer} = ${memoria}`;
      logHistory(logEntryEq);

      ultimo_operador = null;
      buffer = "" + memoria;
      memoria = 0;
      break;

    case '+': case '-': case '*': case '/':
      handleMath(symbol);
      break;

    case 'sin': case 'cos': case 'tan':
      if (buffer === "0") return;
      const val = parseFloat(buffer);
      const cientifico_result = {
        'sin': Math.sin(val),
        'cos': Math.cos(val),
        'tan': Math.tan(val)
      }[symbol];
      buffer = "" + cientifico_result;

      // Registro de historial unificado
      const logEntryCient = `${symbol}(${val}) = ${cientifico_result}`;
      logHistory(logEntryCient);
      break;
  }
  updateScreen();
}

// --- Manejo de operaciones aritméticas ---
function handleMath(symbol) {
  if (buffer === '0' && memoria === 0) return;
  const intBuffer = parseInt(buffer);

  if (memoria === 0) {
    memoria = intBuffer;
  } else {
    const memoriaPrevia = memoria;
    flushOperation(intBuffer);

    // Registro de historial (separado del cálculo)
    const logEntryMath = `${memoriaPrevia} ${ultimo_operador} ${intBuffer} = ${memoria}`;
    logHistory(logEntryMath);
  }
  ultimo_operador = symbol;
  buffer = "0";
}

// --- Nueva función: solo realiza el cálculo (antes hacía demasiado) ---
function flushOperation(intBuffer) {
  if (OPERATIONS[ultimo_operador]) {
    memoria = OPERATIONS[ultimo_operador](memoria, intBuffer);
  }
}

// --- Actualización de pantalla ---
function updateScreen() {
  document.getElementById("display").innerText = buffer;
}

// --- Inicialización ---
function init() {
  document.querySelector('.buttons').addEventListener('click', function(event) {
    buttonClick(event.target.innerText);
  });
}

function buttonClick(value) {
  if (isNaN(parseInt(value))) handleSymbol(value);
  else handleNumber(value);
}

init();
