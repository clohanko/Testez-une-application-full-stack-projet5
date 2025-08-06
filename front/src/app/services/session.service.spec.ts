/// <reference types="jest" />

import { TestBed } from '@angular/core/testing';
import { SessionService } from './session.service';
import { SessionInformation } from '../interfaces/sessionInformation.interface';

describe('SessionService – unitaires', () => {
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

  afterEach(() => service.logOut());

  it('devrait être créé', () => {
    expect(service).toBeTruthy();
  });

  it('logIn() renseigne sessionInformation et isLogged', () => {
    service.logIn(mockUser);
    expect(service.sessionInformation).toEqual(mockUser);
    expect(service.isLogged).toBe(true);
  });

  it('logOut() vide sessionInformation et isLogged', () => {
    service.logIn(mockUser);
    service.logOut();
    expect(service.sessionInformation).toBeUndefined();
    expect(service.isLogged).toBe(false);
  });

  it('$isLogged() notifie les changements (false → true → false)', (done) => {
    const expected = [false, true, false];
    const received: boolean[] = [];

    service.$isLogged().subscribe(val => {
      received.push(val);
      if (received.length === expected.length) {
        expect(received).toEqual(expected);
        done();
      }
    });

    service.logIn(mockUser);
    service.logOut();
  });
});
