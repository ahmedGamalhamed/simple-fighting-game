import { Player } from "./Player";

export class Game {
  static floorY = 0;
  static floorHeight = 20;

  time = 10;
  constructor(public canvasContext: CanvasRenderingContext2D, public player1: Player, public player2: Player) {
    // console.log(this.player1);
    Game.floorY = this.canvasContext.canvas.height - Game.floorHeight;
    const interval = setInterval(() => {
      // this.time -= 1;
      if (this.time == 0) clearInterval(interval);
    }, 1000);
  }

  init() {
    this.drawTimer();
    this.drawHealthBars();
    if (this.time > 0) {
      this.drawHealthBars();
      this.checkHits();
      this.player1.update();
      this.player2.update();
    } else {
      let status = "It's a tie";
      if (this.player1.health > this.player2.health) status = "Player 1 Wins!";
      else if (this.player2.health > this.player1.health) status = "Player 2 Wins!";
      this.canvasContext.fillStyle = "white";
      this.canvasContext.fillText(status, this.canvasContext.canvas.width / 2 - 100, this.canvasContext.canvas.height / 2 + 30);
    }
  }

  drawTimer() {
    this.canvasContext.font = "48px serif";
    this.canvasContext.fillText(this.time + "", this.canvasContext.canvas.width / 2 - 15, 45);
  }

  drawHealthBars() {
    const width = this.canvasContext.canvas.width / 2.5;
    this.drawPlayerHealthBar(20, width, this.player1);
    const start2 = this.canvasContext.canvas.width - 20 - width;
    this.drawPlayerHealthBar(start2, width, this.player2);
  }

  drawPlayerHealthBar(x: number, width: number, player: Player) {
    // health bar player 1
    this.canvasContext.strokeStyle = "white";
    this.canvasContext.strokeRect(x, 20, width, 20);
    this.canvasContext.fillStyle = "green";
    if (player.health <= 60) this.canvasContext.fillStyle = "yellow";
    if (player.health <= 20) this.canvasContext.fillStyle = "red";
    this.canvasContext.fillRect(x, 20, width * (player.health / 100), 20);
  }

  checkHits() {
    this.bindHitBox(this.player1, this.player2);
    this.bindHitBox(this.player2, this.player1);
  }

  private bindHitBox(mainPlayer: Player, SecondayPlayer: Player) {
    const mainAttackBox = mainPlayer.getAttackBox();
    const victimHitBox = SecondayPlayer.getHitBox();
    if (!mainPlayer.getAttackBox().active) return;
    if (mainAttackBox.rayY >= victimHitBox.top && mainAttackBox.rayY <= victimHitBox.bottom) {
      if (mainAttackBox.right >= victimHitBox.left && mainAttackBox.right <= victimHitBox.right) {
        SecondayPlayer.takeHit(1);
      }
      if (mainAttackBox.left <= victimHitBox.right && mainAttackBox.left >= victimHitBox.left) {
        SecondayPlayer.takeHit(-1);
      }
    }
  }
}
