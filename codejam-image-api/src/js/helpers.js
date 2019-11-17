function preloaderOnMouse(state = false) {
  document.body.classList.toggle('wait', state);
}
/* eslint-disable no-param-reassign */
function onloadToPromise(obj) {
  return new Promise((resolve, reject) => {
    obj.onload = () => resolve(obj);
    obj.onerror = reject;
  });
}

const rgbToHex = (color) => {
  const colorWithoutAlpha = color.slice(0, 3);
  const hexColor = colorWithoutAlpha.reduce((acc, el) => {
    const hexEl = `00${el.toString(16)}`.substr(-2);
    const hexAcc = `${acc}${hexEl}`;
    return hexAcc;
  }, '');
  return `#${hexColor}`;
};

function convertImageToArray(img, size) {
  try {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = size;
    tempCanvas.height = size;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(img, 0, 0, size, size);
    const tempImageData = tempCtx.getImageData(0, 0, size, size).data;
    const tempArray = new Array(size).fill(0).map(() => new Array(size).fill(0));
    for (let i = 0; i < tempImageData.length; i += 4) {
      const x = Math.floor(i / 4 / size);
      const y = (i / 4) % size;
      tempArray[y][x] = rgbToHex([tempImageData[i], tempImageData[i + 1], tempImageData[i + 2]]);
    }
    return tempArray;
  } catch (e) {
    console.err('Ошибка пересчета изображения в массив', e);
    throw e;
  }
}

export {
  rgbToHex, convertImageToArray, onloadToPromise, preloaderOnMouse,
};
