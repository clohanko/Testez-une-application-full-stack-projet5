import { ComponentFixture, TestBed }     from '@angular/core/testing';
import { NO_ERRORS_SCHEMA }              from '@angular/core';
import { ActivatedRoute }                from '@angular/router';
import { MatSnackBar }                   from '@angular/material/snack-bar';
import { Router }                        from '@angular/router';
import { HttpClientTestingModule }       from '@angular/common/http/testing';
import { ReactiveFormsModule }           from '@angular/forms';
import { of }                            from 'rxjs';

import { DetailComponent }               from './detail.component';
import { SessionApiService }             from '../../services/session-api.service';
import { TeacherService }                from '../../../../services/teacher.service';
import { SessionService }                from '../../../../services/session.service';
import { expect, jest } from '@jest/globals';

describe('DetailComponent', () => {
  let component : DetailComponent;
  let fixture   : ComponentFixture<DetailComponent>;
  let sessionApi: SessionApiService;
  let teacherApi: TeacherService;
  let snackBar  : MatSnackBar;
  let router    : Router;

  const fakeSession = {
    id: 42,
    name: 'Yoga Flow',
    title: 'Yoga Flow',
    description: 'Relaxing session',
    date: new Date('2025-06-30T10:00:00Z'),
    capacity: 20,
    teacher_id: 5,
    users: [1, 4]
  } as any;

  const fakeTeacher = {
    id: 5,
    firstName: 'Alice',
    lastName : 'Smith',
    createdAt: new Date(),
    updatedAt: new Date()
  } as any;

  const routeStub = {
    snapshot: { paramMap: { get: (k: string) => (k === 'id' ? '42' : null) } }
  } as ActivatedRoute;

  const sessionServiceStub = {
    sessionInformation: { id: 1, admin: true }
  };

  const snackBarStub = { open: jest.fn() };
  const routerStub   = { navigate: jest.fn() };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,   // mock HttpClient
        ReactiveFormsModule        // fournit FormBuilder
      ],
      declarations: [DetailComponent],
      providers: [
        { provide: ActivatedRoute, useValue: routeStub },
        { provide: SessionService, useValue: sessionServiceStub },
        { provide: MatSnackBar,    useValue: snackBarStub },
        { provide: Router,         useValue: routerStub },
        SessionApiService,
        TeacherService
      ],
      schemas: [NO_ERRORS_SCHEMA]  
    }).compileComponents();

    sessionApi = TestBed.inject(SessionApiService);
    teacherApi = TestBed.inject(TeacherService);
    snackBar   = TestBed.inject(MatSnackBar);
    router     = TestBed.inject(Router);

    jest.spyOn(sessionApi, 'detail').mockReturnValue(of(fakeSession));
    jest.spyOn(sessionApi, 'delete').mockReturnValue(of({}));
    jest.spyOn(teacherApi, 'detail').mockReturnValue(of(fakeTeacher));

    fixture   = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
  });

  

  it('charge la session et le formateur au démarrage', async () => {
    fixture.detectChanges();               // ngOnInit()

    // appels aux services
    expect(sessionApi.detail).toHaveBeenCalledWith('42');
    expect(teacherApi.detail).toHaveBeenCalledWith('5');

    // attendre la fin du cycle async
    await fixture.whenStable();
    fixture.detectChanges();

    // propriétés
    expect(component.session).toEqual(fakeSession);
    expect(component.teacher).toEqual(fakeTeacher);
    expect(component.isParticipate).toBe(true);
    expect(component.isAdmin).toBe(true);

    // Vérifie que « Yoga Flow » apparaît quelque part dans la vue
    const native = fixture.nativeElement as HTMLElement;
    expect(native.textContent).toContain('Yoga Flow');
  });

  it('supprime la session puis redirige', () => {
    fixture.detectChanges();   // charge d’abord
    component.delete();        // appelle delete()

    expect(sessionApi.delete).toHaveBeenCalledWith('42');
    expect(snackBar.open).toHaveBeenCalledWith(
      'Session deleted !',
      'Close',
      { duration: 3000 }
    );
    expect(router.navigate).toHaveBeenCalledWith(['sessions']);
  });
});
