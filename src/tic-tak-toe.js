//canvas width in pixels
const CANVAS_WIDTH = 300;
//canvas height in pixels
const CANVAS_HEIGHT = 300;

const FONT_SIZE = 25;
const FONT_SIZE_STR = FONT_SIZE + "px serif";

export class TickTakToe {
  constructor(div) {
    this.container = div;
  }

  init() {
    this.gridDrawn = false;
    this.firstPlayer = true;

    this.matrix = ["-1", "-1", "-1", "-1", "-1", "-1", "-1", "-1", "-1"];

    this.boxes = [];

    this.gameOver = false;

    this.winningCombination = [];

    this.initDom();

    //registering the animation frame rendering
    window.requestAnimationFrame(() => {
      this.draw();
    });
  }

  initDom() {
    let self = this;
    this.gameTitle = document.createElement("h3");
    this.gameTitle.innerHTML = "Tic-Tac-Toe";
    this.container.append(this.gameTitle);

    this.playerTurn = document.createElement("h5");
    this.playerTurn.innerHTML = "Player Turn : X";
    this.container.append(this.playerTurn);

    this.canvas = document.createElement("canvas");
    this.canvas.width = CANVAS_WIDTH;
    this.canvas.height = CANVAS_HEIGHT;

    this.context = this.canvas.getContext("2d");
    this.context.scale(1, 1);

    this.container.append(this.canvas);

    this.gameOverText = document.createElement("h5");
    this.gameOverText.innerHTML = "";
    this.container.append(this.gameOverText);

    this.gameRestartButton = document.createElement("button");
    this.gameRestartButton.innerHTML = "Restart";
    this.container.append(this.gameRestartButton);

    this.gameRestartButton.addEventListener("click", () => {
      self.container.replaceChildren();
      self.init();
    });

    this.canvas.addEventListener("click", (evt) => {
      let mousePosition = self.getMousePositionOnCanvas(evt);
      let hitBox = self.checkHit(mousePosition);
      if (
        !self.gameOver &&
        hitBox.index > -1 &&
        self.matrix[hitBox.index] === "-1"
      ) {
        self.context.font = FONT_SIZE_STR;

        let posX = hitBox.box.dimensions.x1;

        let posY = hitBox.box.dimensions.y1;

        let offsetX =
          (hitBox.box.dimensions.x2 - hitBox.box.dimensions.x1) / 2 -
          FONT_SIZE / 2;
        let offsetY = (hitBox.box.dimensions.y2 - hitBox.box.dimensions.y1) / 2;

        posX = posX + offsetX;
        posY = posY + offsetY;

        self.context.fillText(self.firstPlayer ? "X" : "O", posX, posY);

        self.matrix[hitBox.index] = self.firstPlayer ? "1" : "2";
        self.checkForWin();
        if (self.gameOver) {
          self.gameOverText.innerHTML =
            "Game Over!! Winner is " +
            (self.firstPlayer ? "First" : "Second") +
            " player.";
          self.drawWinningMove();
          console.log("Game Over");
        }
        self.firstPlayer = !self.firstPlayer;
        self.playerTurn.innerHTML = self.firstPlayer
          ? "Player Turn : X"
          : "Player Turn : O";
        if (self.gameOver) {
          self.playerTurn.innerHTML = "";
        }
      }
    });
  }

  getMousePositionOnCanvas(event) {
    let rect = this.canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  }

  draw() {
    // let self = this;

    this.drawGrid();
    /* window.requestAnimationFrame(() => {
      self.draw();
    });*/
  }

  drawGrid() {
    if (!this.gridDrawn) {
      let cellWidth = CANVAS_WIDTH / 3;
      let cellHeight = CANVAS_HEIGHT / 3;

      //draw vertical
      let x = cellWidth;
      let y = cellHeight;
      this.context.lineWidth = 2;
      this.context.strokeStyle = "black";
      this.context.beginPath();
      this.context.moveTo(x, 0);
      this.context.lineTo(x, CANVAS_HEIGHT);
      this.context.closePath();
      this.context.stroke();

      x = x + cellWidth;
      this.context.beginPath();
      this.context.moveTo(x, 0);
      this.context.lineTo(x, CANVAS_HEIGHT);
      this.context.closePath();
      this.context.stroke();

      this.context.beginPath();
      this.context.moveTo(0, y);
      this.context.lineTo(CANVAS_WIDTH, y);
      this.context.closePath();
      this.context.stroke();

      y = y + cellHeight;
      this.context.beginPath();
      this.context.moveTo(0, y);
      this.context.lineTo(CANVAS_WIDTH, y);
      this.context.closePath();
      this.context.stroke();

      this.recordBoxes(cellWidth, cellHeight);

      this.gridDrawn = true;
    }
  }

