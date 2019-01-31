export function Rectangle(x, y, width, height, color, ctx) {
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
