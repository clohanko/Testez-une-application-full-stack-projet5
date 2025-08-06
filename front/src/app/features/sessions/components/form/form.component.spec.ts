/// <reference types="jest" />

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { FormComponent } from './form.component';
import { SessionApiService } from '../../services/session-api.service';
import { SessionService } from '../../../../services/session.service';
import { TeacherService } from '../../../../services/teacher.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';

/* ------------------------------------------------------------------
   Tests unitaires – création
------------------------------------------------------------------ */
describe('FormComponent - mode create (unitaires)', () => {
  let component: FormComponent;
  let fixture  : ComponentFixture<FormComponent>;
  let api      : SessionApiService;
  let snackBar : MatSnackBar;
  let router   : Router;

  const sessionServiceStub = { sessionInformation: { admin: true } };
  const routerStub : Partial<Router> = { url: '/sessions/create', navigate: jest.fn() };
  const snackBarStub = { open: jest.fn() };
  const teacherServiceStub = { all: () => of([]) };
  const routeStub = { snapshot: { paramMap: { get: () => null } } } as unknown as ActivatedRoute;
  const fakeSession = { id: 99, name: 'Yoga test' } as any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientTestingModule],
      declarations: [FormComponent],
      providers: [
        { provide: SessionService,  useValue: sessionServiceStub },
        { provide: TeacherService,  useValue: teacherServiceStub },
        { provide: Router,         useValue: routerStub },
        { provide: MatSnackBar,    useValue: snackBarStub },
        { provide: ActivatedRoute, useValue: routeStub },
        SessionApiService
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    api      = TestBed.inject(SessionApiService);
    snackBar = TestBed.inject(MatSnackBar);
    router   = TestBed.inject(Router) as unknown as Router;

    fixture   = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('ne soumet pas si le formulaire est invalide', () => {
    const spyCreate = jest.spyOn(api, 'create');
    component.submit();
    expect(component.sessionForm?.invalid).toBe(true);
    expect(spyCreate).not.toHaveBeenCalled();
  });

  it('soumet la création si le formulaire est valide', () => {
    jest.spyOn(api, 'create').mockReturnValue(of(fakeSession));

    component.sessionForm?.patchValue({
      name: 'Yoga test',
      description:'Flow',
      date: new Date(),
      capacity: 12,
      teacher_id: 1
    });
    component.submit();

    expect(api.create).toHaveBeenCalled();
    expect(snackBar.open).toHaveBeenCalledWith('Session created !','Close',{ duration: 3000 });
    expect(router.navigate).toHaveBeenCalledWith(['sessions']);
  });
});

/* ------------------------------------------------------------------
   Tests unitaires – mise à jour
------------------------------------------------------------------ */
describe('FormComponent - mode update (unitaires)', () => {
  let component: FormComponent;
  let fixture  : ComponentFixture<FormComponent>;
  let api      : SessionApiService;
  let snackBar : MatSnackBar;
  let router   : Router;

  const sessionServiceStub = { sessionInformation: { admin: true } };
  const routerStub : Partial<Router> = { url: '/sessions/update/99', navigate: jest.fn() };
  const snackBarStub = { open: jest.fn() };
  const teacherServiceStub = { all: () => of([]) };
  const routeStub = { snapshot: { paramMap: { get: () => '99' } } } as unknown as ActivatedRoute;

  const fakeSession = {
    id: 99, name: 'Old name', description:'Flow',
    date: new Date(), capacity: 10, teacher_id: 1
  } as any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientTestingModule],
      declarations: [FormComponent],
      providers: [
        { provide: SessionService,  useValue: sessionServiceStub },
        { provide: TeacherService,  useValue: teacherServiceStub },
        { provide: Router,         useValue: routerStub },
        { provide: MatSnackBar,    useValue: snackBarStub },
        { provide: ActivatedRoute, useValue: routeStub },
        SessionApiService
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    api      = TestBed.inject(SessionApiService);
    snackBar = TestBed.inject(MatSnackBar);
    router   = TestBed.inject(Router) as unknown as Router;

    jest.spyOn(api, 'detail').mockReturnValue(of(fakeSession));
    jest.spyOn(api, 'update').mockReturnValue(of({ ...fakeSession, name: 'New name' }));

    fixture   = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('ne soumet pas si le formulaire est invalide (update)', () => {
    component.sessionForm.patchValue({ name: '' });
    component.submit();
    expect(api.update).not.toHaveBeenCalled();
  });

  it('appelle update() et redirige si le formulaire est valide', () => {
    component.sessionForm.patchValue({ name: 'New name' });
    component.submit();

    expect(api.update).toHaveBeenCalledWith('99', expect.objectContaining({ name: 'New name' }));
    expect(snackBar.open).toHaveBeenCalledWith('Session updated !','Close',{ duration: 3000 });
    expect(router.navigate).toHaveBeenCalledWith(['sessions']);
  });
});

/* ------------------------------------------------------------------
   Test d’intégration simulé (HttpClientTestingModule)
------------------------------------------------------------------ */
describe('FormComponent - Test d’intégration simulé', () => {
  let component: FormComponent;
  let fixture  : ComponentFixture<FormComponent>;
  let httpMock : HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientTestingModule],
      declarations: [FormComponent],
      providers: [
        SessionApiService,
        /* stub TeacherService pour éviter GET api/teacher */
        { provide: TeacherService, useValue: { all: () => of([]) } },
        { provide: MatSnackBar,   useValue: { open: jest.fn() } },
        { provide: Router,        useValue: { url: '/sessions/create', navigate: jest.fn() } },
        { provide: ActivatedRoute,useValue: { snapshot: { paramMap: { get: () => null } } } },
        { provide: SessionService,useValue: { sessionInformation: { admin: true } } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    fixture  = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;

    component.sessionForm = component['fb'].group({
      name: 'Test intégration',
      date: '2025-12-12',
      teacher_id: 1,
      description: 'test'
    });

    fixture.detectChanges();
  });

  it('devrait envoyer une requête POST via HttpClient', () => {
    const api = TestBed.inject(SessionApiService);
    api.create({ name: 'Test intégration' } as any).subscribe();

    const req = httpMock.expectOne('api/session');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ name: 'Test intégration' });

    req.flush({});
    httpMock.verify();
  });
});
