declare namespace Cypress {
    interface Chainable<Subject = any> {
      loginByApi(): Chainable<void>;
      loginAsUser(): Chainable<void>;

    }

  }