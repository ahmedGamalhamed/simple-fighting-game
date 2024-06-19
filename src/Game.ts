import { Sprite } from "./Sprite";

export class Game {
  time = 60;
  constructor(public canvasContext: CanvasRenderingContext2D, public player1: Sprite, public player2: Sprite) {
    // console.log(this.player1);
    setInterval(() => {
      this.time -= 1;
    }, 1000);
  }

  init() {
    this.initHealthBars();
    this.initTimer();
    this.checkHits();
  }

  initTimer() {
    this.canvasContext.font = "48px serif";
    this.canvasContext.fillText(this.time + "", this.canvasContext.canvas.width / 2 - 30, 45);
  }

  initHealthBars() {
    const width = this.canvasContext.canvas.width / 2.5;
    this.drawPlayerHealthBar(20, width, this.player1);
    const start2 = this.canvasContext.canvas.width - 20 - width;
    this.drawPlayerHealthBar(start2, width, this.player2);
  }

  drawPlayerHealthBar(x: number, width: number, player: Sprite) {
    // health bar player 1
    this.canvasContext.strokeStyle = "white";
    this.canvasContext.strokeRect(x, 20, width, 20);
    this.canvasContext.fillStyle = player.playerColor;
    this.canvasContext.fillRect(x, 20, width * (player.health / 100), 20);
  }

  checkHits() {
    this.bindHitBox(this.player1, this.player2);
    this.bindHitBox(this.player2, this.player1);
  }

  private bindHitBox(mainPlayer: Sprite, SecondayPlayer: Sprite) {
    const attackBox = mainPlayer.getAttackBox();
    const victimBox = SecondayPlayer.getHitBox();
    if (!mainPlayer.getAttackBox().active) return;
    if (attackBox.rayY >= victimBox.top && attackBox.rayY <= victimBox.bottom) {
      if (attackBox.right >= victimBox.left && attackBox.right <= victimBox.right) {
        SecondayPlayer.sufferHit(1);
      }
      if (attackBox.left <= victimBox.right && attackBox.left >= victimBox.left) {
        SecondayPlayer.sufferHit(-1);
      }
    }
  }
}
