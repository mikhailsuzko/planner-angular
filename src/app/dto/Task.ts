import {Priority} from './Priority';
import {Category} from './Category';

export class Task {
  id: number | null;
  title: string;
  completed: boolean;
  priority: Priority | null;
  category: Category | null;
  taskDate?: Date;

  oldCategory!: Category;


  constructor(id: number | null, title: string, completed: boolean, priority: Priority | null, category: Category | null, taskDate?: Date) {
    this.id = id;
    this.title = title;
    this.completed = completed;
    this.priority = priority;
    this.category = category;
    this.taskDate = taskDate;
  }

  public toString = (): string => {
    return `Task (title: ${this.title})`;
  }
}
