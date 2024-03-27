export class Category {
  id?: number;
  title: string;
  completedCount: number;
  uncompletedCount: number;

  constructor(title: string, id?: number, completedCount?: number, uncompletedCount?: number) {
    this.id = id;
    this.title = title;
    this.completedCount = completedCount ?? 0;
    this.uncompletedCount = uncompletedCount ?? 0;
  }

  public toString = (): string => {
    return `Category (title: ${this.title})`;
  }

}
