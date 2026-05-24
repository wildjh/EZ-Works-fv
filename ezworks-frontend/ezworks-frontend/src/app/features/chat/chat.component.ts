import { DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { Conversacion } from '../../core/models/api.models';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, DatePipe],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  readonly auth = inject(AuthService);

  readonly conv = signal<Conversacion | null>(null);
  readonly loading = signal(true);
  readonly sending = signal(false);
  readonly error = signal('');

  readonly form = this.fb.nonNullable.group({ contenido: [''] });

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.load(id);
  }

  load(id: number): void {
    this.api.getConversacion(id).subscribe({
      next: (c) => {
        this.conv.set(c);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.error?.detail ?? 'No se pudo cargar el chat');
        this.loading.set(false);
      },
    });
  }

  enviar(): void {
    const texto = this.form.value.contenido?.trim();
    const c = this.conv();
    if (!texto || !c) return;

    this.sending.set(true);
    this.api.enviarMensaje(c.id, texto).subscribe({
      next: () => {
        this.form.reset();
        this.sending.set(false);
        this.load(c.id);
      },
      error: (err) => {
        this.sending.set(false);
        this.error.set(err?.error?.detail ?? 'Error al enviar');
      },
    });
  }

  isMine(emisorId: number): boolean {
    return this.auth.currentUser()?.id === emisorId;
  }
}
