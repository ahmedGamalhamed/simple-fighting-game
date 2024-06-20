import "./style.css";
import { Player } from "./Player";
import { Game } from "./Game";
import { Picture } from "./Picture";

const canvas = document.querySelector("canvas")!;
const ctx = canvas?.getContext("2d")!;

canvas.width = 1024;
canvas.height = 576;

ctx.fillRect(0, 0, canvas.width, canvas.height);

const player1 = new Player(canvas, "red");
const player2 = new Player(canvas, "blue", { x: canvas.width - Player.initailWidth, y: 0 }, -1);

function bindEvent(eventName: "keydown" | "keyup", fun: "setInteract" | "stopInteract") {
  window.addEventListener(eventName, (e) => {
    switch (e.code.toLowerCase()) {
      // player1
      case "keya":
        player1[fun]("l");
        break;
      case "keyd":
        player1[fun]("r");
        break;
      case "keyw":
        player1[fun]("u");
        break;
      case "space":
        player1[fun]("f");
        break;

      // player2
      case "arrowleft":
        player2[fun]("l");
        break;
      case "arrowright":
        player2[fun]("r");
        break;
      case "arrowup":
        player2[fun]("u");
        break;
      case "numpad0":
        player2[fun]("f");
        break;
    }
  });
}

bindEvent("keydown", "setInteract");
bindEvent("keyup", "stopInteract");

const game = new Game(ctx, player1, player2);
const backgroundImage = new Picture("/bg.png");
const shopImage = new Picture("/shop.png", undefined, 2);

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  backgroundImage.draw(ctx);
  shopImage.draw(ctx, { x: 720, y: 298 }, { sections: 6 });
  game.init();
  requestAnimationFrame(animate);
}

animate();
