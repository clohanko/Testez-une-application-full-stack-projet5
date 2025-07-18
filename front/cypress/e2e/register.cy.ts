/// <reference types="cypress" />


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
  