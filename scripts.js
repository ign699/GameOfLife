`use strict`



class GOL {
    constructor(width, height, cellSize, canvaId) {
        this.width = width;
        this.height = height;
        this.alive = [];
        this.cells = [];

        for(let i = 0; i < height; i++){
            cells.push(new Array(width).fill(0));
        }


    }
}   


class GOLcanvas {
    constructor(cellSize, canvaId){
        this.cellSize = cellSize;
        this.canvas = document.getElementById(canvaId);
        this.ctx = canvas.getContext("2d");
        this.width = canvas.width;
        this.height = canvas.height;
    }

    createGrid() {
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = '#b1bcce';
        for(let y = 0; y <= this.width; y+=this.cellSize + 1){
            for(let x = 0; x <= this.height; x+=this.cellSize + 1){
                this.ctx.strokeRect(y + 0.5, x + 0.5, this.cellSize + 1, this.cellSize + 1);
            }
        }
    }

    calcCoordinates(x, y) {
        const X = Math.floor(x/(this.cellSize + 1));
        const Y = Math.floor(y/(this.cellSize + 1));
        return {x: X, y: Y}
    }

    fillCell(x, y) {
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(x*(this.cellSize + 1) + 1, y*(this.cellSize + 1) + 1, this.cellSize, this.cellSize);
    }

    mousedownHandler(event){
        const coordinates = this.calcCoordinates(event.offsetX, event.offsetY);
        alive.push(coordinates);
        this.fillCell(coordinates.x, coordinates.y);
    }

    mousemoveHandler(event){
        if(event.buttons === 1){
            const coordinates = this.calcCoordinates(event.offsetX, event.offsetY);
            alive.push(coordinates);
            this.fillCell(coordinates.x, coordinates.y);
        }
    }

    setUpListeners(alive, cells) {
        this.mousemoveEvent = this.mousemoveHandler.bind(this);
        this.canvas.addEventListener('mousemove', this.mousemoveEvent);
        this.mousedownEvent = this.mousedownHandler.bind(this);
        this.canvas.addEventListener('mousedown', this.mousedownEvent);
    }

    removeListeners() {
        this.canvas.removeEventListener('mousemove', this.mousemoveEvent);
        this.canvas.removeEventListener('mousedown', this.mousedownEvent);
    }
}

const GOLcanv = new GOLcanvas(5, 'canvas');
let alive = []
GOLcanv.createGrid();
GOLcanv.setUpListeners(alive);




// const fillRect = (x, y, size) => {
//     ctx.fillStyle = '#000000';
//     ctx.fillRect(x,y,size,size);
// }

// const calcCoordinates = (x, y, size) => {
//     return {x: Math.floor(x/size)*size + 1, y: Math.floor(y/size)*size + 1}
// }

// const calcNeighours = (x, y) => {
//     return squares[x+1][y] + squares[x-1][y] + squares[x][y-1] + squares[x][y+1] + squares[x+1][y+1] + squares[x+1][y-1] + squares[x-1][y+1] + squares[x-1][y-1]
// }

// const recalcPainted = () => {
//     painted = painted.filter((square)=>{
//         const neighbours = calcNeighours(square.x, square.y);
//         return (neighbours===2||neighbours===3);
//     })
// }



// const fillMouseMove = (event) => {
//     if(event.buttons === 1) {
//         const coor = calcCoordinates(event.offsetX, event.offsetY, 6);
//         if(squares[(coor.x-1)/6][(coor.y-1)/6] === 0){
//             painted.push({x: (coor.x-1)/6, y: (coor.y-1)/6})
//             fillRect(coor.x, coor.y, 5);
//             squares[(coor.x-1)/6][(coor.y-1)/6] = 1;
//         }
//     }
// }
// canvas.addEventListener('mousemove', fillMouseMove)

// canvas.addEventListener('mousedown', fillMouseMove)

document.getElementById('startBtn').addEventListener('click', (event) => {
    GOLcanv.removeListeners();
})