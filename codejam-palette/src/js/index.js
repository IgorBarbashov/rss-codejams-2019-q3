const dataSrc = {
  4: '4x4.json',
  32: '32x32.json',
};
const baseSize = 512;
const defaultSize = 4;

const errorMsg = document.querySelector('.error-msg');
let errorTimer;

const buttons = document.querySelectorAll('.aside-right__fsize');
const canvas = document.getElementById('canvas');
canvas.width = baseSize;
canvas.height = baseSize;
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

async function drawCanvas(size) {
  const spriteSize = baseSize / size;
  try {
    const response = await fetch(`./assets/data/${dataSrc[size]}`);
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
}

function drawImage() {
  const img = new Image();
  img.src = './assets/images/image.png';
  img.addEventListener('load', () => {
    ctx.drawImage(img, 0, 0, 512, 512);
    handleErrorMsg('hide');
  });
  img.addEventListener('error', () => {
    handleErrorMsg('show');
  });
}

buttons.forEach((el) => {
  el.addEventListener('click', () => {
    if (el.classList.contains('active')) {
      return;
    }
    buttons.forEach((button) => button.classList.remove('active'));
    el.classList.add('active');
    if (el.dataset.isImage === 'true') {
      drawImage();
    } else {
      drawCanvas(el.dataset.size);
    }
  });
});

drawCanvas(defaultSize);
