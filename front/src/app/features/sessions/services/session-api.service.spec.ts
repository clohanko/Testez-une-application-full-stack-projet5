/// <reference types="jest" />

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpErrorResponse }                               from '@angular/common/http';
import { TestBed }                                         from '@angular/core/testing';
import { SessionApiService }                               from './session-api.service';

describe('SessionApiService', () => {
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


  /** utilitaire raccourci */
  function expectError(obs: any, method: string, url: string) {
    let status: number | null = null;

    obs.subscribe({
      next : () => fail('devrait échouer'),
      error: (err: HttpErrorResponse) => (status = err.status)   // ← typé
    });

    const req = http.expectOne(url);
    expect(req.request.method).toBe(method);
    req.flush({ message: 'Bad' }, { status: 400, statusText: 'Bad Request' });

    expect(status).toBe(400);
  }

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
