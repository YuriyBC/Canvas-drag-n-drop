import utils from './utils';

const { getRandomColor } = utils;

let container;

const CONSTANTS = {
  RED_COLOR: '#da3d4b',
  OFFSET_PAGE: 100,
  OFFSET_CONNECTION: 25,
  OFFSET_BETWEEN_RECTANGLES: 70,
};

const rectangleCollection = {
  collection: [],
  add(rectangle) {
    this.collection.push(rectangle);
  },
  get() {
    return this.collection;
  },
};

function getMousePosition(event) {
  const textRectangle = container.getBoundingClientRect();
  return {
    x: event.clientX - textRectangle.left,
    y: event.clientY - textRectangle.top,
  };
}

function getRandomRectangle(canvas) {
  const rectanglesQuantity = [...rectangleCollection.get()].length;
  const previousRectangle = [...rectangleCollection.get()][rectanglesQuantity - 1];
  const previousRectangleHeight = previousRectangle
    ? previousRectangle.y + previousRectangle.height
    : 0;

  const maxWidth = 400;
  const minWidth = 70;
  const maxHeight = 120;
  const minHeight = 45;

  const positionX = canvas.width / 2.4;
  const positionY = CONSTANTS.OFFSET_BETWEEN_RECTANGLES + previousRectangleHeight;
  const rectangleWidth = Math.floor(Math.random() * (maxWidth - minWidth)) + minWidth;
  const rectangleHeight = Math.floor(Math.random() * (maxHeight - minHeight)) + minHeight;

  const rectangleParams = [positionX, positionY, rectangleWidth, rectangleHeight];
  const rectangleColor = getRandomColor();

  return {
    rectangleParams,
    rectangleColor,
  };
}

function Rectangle(x, y, width, height, color, ctx) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.ctx = ctx;
  this.color = color;
  this.isCrossed = false;
  this.isDragged = false;
  this.isConnected = false;
  this.connectedPosition = [];
  this.lastDraggedPosition = [];
  this.mouseOffset = [];

  this.print = function print() {
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.x, this.y, this.width, this.height);
  };
  this.setPosition = function setPosition(positionX, positionY, positionWidth, positionHeight) {
    this.x = positionX;
    this.y = positionY;
    this.width = positionWidth;
    this.height = positionHeight;
  };
  this.setColor = function setColor(colorToSet) {
    this.ctx.fillStyle = colorToSet || this.color;
    this.ctx.fillRect(this.x, this.y, this.width, this.height);
  };
  this.transform = function transform(
    transformX,
    transformY,
    transformWidth,
    transformHeight,
    transformColor,
  ) {
    if (transformColor) this.ctx.fillStyle = transformColor;
    if (!transformWidth && !transformHeight) {
      this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      this.ctx.fillRect(transformX, transformY, this.width, this.height);
      this.lastDraggedPosition = [transformX, transformY, this.width, this.height];
    } else {
      this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      this.ctx.fillRect(transformX, transformY, transformWidth, transformHeight);
    }
  };
  this.setCrossed = function setCrossed(value) {
    this.isCrossed = value;
  };
  this.setDragProgress = function setDragProgress(value) {
    this.isDragged = value;
  };
  this.setMouseOffset = function setMouseOffset(value) {
    this.mouseOffset = value;
  };
  this.setConnected = function setConnected(value, position) {
    this.isConnected = value;
    this.connectedPosition = position;
  };
}

function showRandomRectangle(canvas, ctx) {
  const { rectangleParams, rectangleColor } = getRandomRectangle(canvas);

  const rectangle = new Rectangle(
    rectangleParams[0],
    rectangleParams[1],
    rectangleParams[2],
    rectangleParams[3],
    rectangleColor,
    ctx,
  );
  rectangle.print();
  rectangleCollection.add(rectangle);
}

