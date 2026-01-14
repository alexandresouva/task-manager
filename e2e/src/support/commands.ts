/// <reference types="cypress" />

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      getByTestId(dataTestId: string): Chainable<JQuery<HTMLElement>>;
    }
  }
}

Cypress.Commands.add('getByTestId', (dataTestId) => {
  return cy.get(`[data-testid="${dataTestId}"]`);
});

// Temporary workaround for a known Nx + Cypress type-definition issue.
// The empty export ensures this file is treated as a module by TypeScript,
// preventing global type conflicts until the issue is resolved upstream.
// See: https://github.com/nrwl/nx/pull/33906
export {};
