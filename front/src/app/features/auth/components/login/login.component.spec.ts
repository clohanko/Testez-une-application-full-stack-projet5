import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule }       from '@angular/forms';
import { HttpClientTestingModule }   from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA }          from '@angular/core';
import { of, throwError }            from 'rxjs';

import { LoginComponent }            from './login.component';
import { AuthService }               from '../../services/auth.service';
import { MatSnackBar }               from '@angular/material/snack-bar';
import { Router }                    from '@angular/router';
import { expect, jest } from '@jest/globals';


const routerStub = { navigate: jest.fn() };
const snackBarStub = { open: jest.fn() };

describe('LoginComponent – submit()', () => {
  let component: LoginComponent;
  let fixture  : ComponentFixture<LoginComponent>;
  let auth     : AuthService;
  let router   : Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientTestingModule],
      declarations: [LoginComponent],
      providers: [
        { provide: Router,     useValue: routerStub },
        { provide: MatSnackBar,useValue: snackBarStub },
        AuthService
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    auth   = TestBed.inject(AuthService);
    router = TestBed.inject(Router);

    fixture   = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => jest.clearAllMocks());

  it('appelle login() même si le formulaire est vide et redirige si succès', () => {
    const spy = jest.spyOn(auth, 'login').mockReturnValue(of({} as any));

    component.submit();

    expect(spy).toHaveBeenCalled();                       // login() appelé
    expect(router.navigate).toHaveBeenCalledWith(['/sessions']);
  });

  it('ne redirige pas en cas d’erreur (401)', () => {
    jest.spyOn(auth, 'login').mockReturnValue(
      throwError(() => ({ status: 401 }))
    );

    component.form.setValue({ email: 'a@a.com', password: 'bad' });
    component.submit();

    expect(router.navigate).not.toHaveBeenCalled();       // aucune redirection
  });

  /* ---------- 3) login OK ---------- */
  it('redirige vers /sessions si login réussi', () => {
    jest.spyOn(auth, 'login').mockReturnValue(
      of({
        id: 1,
        token: 'fake',
        type: 'Bearer',
        username: 'john',
        firstName: 'John',
        lastName: 'Doe',
        admin: false
      } as any)
    );

    component.form.setValue({ email: 'a@a.com', password: 'good' });
    component.submit();

    expect(router.navigate).toHaveBeenCalledWith(['/sessions']);
  });
});
