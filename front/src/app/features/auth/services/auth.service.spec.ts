import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from './auth.service';
import { expect, jest } from '@jest/globals';


describe('AuthService', () => {
  let service: AuthService;
  let http   : HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    http    = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    http.verify();
    localStorage.clear();
  });

  it('login() stocke le token en cas de succès', () => {
    service.login({ email: 'john@mail.com', password: 'pwd' }).subscribe(user => {
      expect(user.id).toBe(1);
      expect(localStorage.getItem('token')).toBe('abc');
    });

    const req = http.expectOne('api/auth/login');   // adapte l’URL si besoin
    expect(req.request.method).toBe('POST');
    req.flush({ token: 'abc', user: { id: 1 } });
  });

  it('login() ne stocke rien en cas de 401', () => {
    let status: number | null = null;

    service.login({ email: 'bad', password: 'bad' }).subscribe({
      error: (err: HttpErrorResponse) => (status = err.status)
    });

    const req = http.expectOne('api/auth/login');   // adapte l’URL si besoin
    req.flush({}, { status: 401, statusText: 'Unauthorized' });

    expect(status).toBe(401);
    expect(localStorage.getItem('token')).toBeNull();
  });
});
