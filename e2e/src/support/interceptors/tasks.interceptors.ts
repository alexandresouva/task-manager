import { TasksCounts } from '../models/list.model';

export const mockTasksWithCounts = ({
  pending,
  completed,
}: TasksCounts): string => {
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

export const mockToggleTask = (): string => {
  const alias = 'toggleTask';

  cy.intercept('PUT', '**/tasks/*', (req) => {
    req.reply({
      statusCode: 200,
      body: req.body,
    });
  }).as(alias);

  return alias;
};
