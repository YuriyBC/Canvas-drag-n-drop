const width = window.innerWidth;
const height = window.innerHeight;
let container;


window.onload = function () {
    generateRectangles()
};

const rectangleCollection = {
    history: [],
    add: function (rectangle) {
        this.history.push(rectangle)
    },
    get: function () {
        return this.history
    }
};

const CONSTANTS = {
    RED_COLOR: '#da3d4b'
};

function createCanvas () {
    container = document.getElementsByClassName('canvas-container')[0];
    const canvasCollection = container.getElementsByTagName('canvas');
    const canvas = document.createElement('canvas');
    const offset = 200;

    canvas.id = `canvas-container-${canvasCollection.length}`;
    canvas.width = width - offset;
    canvas.height = height - offset;
    canvas.style.position = 'absolute';
    container.appendChild(canvas);
    container.addEventListener('mousedown', onClickCanvas.bind(this));
    container.addEventListener('mouseup', onMouseUp.bind(this));
    container.addEventListener('mousemove',  onDragMove.bind(this));

    return canvas
}

function generateRectangles () {
    const rectanglesToGenerate = 3;

    for (let i = 0; i < rectanglesToGenerate; i++) {
        const canvas = createCanvas();
        let ctx = canvas.getContext('2d');
        showRandomRectangle(canvas, ctx)
    }
}

function showRandomRectangle (canvas, ctx) {
    let {recParams, recColor} = getRandomRectangle(canvas);

    const rectangle = new Rectangle(recParams[0],
                  recParams[1],
                  recParams[2],
                  recParams[3],
                  recColor,
                  ctx);
    rectangle.print();
    rectangleCollection.add(rectangle);
}

function Rectangle (x, y, xx, yy, color, ctx) {
    this.x = x;
    this.y = y;
    this.xx = xx;
    this.yy = yy;
    this.ctx = ctx;
    this.color = color;
    this.isCrossed = false;
    this.isDragged = false;
    this.lastDraggedPosition = [];
    this.mouseOffset = [];

    this.print = function () {
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x, this.y, this.xx, this.yy);
    };
    this.setPosition = function (x, y, xx, yy) {
        this.x = x;
        this.y = y;
        this.xx = xx;
        this.yy = yy;
    };
    this.setColor = function (color) {
        this.ctx.fillStyle = color || this.color;
        this.ctx.fillRect(this.x, this.y, this.xx, this.yy);
    };
    this.transform = function (x, y, xx, yy, color) {
        this.ctx.fillStyle = color;
        if (!xx && !yy) {
            this.ctx.clearRect(0, 0, width, height);
            this.ctx.fillRect(x, y, this.xx, this.yy);
            this.lastDraggedPosition = [x, y, this.xx, this.yy]
        } else {
            this.ctx.clearRect(0, 0, width, height);
            this.ctx.fillRect(x, y, xx, yy);
        }
    };
    this.setCrossed = function (value) {
        this.isCrossed = value
    };
    this.setDragProgress = function (val) {
        this.isDragged = val
    };
    this.setMouseOffset = function (val) {
        this.mouseOffset = val
    }
}

function getRandomRectangle(canvas) {
    const offsetBetweenRectangles = 30;
    const rectanglesBeforeLength = [...rectangleCollection.get()].length;
    const previousRectangle = [...rectangleCollection.get()][rectanglesBeforeLength - 1];
    const previousRectangleHeight = previousRectangle ? previousRectangle.y + previousRectangle.yy : 0;

    const _maxWidth = 200;
    const _minWidth = 40;
    const _maxHeight = 200;
    const _minHeight = 45;

    let positionX = Math.floor(Math.random() * canvas.width) + 1;
    let positionY = rectanglesBeforeLength * offsetBetweenRectangles + previousRectangleHeight;
    let width = Math.floor(Math.random() * (_maxWidth - _minWidth)) + _minWidth;
    let height = Math.floor(Math.random() * (_maxHeight - _minHeight)) + _minHeight;


    let recParams = [positionX, positionY, width, height];
    console.log(recParams )
    let recColor = "#"+((1<<24)*Math.random()|0).toString(16);

    return {
        recParams,
        recColor
    };
}

