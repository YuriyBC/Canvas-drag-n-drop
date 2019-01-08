window.onload = function () {
    addCanvas();
};

function addCanvas () {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const offset = 500;

    let canvas = document.getElementById('canvas-container');
    canvas.width =  width - offset;
    canvas.height =  height - offset;

    if(canvas && canvas.getContext) {
        let ctx = canvas.getContext('2d');
        showRandomRectangle(canvas, ctx)
    }

    canvas.addEventListener('mousedown', canvasClickHandler);
    canvas.addEventListener('mousemove',  canvasMouseHandler);
}

function showRandomRectangle (canvas, ctx) {
    const rectanglesToGenerate = 1;

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
    let width = Math.floor(Math.random() * (_maxWidth - positionX)) + positionX;
    let height = Math.floor(Math.random() * (_maxHeight - _minHeight)) + _minHeight;

    let recParams = [positionX, positionY, width, height];
    let recColor = "#"+((1<<24)*Math.random()|0).toString(16);

    const rectangle = {
        recParams,
        recColor
    };
    getRandomRectangle.history.push(rectangle);
    return rectangle
}


function canvasMouseHandler (ev) {
    // console.log(ev.layerX, ev.layerY)
}

function canvasClickHandler (ev) {
    if (getRandomRectangle.history.length) {
        getRandomRectangle.history.forEach(el => {
            const mousePosition = getMousePos(ev);
            const isSimilarHorizontalPosition = mousePosition.x > el.recParams[0] && mousePosition.x < el.recParams[0] + el.recParams[2];
            const isSimilarVerticalPosition = mousePosition.y > el.recParams[1] && mousePosition.y < el.recParams[1] + el.recParams[3];
            if (isSimilarHorizontalPosition && isSimilarVerticalPosition) {

            }
        })
    }

}

function getMousePos(evt) {
    let canvas = document.getElementById('canvas-container');
    let rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}