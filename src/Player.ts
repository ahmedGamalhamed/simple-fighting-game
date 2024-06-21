import { Game } from "./Game";
import { Picture } from "./Picture";

interface IStates {
  idle?: {
    src: string;
    start: number;
    count: number;
  };
  move?: {
    src: string;
    start: number;
    count: number;
  };
  attack?: {
    src: string;
    start: number;
    count: number;
  };
  hit?: {
    src: string;
    start: number;
    count: number;
  };
  dead?: {
    src: string;
    start: number;
    count: number;
  };
}

export class Player {
  static initailWidth = 50;

  // public
  public width = Player.initailWidth;
  public height = 160;
  public canvasContext: CanvasRenderingContext2D;
  public health = 100;
  public isDead = false;

  // private
  private playerPicture: null | Picture = null;
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
  private attackDuration = 800;
  private hitDuration = 500;
  private canGetHit = false;
  private attckThrottle = false;
  private states: IStates = {};
  public currentState: keyof IStates = "idle";

  constructor(
    public canvas: HTMLCanvasElement,
    public playerShape: { color?: string; imageSrc?: string; offset?: { x: number; y: number }; chunks?: number; animate?: boolean; animateEvery?: number; states?: IStates },
    public controls: "wasd" | "arrows" = "wasd",
    public position = { x: 0, y: 0 },
    public direction: 1 | -1 | 0 = 0,
    public velocity = { x: 0, y: 0 }
  ) {
    this.canvasContext = canvas.getContext("2d")!;
    this.updateAttackBox();
    if ("imageSrc" in this.playerShape) {
      this.playerPicture = new Picture(this.playerShape.imageSrc!, undefined, 2.5);
      if ("states" in this.playerShape) {
        this.states = this.playerShape.states!;
      }
    }
    this.bindKeyboardEvents();
  }

  updateAttackBox() {
    this.attackBox.x = this.getHitBox().right;
    if (this.direction == -1) this.attackBox.x = this.position.x - this.attackBox.width;
    this.attackBox.y = this.position.y;
  }

  getHitBox() {
    return {
      left: Math.floor(this.position.x),
      right: Math.floor(this.position.x + this.width),
      top: Math.floor(this.position.y),
      bottom: Math.floor(this.position.y + this.height),
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

    if (this.pressedKeys.u && this.position.y + this.height >= Game.floorY) {
      this.velocity.y = this.gravity * -this.jumpFactor;
    }

    if (this.position.y + this.height + this.velocity.y < Game.floorY) this.velocity.y += this.gravity;
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

    if ("imageSrc" in this.playerShape) {
      this.animate();
    } else if ("color" in this.playerShape) {
      this.canvasContext.fillStyle = this.playerShape.color!;
      this.canvasContext.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

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

  takeHit(direction: 1 | -1) {
    if (this.canGetHit) return;

    this.canGetHit = true;
    this.position.x += 100 * direction;
    this.health -= 20;
    if (this.health <= 0) {
      this.die();
    }
    this.currentState = "hit";
    setTimeout(() => {
      this.currentState = "idle";
      this.canGetHit = false;
    }, this.hitDuration);
  }

  die() {
    // [this.width, this.height] = [this.height, this.width];
    this.isDead = true;
  }

  attack() {
    if (this.attckThrottle) return;
    this.attckThrottle = true;
    this.attackBox.active = true;
    setTimeout(() => {
      this.currentState = "idle";
      this.attackBox.active = false;
      this.attckThrottle = false;
    }, this.attackDuration);
  }

  private animate() {
    const state = this.states[this.currentState];
    if (!this.playerShape.animate || !state) return;
    if (this.playerPicture?.image) {
      this.playerPicture.updateSrc(state.src);
    }
    this.playerPicture!.draw(
      this.canvasContext,
      { x: this.position.x + (this.playerShape?.offset?.x || 0), y: this.position.y + (this.playerShape?.offset?.y || 0) },
      {
        ...this.playerShape,
        chunks: state.count,
        startChunk: state.start,
        chunksToAnimate: state.count,
      }
    );
  }

  private updatePlayerState(type: keyof IStates) {
    if (this.currentState == "attack") return;
    if (Object.values(this.pressedKeys).includes(true) && type == "idle") return;
    this.currentState = type;
  }

  private setInteract(type: "l" | "r" | "u" | "f") {
    if (this.isDead) return;
    let newState: keyof IStates = "move";
    switch (type) {
      case "l":
        this.pressedKeys.l = true;
        break;
      case "r":
        this.pressedKeys.r = true;
        break;
      case "u":
        this.pressedKeys.u = true;
        break;
      case "f":
        newState = "attack";
        this.attack();
        break;
    }
    this.updatePlayerState(newState);
  }

  private stopInteract(type: "l" | "r" | "u" | "f") {
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
    this.updatePlayerState("idle");
  }

  private bindKeyboardEvents() {
    const trigger = (e: KeyboardEvent, cb: Function) => {
      // trigger movment
      const code = e.code.toLowerCase();
      if (this.controls == "wasd") {
        switch (code) {
          // player1
          case "keya":
            cb("l");
            break;
          case "keyd":
            cb("r");
            break;
          case "keyw":
            cb("u");
            break;
          case "space":
            cb("f");
            break;
        }
      } else if (this.controls == "arrows") {
        switch (code) {
          // player2
          case "arrowleft":
            cb("l");
            break;
          case "arrowright":
            cb("r");
            break;
          case "arrowup":
            cb("u");
            break;
          case "numpad0":
            cb("f");
            break;
        }
      }
    };

    window.addEventListener("keydown", (e: KeyboardEvent) => {
      trigger(e, this.setInteract.bind(this));
    });

    window.addEventListener("keyup", (e: KeyboardEvent) => {
      trigger(e, this.stopInteract.bind(this));
    });
  }
}
