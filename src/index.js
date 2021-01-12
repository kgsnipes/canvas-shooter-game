import "./styles.css";

/*
Description: i am bored, trying to have some fun.

Author : kaushik ganguly

*/

//defines global game constants
//canvas width in pixels
const CANVAS_WIDTH = 300;
//canvas height in pixels
const CANVAS_HEIGHT = 300;
//shooter size in pixels
const SHOOTER_SIZE = 10;
//enemy size in pixels
const ENEMY_SIZE = 10;
//bullet size in pixels
const BULLET_SIZE = 5;
//number of enemies to be created
const ENEMY_LIMIT = 5;
//the pace at which the enemy moves in pixels.
const ENEMY_PACE = 0.35;
//color for the shooter
const SHOOTER_COLOR = "blue";
//color for the enemy
const ENEMY_COLOR = "red";
//color for the bullet
const BULLET_COLOR = "orange";
//travelling pace for the bullet;
const BULLET_PACE = 2;

//defining the enemy
class Enemy {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.hit = false;
  }

  //moving action for the enemy towards the shooter
  moveForward() {
    if (!this.hasReachedTarget()) {
      this.y += ENEMY_PACE;
    }
  }
  // returns the position of the enemy
  getPosition() {
    return { x: this.x, y: this.y };
  }

  //to check if the enemy has reached the target
  hasReachedTarget() {
    return this.y >= CANVAS_HEIGHT - SHOOTER_SIZE;
  }

  // returns if the enemy got hit by the bullet
  isHit() {
    return this.hit;
  }
  //to register the hit on the enemy.
  down() {
    this.hit = true;
  }
}

//defining the bullet
class Bullet {
  constructor(position) {
    this.x = position.x;
    this.y = position.y;
  }

  //the acceleration of the bullet
  moveForward() {
    if (!this.hasReachedBoundary()) this.y -= BULLET_PACE;
  }

  getPosition() {
    return { x: this.x, y: this.y };
  }

  hasReachedBoundary() {
    return this.y < 0;
  }
}

//defining the shooter
class Shooter {
  constructor() {
    //setting initial position to the center of the canvas.
    this.x = CANVAS_WIDTH / 2;
    this.y = CANVAS_HEIGHT - SHOOTER_SIZE;
    this.score = 0;
  }

  move(direction) {
    //checking for boundaries and moving within it.
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

  // shooting a bullet
  shoot() {
    return new Bullet({ x: this.x, y: this.y });
  }

  //adding to score
  incrementScore() {
    this.score++;
  }

  getScore() {
    return this.score;
  }
}

//defining the main game.
class ShootingGame {
  constructor(div) {
    this.container = div;
  }

  init() {
    //creating the shooter.
    this.shooter = new Shooter();
    //list to track the bullets
    this.bullets = [];
    //list to track the enemies
    this.enemies = [];
    //flag to check if the game is over/ if enemy has breached the walls.
    this.gameOver = false;
    //storing the previous random number generated to compare with newly created random number.
    this.prevRandom = 0;
    //flag to store the game pause state
    this.gamePaused = false;
    //initializing dom
    this.initDom();
  }

  //getting a random number that is different from the previous
  getRandomNumber(max) {
    let randomNumber = Math.floor(Math.random() * Math.floor(max));
    if (this.prevRandom !== randomNumber) {
      return randomNumber;
    }
    return this.getRandomNumber(max);
  }

  //initializing the game controls and canvas.
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

    this.instructionsDiv = document.createElement("div");
    this.instructionsDiv.innerHTML =
      " Instructions : Use the right/left arrow to move and space bar to shoot.";

    this.buttonDiv.append(this.gamePauseButton);
    this.buttonDiv.append(this.gameRestartButton);

    this.container.append(this.gameStatus);
    this.container.append(this.score);
    this.container.append(this.buttonDiv);
    this.container.append(this.canvas);
    this.container.append(this.instructionsDiv);

    // creating the enemies
    this.createEnemies();
    //adding event listeners for gaming and
    this.addEventListeners();
    //registering the animation frame rendering
    window.requestAnimationFrame(() => {
      this.draw();
    });
  }

  createEnemies() {
    for (let i = 0; i < ENEMY_LIMIT; i++) {
      this.enemies.push(
        new Enemy(
          this.getRandomNumber(
            (CANVAS_WIDTH - 2 * SHOOTER_SIZE) * Math.random()
          ),
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

        this.updateGameStatus();

        this.updateScore();
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
        bullet.getPosition().y >=
          this.enemies[index].getPosition().y - ENEMY_SIZE &&
        bullet.getPosition().y <= this.enemies[index].getPosition().y
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
  }

  updateGameStatus() {
    if (this.gameOver) {
      this.gameStatus.innerHTML = "Game Over!!!";
    }
  }

  updateScore() {
    this.score.innerHTML = "Score : " + this.shooter.getScore();
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
