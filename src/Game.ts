import { Sprite } from "./Sprite";

export class Game {
  private hitPositionJump = 50;

  constructor(public player1: Sprite, public player2: Sprite) {
    // console.log(this.player1);
  }

  bindHitBox(player1: Sprite, player2: Sprite) {
    const hitBox1 = player1.getHitBox();
    const hitBox2 = player2.getHitBox();
    const attackBox1 = player1.getAttackBox();
    if (attackBox1.rayY >= hitBox2.top && attackBox1.rayY <= hitBox1.bottom) {
      if (attackBox1.right >= hitBox2.left && attackBox1.right <= hitBox2.right) {
        player2.position.x += this.hitPositionJump;
      }
      if (attackBox1.left <= hitBox2.right && attackBox1.left >= hitBox2.left) {
        player2.position.x -= this.hitPositionJump;
      }
    }
  }

  checkHits() {
    this.bindHitBox(this.player1, this.player2);
    this.bindHitBox(this.player2, this.player1);
  }
}
