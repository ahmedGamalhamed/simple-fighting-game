interface ICropObj {
  x: number;
  y: number;
  width: number;
  height: number;
  sections: number;
}

export class Picture {
  public image: HTMLImageElement;
  private currentFrame = 0;
  private framesAnimated = 0;
  private animateEveryFrameCount = 15;

  constructor(public src: string, public size?: { width: number; height: number }, public scale = 1) {
    this.image = new Image();
    this.image.src = src;
    if (!this.size) {
      this.size = {
        width: this.image.width,
        height: this.image.height,
      };
    }
    this.size.width *= this.scale;
    this.size.height *= this.scale;
  }

  animate(cropObj: ICropObj) {
    this.framesAnimated++;
    cropObj.x! = (cropObj.width! / cropObj.sections!) * this.currentFrame;
    if (this.framesAnimated % this.animateEveryFrameCount == 0) {
      this.currentFrame++;
    }
    if (this.currentFrame == cropObj.sections) {
      this.currentFrame = 0;
    }
  }

  draw(context: CanvasRenderingContext2D, position = { x: 0, y: 0 }, crop?: Partial<ICropObj>) {
    let cropObj = { x: 0, y: 0, width: this.image.width, height: this.image.height, sections: 1, ...crop };
    if (cropObj.sections > 1) {
      this.animate(cropObj);
    }
    context.drawImage(
      this.image,
      cropObj.x,
      cropObj.y,
      cropObj.width / cropObj.sections,
      cropObj.height,
      position.x,
      position.y,
      this.size!.width / cropObj.sections,
      this.size!.height
    );
  }
}
