// общая статистика по всем задачам (неважно какой категории)
export class Stat {
  id: number;
  title: string;
  completedTotal: number;
  uncompletedTotal: number;

  constructor(id: number, title: string, completedTotal: number, uncompletedTotal: number) {
    this.id = id;
    this.title = title;
    this.completedTotal = completedTotal;
    this.uncompletedTotal = uncompletedTotal;
  }
}
