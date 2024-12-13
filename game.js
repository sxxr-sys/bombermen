const canvas = document.getElementById('game');
const context = canvas.getContext('2d');

const gridSize = 40;
const numRows = 16;
const numCols = 16;

const player = {
  x: 1,
  y: 1,
  size: gridSize,
  speed: gridSize,
  color: '#00BFFF', 
};

const bombImage = new Image();
const explosionImage = new Image();
const wallImage = new Image();
let gameOver = false;


bombImage.src = 'bomb.png'; 
explosionImage.src = 'explosion.png'; 
wallImage.src = 'wall.png'; 

const bombs = [];


const map = Array.from({ length: numRows }, () =>
  Array(numCols).fill(null)
);


for (let i = 0; i < numRows; i++) {
  for (let j = 0; j < numCols; j++) {
    if (i % 2 === 0 || j % 2 === 0) {
      map[i][j] = 'wall'; 
    }
  }
}


const movePlayer = (dx, dy) => {
  if (gameOver) return;

  const newX = player.x + dx;
  const newY = player.y + dy;

  
  if (newX >= 0 && newX < numCols && newY >= 0 && newY < numRows && map[newY][newX] !== 'wall') {
    player.x = newX;
    player.y = newY;
  }
};


const placeBomb = () => {
  if (gameOver) return;

  const bomb = {
    x: player.x,
    y: player.y,
    timer: 3000, 
    size: gridSize,
    image: bombImage,
  };
  bombs.push(bomb);
};


const explodeBombs = () => {
  for (let i = 0; i < bombs.length; i++) {
    bombs[i].timer -= 16;
    if (bombs[i].timer <= 0) {
      
      const { x, y } = bombs[i];
      map[y][x] = null; 
      bombs.splice(i, 1); 
      checkGameOver(x, y); 
    }
  }
};


const checkGameOver = (bombX, bombY) => {
  if (player.x === bombX && player.y === bombY) {
    gameOver = true;
    document.getElementById('game-over-screen').style.display = 'flex';
  }
};


const renderMap = () => {
  context.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      if (map[i][j] === 'wall') {
        context.drawImage(wallImage, j * gridSize, i * gridSize, gridSize, gridSize);
      }
    }
  }
};


const renderGameObjects = () => {
  
  context.fillStyle = player.color;
  context.fillRect(player.x * gridSize, player.y * gridSize, player.size, player.size);

  
  for (let bomb of bombs) {
    context.drawImage(bomb.image, bomb.x * gridSize, bomb.y * gridSize, bomb.size, bomb.size);
  }

  
  
  
};


const gameLoop = () => {
  if (gameOver) return;

  renderMap();
  renderGameObjects();
  explodeBombs();
  requestAnimationFrame(gameLoop);
};


document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp') movePlayer(0, -1);
  if (e.key === 'ArrowDown') movePlayer(0, 1);
  if (e.key === 'ArrowLeft') movePlayer(-1, 0);
  if (e.key === 'ArrowRight') movePlayer(1, 0);
  if (e.key === ' ' && !gameOver) placeBomb();
});


function startGame() {
  document.querySelector('.start-screen').style.display = 'none';
  gameLoop();
}


document.getElementById('restart-button').addEventListener('click', () => {
  gameOver = false;
  player.x = 1;
  player.y = 1;
  bombs.length = 0;
  map.forEach((row, i) => {
    row.forEach((col, j) => {
      if (i % 2 === 0 || j % 2 === 0) {
        map[i][j] = 'wall';
      } else {
        map[i][j] = null;
      }
    });
  });
  document.getElementById('game-over-screen').style.display = 'none';
  gameLoop();
});
