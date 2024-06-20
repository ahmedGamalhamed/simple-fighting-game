import "./style.css";
import { Player } from "./Player";
import { Game } from "./Game";
import { Picture } from "./Picture";
import { Utils } from "./Utils";

const canvas = document.querySelector("canvas")!;
const ctx = canvas?.getContext("2d")!;

canvas.width = 1024;
canvas.height = 576;

ctx.fillRect(0, 0, canvas.width, canvas.height);

const player1 = new Player(canvas, { imageSrc: "/player1_idle.png", chunks: 3, animate: true, animateEvery: 30 }, "wasd", { x: 100, y: 0 });
const player2 = new Player(
  canvas,
  { imageSrc: "/player2_idle.png", chunks: 3, animate: true, animateEvery: 30 },
  "arrows",
  { x: canvas.width - Player.initailWidth - 100, y: 0 },
  -1
);

const game = new Game(ctx, player1, player2);
const backgroundImage = new Picture("/bg.png");
const shopImage = new Picture("/shop.png", undefined, 2);

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  backgroundImage.draw(ctx);
  shopImage.draw(ctx, { x: 720, y: 298 }, { chunks: 6, animate: true });
  game.init();
  requestAnimationFrame(animate);
}

animate();
