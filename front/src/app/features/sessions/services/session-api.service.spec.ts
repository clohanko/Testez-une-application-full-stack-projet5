/// <reference types="jest" />

import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

import { SessionApiService } from './session-api.service';

/* ============================================================
   1) SUITE UNITAIRES — HttpClient totalement stubé
   ============================================================ */
describe('SessionApiService – UNITAIRES', () => {
  let service: SessionApiService;

  const httpStub = {
    get   : jest.fn().mockReturnValue(of([{ id: 1 }])),
    post  : jest.fn().mockReturnValue(of({ id: 99 })),
    put   : jest.fn().mockReturnValue(of({ id: 1, name: 'upd' })),
    delete: jest.fn().mockReturnValue(of({}))
  } as unknown as HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SessionApiService,
        { provide: HttpClient, useValue: httpStub }
      ]
    });
    service = TestBed.inject(SessionApiService);
  });

  it('all() appelle HttpClient.get', () => {
    service.all().subscribe();
    expect(httpStub.get).toHaveBeenCalledWith('api/session');
  });

  it('detail() appelle HttpClient.get', () => {
    service.detail('1').subscribe();
    expect(httpStub.get).toHaveBeenCalledWith('api/session/1');
  });

  it('create() appelle HttpClient.post', () => {
    const body = { name: 'new' } as any;
    service.create(body).subscribe();
    expect(httpStub.post).toHaveBeenCalledWith('api/session', body);
  });

  it('update() appelle HttpClient.put', () => {
    const body = { name: 'upd' } as any;
    service.update('1', body).subscribe();
    expect(httpStub.put).toHaveBeenCalledWith('api/session/1', body);
  });

  it('delete() appelle HttpClient.delete', () => {
    service.delete('1').subscribe();
    expect(httpStub.delete).toHaveBeenCalledWith('api/session/1');
  });
});

/* ============================================================
   2) SUITE INTÉGRATION — tes tests existants conservés
   ============================================================ */
describe('SessionApiService – INTÉGRATION', () => {
  let service: SessionApiService;
  let http   : HttpTestingController;

  const dummySession = { id: 1 } as any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SessionApiService]
    });
    service = TestBed.inject(SessionApiService);
    http    = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  /* -- succès ------------------ */
  it('all() → GET api/session', () => {
    service.all().subscribe(res => expect(res).toEqual([dummySession]));
    const req = http.expectOne('api/session');
    expect(req.request.method).toBe('GET');
    req.flush([dummySession]);
  });

  it('create() → POST api/session', () => {
    service.create(dummySession).subscribe(res => expect(res).toEqual(dummySession));
    const req = http.expectOne('api/session');
    expect(req.request.method).toBe('POST');
    req.flush(dummySession);
  });

  it('update() → PUT api/session/1', () => {
    service.update('1', dummySession).subscribe(res => expect(res).toEqual(dummySession));
    const req = http.expectOne('api/session/1');
    expect(req.request.method).toBe('PUT');
    req.flush(dummySession);
  });

  it('delete() → DELETE api/session/1', () => {
    service.delete('1').subscribe(res => expect(res).toEqual({}));
    const req = http.expectOne('api/session/1');
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  /* -- utilitaire erreur 400 ---- */
  function expectError(obs: any, method: string, url: string) {
    let status: number | null = null;

    obs.subscribe({
      next : () => fail('devrait échouer'),
      error: (err: HttpErrorResponse) => (status = err.status)
    });

    const req = http.expectOne(url);
    expect(req.request.method).toBe(method);
    req.flush({ message: 'Bad' }, { status: 400, statusText: 'Bad Request' });
    expect(status).toBe(400);
  }

  /* -- erreurs ------------------ */
  it('all()   gère erreur 400', () =>
    expectError(service.all(), 'GET', 'api/session'));

  it('detail() gère erreur 400', () =>
    expectError(service.detail('1'), 'GET', 'api/session/1'));

  it('create() gère erreur 400', () =>
    expectError(service.create({} as any), 'POST', 'api/session'));

  it('update() gère erreur 400', () =>
    expectError(service.update('1', {} as any), 'PUT', 'api/session/1'));

  it('delete() gère erreur 400', () =>
    expectError(service.delete('1'), 'DELETE', 'api/session/1'));
});
