/** @jest-environment jsdom */
const fs = require('fs');
const path = require('path');

// Load HTML into jsdom before requiring module
const html = fs.readFileSync(path.resolve(__dirname, '..', 'index.html'), 'utf8');
document.body.innerHTML = html;

const game = require('../script.js');

describe('Game logic (evaluateGuess / newSecret)', () => {
  test('newSecret returns a number between 1 and 10', () => {
    const s = game.newSecret();
    expect(s).toBeGreaterThanOrEqual(1);
    expect(s).toBeLessThanOrEqual(10);
  });

  test('evaluateGuess identifies low/high/correct/invalid', () => {
    const secret = 5;
    expect(game.evaluateGuess(2, secret)).toBe('low');
    expect(game.evaluateGuess(9, secret)).toBe('high');
    expect(game.evaluateGuess(5, secret)).toBe('correct');
    expect(game.evaluateGuess('foo', secret)).toBe('invalid');
  });
});

describe('DOM integration', () => {
  beforeEach(() => {
    // reset DOM elements
    document.body.innerHTML = html;
    game.init();
    // set a deterministic secret
    game.setSecret(7);
    // ensure inputs are accessible
    const input = document.getElementById('guess-input');
    input.value = '';
    const attemptsEl = document.getElementById('attempts');
    attemptsEl.textContent = '';
  });

  test('handleGuess updates message and attempts for low guess', () => {
    const input = document.getElementById('guess-input');
    input.value = '3';
    const res = game.handleGuess();
    expect(res).toBe('low');
    expect(document.getElementById('message').textContent).toMatch(/Too low/i);
    expect(document.getElementById('attempts').textContent).toMatch(/Attempts:/i);
  });

  test('handleGuess disables input when correct', () => {
    const input = document.getElementById('guess-input');
    input.value = '7';
    const res = game.handleGuess();
    expect(res).toBe('correct');
    expect(input.disabled).toBe(true);
    expect(document.getElementById('message').textContent).toMatch(/You win/i);
  });
});
