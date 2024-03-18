// общая статистика по всем задачам (неважно какой категории)
export class Stat {
  id?: number;
  completedTotal: number;
  uncompletedTotal: number;

  constructor(completedTotal?: number, uncompletedTotal?: number, id?: number) {
    this.id = id;
    this.completedTotal = completedTotal === undefined ? 0 : completedTotal;
    this.uncompletedTotal = uncompletedTotal === undefined ? 0 : uncompletedTotal;
  }
}
