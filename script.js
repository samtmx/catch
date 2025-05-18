const player = document.getElementById('player');
const item = document.getElementById('item');
const scoreDisplay = document.getElementById('score');
const gameOverScreen = document.getElementById('gameOver');
const leftBtn = document.getElementById('leftBtn');
const rightBtn = document.getElementById('rightBtn');
const startScreen = document.getElementById('startScreen');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');

const catchSound = new Audio('catch.mp3');  // Replace or remove if you want
const gameOverSound = new Audio('gameover.mp3');  // Replace or remove if you want

let playerX = (window.innerWidth / 2) - 40;
let itemX = Math.random() * (window.innerWidth - 40);  // 40 = item width
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

// Left button events (touch and mouse)
leftBtn.addEventListener('touchstart', e => {
  e.preventDefault();
  movePlayerLeft();
  leftInterval = setInterval(movePlayerLeft, 100);
});
leftBtn.addEventListener('touchend', () => clearInterval(leftInterval));
leftBtn.addEventListener('mousedown', e => {
  e.preventDefault();
  movePlayerLeft();
  leftInterval = setInterval(movePlayerLeft, 100);
});
leftBtn.addEventListener('mouseup', () => clearInterval(leftInterval));
leftBtn.addEventListener('mouseleave', () => clearInterval(leftInterval));

// Right button events (touch and mouse)
rightBtn.addEventListener('touchstart', e => {
  e.preventDefault();
  movePlayerRight();
  rightInterval = setInterval(movePlayerRight, 100);
});
rightBtn.addEventListener('touchend', () => clearInterval(rightInterval));
rightBtn.addEventListener('mousedown', e => {
  e.preventDefault();
  movePlayerRight();
  rightInterval = setInterval(movePlayerRight, 100);
});
rightBtn.addEventListener('mouseup', () => clearInterval(rightInterval));
rightBtn.addEventListener('mouseleave', () => clearInterval(rightInterval));

// Swipe controls for touch devices
let touchStartX = null;

document.addEventListener('touchstart', e => {
  if (!gameRunning) return;
  if (e.touches.length === 1) {
    touchStartX = e.touches[0].clientX;
  }
});

document.addEventListener('touchmove', e => {
  if (!gameRunning || touchStartX === null) return;
  const touchCurrentX = e.touches[0].clientX;
  const deltaX = touchCurrentX - touchStartX;

  if (Math.abs(deltaX) > 30) {
    if (deltaX > 0) {
      movePlayerRight();
    } else {
      movePlayerLeft();
    }
    touchStartX = touchCurrentX; // reset to current to allow continuous swipe
  }
});

document.addEventListener('touchend', () => {
  touchStartX = null;
});

// Drop the falling item
function dropItem() {
  if (!gameRunning) return;

  itemY += speed;
  item.style.top = `${itemY}px`;
  item.style.left = `${itemX}px`;

  const playerRect = player.getBoundingClientRect();
  const itemRect = item.getBoundingClientRect();

  // Check collision
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

  // If item falls past bottom, game over
  if (itemY > window.innerHeight * (2/3)) { // Only game area height
    gameOver();
  } else {
    requestAnimationFrame(dropItem);
  }
}

function resetItem() {
  itemY = 0;
  itemX = Math.random() * (window.innerWidth - item.offsetWidth);
  item.style.left = `${itemX}px`;
  item.style.top = `${itemY}px`;
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
  playerX = (window.innerWidth / 2) - player.offsetWidth / 2;
  scoreDisplay.textContent = 'Score: 0';
  player.style.left = `${playerX}px`;
  gameOverScreen.style.display = 'none';
  gameRunning = true;
  resetItem();
  dropItem();
}

function startGame() {
  startScreen.style.display = 'none';
  gameRunning = true;
  playerX = (window.innerWidth / 2) - player.offsetWidth / 2;
  player.style.left = `${playerX}px`;
  resetItem();
  dropItem();
}

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', restartGame);

// Resize handler to keep player and item inside viewport
window.addEventListener('resize', () => {
  playerX = Math.min(playerX, window.innerWidth - player.offsetWidth);
  player.style.left = `${playerX}px`;
  itemX = Math.min(itemX, window.innerWidth - item.offsetWidth);
  item.style.left = `${itemX}px`;
});
