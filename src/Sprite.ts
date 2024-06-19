export class Sprite {
  static initailWidth = 50;
  public width = Sprite.initailWidth;
  public height = 150;
  public canvasContext: CanvasRenderingContext2D;
  public health = 100;
  public isDead = false;
  private attackBox = {
    x: 0,
    y: 0,
    width: 100,
    height: 20,
    active: false,
  };

  private gravity = 0.6;
  private jumpFactor = 30;
  private speed = 2;
  private pressedKeys = {
    l: false,
    r: false,
    u: false,
  };
  private attackDuration = 100;
  private hitThrottle = false;
  private fireThrottle = false;
  private fireThrottleDuration = 500;

  constructor(public canvas: HTMLCanvasElement, public playerColor: string, public position = { x: 0, y: 0 }, private direction: 1 | -1 | 0 = 0, public velocity = { x: 0, y: 0 }) {
    this.canvasContext = canvas.getContext("2d")!;
    this.updateAttackBox();
  }

  updateAttackBox() {
    this.attackBox.x = this.getHitBox().right;
    if (this.direction == -1) this.attackBox.x = this.position.x - this.attackBox.width;
    this.attackBox.y = this.position.y;
  }

  getHitBox() {
    return {
      left: this.position.x,
      right: this.position.x + this.width,
      top: this.position.y,
      bottom: this.position.y + this.height,
    };
  }

  getAttackBox() {
    const box = {
      ...this.attackBox,
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

    if (this.pressedKeys.u && this.position.y + this.height >= this.canvas.height) {
      this.velocity.y = this.gravity * -this.jumpFactor;
    }

    if (this.position.y + this.height + this.velocity.y < this.canvas.height) this.velocity.y += this.gravity;
    else this.velocity.y = 0;
  }

  updatePosition() {
    this.position.y += this.velocity.y;
    this.position.x += this.velocity.x;
    const hitBox = this.getHitBox();
    if (hitBox.left <= 0) this.position.x = 0;
    if (hitBox.right >= this.canvas.width) this.position.x = this.canvas.width - this.width;
    this.updateAttackBox();
  }

  draw() {
    // fill player
    this.canvasContext.fillStyle = this.playerColor;
    this.canvasContext.fillRect(this.position.x, this.position.y, this.width, this.height);

    // fill player eye
    if (!this.isDead) {
      const hitBox = this.getHitBox();
      this.canvasContext.fillStyle = "green";
      this.canvasContext.beginPath();
      let eyePosition = (hitBox.left + hitBox.right) / 2;
      if (this.direction == 1) {
        eyePosition = hitBox.right - 10;
      } else if (this.direction == -1) {
        eyePosition = hitBox.left + 10;
      }
      this.canvasContext.arc(eyePosition, hitBox.top + 10, 10, 0, 2 * Math.PI);
      this.canvasContext.fill();
    }

    // fill player attack box
    this.canvasContext.fillStyle = "green";
    if (this.attackBox.active) this.canvasContext.fillRect(this.attackBox.x, this.attackBox.y, this.attackBox.width, this.attackBox.height);
  }

  update() {
    this.updateVelocity();
    this.updatePosition();
    this.draw();
  }

  sufferHit(direction: 1 | -1) {
    if (this.hitThrottle) return;
    this.hitThrottle = true;
    this.position.x += 50 * direction;
    this.health -= 20;
    console.log("Ouch", this.health);
    if (this.health <= 0) {
      this.die();
    }
    setTimeout(() => {
      this.hitThrottle = false;
    }, this.attackDuration);
  }

  die() {
    [this.width, this.height] = [this.height, this.width];
    this.isDead = true;
  }

  setInteract(type: "l" | "r" | "u" | "f") {
    if (this.isDead) return;
    switch (type) {
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
      case "f":
        if (this.fireThrottle) return;
        this.fireThrottle = true;
        this.attackBox.active = true;
        setTimeout(() => {
          this.attackBox.active = false;
        }, this.attackDuration);

        setTimeout(() => {
          this.fireThrottle = false;
        }, this.fireThrottleDuration);
        break;
    }
  }

  stopInteract(type: "l" | "r" | "u" | "f") {
    switch (type) {
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