function onClickCanvas(event) {
  const collection = rectangleCollection.get();
  if (collection.length) {
    collection.forEach((el) => {
      const mousePosition = getMousePosition(event);
      const isSimilarHorizontalPosition = mousePosition.x > el.x && mousePosition.x < el.x + el.width;
      const isSimilarVerticalPosition = mousePosition.y > el.y && mousePosition.y < el.y + el.height;
      if (isSimilarHorizontalPosition && isSimilarVerticalPosition) {
        container.style.cursor = 'move';
        const offsetX = el.x - mousePosition.x;
        const offsetY = el.y - mousePosition.y;

        el.setMouseOffset([offsetX * -1, offsetY * -1]);
        el.setDragProgress(true);
      }
    });
  }
}

function calculateConnectionPosition(draggableItem, rectangle) {
  let x;
  let y;
  let direction;
  const isLeft = rectangle.x > draggableItem.lastDraggedPosition[0]
        + draggableItem.lastDraggedPosition[2];
  const isRight = rectangle.x + rectangle.width < draggableItem.lastDraggedPosition[0];
  const isTop = draggableItem.lastDraggedPosition[1]
        + draggableItem.lastDraggedPosition[3] < rectangle.y;
  const isBottom = rectangle.y + rectangle.height < draggableItem.lastDraggedPosition[1];

  if (isRight) {
    const heightDifference = draggableItem.height - rectangle.height;
    x = rectangle.x + rectangle.width;
    y = rectangle.y - heightDifference;
    direction = true;
  }

  if (isLeft) {
    const heightDifference = draggableItem.height - rectangle.height;
    x = rectangle.x - draggableItem.width;
    y = rectangle.y - heightDifference;
    direction = true;
  }

  if (isTop) {
    x = rectangle.x;
    y = rectangle.y - draggableItem.height;
    direction = true;
  }

  if (isBottom) {
    x = rectangle.x;
    y = rectangle.y + rectangle.height;
    direction = true;
  }


  return {
    x,
    y,
    direction,
    width: draggableItem.width,
    height: draggableItem.height,
  };
}

function detectAvailableConnection(mousePosition, draggableItem, rectangle) {
  const elementPositionBeforeX = mousePosition.x
        + (draggableItem.width - draggableItem.mouseOffset[0])
        + CONSTANTS.OFFSET_CONNECTION;
  const elementPositionAfterX = mousePosition.x
        - draggableItem.mouseOffset[0]
        - CONSTANTS.OFFSET_CONNECTION;
  const elementPositionBeforeY = mousePosition.y
        + (draggableItem.height
            - draggableItem.mouseOffset[1])
        + CONSTANTS.OFFSET_CONNECTION;
  const elementPositionAfterY = mousePosition.y
        - draggableItem.mouseOffset[1]
        - CONSTANTS.OFFSET_CONNECTION;

  const isRectangleCrossedByX = elementPositionBeforeX
        > rectangle.x && elementPositionAfterX
        < rectangle.x + rectangle.width;
  const isRectangleCrossedByY = elementPositionBeforeY
        > rectangle.y && elementPositionAfterY
        < rectangle.y + rectangle.height;
  return isRectangleCrossedByX && isRectangleCrossedByY;
}

function detectIsMouseInsideElement(mousePosition, rectangle) {
  return mousePosition.x > rectangle.x && mousePosition.x < rectangle.x + rectangle.width
    && mousePosition.y > rectangle.y && mousePosition.y < rectangle.y + rectangle.height;
}

