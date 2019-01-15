import {
    getRandomColor,
    getRandomNumberBetweenMinMax,
} from '../utils/utils';
import { constants } from './constsnts';

export const rectangleCollection = {
    collection: [],
    add(rectangle) {
        this.collection.push(rectangle);
    },
    get() {
        return this.collection;
    },
    getRandomRectangle() {
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
    },
};