function onClickCanvas (ev) {
    const collection = rectangleCollection.get();
    if (collection.length) {
        collection.forEach(el => {
            const mousePosition = getMousePos(ev);
            const isSimilarHorizontalPosition = mousePosition.x > el.x && mousePosition.x < el.x + el.xx;
            const isSimilarVerticalPosition = mousePosition.y > el.y && mousePosition.y < el.y + el.yy;
            if (isSimilarHorizontalPosition && isSimilarVerticalPosition) {
                container.style.cursor = "move";
                const offsetX = el.x - mousePosition.x;
                const offsetY = el.y - mousePosition.y;

                el.setMouseOffset([offsetX * -1, offsetY * -1]);
                el.setDragProgress(true);
            }
        })
    }
}


function onDragMove (ev) {
    const collection = rectangleCollection.get();
    const draggableItem = collection.find(el => el.isDragged);

    if (draggableItem) {
        let x = ev.pageX - container.offsetLeft - draggableItem.mouseOffset[0];
        let y = ev.pageY - container.offsetTop - draggableItem.mouseOffset[1];
        if (isPositionAllowed(x, y, draggableItem, ev)) draggableItem.transform(x, y);
    }
}

function onMouseUp () {
    const collection = rectangleCollection.get();
    const draggableItem = collection.find(el => el.isDragged);

    if (draggableItem) {
        // one click behaviour
        if (!draggableItem.lastDraggedPosition.length) {
            draggableItem.setDragProgress(false);
            container.style.cursor = "default";
            return
        }
        // draggable behaviour
        if (draggableItem.isCrossed) {
            draggableItem.transform(draggableItem.x, draggableItem.y)
        } else {
            draggableItem.setPosition(...draggableItem.lastDraggedPosition)
        }

        draggableItem.setDragProgress(false);
        draggableItem.setCrossed(false);
        container.style.cursor = "default";
        collection.forEach(el => el.setColor());
    }
}

function isPositionAllowed (potentialX, potentialY, draggableItem, ev) {
    let allowedOffset = 30;
    const collection = rectangleCollection.get().filter(el => JSON.stringify(el) !== JSON.stringify(draggableItem));

    if (collection && collection.length && ev) {
        return collection.every(el => {
            const mousePosition = getMousePos(ev);
            const elementPositionBeforeX = mousePosition.x + (draggableItem.xx - draggableItem.mouseOffset[0]) + allowedOffset;
            const elementPositionAfterX = mousePosition.x - draggableItem.mouseOffset[0] - allowedOffset;
            const elementPositionBeforeY = mousePosition.y + (draggableItem.yy - draggableItem.mouseOffset[1]) + allowedOffset;
            const elementPositionAfterY = mousePosition.y - draggableItem.mouseOffset[1] - allowedOffset;

            const isRectangleCrossedByX = elementPositionBeforeX > el.x && elementPositionAfterX < el.x + el.xx;
            const isRectangleCrossedByY = elementPositionBeforeY > el.y && elementPositionAfterY < el.y + el.yy;

            if (isRectangleCrossedByX && isRectangleCrossedByY) {
                connectRectangle(draggableItem, el);
                // draggableItem.setCrossed(true);
                // draggableItem.setColor(CONSTANTS.RED_COLOR);
                // el.setColor(CONSTANTS.RED_COLOR);
                // console.log(start, draggableItem.xx, height, draggableItem.yy, draggableItem.color)
                return false
            }
            return true
        })
    }
}


function connectRectangle (draggableItem, el) {
    let allowedOffset = 30;
    const isLeft = el.x > draggableItem.lastDraggedPosition[0] + draggableItem.lastDraggedPosition[2];
    const isRight = el.x + el.xx < draggableItem.lastDraggedPosition[0];
    const isTop = draggableItem.lastDraggedPosition[1] + draggableItem.lastDraggedPosition[3] < el.y;
    const isBottom = el.y + el.yy < draggableItem.lastDraggedPosition[1];

    if (isRight) {
        let newX = el.x + el.xx;
        let heightDifference = draggableItem.yy - el.yy;
        let nexY = el.y - heightDifference;
        draggableItem.transform(newX, nexY, draggableItem.xx, draggableItem.yy, draggableItem.color);
        draggableItem.setCrossed(true);
    }

    if (isLeft) {
        let newX = el.x - draggableItem.xx;
        let heightDifference = draggableItem.yy - el.yy;
        let nexY = el.y - heightDifference;
        draggableItem.transform(newX, nexY, draggableItem.xx, draggableItem.yy, draggableItem.color);
        draggableItem.setCrossed(true);
    }
    // console.log(el.x, el.y, el.xx, el.yy)
    // console.log(draggableItem.x, draggableItem.y, draggableItem.xx, draggableItem.y)
}

function getMousePos(evt) {
    let rect = container.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}
