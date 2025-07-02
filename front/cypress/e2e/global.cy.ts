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

  
describe('Register spec', () => {
    it('Register successfully and redirects to login', () => {
      cy.visit('/register');
  
      cy.intercept('POST', '/api/auth/register', {
        statusCode: 200,
        body: {}, 
      }).as('register');
  
      cy.get('input[formControlName=firstName]').type('John');
      cy.get('input[formControlName=lastName]').type('Doe');
      cy.get('input[formControlName=email]').type('john@example.com');
      cy.get('input[formControlName=password]').type('test!1234');
  
      cy.get('button[type=submit]').click();
  
      cy.wait('@register');
      cy.url().should('include', '/login');
    });
  
    it('Displays error on registration failure', () => {
      cy.visit('/register');
  
      cy.intercept('POST', '/api/auth/register', {
        statusCode: 400,
        body: { message: 'Email already exists' },
      }).as('register-fail');
  
      cy.get('input[formControlName=firstName]').type('Jane');
      cy.get('input[formControlName=lastName]').type('Doe');
      cy.get('input[formControlName=email]').type('jane@example.com');
      cy.get('input[formControlName=password]').type('wrong');
  
      cy.get('button[type=submit]').click();
  
      cy.wait('@register-fail');
  
      cy.contains('An error occurred').should('exist');
    });
  });
  
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
  
    it('Crée une nouvelle session (admin)', () => {
      const sessionName = `Session Cypress - ${Date.now()}`;
      cy.createSession(sessionName, 'Session créée par test');
      cy.contains('Session created').should('exist');
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



  