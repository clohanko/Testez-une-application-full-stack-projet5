/// <reference types="cypress" />

describe('Login spec', () => {
  beforeEach(() => {
    // Intercepte la requête POST vers /api/auth/login
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 200,
      body: {
        id: 1,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: true,
        token: 'fake-token',
        type: 'Bearer'
      }
    }).as('login');

    // Intercepte la requête GET vers /api/session
    cy.intercept('GET', '/api/session', []).as('session');
  });

  it('Login successful and redirect to /sessions', () => {
    cy.visit('/login');

    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type('test!1234');

    // Clique sur le bouton de soumission (à adapter selon ton HTML)
    cy.get('button[type=submit]').click();

    // Attente de l'interception (le POST login)
    cy.wait('@login');

    // Vérification de la redirection
    cy.url().should('include', '/sessions');
  });
});
