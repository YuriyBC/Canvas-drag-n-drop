const width = window.innerWidth;
const height = window.innerHeight;
let container


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
    canvas.style.position = 'absolute'
    container.appendChild(canvas);
    container.addEventListener('mousedown', canvasClickHandler.bind(this));
    container.addEventListener('mouseup', canvasReleaseMouse.bind(this));
    container.addEventListener('mousemove',  canvasMousemoveHandler.bind(this));

    return canvas
}

function generateRectangles () {
    const rectanglesToGenerate = 2;

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

function Rectangle (x, y, xx, yy, color, ctx) {;
    this.x = x;
    this.y = y;
    this.xx = xx;
    this.yy = yy;
    this.ctx = ctx;
    this.color = color;
    this.isDraggble = false;
    this.draggedLast = [];
    this.isCrossed = false;

    this.setCrossed = function (value) {
        this.isCrossed = value
    };
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
            this.draggedLast = [x, y, this.xx, this.yy]
        }
    };
    this.setDraggble = function (val) {
        this.isDraggble = val
    }
}

function getRandomRectangle(canvas) {
    if (!getRandomRectangle.history)  getRandomRectangle.history = [];
    const _maxWidth = 400;
    const _minWidth = 40;
    const _maxHeight = 400;
    const _minHeight = 45;

    let positionX = Math.floor(Math.random() * canvas.width) + 1;
    let positionY = Math.floor(Math.random() * canvas.height) + 1;
    let width = Math.floor(Math.random() * (_maxWidth - positionX)) + positionX;
    let height = Math.floor(Math.random() * (_maxHeight - _minHeight)) + _minHeight;

    let recParams = [positionX, positionY, width, height];
    let recColor = "#"+((1<<24)*Math.random()|0).toString(16);

    return {
        recParams,
        recColor
    };
}


function canvasMousemoveHandler (ev) {
    const collection = rectangleCollection.get();
    const draggableItem = collection.find(el => el.isDraggble);

    if (draggableItem) {
        let x = ev.pageX - container.offsetLeft - (draggableItem.xx / 2);
        let y = ev.pageY - container.offsetTop - (draggableItem.yy / 2);
        if (isPositionAllowed(x, y, draggableItem, ev)) draggableItem.transform(x, y);
    }
}

function isPositionAllowed (potentialX, potentialY, draggableItem, ev) {
    let offsetAllowed = 0;

    const collection = rectangleCollection.get().filter(el => JSON.stringify(el) !== JSON.stringify(draggableItem) );
    if (collection && collection.length && ev) {
        return collection.every(el => {
            const mousePosition = getMousePos(ev);
            const elementPositionBeforeX = mousePosition.x + (draggableItem.xx / 2) + offsetAllowed;
            const elementPositionAfterX = mousePosition.x - (draggableItem.xx / 2) - offsetAllowed;
            const elementPositionBeforeY = mousePosition.y + (draggableItem.yy / 2) + offsetAllowed;
            const elementPositionAfterY = mousePosition.y - (draggableItem.yy / 2) - offsetAllowed;

            const isRectangleCrossedByX = elementPositionBeforeX > el.x && elementPositionAfterX < el.x + el.xx;
            const isRectangleCrossedByY = elementPositionBeforeY > el.y && elementPositionAfterY < el.y + el.yy;

            if (isRectangleCrossedByX && isRectangleCrossedByY) {
                draggableItem.setCrossed(true);
                draggableItem.setColor(CONSTANTS.RED_COLOR);
                el.setColor(CONSTANTS.RED_COLOR);
            }
            return true
        })
    }
}

function canvasReleaseMouse () {
    const collection = rectangleCollection.get();
    const draggableItem = collection.find(el => el.isDraggble);
    if (draggableItem) {
        if (draggableItem.isCrossed) {
            draggableItem.transform(draggableItem.x, draggableItem.y)
        } else {
            draggableItem.setPosition(...draggableItem.draggedLast)
        }

        draggableItem.setDraggble(false);
        draggableItem.setCrossed(false);
        container.style.cursor = "default";
        collection.forEach(el => el.setColor());
    }
}

function canvasClickHandler (ev) {
    ev.preventDefault();

    const collection = rectangleCollection.get();
    if (collection.length) {
        collection.forEach(el => {
            const mousePosition = getMousePos(ev);
            const isSimilarHorizontalPosition = mousePosition.x > el.x && mousePosition.x < el.x + el.xx;
            const isSimilarVerticalPosition = mousePosition.y > el.y && mousePosition.y < el.y + el.yy;
            if (isSimilarHorizontalPosition && isSimilarVerticalPosition) {
                container.style.cursor = "move";
                el.setDraggble(true);
            }
        })
    }
}

function getMousePos(evt) {
    let rect = container.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}
