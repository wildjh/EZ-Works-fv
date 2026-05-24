import { CurrencyPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { Postulacion, Requerimiento } from '../../../core/models/api.models';

@Component({
  selector: 'app-requerimiento-detalle',
  standalone: true,
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './requerimiento-detalle.component.html',
  styleUrl: './requerimiento-detalle.component.css',
})
export class RequerimientoDetalleComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly req = signal<Requerimiento | null>(null);
  readonly postulaciones = signal<Postulacion[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly actionMsg = signal('');
  readonly conversacionId = signal<number | null>(null);

  private id = 0;

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.api.getRequerimiento(this.id).subscribe({
      next: (r) => {
        this.req.set(r);
        this.loading.set(false);
        if (r.estado === 'PUBLICADO' || r.estado === 'EN_MATCH') {
          this.loadPostulaciones();
        }
        if (r.emparejamientoId) {
          this.api.getConversacionPorEmparejamiento(r.emparejamientoId).subscribe({
            next: (c) => this.conversacionId.set(c.id),
          });
        }
      },
      error: (err) => {
        this.error.set(err?.error?.detail ?? 'No encontrado');
        this.loading.set(false);
      },
    });
  }

  loadPostulaciones(): void {
    this.api.getPostulaciones(this.id).subscribe({
      next: (p) => this.postulaciones.set(p),
    });
  }

  publicar(): void {
    this.api.publicarRequerimiento(this.id).subscribe({
      next: (r) => {
        this.req.set(r);
        this.actionMsg.set('Publicado correctamente');
        this.loadPostulaciones();
      },
      error: (err) => this.error.set(err?.error?.detail ?? 'No se pudo publicar'),
    });
  }

  match(postulacionId: number): void {
    this.api.crearMatch(this.id, postulacionId).subscribe({
      next: (m) => {
        this.actionMsg.set('Match realizado');
        this.router.navigate(['/chat', m.conversacionId]);
      },
      error: (err) => this.error.set(err?.error?.detail ?? 'No se pudo hacer match'),
    });
  }
}
