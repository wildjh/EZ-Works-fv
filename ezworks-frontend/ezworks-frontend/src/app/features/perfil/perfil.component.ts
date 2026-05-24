import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css',
})
export class PerfilComponent implements OnInit {
  private readonly api = inject(ApiService);
  readonly auth = inject(AuthService);
  private readonly fb = inject(FormBuilder);

  readonly saving = signal(false);
  readonly message = signal('');
  readonly error = signal('');

  readonly form = this.fb.nonNullable.group({
    nombre: [''],
    apellido: [''],
    telefono: [''],
    bio: [''],
  });

  ngOnInit(): void {
    const u = this.auth.currentUser();
    if (u) {
      this.patchForm(u);
    } else {
      this.api.getMe().subscribe((user) => {
        this.auth.currentUser.set(user);
        this.patchForm(user);
      });
    }
  }

  private patchForm(u: {
    nombre: string;
    apellido: string;
    telefono?: string;
    perfilAyudante?: { bio?: string };
  }): void {
    this.form.patchValue({
      nombre: u.nombre,
      apellido: u.apellido,
      telefono: u.telefono ?? '',
      bio: u.perfilAyudante?.bio ?? '',
    });
  }

  submit(): void {
    this.saving.set(true);
    this.message.set('');
    this.error.set('');
    this.api.updateMe(this.form.getRawValue()).subscribe({
      next: (u) => {
        this.auth.currentUser.set(u);
        this.saving.set(false);
        this.message.set('Perfil actualizado');
      },
      error: (err) => {
        this.saving.set(false);
        this.error.set(err?.error?.detail ?? 'Error al guardar');
      },
    });
  }
}
