//canvas width in pixels
const CANVAS_WIDTH = 300;
//canvas height in pixels
const CANVAS_HEIGHT = 300;

export class TickTakToe {
  constructor(div) {
    this.container = div;
  }

  init() {
    this.gameTitle = document.createElement("h3");
    this.gameTitle.innerHTML = "Tic-Tac-Toe";
    this.container.append(this.gameTitle);

    this.canvas = document.createElement("canvas");
    this.canvas.width = CANVAS_WIDTH;
    this.canvas.height = CANVAS_HEIGHT;

    this.context = this.canvas.getContext("2d");

    this.container.append(this.canvas);

    this.gridDrawn = false;

    this.firstPlayer = true;

    this.matrix = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ];

    //registering the animation frame rendering
    window.requestAnimationFrame(() => {
      this.draw();
    });
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

      let boxes = 1;
      for (let y = 0; y < CANVAS_HEIGHT; y = y + cellHeight) {
        for (let x = 0; x < CANVAS_WIDTH; x = x + cellWidth) {
          this.context.fillStyle = "blue";
          this.context.fillRect(x, y, cellWidth - 1, cellHeight - 1);
          console.log("box", boxes);

          boxes++;
        }
      }

      this.gridDrawn = true;
    }
  }
}
