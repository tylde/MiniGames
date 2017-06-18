// MineSweeperGmae v1.0.0

var TILE = 25;
var TILES_X = 20;
var TILES_Y = 20;

var canvas = document.getElementById('can');
var ctx = canvas.getContext('2d');

var minesAmount = 65;

// ===== CELL ================================================

function Cell(_x, _y) {
    this.x = _x;
    this.y = _y;
    this.minesAround = 0;
    this.isShowed = false;
    this.isMine = false;
    this.isFlagged = false;
}

Cell.prototype.draw = function() {
    if(this.isShowed) {
        ctx.fillStyle = 'lightgray';
        ctx.fillRect(this.x * TILE + 1, this.y * TILE + 1, TILE - 2, TILE - 2);
        
        if(this.isMine) {
            ctx.fillStyle = 'crimson';
            ctx.beginPath();
            ctx.arc(this.x * TILE + TILE / 2, this.y * TILE + TILE / 2, TILE / 4, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
        }
        else {
            if(this.minesAround) {
                ctx.fillStyle = 'black';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.font = 'bold ' + TILE * 0.75 + 'px Arial';
                ctx.fillText(this.minesAround, this.x * TILE + TILE / 2, this.y * TILE + TILE / 2);
            }
        }
    }
    else {
        ctx.fillStyle = 'deepskyblue';
        ctx.fillRect(this.x * TILE + 1, this.y * TILE + 1, TILE - 2, TILE - 2);
        if (this.isFlagged) {
            ctx.fillStyle = 'black';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = 'bold ' + TILE * 0.75 + 'px Arial';
            ctx.fillText('F', this.x * TILE + TILE / 2, this.y * TILE + TILE / 2);
        }
    }
}

Cell.prototype.calculateMinesAround = function() {
    var total= 0;
    for (var offsetX = -1; offsetX <= 1; offsetX++) {
        var i = this.x + offsetX;
        if (i < 0 || i >= TILES_X) continue;
        
        for (var offsetY = -1; offsetY <= 1; offsetY++) {
            var j = this.y + offsetY;
            if (j < 0 || j >= TILES_Y) continue;
                
            if (grid[i][j].isMine) {
                total++;
            }
            
        }
    }
    this.minesAround = total;
}

Cell.prototype.showBlankCells = function () {
    for (var offsetX = -1; offsetX <= 1; offsetX++) {
        var i = this.x + offsetX;
        if (i < 0 || i >= TILES_X) continue;
        
        for (var offsetY = -1; offsetY <= 1; offsetY++) {
            var j = this.y + offsetY;
            if (j < 0 || j >= TILES_Y) continue;
            
            var cell = grid[i][j];
            if (!cell.isMine && !cell.isShowed) {
                cell.isShowed = true;
                if (cell.minesAround == 0) cell.showBlankCells();      
            }
        }
    }
}


// ===== GRID ================================================

var grid = new Array(TILES_X);
for (var i = 0; i < TILES_X; i++) {
    grid[i] = new Array(TILES_Y);
}

for (var i = 0; i < TILES_X; i++) {
    for (var j = 0; j < TILES_Y; j++) {
        grid[i][j] = new Cell(i, j);
    }
}

var totalMines = 0;
while (totalMines < minesAmount) {
    var i = Math.floor(Math.random() * TILES_X);
    var j = Math.floor(Math.random() * TILES_Y);
    grid[i][j].isMine = true;
    
    totalMines = 0;
    for (var i = 0; i < TILES_X; i++) {
        for (var j = 0; j < TILES_Y; j++) {
            if (grid[i][j].isMine) {
                totalMines++;
            }
        }
    }
}

for (var i = 0; i < TILES_X; i++) {
    for (var j = 0; j < TILES_Y; j++) {
        grid[i][j].calculateMinesAround();
    }
}


// ==========================================================

function showCell() {
    var x = event.clientX - this.getBoundingClientRect().left;
    var y = event.clientY - this.getBoundingClientRect().top;
    var tx = Math.floor(x / TILE);
    var ty = Math.floor(y / TILE);
    
    var cell = grid[tx][ty];
    if (!cell.isShowed && !cell.isFlagged) {
        cell.isShowed = true;
        if (cell.isMine) {
            gameOver();
            draw('red');
            return;
        }
        if (cell.minesAround == 0) {
            cell.showBlankCells();
        }
        draw('black');
        isWonGame();
    }
}

function draw(color) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < TILES_X; i++) {
        for (var j = 0; j < TILES_Y; j++) {
            var cell = grid[i][j];
            cell.draw();
        }
    }
}

function gameOver() {
    for (var i = 0; i < TILES_X; i++) {
        for (var j = 0; j < TILES_Y; j++) {
            grid[i][j].isShowed = true;
        }
    }  
}

function isWonGame() {
    var score = 0;
    for (var i = 0; i < TILES_X; i++) {
        for (var j = 0; j < TILES_Y; j++) {
            if (grid[i][j].isShowed) {
                score++;
            }
        }
    }
    if (score == TILES_X * TILES_Y - minesAmount) {
        draw('green');
        return true;
    }
    else {
        return false;
    }
}


// ==========================================================

canvas.oncontextmenu = function ()
{
    var x = event.clientX - this.getBoundingClientRect().left;
    var y = event.clientY - this.getBoundingClientRect().top;
    var tx = Math.floor(x / TILE);
    var ty = Math.floor(y / TILE);
    
    var cell = grid[tx][ty];
    if (!cell.isShowed && !isWonGame()) {
        cell.isFlagged = !cell.isFlagged;
        draw('black');
    }
    
    return false;     
}

//window.addEventListener('oncontextmenu', flagCell);


//canvas.addEventListener();

canvas.addEventListener('click', showCell);
draw('black');