  recordBoxes(cellWidth, cellHeight) {
    let box = 0;
    for (let y = 0; y < CANVAS_HEIGHT; y = y + cellHeight) {
      for (let x = 0; x < CANVAS_WIDTH; x = x + cellWidth) {
        let boxRect = {
          x1: x,
          y1: y,
          x2: x + cellWidth - 1,
          y2: y + cellHeight - 1
        };
        this.boxes.push({ dimensions: boxRect, boxNumber: box });
        box++;
      }
    }
  }

  checkHit(position) {
    let boxIndex = -1;
    let boxObj = {};
    for (let box of this.boxes) {
      if (
        position.x >= box.dimensions.x1 &&
        position.x <= box.dimensions.x2 &&
        position.y >= box.dimensions.y1 &&
        position.y <= box.dimensions.y2
      ) {
        boxIndex = box.boxNumber;
        boxObj = box;
        break;
      }
    }

    return { index: boxIndex, box: boxObj };
  }

  checkForWin() {
    if (
      this.combinationMatches(0, 1, 2) ||
      this.combinationMatches(3, 4, 5) ||
      this.combinationMatches(6, 7, 8) ||
      this.combinationMatches(0, 4, 8) ||
      this.combinationMatches(2, 4, 6) ||
      this.combinationMatches(0, 3, 6) ||
      this.combinationMatches(1, 4, 7) ||
      this.combinationMatches(2, 5, 8)
    ) {
      this.gameOver = true;
    }
  }

  combinationMatches(a, b, c) {
    let isWin =
      this.matrix[a] !== "-1" &&
      this.matrix[a] === this.matrix[b] &&
      this.matrix[a] === this.matrix[c];
    if (isWin) {
      this.winningCombination = [a, b, c];
    }
    return isWin;
  }

  drawWinningMove() {
    let x1 = 0;
    let x2 = 0;
    let y1 = 0;
    let y2 = 0;

    let m = this.winningCombination;

    if (m[0] === 0 && m[2] === 2) {
      x1 = 0;
      y1 = CANVAS_HEIGHT / 8;
      x2 = CANVAS_WIDTH;
      y2 = CANVAS_HEIGHT / 8;
    } else if (m[0] === 0 && m[2] === 6) {
      x1 = CANVAS_WIDTH / 6;
      y1 = 0;
      x2 = CANVAS_WIDTH / 6;
      y2 = CANVAS_HEIGHT;
    } else if (m[0] === 0 && m[2] === 8) {
      x1 = 0;
      y1 = 0;
      x2 = CANVAS_WIDTH;
      y2 = CANVAS_HEIGHT;
    } else if (m[0] === 3 && m[2] === 5) {
      x1 = 0;
      y1 = CANVAS_HEIGHT / 2;
      x2 = CANVAS_WIDTH;
      y2 = CANVAS_HEIGHT / 2;
    } else if (m[0] === 6 && m[2] === 8) {
      x1 = 0;
      y1 = CANVAS_HEIGHT - CANVAS_HEIGHT / 6;
      x2 = CANVAS_WIDTH;
      y2 = CANVAS_HEIGHT - CANVAS_HEIGHT / 6;
    } else if (m[0] === 2 && m[2] === 6) {
      x1 = CANVAS_WIDTH;
      y1 = 0;
      x2 = 0;
      y2 = CANVAS_HEIGHT;
    } else if (m[0] === 1 && m[2] === 7) {
      x1 = CANVAS_WIDTH / 2;
      y1 = 0;
      x2 = CANVAS_WIDTH / 2;
      y2 = CANVAS_HEIGHT;
    } else if (m[0] === 2 && m[2] === 8) {
      x1 = CANVAS_WIDTH - CANVAS_WIDTH / 6;
      y1 = 0;
      x2 = CANVAS_WIDTH - CANVAS_WIDTH / 6;
      y2 = CANVAS_HEIGHT;
    }

    this.context.lineWidth = 2;
    this.context.strokeStyle = "red";
    this.context.beginPath();
    this.context.moveTo(x1, y1);
    this.context.lineTo(x2, y2);
    this.context.closePath();
    this.context.stroke();
  }
}
