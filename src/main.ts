import "./style.css";
import { Player } from "./Player";
import { Game } from "./Game";
import { Picture } from "./Picture";

//preload background
const img = new Image();
img.src = "/bg.png";

img.onload = () => {
  const canvas = document.querySelector("canvas")!;
  const ctx = canvas?.getContext("2d")!;

  canvas.width = 1024;
  canvas.height = 576;

  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const player1 = new Player(
    canvas,
    {
      imageSrc: "/player1/Idle.png",
      offset: { x: -300, y: -260 },
      chunks: 8,
      animate: true,
      animateEvery: 15,
      states: {
        idle: {
          src: "/player1/Idle.png",
          rtlSrc: "/player1/Idle-rtl.png",
          start: 0,
          count: 8,
        },
        move: {
          src: "/player1/Run.png",
          rtlSrc: "/player1/Run-rtl.png",
          start: 0,
          count: 8,
        },
        attack: {
          src: "/player1/Attack1.png",
          rtlSrc: "/player1/Attack1-rtl.png",
          start: 0,
          count: 8,
        },
        hit: {
          src: "/player1/hit.png",
          rtlSrc: "/player1/hit-rtl.png",
          start: 0,
          count: 3,
        },
      },
    },
    "wasd",
    { x: 100, y: 0 }
  );
  const player2 = new Player(
    canvas,
    {
      imageSrc: "/player2/Idle.png",
      offset: { x: -150, y: -100 },
      chunks: 8,
      animate: true,
      animateEvery: 15,
      states: {
        idle: {
          src: "/player2/Idle.png",
          rtlSrc: "/player2/Idle-rtl.png",
          start: 0,
          count: 8,
        },
        move: {
          src: "/player2/Run.png",
          rtlSrc: "/player2/Run-rtl.png",
          start: 0,
          count: 8,
        },
        attack: {
          src: "/player2/Attack.png",
          rtlSrc: "/player2/Attack-rtl.png",
          start: 0,
          count: 8,
          offset: {
            x: 90,
          },
        },
        hit: {
          src: "/player2/hit.png",
          rtlSrc: "/player2/hit-rtl.png",
          start: 0,
          count: 4,
        },
      },
    },
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
};
