import state from './state';
import renderRules from './rules';

const errorMsg = document.querySelector('.error-msg');
let errorTimer;

const buttons = document.querySelectorAll('.aside-right__fsize');
const canvas = document.getElementById('canvas');
canvas.width = state.baseSize;
canvas.height = state.baseSize;
const ctx = canvas.getContext('2d');

function handleErrorMsg(action = 'hide', time = 3000) {
  if (action === 'show') {
    errorMsg.classList.add('shown');
    errorTimer = setTimeout(() => {
      errorMsg.classList.remove('shown');
    }, time);
  } else if (action === 'hide') {
    errorMsg.classList.remove('shown');
    clearTimeout(errorTimer);
  }
}

async function drawCanvas(size, src) {
  const spriteSize = state.baseSize / size;
  try {
    const response = await fetch(src);
    if (!response.ok) {
      throw new Error('Server response is not OK');
    }
    const data = await response.json();
    data.forEach((row, i) => {
      row.forEach((column, j) => {
        ctx.fillStyle = Array.isArray(column)
          ? `rgba(${column[0]},${column[1]},${column[2]},${column[3]})`
          : `#${column}`;
        ctx.fillRect(spriteSize * i, spriteSize * j, spriteSize * (i + 1), spriteSize * (j + 1));
      });
    });
    handleErrorMsg('hide');
  } catch (e) {
    /* eslint-disable-next-line */
    console.log('Ошибка получения данных от сервера:', e);
    handleErrorMsg('show');
  }
  renderRules(size);
}

function drawImage(size, src) {
  const img = new Image();
  img.src = src;
  img.addEventListener('load', () => {
    ctx.drawImage(img, 0, 0, 512, 512);
    handleErrorMsg('hide');
  });
  img.addEventListener('error', () => {
    handleErrorMsg('show');
  });

  renderRules(size);
}

buttons.forEach(el => {
  el.addEventListener('click', () => {
    if (el.classList.contains('active')) {
      return;
    }
    buttons.forEach(button => button.classList.remove('active'));
    el.classList.add('active');
    if (el.dataset.isImage === 'true') {
      drawImage(el.dataset.size, el.dataset.src);
    } else {
      drawCanvas(el.dataset.size, el.dataset.src);
    }
  });
});

drawCanvas(state.defaultSize, state.defualtSource);
