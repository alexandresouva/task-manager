import { provideHttpClient } from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';

import { Task } from '@app/shared/models/tasks.model';
import { tasksMock } from '@app/testing/data/tasks.mock';
import { environment } from 'src/environments/environment';

import { TaskService } from './task-service';

describe('TaskService', () => {
  let service: TaskService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(TaskService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Method 1: fakeAsync
  it('should return tasks - using fakeAsync', fakeAsync(() => {
    let result: Task[] | undefined;

    service.getAll().subscribe((tasks) => {
      result = tasks;
    });

    const req = httpTestingController.expectOne(environment.endpoints.tasks);
    req.flush(tasksMock);

    tick(2000);

    expect(req.request.method).toBe('GET');
    expect(result).toStrictEqual(tasksMock);
  }));

  // Method 2: done
  it('should return tasks - using done', (done) => {
    service.getAll().subscribe((tasks) => {
      expect(req.request.method).toBe('GET');
      expect(tasks).toStrictEqual(tasksMock);
      done();
    });

    const req = httpTestingController.expectOne(environment.endpoints.tasks);
    req.flush(tasksMock);
  });

  // Method 3: waitForAsync
  it('should return tasks - using waitForAsync', waitForAsync(() => {
    service.getAll().subscribe((tasks) => {
      expect(req.request.method).toBe('GET');
      expect(tasks).toStrictEqual(tasksMock);
    });

    const req = httpTestingController.expectOne(environment.endpoints.tasks);
    req.flush(tasksMock);
  }));

  it('should update a task', () => {
    const updatedTask: Task = { id: 2, description: 'Task 2', completed: true };

    service.update(updatedTask.id, updatedTask).subscribe((task) => {
      expect(req.request.method).toBe('PUT');
      expect(task).toStrictEqual(updatedTask);
    });

    const req = httpTestingController.expectOne(
      `${environment.endpoints.tasks}/${updatedTask.id}`,
    );
    req.flush(updatedTask);
  });

  it('should delete a task', fakeAsync(() => {
    const taskIdToDelete = 3;

    service.delete(taskIdToDelete).subscribe(() => {
      expect(req.request.method).toBe('DELETE');
    });

    const req = httpTestingController.expectOne(
      `${environment.endpoints.tasks}/${taskIdToDelete}`,
    );
    req.flush(null);
  }));
});
