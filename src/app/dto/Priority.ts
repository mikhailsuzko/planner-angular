export class Priority {
  id?: number;
  title: string;
  color: string;

  constructor(title: string, color: string, id?: number) {
    this.id = id;
    this.title = title;
    this.color = color;
  }
}
