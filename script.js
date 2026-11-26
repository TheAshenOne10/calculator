const currentEl = document.getElementById("current");
const historyEl = document.getElementById("history");

let currentInput = "0";
let previousValue = null;
let operator = null;
let waitingForOperand = false;

function updateDisplay() {
  currentEl.textContent = currentInput;
  historyEl.textContent =
    previousValue !== null ? `${previousValue} ${symbol(operator) ?? ""}` : "";
}

function symbol(op) {
  return { "+": "+", "-": "−", "*": "×", "/": "÷" }[op];
}

function calculate(a, b, op) {
  switch (op) {
    case "+": return a + b;
    case "-": return a - b;
    case "*": return a * b;
    case "/": return b === 0 ? "Error" : a / b;
    default: return b;
  }
}

function inputNumber(num) {
  if (waitingForOperand) {
    currentInput = num;
    waitingForOperand = false;
  } else {
    currentInput = currentInput === "0" ? num : currentInput + num;
  }
  updateDisplay();
}

function inputDecimal() {
  if (waitingForOperand) {
    currentInput = "0.";
    waitingForOperand = false;
  } else if (!currentInput.includes(".")) {
    currentInput += ".";
  }
  updateDisplay();
}

function handleOperator(op) {
  const inputValue = parseFloat(currentInput);

  if (operator && waitingForOperand) {
    operator = op;
    updateDisplay();
    return;
  }

  if (previousValue === null) {
    previousValue = inputValue;
  } else if (operator) {
    const result = calculate(previousValue, inputValue, operator);
    if (result === "Error") {
      currentInput = "Error";
      previousValue = null;
      operator = null;
      waitingForOperand = true;
      updateDisplay();
      return;
    }
    previousValue = result;
    currentInput = String(result);
  }

  operator = op;
  waitingForOperand = true;
  updateDisplay();
}

function handleEquals() {
  if (operator === null || previousValue === null) return;
  const inputValue = parseFloat(currentInput);
  const result = calculate(previousValue, inputValue, operator);

  currentInput = String(result);
  previousValue = null;
  operator = null;
  waitingForOperand = true;
  updateDisplay();
}

function clearAll() {
  currentInput = "0";
  previousValue = null;
  operator = null;
  waitingForOperand = false;
  updateDisplay();
}

function deleteLast() {
  if (waitingForOperand) return;
  currentInput = currentInput.length > 1 ? currentInput.slice(0, -1) : "0";
  updateDisplay();
}

function percent() {
  currentInput = String(parseFloat(currentInput) / 100);
  updateDisplay();
}

document.querySelector(".buttons").addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  if (btn.dataset.num) inputNumber(btn.dataset.num);
  else if (btn.dataset.op) handleOperator(btn.dataset.op);
  else {
    switch (btn.dataset.action) {
      case "decimal": inputDecimal(); break;
      case "equals": handleEquals(); break;
      case "clear": clearAll(); break;
      case "delete": deleteLast(); break;
      case "percent": percent(); break;
    }
  }
});

// Keyboard support
document.addEventListener("keydown", (e) => {
  const key = e.key;
  if (/^[0-9]$/.test(key)) inputNumber(key);
  else if (key === ".") inputDecimal();
  else if (["+", "-", "*", "/"].includes(key)) handleOperator(key);
  else if (key === "Enter" || key === "=") handleEquals();
  else if (key === "Backspace") deleteLast();
  else if (key === "Escape") clearAll();
  else if (key === "%") percent();
});

updateDisplay();