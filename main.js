window.onload = function () {
    addCanvas();
    document.addEventListener('mousedown', movieClickHandler);
};

function addCanvas () {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const offset = 100;

    let canvas = document.getElementById('canvas-container');
    canvas.width =  width - offset;
    canvas.height =  height - offset;

    if(canvas && canvas.getContext) {
        let ctx = canvas.getContext('2d');
        showRandomRectangle(canvas, ctx)
    }
}

function showRandomRectangle (canvas, ctx) {
    const rectanglesToGenerate = 4;

    for (let i = 0; i < rectanglesToGenerate; i++) {
        let {recParams, recColor} = getRandomRectangle(canvas);
        ctx.fillStyle = recColor;
        ctx.fillRect(recParams[0], recParams[1], recParams[2], recParams[3])
    };
}


function getRandomRectangle(canvas) {
    if (!getRandomRectangle.history)  getRandomRectangle.history = [];
    const _maxWidth = 400;
    const _minWidth = 40;
    const _maxHeight = 400;
    const _minHeight = 45;

    let positionX = Math.floor(Math.random() * canvas.width) + 1;
    let positionY = Math.floor(Math.random() * canvas.height) + 1;
    let width = Math.floor(Math.random() * (_maxWidth - _minWidth)) + _minWidth;
    let height =  positionY;

    let recParams = [positionX, positionY, width, height];
    let recColor = "#"+((1<<24)*Math.random()|0).toString(16);

    const rectangle = {
        recParams,
        recColor
    };
    getRandomRectangle.history.push(rectangle);
    return rectangle
}


function movieClickHandler (ev) {
    console.log(ev.offsetX)
}