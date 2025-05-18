const player = document.getElementById('player');
const item = document.getElementById('item');

let playerX = window.innerWidth / 2 - 40;
let itemX = Math.random() * (window.innerWidth - 30);
let itemY = 0;

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') {
    playerX -= 20;
  } else if (e.key === 'ArrowRight') {
    playerX += 20;
  }
  player.style.left = `${playerX}px`;
});

function dropItem() {
  itemY += 5;
  item.style.top = `${itemY}px`;
  item.style.left = `${itemX}px`;

  const playerRect = player.getBoundingClientRect();
  const itemRect = item.getBoundingClientRect();

  if (
    itemRect.bottom >= playerRect.top &&
    itemRect.left < playerRect.right &&
    itemRect.right > playerRect.left
  ) {
    alert('Uban Uballll......!');
    resetItem();
  }

  if (itemY > window.innerHeight) {
    resetItem();
  }

  requestAnimationFrame(dropItem);
}

function resetItem() {
  itemY = 0;
  itemX = Math.random() * (window.innerWidth - 30);
}

dropItem();
