/// <reference types="jest" />

import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

import { TeacherService } from './teacher.service';

interface Teacher { id: number; firstName: string; }

const dummy     : Teacher   = { id: 1, firstName: 'T1' };
const dummyList : Teacher[] = [
  { id: 1, firstName: 'T1' },
  { id: 2, firstName: 'T2' }
];

/* =========================================================
   1. TESTS UNITAIRES  – HttpClient complètement stubé
   ========================================================= */
describe('TeacherService – UNITAIRES', () => {
  let service: TeacherService;

  const httpStub = {
    get: jest.fn()
      .mockImplementation((url: string) =>
        url.includes('/1') ? of(dummy) : of(dummyList)
      )
  } as unknown as HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TeacherService,
        { provide: HttpClient, useValue: httpStub }
      ]
    });
    service = TestBed.inject(TeacherService);
  });

  it('all() retourne la liste (stub)', () => {
    service.all().subscribe(r => expect(r).toEqual(dummyList));
    expect(httpStub.get).toHaveBeenCalledWith('api/teacher');
  });

  it('detail() retourne le bon teacher (stub)', () => {
    service.detail('1').subscribe(r => expect(r).toEqual(dummy));
    expect(httpStub.get).toHaveBeenCalledWith('api/teacher/1');
  });
});

/* =========================================================
   2. TESTS D’INTÉGRATION – HttpClientTestingModule
   ========================================================= */
describe('TeacherService – INTÉGRATION', () => {
  let service : TeacherService;
  let http    : HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports : [HttpClientTestingModule],
      providers: [TeacherService]
    });
    service = TestBed.inject(TeacherService);
    http    = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('all() émet un GET api/teacher', () => {
    service.all().subscribe(r => expect(r).toEqual(dummyList));

    const req = http.expectOne('api/teacher');
    expect(req.request.method).toBe('GET');
    req.flush(dummyList);
  });

  it('detail() émet un GET api/teacher/1', () => {
    service.detail('1').subscribe(r => expect(r).toEqual(dummy));

    const req = http.expectOne('api/teacher/1');
    expect(req.request.method).toBe('GET');
    req.flush(dummy);
  });

  it('all() propage l’erreur serveur 500', () => {
    let status: number | null = null;

    service.all().subscribe({
      next : () => fail('devrait échouer'),
      error: (err: HttpErrorResponse) => (status = err.status)
    });

    const req = http.expectOne('api/teacher');
    req.flush({}, { status: 500, statusText: 'Server Error' });

    expect(status).toBe(500);
  });
});