function isDraggingAllowed(potentialX, potentialY, draggableItem, event) {
  const collection = rectangleCollection.get().filter(rectangle => JSON.stringify(rectangle) !== JSON.stringify(draggableItem));

  if (collection && collection.length && event) {
    return collection.every((rectangle) => {
      const mousePosition = getMousePosition(event);
      const isConnectionAvailable = detectAvailableConnection(mousePosition, draggableItem, rectangle);
      const isMouseInsideElement = detectIsMouseInsideElement(mousePosition, rectangle);

      if (isMouseInsideElement) {
        draggableItem.setCrossed(true);
        draggableItem.setConnected(false);
        draggableItem.setColor(CONSTANTS.RED_COLOR);
        rectangle.setColor(CONSTANTS.RED_COLOR);
        return true;
      }

      if (isConnectionAvailable) {
        const directionObject = calculateConnectionPosition(draggableItem, rectangle);
        const {
          direction, x, y, width, height, color,
        } = directionObject;

        if (direction) {
          draggableItem.transform(x, y, width, height);
          draggableItem.setConnected(true, [x, y, width, height, color]);
          return false;
        }
      }

      if (draggableItem.isConnected) {
        draggableItem.setConnected(false);
        return true;
      }

      return true;
    });
  }
  return false;
}

function onDragMove(event) {
  const collection = rectangleCollection.get();
  const draggableItem = collection.find(rectangle => rectangle.isDragged);
  if (draggableItem) {
    const x = event.pageX - container.offsetLeft - draggableItem.mouseOffset[0];
    const y = event.pageY - container.offsetTop - draggableItem.mouseOffset[1];
    if (isDraggingAllowed(x, y, draggableItem, event)) draggableItem.transform(x, y);
  }
}

function onMouseUp() {
  const collection = rectangleCollection.get();
  const draggableItem = collection.find(rectangle => rectangle.isDragged);

  if (draggableItem) {
    // one click behaviour
    if (!draggableItem.lastDraggedPosition.length) {
      draggableItem.setDragProgress(false);
      container.style.cursor = 'default';
      return;
    }
    // draggable behaviour
    if (draggableItem.isCrossed && !draggableItem.isConnected) {
      draggableItem.transform(draggableItem.x, draggableItem.y);
    } else if (!draggableItem.isCrossed && draggableItem.isConnected) {
      draggableItem.setPosition(...draggableItem.connectedPosition);
    } else if (draggableItem.isCrossed && draggableItem.isConnected) {
      draggableItem.setPosition(...draggableItem.connectedPosition);
    } else {
      draggableItem.setPosition(...draggableItem.lastDraggedPosition);
    }

    draggableItem.setDragProgress(false);
    draggableItem.setCrossed(false);
    draggableItem.setConnected(false);
    container.style.cursor = 'default';
    collection.forEach(rectangle => rectangle.setColor());
  }
}

function setCanvasContainerSize() {
  container = document.getElementById('canvas-container');
  container.style.width = `${window.innerWidth - CONSTANTS.OFFSET_PAGE}px`;
  container.style.height = `${window.innerHeight - CONSTANTS.OFFSET_PAGE}px`;
  container.style.marginTop = `${CONSTANTS.OFFSET_PAGE / 2}px`;
  container.style.marginLeft = `${CONSTANTS.OFFSET_PAGE / 2}px`;
}

function createCanvas() {
  const canvasCollection = container.getElementsByTagName('canvas');
  const canvas = document.createElement('canvas');

  canvas.id = `canvas-container-${canvasCollection.length}`;
  canvas.width = window.innerWidth - CONSTANTS.OFFSET_PAGE;
  canvas.height = window.innerHeight - CONSTANTS.OFFSET_PAGE;
  canvas.style.position = 'absolute';
  container.appendChild(canvas);
  container.addEventListener('mousedown', onClickCanvas.bind(this));
  container.addEventListener('mouseup', onMouseUp.bind(this));
  container.addEventListener('mousemove', onDragMove.bind(this));

  return canvas;
}

function generateRectangles() {
  const rectanglesToGenerate = 5;

  for (let i = 0; i < rectanglesToGenerate; i += 1) {
    const canvas = createCanvas();
    const ctx = canvas.getContext('2d');
    showRandomRectangle(canvas, ctx);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  setCanvasContainerSize();
  generateRectangles();
});
