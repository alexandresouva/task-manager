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
    let result: Task[] | null = null;

    service.getAll().subscribe((tasks) => {
      result = tasks;
    });

    const req = httpTestingController.expectOne({
      url: environment.endpoints.tasks,
      method: 'GET',
    });
    req.flush(tasksMock);
    tick();

    expect(result).toEqual(tasksMock);
  }));

  // Method 2: done
  it('should return tasks - using done', (done) => {
    service.getAll().subscribe((tasks) => {
      expect(tasks).toEqual(tasksMock);
      done();
    });

    const req = httpTestingController.expectOne({
      url: environment.endpoints.tasks,
      method: 'GET',
    });
    req.flush(tasksMock);
  });

  // Method 3: waitForAsync
  it('should return tasks - using waitForAsync', waitForAsync(() => {
    service.getAll().subscribe((tasks) => {
      expect(tasks).toEqual(tasksMock);
    });

    const req = httpTestingController.expectOne({
      url: environment.endpoints.tasks,
      method: 'GET',
    });
    req.flush(tasksMock);
  }));

  it('should update a task', () => {
    const updatedTask: Task = { id: 2, description: 'Task 2', completed: true };

    service.update(updatedTask.id, updatedTask).subscribe((task) => {
      expect(task).toEqual(updatedTask);
    });

    const req = httpTestingController.expectOne({
      url: `${environment.endpoints.tasks}/${updatedTask.id}`,
      method: 'PUT',
    });
    req.flush(updatedTask);
  });

  it('should delete a task', fakeAsync(() => {
    const taskIdToDelete = 3;

    service.delete(taskIdToDelete).subscribe();

    const req = httpTestingController.expectOne({
      url: `${environment.endpoints.tasks}/${taskIdToDelete}`,
      method: 'DELETE',
    });
    req.flush(null);
  }));

  it('should create a task', () => {
    const newTaskName = 'New Task';
    const createdTask: Task = {
      id: 4,
      description: newTaskName,
      completed: false,
    };

    service.create(newTaskName).subscribe((task) => {
      expect(task).toEqual(createdTask);
    });

    const req = httpTestingController.expectOne({
      url: environment.endpoints.tasks,
      method: 'POST',
    });
    req.flush(createdTask);
  });
});
