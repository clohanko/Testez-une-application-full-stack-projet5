describe('Profil utilisateur', () => {
  beforeEach(() => {
    cy.loginAndGoToProfile();
  });

  it('affiche l’email de l’utilisateur connecté', () => {
    cy.contains('Email').should('contain.text', 'yoga@studio.com');
  });

  it('affiche le nom complet', () => {
    cy.contains('Name:').should('exist');
  });

  it('affiche la date de création', () => {
    cy.contains('Create at:').should('exist');
  });
});
