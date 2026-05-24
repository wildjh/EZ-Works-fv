import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { Categoria } from '../../../core/models/api.models';

@Component({
  selector: 'app-requerimiento-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './requerimiento-form.component.html',
  styleUrl: './requerimiento-form.component.css',
})
export class RequerimientoFormComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  readonly categorias = signal<Categoria[]>([]);
  readonly loading = signal(false);
  readonly error = signal('');

  readonly form = this.fb.nonNullable.group({
    categoriaId: [0, [Validators.required, Validators.min(1)]],
    titulo: ['', Validators.required],
    descripcion: ['', Validators.required],
    remuneracion: [0, [Validators.required, Validators.min(1)]],
    zonaAproximada: [''],
    direccionExacta: [''],
  });

  ngOnInit(): void {
    this.api.getCategorias().subscribe((c) => this.categorias.set(c));
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.error.set('');
    const v = this.form.getRawValue();
    this.api
      .crearRequerimiento({
        categoriaId: v.categoriaId,
        titulo: v.titulo,
        descripcion: v.descripcion,
        remuneracion: v.remuneracion,
        zonaAproximada: v.zonaAproximada || undefined,
        direccionExacta: v.direccionExacta || undefined,
      })
      .subscribe({
        next: (r) => this.router.navigate(['/empleador/requerimientos', r.id]),
        error: (err) => {
          this.loading.set(false);
          this.error.set(err?.error?.detail ?? 'Error al crear');
        },
      });
  }
}
