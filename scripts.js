`use strict`



class GOLcanvas {
    constructor(cellSize, width, height, canvasId){
        this.cellSize = cellSize;
        this.canvas = document.getElementById(canvasId);
        this.widthPixels = cellSize*width + width + 1;
        this.heightPixels = cellSize*height + height + 1;
        this.canvas.width = this.widthPixels;
        this.canvas.height = this.heightPixels;
        this.ctx = canvas.getContext("2d");
        this.width = canvas.width;
        this.height = canvas.height;
        this.alive = [];
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
        this.alive.push(coordinates);
        this.fillCell(coordinates.x, coordinates.y);
    }

    mousemoveHandler(event){
        if(event.buttons === 1){
            const coordinates = this.calcCoordinates(event.offsetX, event.offsetY);
            this.alive.push(coordinates);
            this.fillCell(coordinates.x, coordinates.y);
        } else if (event.buttons === 2) {
            const coordinates = this.calcCoordinates(event.offsetX, event.offsetY);
            this.alive.push(coordinates);
            [{x: 0, y: 1}, {x: 0, y: -1}].forEach((elem) => {
                const X = coordinates.x + elem.x;
                const Y = coordinates.y + elem.y;
                this.alive.push({x: X, y: Y});
                this.fillCell(X, Y);
            })
            this.fillCell(coordinates.x, coordinates.y);
        }
    }

    fillCellWhite(x, y) {
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillRect(x*(this.cellSize + 1) + 1, y*(this.cellSize + 1) + 1, this.cellSize, this.cellSize);
    }

    gatherInput() {
        this.mousemoveEvent = this.mousemoveHandler.bind(this);
        this.canvas.addEventListener('mousemove', this.mousemoveEvent);
        this.mousedownEvent = this.mousedownHandler.bind(this);
        this.canvas.addEventListener('mousedown', this.mousedownEvent);
    }

    stopGathering() {
        this.canvas.removeEventListener('mousemove', this.mousemoveEvent);
        this.canvas.removeEventListener('mousedown', this.mousedownEvent);
        return this.alive;
    }

    repaint(alive, previouslyAlive) {
        previouslyAlive.forEach((cell) => {
            this.fillCellWhite(cell.x, cell.y);
        })

        alive.forEach((cell) => {
            this.fillCell(cell.x, cell.y);
        });
    }
}


class GOL {
    constructor(width, height, cellSize, canvasId) {
        this.width = width;
        this.height = height;
        this.alive = [];
        this.cells = [];
        this.potentialNewborns = [];
        this.GOLcanv = new GOLcanvas(cellSize, width, height, canvasId);
        this.neighbours = [{x: 0, y: 1}, {x: 0, y: -1}, {x: -1, y: 0}, {x: 1, y: 0}, {x: 1, y: -1}, {x: 1, y: 1}, {x: -1, y: 1}, {x: -1, y: -1}];
        this.GOLcanv.createGrid();
        for(let i = 0; i < this.height; i++){
            this.cells.push(new Array(this.width).fill(0));
        }
    }

    filterCopies(toFilter) {
        let filtered = toFilter;
        filtered = filtered.map((elem) => {
            return JSON.stringify(elem);
        })
        filtered = filtered.filter((elem, index) => {
            return filtered.indexOf(elem) === index;
        })
        filtered = filtered.map((elem) => {
            return JSON.parse(elem);
        })
        return filtered;
    }

    mapAliveToCells() {
        this.alive.forEach((elem) => {
            this.cells[elem.y][elem.x] = 1;
        })
    }

    calcNeighbours(cell) {
        let neighbours = 0;
        this.neighbours.forEach((neighbour) => {
            if(-1 < cell.x + neighbour.x && cell.x + neighbour.x < this.width  && -1 < cell.y + neighbour.y && cell.y + neighbour.y < this.height) {
                neighbours+=this.cells[cell.y + neighbour.y][cell.x + neighbour.x]
            }
        })
        return neighbours;
    }

    checkPotentailNewborns() {
        this.potentialNewborns = [];
        this.alive.forEach((alive) => {
            this.neighbours.forEach((neighbour) => {
                if(-1 < alive.x + neighbour.x && alive.x + neighbour.x < this.width && -1 < alive.y + neighbour.y && alive.y + neighbour.y < this.height) {
                    if(this.cells[alive.y + neighbour.y][alive.x + neighbour.x] === 0) {
                        this.potentialNewborns.push({x: alive.x + neighbour.x, y: alive.y + neighbour.y})
                    }
                }
            })
        })
    }
    

    gameStep(game) {
        const dead = [];
        this.checkPotentailNewborns();
        let newBorns = this.potentialNewborns.filter((cell) => {
            return this.calcNeighbours(cell) === 3;
        });

        const previouslyAlive = this.alive;
        newBorns = this.filterCopies(newBorns);

        this.alive = this.alive.filter((cell) => {
            const neighbours = this.calcNeighbours(cell);
            if(2 <= neighbours && neighbours <= 3){
                return true;
            } else {
                dead.push(cell);
                return false;
            }
        });

        dead.forEach((cell) => {
            this.cells[cell.y][cell.x] = 0;
        });

        newBorns.forEach((cell) => {
            this.cells[cell.y][cell.x] = 1;
        });

        this.alive = this.alive.concat(newBorns);
        if(this.alive.length === 0){
            clearInterval(game);
        }
        
        this.GOLcanv.repaint(this.alive, previouslyAlive);
    }

    start() {

        const gameFunc = () => {
            this.gameStep(game);
        }
        const game = setInterval(gameFunc, 20);
    }

    gatherUserInput() {
        this.GOLcanv.gatherInput([]);
        document.getElementById('startBtn').addEventListener('click', (event) => {
            this.alive = this.GOLcanv.stopGathering();
            this.alive = this.filterCopies(this.alive);
            this.mapAliveToCells();
            console.log(this.alive)
        })
    }

}   




const game = new GOL(300, 300, 2, 'canvas');
game.gatherUserInput();




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

