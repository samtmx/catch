const player = document.getElementById('player');
const item = document.getElementById('item');
const scoreDisplay = document.getElementById('score');
const gameOverScreen = document.getElementById('gameOver');
const leftBtn = document.getElementById('leftBtn');
const rightBtn = document.getElementById('rightBtn');
const startScreen = document.getElementById('startScreen');
const gameScreen = document.getElementById('gameScreen');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');

const catchSound = new Audio('catch.mp3');
const gameOverSound = new Audio('gameover.mp3');

let playerX = window.innerWidth / 2 - 40;
let itemX = Math.random() * (window.innerWidth - 30);
let itemY = 0;

let score = 0;
let speed = 4;
let gameRunning = false;

function movePlayerLeft() {
  if (!gameRunning) return;
  playerX = Math.max(0, playerX - 30);
  player.style.left = `${playerX}px`;
}

function movePlayerRight() {
  if (!gameRunning) return;
  playerX = Math.min(window.innerWidth - player.offsetWidth, playerX + 30);
  player.style.left = `${playerX}px`;
}

document.addEventListener('keydown', e => {
  if (!gameRunning) return;
  if (e.key === 'ArrowLeft') movePlayerLeft();
  if (e.key === 'ArrowRight') movePlayerRight();
});

let leftInterval, rightInterval;

leftBtn.addEventListener('touchstart', e => {
  e.preventDefault();
  movePlayerLeft();
  leftInterval = setInterval(movePlayerLeft, 150);
});
leftBtn.addEventListener('touchend', () => {
  clearInterval(leftInterval);
});
leftBtn.addEventListener('mousedown', e => {
  e.preventDefault();
  movePlayerLeft();
  leftInterval = setInterval(movePlayerLeft, 150);
});
leftBtn.addEventListener('mouseup', () => {
  clearInterval(leftInterval);
});

rightBtn.addEventListener('touchstart', e => {
  e.preventDefault();
  movePlayerRight();
  rightInterval = setInterval(movePlayerRight, 150);
});
rightBtn.addEventListener('touchend', () => {
  clearInterval(rightInterval);
});
rightBtn.addEventListener('mousedown', e => {
  e.preventDefault();
  movePlayerRight();
  rightInterval = setInterval(movePlayerRight, 150);
});
rightBtn.addEventListener('mouseup', () => {
  clearInterval(rightInterval);
});

// Swipe controls
let touchStartX = null;

window.addEventListener('touchstart', e => {
  if (!gameRunning) return;
  touchStartX = e.changedTouches[0].clientX;
});

window.addEventListener('touchmove', e => {
  if (!gameRunning || touchStartX === null) return;

  const touchCurrentX = e.changedTouches[0].clientX;
  const diffX = touchCurrentX - touchStartX;
  const swipeThreshold = 20;

  if (diffX > swipeThreshold) {
    movePlayerRight();
    touchStartX = touchCurrentX;
  } else if (diffX < -swipeThreshold) {
    movePlayerLeft();
    touchStartX = touchCurrentX;
  }
});

window.addEventListener('touchend', () => {
  touchStartX = null;
});

function dropItem() {
  if (!gameRunning) return;

  itemY += speed;
  item.style.top = `${itemY}px`;
  item.style.left = `${itemX}px`;

  const playerRect = player.getBoundingClientRect();
  const itemRect = item.getBoundingClientRect();

  if (
    itemRect.bottom >= playerRect.top &&
    itemRect.left < playerRect.right &&
    itemRect.right > playerRect.left
  ) {
    catchSound.play();
    score++;
    scoreDisplay.textContent = `Score: ${score}`;
    speed += 0.2;
    resetItem();
  }

  if (itemY > window.innerHeight) {
    gameOver();
    return;
  }

  requestAnimationFrame(dropItem);
}

function resetItem() {
  itemY = 0;
  itemX = Math.random() * (window.innerWidth - 30);
}

function gameOver() {
  gameRunning = false;
  gameOverSound.play();
  gameOverScreen.style.display = 'flex';
}

function restartGame() {
  score = 0;
  speed = 4;
  itemY = 0;
  playerX = window.innerWidth / 2 - 40;
  scoreDisplay.textContent = `Score: 0`;
  player.style.left = `${playerX}px`;
  gameOverScreen.style.display = 'none';
  gameRunning = true;
  dropItem();
}

// Start game handler
startBtn.addEventListener('click', () => {
  startScreen.style.display = 'none';
  gameScreen.classList.add('active');
  gameRunning = true;

  // Reset initial values
  score = 0;
  speed = 4;
  itemY = 0;
  playerX = window.innerWidth / 2 - 40;
  scoreDisplay.textContent = `Score: 0`;
  player.style.left = `${playerX}px`;
  gameOverScreen.style.display = 'none';

  dropItem();
});

restartBtn.addEventListener('click', restartGame);

// On window resize, reposition player within boundaries
window.addEventListener('resize', () => {
  playerX = Math.min(playerX, window.innerWidth - player.offsetWidth);
  player.style.left = `${playerX}px`;
});
