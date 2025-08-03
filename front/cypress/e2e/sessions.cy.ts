/// <reference types="cypress" />

describe('Sessions E2E', () => {
  beforeEach(() => {
    cy.loginViaUI();
  });

    it('Crée une nouvelle session (admin)', () => {
    const sessionName = `Session Cypress - ${Date.now()}`;
    cy.createSession(sessionName, 'Session créée par test');
    cy.contains('Session created').should('exist');
  });

  it('Affiche la liste des sessions', () => {
    cy.contains('Rentals available').should('be.visible');
    cy.get('.items .item').should('have.length.greaterThan', 0);
  });

  it('Accède au détail d’une session', () => {
    cy.get('.items .item').first().within(() => {
      cy.contains('Detail').click();
    });

    cy.get('mat-card-title h1', { timeout: 10000 }).should('exist');
    cy.get('mat-card-subtitle').should('contain.text', 'people');
    cy.get('mat-card-content').should('contain.text', 'Description:');
  });



  it('Met à jour une session existante (admin)', () => {
    const sessionName = `Session à modifier - ${Date.now()}`;
    const updatedName = `Session modifiée - ${Date.now()}`;
    cy.createSession(sessionName);

    cy.get('.items .item').contains(sessionName).parents('.item').within(() => {
      cy.contains('Edit').click();
    });

    cy.url().should('include', '/sessions/update');
    cy.get('input[formControlName="name"]').clear().type(updatedName);
    cy.get('textarea[formControlName="description"]').clear().type('Nouvelle description');
    cy.get('button[type="submit"]').click();

    cy.url({ timeout: 10000 }).should('include', '/sessions');
    cy.contains('Session updated').should('exist');
  });

  it('Supprime une session existante (admin)', () => {
    const sessionName = `Session à supprimer - ${Date.now()}`;
    cy.createSession(sessionName, 'Session à supprimer');

    cy.get('.items .item').contains(sessionName).parents('.item').within(() => {
      cy.contains('Detail').click();
    });

    cy.url().should('include', '/sessions/detail/');
    cy.contains('button', 'Delete').click();

    cy.url().should('include', '/sessions');
    cy.contains(sessionName).should('not.exist');
  });
});
