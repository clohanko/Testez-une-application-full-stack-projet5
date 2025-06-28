/// <reference types="jest" />

import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { HttpErrorResponse } from '@angular/common/http';

import { TeacherService } from './teacher.service';

describe('TeacherService', () => {
  let service: TeacherService;
  let http   : HttpTestingController;

  const dummy = { id: 1, firstName: 'T1' } as any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TeacherService]
    });
    service = TestBed.inject(TeacherService);
    http    = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());


  it('detail() déclenche une requête HTTP à chaque appel', () => {
    // 1er appel
    service.detail('1').subscribe(t => expect(t).toEqual(dummy));
    const req1 = http.expectOne('api/teacher/1');
    expect(req1.request.method).toBe('GET');
    req1.flush(dummy);

    // 2e appel : nouvelle requête, pas de cache
    service.detail('1').subscribe(t => expect(t).toEqual(dummy));
    const req2 = http.expectOne('api/teacher/1');
    expect(req2.request.method).toBe('GET');
    req2.flush(dummy);
  });


  it('detail() propage l’erreur HTTP', () => {
    let status: number | null = null;

    service.detail('2').subscribe({
      next : () => fail('devrait échouer'),
      error: (err: HttpErrorResponse) => (status = err.status)
    });

    const req = http.expectOne('api/teacher/2');
    req.flush({}, { status: 404, statusText: 'Not Found' });

    expect(status).toBe(404);
  });
});
