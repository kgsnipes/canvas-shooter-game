import "./styles.css";
import { ShootingGame } from "./game";

let shootingGame = new ShootingGame(document.getElementById("app"));
document.shootingGame = shootingGame;
document.shootingGame.init();
