interface ICropObj {
  animate?: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  chunks?: number;
  chunksToAnimate?: number;
  animateEvery?: number;
  startChunk?: number;
}

export class Picture {
  public image: HTMLImageElement;
  private currentFrame = 0;
  private framesAnimated = 0;
  private animateEvery = 15;

  constructor(src: string, public size?: { width: number; height: number }, public scale = 1) {
    this.image = new Image();
    this.updateSrc(src);
  }

  updateSrc(src: string) {
    this.image.src = src;
    this.size = {
      width: this.image.width,
      height: this.image.height,
    };
    this.size.width *= this.scale;
    this.size.height *= this.scale;
  }

  animate(cropObj: ICropObj) {
    this.framesAnimated++;
    const chunkSize = cropObj.width! / cropObj.chunks!;
    const chunkStart = this.currentFrame + cropObj.startChunk!;
    cropObj.x! = chunkSize * chunkStart;
    if (cropObj.animate && this.framesAnimated % this.animateEvery == 0) {
      this.currentFrame++;
    }
    if (this.currentFrame >= cropObj.chunksToAnimate!) {
      this.currentFrame = 0;
    }
  }

  draw(context: CanvasRenderingContext2D, position = { x: 0, y: 0 }, crop?: Partial<ICropObj>) {
    let cropObj = { x: 0, y: 0, width: this.image.width, height: this.image.height, chunks: 1, startChunk: 0, chunksToAnimate: 0, animate: false, ...crop };
    if (cropObj.animateEvery) this.animateEvery = cropObj.animateEvery;
    if (!cropObj.chunksToAnimate) cropObj.chunksToAnimate = cropObj.chunks;
    this.animate(cropObj as ICropObj);
    context.drawImage(
      this.image,
      cropObj.x,
      cropObj.y,
      cropObj.width / cropObj.chunks,
      cropObj.height,
      position.x,
      position.y,
      this.size!.width / cropObj.chunks,
      this.size!.height
    );
  }
}
