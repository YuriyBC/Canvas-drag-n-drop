import { constants } from './constsnts';
import { Rectangle } from './models/rectangleModel';

import {
    getRandomColor,
    eventListenerService,
    getRandomNumberBetweenMinMax,
    setStyle,
} from '../utils/utils';

import {
    isDraggingAllowed,
    getMousePosition,
} from './calculations';

import {
    rectangleCollection,
} from './rectangleCollections';

function getRandomRectangle() {
    const rectanglesQuantity = [...rectangleCollection.get()].length;
    const previousRectangle = [...rectangleCollection.get()][rectanglesQuantity - 1];
    const previousRectangleHeight = previousRectangle
        ? previousRectangle.y + previousRectangle.height
        : 0;

    const positionX = constants.CONTAINER_PADDING;
    const positionY = constants.OFFSET_BETWEEN_RECTANGLES + previousRectangleHeight;
    const rectangleWidth = getRandomNumberBetweenMinMax(
        constants.RECTANGLE_MIN_WIDTH,
        constants.RECTANGLE_MAX_WIDTH,
    );
    const rectangleHeight = getRandomNumberBetweenMinMax(
        constants.RECTANGLE_MIN_HEIGHT,
        constants.RECTANGLE_MAX_HEIGHT,
    );

    const rectangleParams = [positionX, positionY, rectangleWidth, rectangleHeight];
    const rectangleColor = getRandomColor();

    return {
        rectangleParams,
        rectangleColor,
    };
}

function showRandomRectangle(canvas, ctx) {
    const { rectangleParams, rectangleColor } = getRandomRectangle();

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

function onClickCanvas(container, event) {
    const collection = rectangleCollection.get();

    if (collection.length) {
        collection.forEach((el) => {
            const mousePosition = getMousePosition(event, container);
            const isSimilarHorizontalPosition = mousePosition.x
        > el.x && mousePosition.x
        < el.x + el.width;
            const isSimilarVerticalPosition = mousePosition.y
        > el.y && mousePosition.y
        < el.y + el.height;
            if (isSimilarHorizontalPosition && isSimilarVerticalPosition) {
                setStyle(container, 'cursor', 'move');
                const offsetX = el.x - mousePosition.x;
                const offsetY = el.y - mousePosition.y;

                el.setMouseOffset([offsetX * -1, offsetY * -1]);
                el.setDragProgress(true);
            }
        });
    }
}

function onDragMove(container, event) {
    const collection = rectangleCollection.get();
    const draggableItem = collection.find(rectangle => rectangle.isDragged);
    if (draggableItem) {
        const x = event.pageX - container.offsetLeft - draggableItem.mouseOffset[0];
        const y = event.pageY - container.offsetTop - draggableItem.mouseOffset[1];
        if (isDraggingAllowed(x, y, draggableItem, event, container)) {
            requestAnimationFrame(() => draggableItem.transform(x, y));
        }
    }
}

function onMouseUp(container) {
    const collection = rectangleCollection.get();
    const draggableItem = collection.find(rectangle => rectangle.isDragged);

    if (draggableItem) {
    // one click behaviour
        if (!draggableItem.lastDraggedPosition.length) {
            draggableItem.setDragProgress(false);
            setStyle(container, 'cursor', 'default');
            return;
        }
        // draggable behaviour
        // if rectangle has crossed another rectangle
        if (draggableItem.isCrossed) {
            draggableItem.transform(draggableItem.x, draggableItem.y);

            // if rectangle has't crossed another rectangle but has been connected to another
        } else if (!draggableItem.isCrossed && draggableItem.isConnected) {
            draggableItem.setPosition(...draggableItem.connectedPosition);

            // if rectangle has been dragged to any place
        } else {
            draggableItem.setPosition(...draggableItem.lastDraggedPosition);
        }

        draggableItem.setDragProgress(false);
        draggableItem.setCrossed(false);
        draggableItem.setConnected(false);
        setStyle(container, 'cursor', 'default');
        collection.forEach(rectangle => rectangle.setColor());
    }
}

function setCanvasContainerSize() {
    const container = document.getElementById('canvas-container');
    setStyle(container, 'width', `${window.innerWidth - constants.OFFSET_PAGE}px`);
    setStyle(container, 'height', `${window.innerHeight - constants.OFFSET_PAGE}px`);
    setStyle(container, 'marginTop', `${constants.OFFSET_PAGE / 2}px`);
    setStyle(container, 'marginLeft', `${constants.OFFSET_PAGE / 2}px`);
}

function createCanvas() {
    const container = document.getElementById('canvas-container');
    const canvasCollection = container.getElementsByTagName('canvas');
    const canvas = document.createElement('canvas');

    canvas.id = `canvas-container-${canvasCollection.length}`;
    canvas.width = window.innerWidth - constants.OFFSET_PAGE;
    canvas.height = window.innerHeight - constants.OFFSET_PAGE;
    setStyle(canvas, 'position', 'absolute');
    container.appendChild(canvas);

    eventListenerService(container, 'mousedown', onClickCanvas.bind(this, container));
    eventListenerService(container, 'mouseup', onMouseUp.bind(this, container));
    eventListenerService(container, 'mousemove', onDragMove.bind(this, container));

    return canvas;
}

function generateRectangles() {
    for (let i = 0; i < constants.RECTANGLES_TO_GENERATE; i += 1) {
        const canvas = createCanvas();
        const ctx = canvas.getContext('2d');
        showRandomRectangle(canvas, ctx);
    }
}

eventListenerService(document, 'DOMContentLoaded', () => {
    setCanvasContainerSize();
    generateRectangles();
});
