import "./styles.css";
import { ShootingGame } from "./shooting_game";
import { TickTakToe } from "./tic-tak-toe";

/*let shootingGame = new ShootingGame(document.getElementById("app"));
document.shootingGame = shootingGame;
document.shootingGame.init();
*/

let tictaktoe = new TickTakToe(document.getElementById("app"));
document.tictaktoe = tictaktoe;
document.tictaktoe.init();
