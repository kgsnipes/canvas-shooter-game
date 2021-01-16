//canvas width in pixels
const CANVAS_WIDTH = 300;
//canvas height in pixels
const CANVAS_HEIGHT = 300;

const FONT_SIZE = "20px serif";

export class TickTakToe {
  constructor(div) {
    this.container = div;
  }

  init() {
    this.gridDrawn = false;
    this.firstPlayer = true;

    this.matrix = [-1, -1, -1, -1, -1, -1, -1, -1, -1];

    this.boxes = [];

    this.gameOver = false;

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

    this.canvas = document.createElement("canvas");
    this.canvas.width = CANVAS_WIDTH;
    this.canvas.height = CANVAS_HEIGHT;

    this.context = this.canvas.getContext("2d");

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
      if (hitBox.index > -1 && self.matrix[hitBox.index] === -1) {
        self.context.font = FONT_SIZE;
        self.context.fillText(
          self.firstPlayer ? "X" : "O",
          hitBox.box.dimensions.x1 +
            (hitBox.box.dimensions.x2 - hitBox.box.dimensions.x1) / 2,
          hitBox.box.dimensions.y1 +
            (hitBox.box.dimensions.y2 - hitBox.box.dimensions.y1) / 2
        );
        self.matrix[hitBox.index] = self.firstPlayer ? 1 : 2;
        self.checkForWin();
        if (self.gameOver) {
          self.gameOverText.innerHTML =
            "Game Over!! Winner is " +
            (self.firstPlayer ? "First" : "Second") +
            " player.";
          console.log("Game Over");
        }
        self.firstPlayer = !self.firstPlayer;
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
    let self = this;

    this.drawGrid();
    window.requestAnimationFrame(() => {
      self.draw();
    });
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
    console.log("position", position);
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
    let m = this.matrix;
    if (
      (m[0] == m[1]) == m[2] ||
      (m[3] == m[4]) == m[5] ||
      (m[6] == m[7]) == m[8] ||
      (m[0] == m[4]) == m[8] ||
      (m[2] == m[4]) == m[6] ||
      (m[0] == m[3]) == m[6] ||
      (m[1] == m[4]) == m[7] ||
      (m[2] == m[5]) == m[8]
    ) {
      this.gameOver = true;
    }
  }
}
