import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Task } from '@shared/models/task.model';

import { CreateTask } from './create-task/create-task';
import { ListFacade } from './list-facade';
import { TaskList } from './task-list/task-list';

@Component({
  selector: 'app-list',
  imports: [TaskList, CreateTask],
  providers: [],
  templateUrl: './list.html',
})
export class List implements OnInit {
  private readonly router = inject(Router);
  protected readonly facade = inject(ListFacade);

  ngOnInit(): void {
    this.facade.loadTasks();
  }

  protected navigateToEditPage(task: Task): void {
    this.router.navigateByUrl(`/tasks/${task.id}/edit`);
  }
}
