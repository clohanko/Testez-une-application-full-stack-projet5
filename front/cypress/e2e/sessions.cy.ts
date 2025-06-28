/// <reference types="cypress" />

describe('Sessions E2E', () => {

    beforeEach(() => {
        cy.loginViaUI();
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
  });
  