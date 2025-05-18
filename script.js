const elements = {
  player: document.getElementById('player'),
  item: document.getElementById('item'),
  scoreDisplay: document.getElementById('score'),
  gameOverScreen: document.getElementById('gameOver'),
  leftBtn: document.getElementById('leftBtn'),
  rightBtn: document.getElementById('rightBtn'),
  startScreen: document.getElementById('startScreen'),
  startBtn: document.getElementById('startBtn'),
  restartBtn: document.getElementById('restartBtn'),
  finalScore: document.getElementById('finalScore')
};

const catchSound = document.getElementById('catchSound');
const gameOverSound = document.getElementById('gameOverSound');

const state = {
  playerX: window.innerWidth / 2,
  itemX: Math.random() * (window.innerWidth - 80),
  itemY: 0,
  score: 0,
  speed: 4,
  gameRunning: false,
  animationId: null,
  leftInterval: null,
  rightInterval: null,
  touchStartX: null
};

function initGame() {
  elements.player.style.left = `${state.playerX}px`;
  elements.item.style.left = `${state.itemX}px`;
  elements.item.style.top = `${state.itemY}px`;
  elements.scoreDisplay.textContent = `Score: 0`;
  elements.gameOverScreen.style.display = 'none';
  elements.startScreen.style.display = 'flex';
}

function movePlayer(direction) {
  if (!state.gameRunning) return;

  const moveAmount = 30;
  const playerWidth = elements.player.offsetWidth;

  if (direction === 'left') {
    state.playerX = Math.max(playerWidth / 2, state.playerX - moveAmount);
  } else {
    state.playerX = Math.min(window.innerWidth - playerWidth / 2, state.playerX + moveAmount);
  }

  elements.player.style.left = `${state.playerX}px`;
}

function setupEventListeners() {
  document.addEventListener('keydown', (e) => {
    if (!state.gameRunning) return;
    if (e.key === 'ArrowLeft') movePlayer('left');
    if (e.key === 'ArrowRight') movePlayer('right');
  });

  const setupButtonControl = (button, direction) => {
    const startEvent = 'ontouchstart' in window ? 'touchstart' : 'mousedown';
    const endEvent = 'ontouchstart' in window ? 'touchend' : 'mouseup';

    button.addEventListener(startEvent, (e) => {
      e.preventDefault();
      if (state[direction + 'Interval']) return;
      movePlayer(direction);
      state[direction + 'Interval'] = setInterval(() => movePlayer(direction), 100);
    });

    const clearIntervals = () => {
      clearInterval(state.leftInterval);
      clearInterval(state.rightInterval);
      state.leftInterval = null;
      state.rightInterval = null;
    };

    button.addEventListener(endEvent, clearIntervals);
    button.addEventListener('mouseleave', clearIntervals);
  };

  setupButtonControl(elements.leftBtn, 'left');
  setupButtonControl(elements.rightBtn, 'right');

  document.addEventListener('touchstart', (e) => {
    if (!state.gameRunning) return;
    if (e.touches.length === 1) {
      state.touchStartX = e.touches[0].clientX;
    }
  });

  document.addEventListener('touchmove', (e) => {
    if (!state.gameRunning || state.touchStartX === null) return;
    const deltaX = e.touches[0].clientX - state.touchStartX;
    if (Math.abs(deltaX) > 30) {
      movePlayer(deltaX > 0 ? 'right' : 'left');
      state.touchStartX = e.touches[0].clientX;
    }
  });

  document.addEventListener('touchend', () => {
    state.touchStartX = null;
  });

  elements.startBtn.addEventListener('click', startGame);
  elements.restartBtn.addEventListener('click', restartGame);

  window.addEventListener('resize', () => {
    const pw = elements.player.offsetWidth;
    state.playerX = Math.min(Math.max(state.playerX, pw / 2), window.innerWidth - pw / 2);
    elements.player.style.left = `${state.playerX}px`;

    state.itemX = Math.min(state.itemX, window.innerWidth - elements.item.offsetWidth);
    elements.item.style.left = `${state.itemX}px`;
  });
}

function gameLoop() {
  if (!state.gameRunning) return;

  state.itemY += state.speed;
  elements.item.style.top = `${state.itemY}px`;

  const playerRect = elements.player.getBoundingClientRect();
  const itemRect = elements.item.getBoundingClientRect();

  if (
    itemRect.bottom >= playerRect.top &&
    itemRect.left < playerRect.right &&
    itemRect.right > playerRect.left
  ) {
    handleCatch();
  }

  const gameAreaHeight = document.getElementById('gameScreen').offsetHeight;
  if (state.itemY > gameAreaHeight) {
    gameOver();
  } else {
    state.animationId = requestAnimationFrame(gameLoop);
  }
}

function handleCatch() {
  if (catchSound) catchSound.currentTime = 0, catchSound.play();
  state.score++;
  state.speed += 0.2;
  elements.scoreDisplay.textContent = `Score: ${state.score}`;
  resetItem();
}

function resetItem() {
  state.itemY = 0;
  state.itemX = Math.random() * (window.innerWidth - 80);
  elements.item.style.left = `${state.itemX}px`;
  elements.item.style.top = `${state.itemY}px`;
}

function gameOver() {
  state.gameRunning = false;
  cancelAnimationFrame(state.animationId);
  if (gameOverSound) gameOverSound.currentTime = 0, gameOverSound.play();
  elements.finalScore.textContent = state.score;
  elements.gameOverScreen.style.display = 'flex';
}

function restartGame() {
  state.score = 0;
  state.speed = 4;
  elements.scoreDisplay.textContent = 'Score: 0';
  elements.gameOverScreen.style.display = 'none';
  state.gameRunning = true;
  resetItem();
  gameLoop();
}

function startGame() {
  elements.startScreen.style.display = 'none';
  state.gameRunning = true;
  state.playerX = window.innerWidth / 2;
  elements.player.style.left = `${state.playerX}px`;
  resetItem();
  gameLoop();
}

initGame();
setupEventListeners();
