export class Category {
  id?: number;
  title: string;
  completedCount: number;
  uncompletedCount: number;

  constructor(title: string, id?: number, completedCount?: number, uncompletedCount?: number) {
    this.id = id;
    this.title = title;
    this.completedCount = completedCount === undefined ? 0 : completedCount;
    this.uncompletedCount = uncompletedCount === undefined ? 0 : uncompletedCount;
  }

  public toString = (): string => {
    return `Category (title: ${this.title})`;
  }

}
