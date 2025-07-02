/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject = any> {
    /**
     * Connecte un utilisateur via l'API et injecte le token dans localStorage
     */
    loginAsUser(): Chainable<void>;
    loginViaUI(): Chainable<void>;
    loginAndVisit(path: string): Chainable<void>;
    loginAndGoToProfile(): Chainable<void>;
    createSession(name: string, description?: string): void;
    deleteSessionByName(name: string): void;
  }
}