import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';

import { SessionService }   from '../../../../services/session.service';
import { TeacherService }   from '../../../../services/teacher.service';
import { SessionApiService } from '../../services/session-api.service';
import { Session }          from '../../interfaces/session.interface';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {

  public onUpdate = false;
  public sessionForm!: FormGroup;              // non-nullable après initForm()
  public teachers$ = this.teacherService.all();
  private id?: string;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private sessionApi: SessionApiService,
    private sessionService: SessionService,
    private teacherService: TeacherService,
    private router: Router
  ) {}

  /* ---------- lifecycle ---------- */

  ngOnInit(): void {
    if (!this.sessionService.sessionInformation!.admin) {
      this.router.navigate(['/sessions']);
      return;
    }

    if (this.router.url.includes('update')) {
      this.onUpdate = true;
      this.id = this.route.snapshot.paramMap.get('id')!;
      this.sessionApi.detail(this.id).subscribe(s => this.initForm(s));
    } else {
      this.initForm();
    }
  }

  /* ---------- actions ---------- */

  submit(): void {
    /* ① bloque si invalide */
    if (this.sessionForm.invalid) {
      this.sessionForm.markAllAsTouched();   // affiche les erreurs
      return;
    }

    const session = this.sessionForm.value as Session;

    /* ② create vs update */
    const req$ = this.onUpdate
      ? this.sessionApi.update(this.id!, session)
      : this.sessionApi.create(session);

    req$.subscribe(() =>
      this.exitPage(this.onUpdate ? 'Session updated !' : 'Session created !')
    );
  }

  /* ---------- helpers ---------- */

  private initForm(session?: Session): void {
    this.sessionForm = this.fb.group({
      name: [
        session?.name ?? '',
        Validators.required
      ],
      date: [
        session ? new Date(session.date).toISOString().split('T')[0] : '',
        Validators.required
      ],
      teacher_id: [
        session?.teacher_id ?? '',
        Validators.required
      ],
      description: [
        session?.description ?? '',
        [Validators.required, Validators.max(2000)]
      ]
    });
  }

  private exitPage(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 3000 });
    this.router.navigate(['sessions']);
  }
}
