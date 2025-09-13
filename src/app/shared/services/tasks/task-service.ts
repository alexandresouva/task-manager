import { Injectable } from '@angular/core';
import { Task } from '@app/shared/models/tasks.model';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  getAll(): Observable<Task[]> {
    return of([
      { id: 1, description: 'Learn Angular', completed: false },
      { id: 2, description: 'Build a Todo App', completed: false },
      { id: 3, description: 'Setup Tailwind', completed: true },
      { id: 4, description: 'Install DaisyUI', completed: true },
    ]);
  }
}
