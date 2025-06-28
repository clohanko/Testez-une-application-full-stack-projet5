import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule }       from '@angular/forms';
import { HttpClientTestingModule }   from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA }          from '@angular/core';
import { of, throwError }            from 'rxjs';

import { RegisterComponent }         from './register.component';
import { AuthService }               from '../../services/auth.service';
import { Router }                    from '@angular/router';
import { expect, jest }               from '@jest/globals';

const routerStub   = { navigate: jest.fn() };

describe('RegisterComponent - submit()', () => {
  let fixture  : ComponentFixture<RegisterComponent>;
  let component: RegisterComponent;
  let auth     : AuthService;
  let router   : Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientTestingModule],
      declarations: [RegisterComponent],
      providers: [
        { provide: Router, useValue: routerStub },
        AuthService
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    auth     = TestBed.inject(AuthService);
    router   = TestBed.inject(Router);

    fixture   = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();                        // init form
  });

  beforeEach(() => jest.clearAllMocks());

  it('appelle register() même si le formulaire est vide (comportement actuel)', () => {
    const spy = jest.spyOn(auth, 'register').mockReturnValue(of(void 0));

    component.submit();

    expect(spy).toHaveBeenCalled();                     // API appelée
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('redirige vers /login quand l’API répond OK', () => {
    jest.spyOn(auth, 'register').mockReturnValue(of(void 0));

    component.form.setValue({
      firstName: 'John',
      lastName : 'Doe',
      email    : 'john@mail.com',
      password : 'secret'
    });
    component.submit();

    expect(auth.register).toHaveBeenCalled();
    expect(component.onError).toBe(false);              // pas d’erreur
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('ne redirige pas et lève le flag onError si l’API répond 400', () => {
    jest
      .spyOn(auth, 'register')
      .mockReturnValue(throwError(() => ({ status: 400 })));

    component.form.setValue({
      firstName: 'Bad',
      lastName : 'Guy',
      email    : 'bad@mail.com',
      password : '123'
    });
    component.submit();

    expect(component.onError).toBe(true);               
    expect(router.navigate).not.toHaveBeenCalled();     
  });
});
