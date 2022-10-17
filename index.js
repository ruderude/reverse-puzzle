// 連打で画面が拡大縮小するのを防止
document.addEventListener("dblclick", function(e){ e.preventDefault();}, { passive: false });

const board = [];
let count = 0;
const counter = document.getElementById('counter');
const container = document.getElementById('container');
const cleared = document.getElementById('cleared');
const resetBtnArea = document.getElementById('reset_btn_area');
const resetBtn = document.getElementById('reset_btn');
const twitterArea = document.getElementById('twitter_area');
const twitterShare = document.getElementById('twitter_share');
let isAnimation = false;
let isGameOver = false;

const randRange = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

const init = () => {
  container.innerHTML = '';
  count = 0;
  isGameOver = false;
  cleared.classList.add('hidden');
  resetBtnArea.classList.add('hidden');
  twitterArea.classList.add('hidden');
  counter.innerText = count;
  for (let y = 0; y < 3; y++) {
    board[y] = [];
    for (let x = 0; x < 3; x++) {
      const panel = document.createElement('div');
      panel.style.position = 'absolute';
      panel.style.left = `${x * 100 + 2}px`;
      panel.style.top = `${y * 100+ 2}px`;
      panel.style.width = `96px`;
      panel.style.height = `96px`;
      panel.classList.add('devil');
      panel.style.borderRadius = `10px`;
      panel.style.transition = `all 150ms linear`;
      container.appendChild(panel);
      board[y][x] = { panel, state: 0 };
      panel.onpointerdown = (e) => {
        e.preventDefault();
        onDown(x, y);
      }
    }
  }

  const yNum = randRange(0, 2);
  const xNum = randRange(0, 2);

  board[yNum][xNum].panel.classList.remove('devil');
  board[yNum][xNum].panel.classList.add('angel');
  board[yNum][xNum].state = 1;
}

const flip = async(x, y) => {
  if (x < 0 || y < 0 || x >= 3 || y >= 3) {
    return;
  }
  isAnimation = true;
  const panel = board[y][x].panel;
  let stImage;
  let state = board[y][x].state;
  state = 1 - state;
  board[y][x].state = state;

  panel.style.transform = "perspective(150px) rotateY(90deg)";
  await new Promise(r => setTimeout(r, 150));
  panel.classList.remove(...panel.classList);
  stImage = (state) ? "angel" : "devil";
  panel.classList.add(stImage);
  panel.style.transform = "perspective(150px) rotateY(-90deg)";
  panel.parentElement.appendChild(panel);
  await new Promise(r => setTimeout(r, 50));
  panel.style.transform = "perspective(150px) rotateY(0deg)";
  await new Promise(r => setTimeout(r, 150));

  isAnimation = false;
}

const makeTwiterUrl = (count) => {
  const url = `https://twitter.com/share?url=https://game.rude7.com/barrage/&via=rude_rockers&related=rude_rockers&hashtags=hashtag,hashtag2&text=めくった回数${count}回!!`;
  twitterShare.setAttribute('href', url);
}

const onDown = (x, y) => {
  if (isAnimation || isGameOver) {
    return;
  }
  flip(x, y);
  flip(x + 1, y);
  flip(x - 1, y);
  flip(x, y + 1);
  flip(x, y - 1);

  count++;
  counter.innerText = count;

  isGameOver = board.flat().every(v => v.state === 1);
  if (isGameOver) {
    setTimeout(() => {
      makeTwiterUrl(count);
      cleared.classList.remove('hidden');
      resetBtnArea.classList.remove('hidden');
      twitterArea.classList.remove('hidden');
      return;
    }, 400)
  }
}

resetBtn.addEventListener('click', function() {
  init();
})

window.onload = () => {
  init();
}
