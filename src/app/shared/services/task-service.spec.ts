import { fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';

import { TaskService } from './task-service';
import { Task } from '@app/shared/models/tasks.model';
import { provideHttpClient } from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';
import { tasksMock } from '@app/testing/data/tasks.mock';
import { environment } from 'src/environments/environment';

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
  it('should return tasks - fakeAsync', fakeAsync(() => {
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
  it('should return tasks - done', (done) => {
    service.getAll().subscribe((tasks) => {
      expect(req.request.method).toBe('GET');
      expect(tasks).toStrictEqual(tasksMock);
      done();
    });

    const req = httpTestingController.expectOne(environment.endpoints.tasks);
    req.flush(tasksMock);
  });

  // Method 3: waitForAsync
  it('should return tasks - waitForAsync', waitForAsync(() => {
    service.getAll().subscribe((tasks) => {
      expect(req.request.method).toBe('GET');
      expect(tasks).toStrictEqual(tasksMock);
    });

    const req = httpTestingController.expectOne(environment.endpoints.tasks);
    req.flush(tasksMock);
  }));
});
