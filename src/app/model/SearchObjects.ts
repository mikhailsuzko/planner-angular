export class CategorySearchValues {
  title: string;

  constructor(title: string) {
    this.title = title;
  }
}

export class PrioritySearchValues {
  title?: string;
  email?: string;

  constructor(title?: string, email?: string) {
    this.title = title;
    this.email = email;
  }
}

export class TaskSearchValues {

  title?: string | null;
  completed?: boolean | null;
  priorityId?: number | null;
  categoryId?: number | null;

  dateFrom?: Date;
  dateTo?: Date;

  pageNumber = 0;
  pageSize = 5;

  sortColumn = 'completed';
  sortDirection = 'asc';
}
