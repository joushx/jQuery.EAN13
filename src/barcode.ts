interface Barcode {
  validate(data: string): boolean;
  generateLineData(data: string): void;
}
