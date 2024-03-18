export class DashboardData {

  completedTotal: number;
  uncompletedTotal: number;

  constructor(completedTotal: number, uncompletedTotal: number) {
    this.completedTotal = completedTotal;
    this.uncompletedTotal = uncompletedTotal;
  }
}
