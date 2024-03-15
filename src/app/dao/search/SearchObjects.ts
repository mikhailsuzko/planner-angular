export class CategorySearchValues {
  title: string;

  constructor(title: string) {
    this.title = title;
  }
}

export class PrioritySearchValues {
  // title: string = null;
  // email: string = null;
}

export class TaskSearchValues {

  title = '';
  // completed: number = null;
  // priorityId: number = null;
  // categoryId: number = null;
  //
  // dateFrom: Date = null;
  // dateTo: Date = null;
  //
  // email: string = null;
  pageNumber = 0;
  pageSize = 5;

  sortColumn = 'title';
  sortDirection = 'asc';

}
