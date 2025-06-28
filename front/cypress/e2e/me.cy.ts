describe('Profil utilisateur', () => {
  beforeEach(() => {
    cy.loginAsUser();
  
    // 🧪 Vérifie que l'on n'est PAS sur /login
    cy.url({ timeout: 10000 }).should('not.include', '/login');
  
    // Vérifie que l'on est bien sur la page profil
    cy.url().should('include', '/me');
  });
  

  it('Affiche les infos de l’utilisateur connecté', () => {
    cy.get('mat-card-content', { timeout: 10000 })
      .should('contain.text', 'Email')
      .and('contain.text', 'yoga@studio.com');
  
    cy.contains('Name:').should('exist');
    cy.contains('Create at:').should('exist');
    cy.contains('Last update:').should('exist');
  });it('Affiche les infos de l’utilisateur connecté', () => {
    cy.get('mat-card-content', { timeout: 10000 })
      .should('contain.text', 'Email')
      .and('contain.text', 'yoga@studio.com');
  });
  
  
});
