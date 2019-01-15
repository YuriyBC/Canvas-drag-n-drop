const { constants } = require('./constsnts');
const { rectangleCollection } = require('./rectangleCollection');

function detectIsMouseInsideElement(mousePosition, rectangle) {
    return mousePosition.x > rectangle.x && mousePosition.x < rectangle.x + rectangle.width
        && mousePosition.y > rectangle.y && mousePosition.y < rectangle.y + rectangle.height;
}

function getMousePosition(event, container) {
    const textRectangle = container.getBoundingClientRect();
    return {
        x: event.clientX - textRectangle.left,
        y: event.clientY - textRectangle.top,
    };
}

function calculateConnectionPosition(draggableItem, rectangle) {
    if (draggableItem && rectangle) {
        if (draggableItem.lastDraggedPosition
        && draggableItem.lastDraggedPosition.length
        && draggableItem.height
        && draggableItem.width
        && rectangle.x
        && rectangle.y
        && rectangle.width
        && rectangle.height) {
            const {
                x,
                y,
                width,
                height,
            } = rectangle;
            let xPosition;
            let yPosition;
            let direction;
            const isLeft = x > draggableItem.lastDraggedPosition[0]
                + draggableItem.lastDraggedPosition[2];
            const isRight = x + width < draggableItem.lastDraggedPosition[0];
            const isTop = draggableItem.lastDraggedPosition[1]
                + draggableItem.lastDraggedPosition[3] < y;
            const isBottom = y + height < draggableItem.lastDraggedPosition[1];

            if (isRight) {
                const heightDifference = draggableItem.height - height;
                xPosition = x + width;
                yPosition = y - heightDifference;
                direction = true;
            }

            if (isLeft) {
                const heightDifference = draggableItem.height - height;
                xPosition = x - draggableItem.width;
                yPosition = y - heightDifference;
                direction = true;
            }

            if (isTop) {
                xPosition = x;
                yPosition = y - draggableItem.height;
                direction = true;
            }

            if (isBottom) {
                xPosition = x;
                yPosition = y + height;
                direction = true;
            }

            return {
                x: xPosition,
                y: yPosition,
                direction,
                width: draggableItem.width,
                height: draggableItem.height,
            };
        }
    }

    return {
        x: null,
        y: null,
        direction: null,
        width: null,
        height: null,
    };
}

function detectAvailableConnection(mousePosition, draggableItem, rectangle) {
    if (mousePosition && draggableItem && rectangle) {
        if (mousePosition.x
            && mousePosition.y
            && constants
            && draggableItem.mouseOffset
            && draggableItem.height
            && draggableItem.width) {
            const elementPositionBeforeX = mousePosition.x
                + (draggableItem.width - draggableItem.mouseOffset[0])
                + constants.OFFSET_CONNECTION;
            const elementPositionAfterX = mousePosition.x
                - draggableItem.mouseOffset[0]
                - constants.OFFSET_CONNECTION;
            const elementPositionBeforeY = mousePosition.y
                + (draggableItem.height
                - draggableItem.mouseOffset[1])
                + constants.OFFSET_CONNECTION;
            const elementPositionAfterY = mousePosition.y
                - draggableItem.mouseOffset[1]
                - constants.OFFSET_CONNECTION;

            const isRectangleCrossedByX = elementPositionBeforeX
                > rectangle.x && elementPositionAfterX
                < rectangle.x + rectangle.width;
            const isRectangleCrossedByY = elementPositionBeforeY
                > rectangle.y && elementPositionAfterY
                < rectangle.y + rectangle.height;

            return isRectangleCrossedByX && isRectangleCrossedByY;
        }
    }
    return false;
}

function isDraggingAllowed(potentialX, potentialY, draggableItem, mousePosition) {
    const collection = rectangleCollection.get().filter(
        rectangle => JSON.stringify(rectangle) !== JSON.stringify(draggableItem),
    );

    if (collection && collection.length && mousePosition) {
        return collection.every((rectangle) => {
            const isConnectionAvailable = detectAvailableConnection(mousePosition,
                draggableItem,
                rectangle);
            const isMouseInsideElement = detectIsMouseInsideElement(mousePosition, rectangle);

            if (isMouseInsideElement) {
                draggableItem.setCrossed(true);
                draggableItem.setConnected(false);
                draggableItem.setColor(constants.RED_COLOR);
                rectangle.setColor(constants.RED_COLOR);
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

module.exports = {
    getMousePosition,
    calculateConnectionPosition,
    detectAvailableConnection,
    isDraggingAllowed,
};
