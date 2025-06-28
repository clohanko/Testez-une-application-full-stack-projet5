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
    return cy.url({ timeout: 10000 }).should('not.include', '/login');
  });

  Cypress.Commands.add('loginAndVisit', (path: string) => {
    cy.visit('/login');
    cy.get('input[formControlName="email"]').type('yoga@studio.com');
    cy.get('input[formControlName="password"]').type('test!1234');
    cy.get('button[type="submit"]').click();
  
    cy.url({ timeout: 10000 }).should('not.include', '/login');
    cy.visit(path);
  });

  
  