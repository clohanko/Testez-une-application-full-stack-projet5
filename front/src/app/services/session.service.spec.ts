import { TestBed } from '@angular/core/testing';
import { SessionService } from './session.service';
import { SessionInformation } from '../interfaces/sessionInformation.interface';

describe('SessionService', () => {
  let service: SessionService;

  const mockUser: SessionInformation = {
    id: 1,
    admin: true,
    token: 'mock-token',
    type: 'user',
    username: 'johndoe',
    firstName: 'John',
    lastName: 'Doe'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionService);
  });

  it('devrait être créé', () => {
    expect(service).toBeDefined();
  });

  it('devrait connecter l’utilisateur via logIn()', () => {
    service.logIn(mockUser);
    expect(service.sessionInformation).toEqual(mockUser);
    expect(service.isLogged).toBe(true);
  });

  it('devrait déconnecter l’utilisateur via logOut()', () => {
    service.logIn(mockUser); // Connecte d'abord
    service.logOut();        // Puis déconnecte
    expect(service.sessionInformation).toBeUndefined();
    expect(service.isLogged).toBe(false);
  });

  it('devrait notifier les abonnés de isLogged$()', (done) => {
    let stateChanges: boolean[] = [];

    service.$isLogged().subscribe(value => {
      stateChanges.push(value);

      // Terminer quand on a reçu les 3 étapes
      if (stateChanges.length === 3) {
        expect(stateChanges).toEqual([false, true, false]);
        done();
      }
    });

    service.logIn(mockUser);
    service.logOut();
  });
});
