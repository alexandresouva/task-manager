import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { NewTask, Task } from '@app/shared/models/task.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly httpClient = inject(HttpClient);

  getAll(): Observable<Task[]> {
    return this.httpClient.get<Task[]>(`${environment.endpoints.tasks}`);
  }

  update(taskId: number, task: Task): Observable<Task> {
    return this.httpClient.put<Task>(
      `${environment.endpoints.tasks}/${taskId}`,
      task,
    );
  }

  delete(taskId: number): Observable<void> {
    return this.httpClient.delete<void>(
      `${environment.endpoints.tasks}/${taskId}`,
    );
  }

  create(taskTitle: string): Observable<Task> {
    const newTask: NewTask = {
      title: taskTitle,
      completed: false,
    };

    return this.httpClient.post<Task>(
      `${environment.endpoints.tasks}`,
      newTask,
    );
  }
}
