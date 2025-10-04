import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';

import { TaskService } from '@shared/services/tasks/task-service';
import { Task } from '@shared/models/tasks.model';
import { createTaskServiceMock } from '@testing/mocks/tasks-service.mock';
import { tasksMock } from '@testing/data/tasks.mock';
import { List } from './list';
import { TestHelper } from '@app/testing/helpers/test-helper';
import { TaskList } from './task-list/task-list';

describe('List', () => {
  let component: List;
  let fixture: ComponentFixture<List>;
  let taskServiceMock: Partial<jest.Mocked<TaskService>>;
  let testHelper: TestHelper<List>;

  const getAllTasksSubject = new Subject<Task[]>();

  beforeEach(async () => {
    taskServiceMock = createTaskServiceMock();

    TestBed.configureTestingModule({
      imports: [List],
      providers: [{ provide: TaskService, useValue: taskServiceMock }],
    });
    await TestBed.compileComponents();

    taskServiceMock.getAll.mockReturnValue(getAllTasksSubject.asObservable());

    fixture = TestBed.createComponent(List);
    testHelper = new TestHelper(fixture);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter completed tasks and pass them to the task list', () => {
    const expectedCompletedTasks = tasksMock.filter((task) => task.completed);

    getAllTasksSubject.next(tasksMock);
    fixture.detectChanges();
    const completedTaskList =
      testHelper.getComponentInstanceByTestId<TaskList>('completed-tasks');

    expect(component['completedTasks']()).toEqual(expectedCompletedTasks);
    expect(completedTaskList.tasks()).toEqual(expectedCompletedTasks);
  });

  it('should filter pending tasks and pass them to the task list', () => {
    const expectedPendingTasks = tasksMock.filter((task) => !task.completed);

    getAllTasksSubject.next(tasksMock);
    fixture.detectChanges();
    const pendingTaskList =
      testHelper.getComponentInstanceByTestId<TaskList>('pending-tasks');

    expect(component['pendingTasks']()).toEqual(
      tasksMock.filter((task) => !task.completed),
    );
    expect(pendingTaskList.tasks()).toEqual(expectedPendingTasks);
  });
});
