// Number Guessing Game (1-10)
// Refactored for testability and accessibility
let secret = null;
let attempts = 0;

// Pure logic (easy to test)
function evaluateGuess(guess, currentSecret) {
  const val = Number(guess);
  if (!Number.isFinite(val) || val < 1 || val > 10) return 'invalid';
  if (val === currentSecret) return 'correct';
  return val > currentSecret ? 'high' : 'low';
}

function newSecret() {
  secret = Math.floor(Math.random() * 10) + 1;
  attempts = 0;
  return secret;
}

function setSecret(n) {
  secret = n;
}

function getSecret() {
  return secret;
}

function getAttempts() {
  return attempts;
}

// DOM helpers (only run when page is loaded)
let inputEl, guessBtn, messageEl, attemptsEl, resetBtn;

function showMessage(text, cls) {
  if (!messageEl) return;
  messageEl.textContent = text;
  messageEl.className = cls || '';
  // animation classes
  if (cls === 'hint') {
    messageEl.classList.remove('success', 'shake');
    // trigger shake animation
    messageEl.classList.add('shake');
    // remove class after animation frame
    setTimeout(() => messageEl.classList.remove('shake'), 600);
  } else if (cls === 'success') {
    messageEl.classList.remove('shake');
    messageEl.classList.add('success');
  }
}

function handleGuess() {
  if (!inputEl) return;
  const val = inputEl.value;
  const result = evaluateGuess(val, secret);

  if (result === 'invalid') {
    showMessage('Please enter a number between 1 and 10.', 'warning');
    return result;
  }

  attempts += 1;
  if (attemptsEl) attemptsEl.textContent = `Attempts: ${attempts}`;

  if (result === 'correct') {
    showMessage('You win! 🎉', 'success');
    inputEl.disabled = true;
    if (guessBtn) guessBtn.disabled = true;
    if (resetBtn) resetBtn.classList.remove('hidden');
  } else if (result === 'high') {
    showMessage('Too high! Try again.', 'hint');
  } else {
    showMessage('Too low! Try again.', 'hint');
  }

  return result;
}

function init() {
  inputEl = document.getElementById('guess-input');
  guessBtn = document.getElementById('guess-btn');
  messageEl = document.getElementById('message');
  attemptsEl = document.getElementById('attempts');
  resetBtn = document.getElementById('reset-btn');

  if (guessBtn) guessBtn.addEventListener('click', handleGuess);
  if (inputEl) inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleGuess();
  });
  if (resetBtn) resetBtn.addEventListener('click', () => {
    newSecret();
    if (attemptsEl) attemptsEl.textContent = '';
    if (messageEl) messageEl.textContent = '';
    if (inputEl) { inputEl.value = ''; inputEl.disabled = false; }
    if (guessBtn) guessBtn.disabled = false;
    if (resetBtn) resetBtn.classList.add('hidden');
  });

  newSecret();
  // keep secret in console for debug (remove in production)
  console.log('Secret (debug):', secret);
}

// Auto-init when run in the browser
if (typeof window !== 'undefined' && window.addEventListener) {
  window.addEventListener('DOMContentLoaded', init);
}

// Exports for tests
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    evaluateGuess,
    newSecret,
    setSecret,
    getSecret,
    getAttempts,
    handleGuess,
    init,
  };
}
