export class Sprite {
  static width = 50;
  static height = 150;
  public canvasContext: CanvasRenderingContext2D;
  private attackBox = {
    x: 0,
    y: 0,
    width: 100,
    height: 20,
  };
  private gravity = 0.6;
  private jumpFactor = 30;
  private speed = 2;
  private pressedKeys = {
    l: false,
    r: false,
    u: false,
  };

  constructor(public canvas: HTMLCanvasElement, public playerColor: string, public position = { x: 0, y: 0 }, private direction: 1 | -1 | 0 = 0, public velocity = { x: 0, y: 0 }) {
    this.canvasContext = canvas.getContext("2d")!;
    this.updateAttackBox();
  }

  updateAttackBox() {
    this.attackBox.x = this.position.x + Sprite.width;
    if (this.direction == -1) this.attackBox.x = this.position.x - this.attackBox.width;
    this.attackBox.y = this.position.y;
  }

  getHitBox() {
    return {
      left: this.position.x,
      right: this.position.x + Sprite.width,
      top: this.position.y,
      bottom: this.position.y + Sprite.height,
    };
  }

  getAttackBox() {
    const box = {
      left: this.attackBox.x,
      right: this.attackBox.x + this.attackBox.width,
      top: this.attackBox.y,
      bottom: this.attackBox.y + this.attackBox.height,
      rayY: 0,
    };
    box.rayY = (box.bottom + box.top) / 2;
    return box;
  }

  updateVelocity() {
    if (this.pressedKeys.l) {
      this.velocity.x = -this.speed;
      this.direction = -1;
    } else if (this.pressedKeys.r) {
      this.velocity.x = this.speed;
      this.direction = 1;
    } else {
      this.velocity.x = 0;
    }

    if (this.pressedKeys.u && this.position.y + Sprite.height >= this.canvas.height) {
      this.velocity.y = this.gravity * -this.jumpFactor;
    }

    if (this.position.y + Sprite.height + this.velocity.y < this.canvas.height) this.velocity.y += this.gravity;
    else this.velocity.y = 0;
  }

  updatePosition() {
    this.position.y += this.velocity.y;
    this.position.x += this.velocity.x;
    this.updateAttackBox();
  }

  draw() {
    this.canvasContext.fillStyle = this.playerColor;
    this.canvasContext.fillRect(this.position.x, this.position.y, Sprite.width, Sprite.height);

    this.canvasContext.fillStyle = "green";
    this.canvasContext.fillRect(this.attackBox.x, this.attackBox.y, this.attackBox.width, this.attackBox.height);
  }

  update() {
    this.updateVelocity();
    this.updatePosition();
    this.draw();
  }

  move(direction: "l" | "r" | "u") {
    switch (direction) {
      case "l":
        this.pressedKeys.l = true;
        this.pressedKeys.r = false;
        break;
      case "r":
        this.pressedKeys.r = true;
        this.pressedKeys.l = false;
        break;
      case "u":
        this.pressedKeys.u = true;
        break;
    }
  }

  stop(direction: "l" | "r" | "u") {
    switch (direction) {
      case "l":
        this.pressedKeys.l = false;
        break;
      case "r":
        this.pressedKeys.r = false;
        break;
      case "u":
        this.pressedKeys.u = false;
        break;
    }
  }
}
