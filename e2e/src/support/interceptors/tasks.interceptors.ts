import { Task, TasksCounts } from '../models/task.model';

export const mockTasks = ({ pending, completed }: TasksCounts): string => {
  const alias = 'getTasks';
  const tasks = [
    ...Array.from({ length: pending }).map((_, i) => ({
      id: i + 1,
      title: `Pending ${i + 1}`,
      completed: false,
    })),
    ...Array.from({ length: completed }).map((_, i) => ({
      id: pending + i + 1,
      title: `Completed ${i + 1}`,
      completed: true,
    })),
  ];

  cy.intercept('GET', '**/tasks', {
    statusCode: 200,
    body: tasks,
  }).as(alias);

  return alias;
};

export const mockTask = (task: Task): string => {
  const alias = 'getTask';

  cy.intercept('GET', '**/tasks/*', (req) => {
    req.reply({
      statusCode: 200,
      body: task,
    });
  }).as(alias);

  return alias;
};

export const mockUpdateTask = (): string => {
  const alias = 'updateTask';

  cy.intercept('PUT', '**/tasks/*', (req) => {
    req.reply({
      statusCode: 200,
      body: req.body,
    });
  }).as(alias);

  return alias;
};

export const mockDeletedTask = (): string => {
  const alias = 'deleteTask';

  cy.intercept('DELETE', '**/tasks/*', (req) => {
    req.reply({
      statusCode: 204,
    });
  }).as(alias);

  return alias;
};

export const mockCreateTask = (): string => {
  const alias = 'createTask';

  cy.intercept('POST', '**/tasks', (req) => {
    req.reply({
      statusCode: 201,
      body: {
        ...req.body,
        id: 100,
      },
    });
  }).as(alias);

  return alias;
};
