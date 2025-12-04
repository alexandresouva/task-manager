import { provideHttpClient } from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';

import { tasksMock } from '@testing/data/tasks.mock';
import { environment } from 'src/environments/environment';

import { TaskService } from './task-service';
import { Task } from '../models/task.model';

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
    const updatedTask: Task = { id: 2, title: 'Task 2', completed: true };

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

  it('should create a task', (done) => {
    const newTaskName = 'New Task';
    const createdTask: Task = {
      id: 4,
      title: newTaskName,
      completed: false,
    };

    let result: Task | null = null;
    service.create(newTaskName).subscribe((task) => {
      result = task;
      done();
    });

    const req = httpTestingController.expectOne({
      url: environment.endpoints.tasks,
      method: 'POST',
    });
    expect(req.request.body).toEqual({
      title: newTaskName,
      completed: false,
    });

    req.flush(createdTask);
    expect(result).toEqual(createdTask);
  });

  it('should get a task by id', (done) => {
    const taskId = 1;
    const expectedTask: Task = { id: 1, title: 'Task 1', completed: false };

    let result: Task | null = null;
    service.getById(taskId).subscribe((task) => {
      result = task;
      done();
    });

    const req = httpTestingController.expectOne({
      url: `${environment.endpoints.tasks}/${taskId}`,
      method: 'GET',
    });
    req.flush(expectedTask);
    expect(result).toEqual(expectedTask);
  });
});
