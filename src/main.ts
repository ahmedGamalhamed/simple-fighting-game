import "./style.css";
import { Sprite } from "./Sprite";
import { Game } from "./Game";

const canvas = document.querySelector("canvas")!;
const ctx = canvas?.getContext("2d")!;

canvas.width = 1024;
canvas.height = 576;

ctx.fillRect(0, 0, canvas.width, canvas.height);

const player1 = new Sprite(canvas, "red");
const player2 = new Sprite(canvas, "blue", { x: canvas.width - Sprite.width, y: 0 }, -1);

function bindEvent(eventName: "keydown" | "keyup", fun: "move" | "stop") {
  window.addEventListener(eventName, (e) => {
    switch (e.code.toLowerCase()) {
      case "keya":
        player1[fun]("l");
        break;
      case "keyd":
        player1[fun]("r");
        break;
      case "keyw":
        player1[fun]("u");
        break;
      case "arrowleft":
        player2[fun]("l");
        break;
      case "arrowright":
        player2[fun]("r");
        break;
      case "arrowup":
        player2[fun]("u");
        break;
    }
  });
}

bindEvent("keydown", "move");
bindEvent("keyup", "stop");

const game = new Game(player1, player2);

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  player1.update();
  player2.update();
  game.checkHits();
  requestAnimationFrame(animate);
}

animate();
