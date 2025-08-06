/// <reference types="jest" />

import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { UserService } from './user.service';

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  password?: string;
  confirmPassword?: string;
  admin?: boolean;
}

const mockUser: User = {
  id: 1,
  email: 'john@example.com',
  firstName: 'John',
  lastName: 'Doe'
};

/* ------------------------------------------------------------------
   1. Tests UNITAIRES – HttpClient totalement mocké
------------------------------------------------------------------ */
describe('UserService – unitaires (HttpClient stub)', () => {
  let service: UserService;
  const httpStub = {
    get   : jest.fn().mockReturnValue(of(mockUser)),
    delete: jest.fn().mockReturnValue(of({}))
  } as unknown as HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserService,
        { provide: HttpClient, useValue: httpStub }
      ]
    });
    service = TestBed.inject(UserService);
  });

  it('devrait être créé', () => {
    expect(service).toBeTruthy();
  });

  it('getById appelle HttpClient.get avec la bonne URL', () => {
    service.getById('1').subscribe(u => expect(u).toEqual(mockUser));
    expect(httpStub.get).toHaveBeenCalledWith('api/user/1');
  });

  it('delete appelle HttpClient.delete avec la bonne URL', () => {
    service.delete('1').subscribe(r => expect(r).toEqual({}));
    expect(httpStub.delete).toHaveBeenCalledWith('api/user/1');
  });
});

/* ------------------------------------------------------------------
   2. Tests D’INTÉGRATION – HttpClientTestingModule
------------------------------------------------------------------ */
describe('UserService – intégration (HttpClientTestingModule)', () => {
  let service  : UserService;
  let httpMock : HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports : [HttpClientTestingModule],
      providers: [UserService]
    });

    service   = TestBed.inject(UserService);
    httpMock  = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('devrait être créé', () => {
    expect(service).toBeTruthy();
  });

  it('getById envoie une requête GET et retourne l’utilisateur', () => {
    service.getById('1').subscribe(u => expect(u).toEqual(mockUser));

    const req = httpMock.expectOne('api/user/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('delete envoie une requête DELETE', () => {
    service.delete('1').subscribe(r => expect(r).toEqual({}));

    const req = httpMock.expectOne('api/user/1');
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
