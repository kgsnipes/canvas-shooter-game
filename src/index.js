import "./styles.css";

const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 500;
const SHOOTER_SIZE = 10;
const ENEMY_SIZE = 10;
const BULLET_SIZE = 5;
const ENEMY_LIMIT = 5;
const ENEMY_PACE = 0.35;
const SHOOTER_COLOR = "blue";
const ENEMY_COLOR = "red";
const BULLET_COLOR = "orange";

class Enemy {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.hit = false;
  }

  moveForward() {
    if (!this.hasReachedTarget()) {
      this.y += ENEMY_PACE;
    }
  }

  getPosition() {
    return { x: this.x, y: this.y };
  }

  hasReachedTarget() {
    return this.y >= CANVAS_HEIGHT - SHOOTER_SIZE;
  }

  isHit() {
    return this.hit;
  }

  down() {
    this.hit = true;
  }
}

class Bullet {
  constructor(position) {
    this.x = position.x;
    this.y = position.y;
  }

  moveForward() {
    if (!this.hasReachedBoundary()) this.y -= 1;
  }

  getPosition() {
    return { x: this.x, y: this.y };
  }

  hasReachedBoundary() {
    return this.y < 0;
  }
}

class Shooter {
  constructor() {
    this.x = CANVAS_WIDTH / 2;
    this.y = CANVAS_HEIGHT - SHOOTER_SIZE;
    this.score = 0;
  }

  move(direction) {
    if (this.x >= SHOOTER_SIZE && direction === "left") {
      this.x -= SHOOTER_SIZE;
    } else if (
      this.x <= CANVAS_WIDTH - 2 * SHOOTER_SIZE &&
      direction === "right"
    ) {
      this.x += SHOOTER_SIZE;
    }
  }

  getPosition() {
    return { x: this.x, y: this.y };
  }

  shoot() {
    return new Bullet({ x: this.x, y: this.y });
  }

  incrementScore() {
    this.score++;
  }

  getScore() {
    return this.score;
  }
}

class ShootingGame {
  constructor(div) {
    this.container = div;
  }

  init() {
    this.shooter = new Shooter();
    this.bullets = [];
    this.enemies = [];
    this.gameOver = false;
    this.prevRandom = 0;
    this.gamePaused = false;
    this.initDom();
  }

  getRandomInt(max) {
    let randomNumber = Math.floor(Math.random() * Math.floor(max));
    if (this.prevRandom !== randomNumber) {
      return randomNumber;
    }
    return this.getRandomInt(max);
  }

  initDom() {
    this.canvas = document.createElement("canvas");
    this.canvas.id = "shooting-game";
    this.canvas.width = CANVAS_WIDTH;
    this.canvas.height = CANVAS_HEIGHT;

    this.context = this.canvas.getContext("2d");

    this.gameStatus = document.createElement("div");
    this.gameStatus.innerHTML = "Game Started";
    this.score = document.createElement("div");

    this.buttonDiv = document.createElement("div");
    this.gamePauseButton = document.createElement("button");
    this.gamePauseButton.innerHTML = "Pause Game";
    this.gameRestartButton = document.createElement("button");
    this.gameRestartButton.innerHTML = "Restart Game";

    this.buttonDiv.append(this.gamePauseButton);
    this.buttonDiv.append(this.gameRestartButton);

    this.container.append(this.gameStatus);
    this.container.append(this.score);
    this.container.append(this.buttonDiv);
    this.container.append(this.canvas);

    this.createEnemies();
    this.addEventListeners();
    window.requestAnimationFrame(() => {
      this.draw();
    });
  }

  createEnemies() {
    for (let i = 0; i < ENEMY_LIMIT; i++) {
      this.enemies.push(
        new Enemy(
          this.getRandomInt((CANVAS_WIDTH - 2 * SHOOTER_SIZE) * Math.random()),
          0
        )
      );
    }
  }

  addEventListeners() {
    let self = this;
    this.gamePauseButton.addEventListener("click", () => {
      self.gamePaused = !self.gamePaused;
    });

    this.gameRestartButton.addEventListener("click", () => {
      self.container.replaceChildren();
      self.init();
    });
    document.addEventListener("keydown", (evt) => {
      if (evt.keyCode === 37) {
        self.shooter.move("left");
      } else if (evt.keyCode === 39) {
        //right
        self.shooter.move("right");
      } else if (evt.keyCode === 32) {
        //space
        self.bullets.push(self.shooter.shoot());
      }
    });
  }

  draw() {
    let self = this;

    if (!this.gamePaused) {
      if (!this.gameOver) {
        this.context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        this.drawShooter();

        this.drawBullets();

        this.drawEnemies();

        this.detectHits();

        this.purgeBullets();

        this.detectGameOver();
      } else {
      }
    }

    window.requestAnimationFrame(() => {
      self.draw();
    });
  }

  detectHits() {
    for (let bullet of this.bullets) {
      let enemiesHit = this.hasEnemyHits(bullet);
      if (enemiesHit) {
        for (let en of enemiesHit) {
          this.enemies.splice(en, 1);
          this.shooter.incrementScore();
        }
      }
    }
  }

  hasEnemyHits(bullet) {
    let hits = [];

    for (let index in this.enemies) {
      if (
        bullet.getPosition().x >= this.enemies[index].getPosition().x &&
        bullet.getPosition().x <=
          this.enemies[index].getPosition().x + ENEMY_SIZE &&
        bullet.getPosition().y === this.enemies[index].getPosition().y
      ) {
        hits.push(index);
        this.enemies[index].down();
      }
    }

    return hits;
  }

  drawShooter() {
    //draw the shooter
    this.context.fillStyle = SHOOTER_COLOR;
    this.context.fillRect(
      this.shooter.getPosition().x,
      this.shooter.getPosition().y,
      SHOOTER_SIZE,
      SHOOTER_SIZE
    );
  }

  drawBullets() {
    this.context.fillStyle = BULLET_COLOR;
    for (let bullet of this.bullets) {
      bullet.moveForward();
      this.context.fillRect(
        bullet.getPosition().x,
        bullet.getPosition().y,
        BULLET_SIZE,
        BULLET_SIZE
      );
    }
  }

  drawEnemies() {
    if (this.enemies.length === 0) {
      this.createEnemies();
    }
    this.context.fillStyle = ENEMY_COLOR;
    for (let enemy of this.enemies) {
      if (!enemy.isHit()) {
        enemy.moveForward();
        this.context.fillRect(
          enemy.getPosition().x,
          enemy.getPosition().y,
          ENEMY_SIZE,
          ENEMY_SIZE
        );
      }
    }
  }

  purgeBullets() {
    for (let bullet in this.bullets) {
      if (this.bullets[bullet].hasReachedBoundary()) {
        this.bullets.splice(bullet, 1);
      }
    }
  }

  detectGameOver() {
    for (let enemy in this.enemies) {
      if (this.enemies[enemy].hasReachedTarget()) {
        this.gameOver = true;
        break;
      }
    }

    if (this.gameOver) {
      this.gameStatus.innerHTML = "Game Over!!!";
    }

    this.score.innerHTML = "Score " + this.shooter.getScore();
  }

  getBullets() {
    return this.bullets;
  }

  getEnemies() {
    return this.enemies;
  }

  getShooter() {
    return this.shooter;
  }
}

let shootingGame = new ShootingGame(document.getElementById("app"));
document.shootingGame = shootingGame;
shootingGame.init();
