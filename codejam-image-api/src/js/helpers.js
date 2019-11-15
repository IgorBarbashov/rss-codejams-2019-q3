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
    const newArray = new Array(size).fill(0).map((row, x) =>
      new Array(size).fill(0).map((cell, y) => {
        const rgbaColor = tempCtx.getImageData(x, y, 1, 1).data;
        const hexColor = rgbToHex(rgbaColor);
        return hexColor;
      }),
    );
    return newArray;
  } catch (e) {
    console.log('Ошибка пересчета изображения в массив', e);
    throw e;
  }
}

export { rgbToHex, convertImageToArray, onloadToPromise };
