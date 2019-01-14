
/*
eslint no-param-reassign: ["error",
{ "props": true, "ignorePropertyModificationsFor": ["element"] }]
*/

function getRandomColor() {
  let color = '#';
  for (let i = 0; i < 6; i += 1) {
    color += '0123456789ABCDEF'[Math.floor(Math.random() * 16)];
  }
  return color;
}

function getRandomNumberBetweenMinMax(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function eventListenerService(element, eventType, callback) {
  if (element.addEventListener) {
    element.addEventListener(eventType, callback);
  }
}

function setStyle(element, style, value) {
  if (element.style) {
    element.style[style] = value;
  }
}


export default {
  getRandomColor,
  eventListenerService,
  getRandomNumberBetweenMinMax,
  setStyle,
};
