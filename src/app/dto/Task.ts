import {Priority} from './Priority';
import {Category} from './Category';

export class Task {
  id: number;
  title: string;
  completed: number;
  priority: Priority;
  category: Category;
  taskDate?: Date;

  constructor(id: number, title: string, completed: number, priority: Priority, category: Category, taskDate?: Date) {
    this.id = id;
    this.title = title;
    this.completed = completed;
    this.priority = priority;
    this.category = category;
    this.taskDate = taskDate;
  }
}
