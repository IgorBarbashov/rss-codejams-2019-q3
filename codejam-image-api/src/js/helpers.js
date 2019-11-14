const rgbToHex = color => {
  const colorWithoutAlpha = color.slice(0, 3);
  const hexColor = colorWithoutAlpha.reduce((acc, el) => {
    const hexEl = `00${el.toString(16)}`.substr(-2);
    const hexAcc = `${acc}${hexEl}`;
    return hexAcc;
  }, '');
  return hexColor;
};

export default rgbToHex;
