const board = document.querySelector(".board");
let col = 40;
let row = 50;
const totalCases = col * row; // 50 colonnes * 40 lignes
const length = 10;
let direction = "left";
const divs = [];
const snake = new Array(length).fill().map((x, i) => i);
snake.reverse();
const dialog = document.getElementById("confirmDialog");
let isGameOver;
let bait;
let head = snake[0];
let interval;

for (let i = 1; i <= totalCases; i++) {
  const div = document.createElement("div");
  // On peut mettre i pour voir les numéros,
  // ou laisser vide pour un tableau propre
  board.appendChild(div);
  divs.push(div);
}
function sound(fileName) {
  const audio = document.createElement("audio");
  audio.volume = 0.1;
  audio.src = fileName;
  audio.play();
}

function drawsnake() {
  divs.forEach((div) =>
    div.classList.remove(
      "snake",
      "head",
      "up",
      "right",
      "down",
      "left",
      "topLeftRadius",
      "topRightRadius",
      "bottomRightRadius",
      "bottomLeftRadius",
    ),
  );

  snake.forEach((num, i) => {
    divs[num].classList.add("snake");

    const prev = snake[i + 1];
    const next = snake[i - 1];

    if (prev && next) {
      if (
        (next == num - 1 && prev == num + col) ||
        (next == num + col && prev == num - 1)
      ) {
        divs[num].classList.add("topLeftRadius");
      } else if (
        (next == num + col && prev == num + 1) ||
        (prev == num + col && next == num + 1)
      ) {
        divs[num].classList.add("topRightRadius");
      } else if (
        (next == num + 1 && prev == num - col) ||
        (prev == num + 1 && next == num - col)
      ) {
        divs[num].classList.add("bottomRightRadius");
      } else if (
        (next == num - 1 && prev == num - col) ||
        (prev == num - 1 && next == num - col)
      ) {
        divs[num].classList.add("bottomLeftRadius");
      }
    }
  });

  const head = snake[0];
  divs[head].classList.add("head", direction);
  showscore();
}
drawsnake();

function setBait() {
  // l appat ne doit pas etre sur le serpent
  divs[bait]?.classList.remove("bait");
  do {
    bait = Math.floor(Math.random() * totalCases);
  } while (snake.includes(bait));
  divs[bait].classList.add("bait");
}
setBait();

function move(dir) {
  if (isGameOver) {
    return;
  }
  let head = snake[0];
  if (dir == "left") {
    if (direction == "right") {
      return;
    }

    head++;
    if (head % col == 0) {
      gameOver();
      return;
    }
  } else if (dir == "right") {
    if (direction == "left") {
      return;
    }
    head--;

    if ((head + 1) % col == 0) {
      gameOver();
      return;
    }
  } else if (dir == "up") {
    if (direction == "down") {
      return;
    }
    head -= col;
    if (head < 0) {
      gameOver();
      return;
    }
  } else if (dir == "down") {
    if (direction == "up") {
      return;
    }
    head += col;
    if (head > totalCases) {
      gameOver();
      return;
    }
  }

  if (snake.includes(head)) {
    gameOver();
    return;
  }

  direction = dir;
  snake.unshift(head);

  if (head == bait) {
    sound("sound.mp3");
    setBait();
  } else {
    snake.pop();
  }

  drawsnake();
  clearInterval(interval);
  interval = setInterval(() => move(direction), 180);
}
window.addEventListener("keydown", (ev) => {
  ev.preventDefault();

  switch (ev.key) {
    case "ArrowUp":
      move("up");
      break;
    case "ArrowRight":
      move("right");
      break;
    case "ArrowDown":
      move("down");
      break;
    case "ArrowLeft":
      move("left");
      break;
    case "Escape":
      clearInterval(interval);
      break;
  }
});

function gameOver() {
  isGameOver = true;
  clearInterval(interval);
  console.log(interval);
  dialog.showModal();
  sound("gameover.mp3");
}
function turnHead() {
  snake.reverse();
  isGameOver = false;
  drawsnake();
  closeModal();
}
function closeModal() {
  dialog.close();
}
function showscore() {
  document.querySelector(".score").innerHTML =
    `Score:${(snake.length - length) * 10}`;
}
function newGame() {
  console.log(location);
  location.reload();
}
