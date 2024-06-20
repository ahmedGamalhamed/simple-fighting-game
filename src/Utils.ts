export class Utils {
  static createImage(imageSrc: string, width: number, height: number) {
    const image = new Image();
    image.src = imageSrc;
    image.width = width;
    image.height = height;
    return image;
  }
}
