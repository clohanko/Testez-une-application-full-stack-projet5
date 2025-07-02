/// <reference types="cypress" />

Cypress.Commands.add('loginAsUser', () => {
    cy.request('POST', 'http://localhost:8080/api/auth/login', {
      email: 'yoga@studio.com',
      password: 'test!1234',
    }).then((res) => {
      const user = res.body;
      cy.visit('/sessions', {
        onBeforeLoad(win) {
          win.localStorage.setItem('user', JSON.stringify(user));
        },
      });
    });
  });
  
  Cypress.Commands.add('loginViaUI', () => {
    cy.visit('/login');
    cy.get('input[formControlName="email"]').type('yoga@studio.com');
    cy.get('input[formControlName="password"]').type('test!1234');
    cy.get('button[type="submit"]').click();
    cy.url({ timeout: 10000 }).should('include', '/sessions');
    cy.url({ timeout: 10000 }).should('not.include', '/login'); 
  });

  Cypress.Commands.add('loginAndVisit', (path: string) => {
    cy.visit('/login');
    cy.get('input[formControlName="email"]').type('yoga@studio.com');
    cy.get('input[formControlName="password"]').type('test!1234');
    cy.get('button[type="submit"]').click();
  
    cy.url({ timeout: 10000 }).should('not.include', '/login');
    cy.visit(path);
  });

  Cypress.Commands.add('loginAndGoToProfile', () => {
    cy.visit('/login');
  
    cy.get('input[formControlName="email"]').type('yoga@studio.com');
    cy.get('input[formControlName="password"]').type('test!1234');
    cy.get('button[type="submit"]').click();
  
    cy.url({ timeout: 10000 }).should('include', '/sessions');
  
    cy.contains('Account').click();
    cy.url().should('include', '/me');
  
    cy.contains('User information').should('exist');
  });
  
  Cypress.Commands.add('createSession', (name: string, description: string = 'Description test') => {
    cy.contains('button', 'Create', { timeout: 10000 }).click();
    cy.url({ timeout: 10000 }).should('include', '/sessions/create');
  
    cy.get('input[formControlName="name"]').type(name);
    cy.get('input[formControlName="date"]').type('2025-07-05');
    cy.get('mat-select[formControlName="teacher_id"]').click();
    cy.get('mat-option').first().click();
    cy.get('textarea[formControlName="description"]').type(description);
    cy.get('button[type="submit"]').click();
  
    cy.url({ timeout: 10000 }).should('include', '/sessions');
  });
