function getRandomColor() {
  let color = '#';
  for (let i = 0; i < 6; i += 1) {
    color += '0123456789ABCDEF'[Math.floor(Math.random() * 16)];
  }
  return color;
}

export default {
  getRandomColor
};
