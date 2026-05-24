import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {
  Categoria,
  Conversacion,
  Emparejamiento,
  Mensaje,
  Postulacion,
  Requerimiento,
  RequerimientoRequest,
  UpdatePerfilRequest,
  UsuarioResponse,
} from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly api = environment.apiUrl;

  getCategorias() {
    return this.http.get<Categoria[]>(`${this.api}/api/categorias`);
  }

  getMe() {
    return this.http.get<UsuarioResponse>(`${this.api}/api/usuarios/me`);
  }

  updateMe(body: UpdatePerfilRequest) {
    return this.http.patch<UsuarioResponse>(`${this.api}/api/usuarios/me`, body);
  }

  getVacantes() {
    return this.http.get<Requerimiento[]>(`${this.api}/api/requerimientos/vacantes`);
  }

  getMisRequerimientos() {
    return this.http.get<Requerimiento[]>(`${this.api}/api/requerimientos/mis`);
  }

  getRequerimiento(id: number) {
    return this.http.get<Requerimiento>(`${this.api}/api/requerimientos/${id}`);
  }

  crearRequerimiento(body: RequerimientoRequest) {
    return this.http.post<Requerimiento>(`${this.api}/api/requerimientos`, body);
  }

  actualizarRequerimiento(id: number, body: RequerimientoRequest) {
    return this.http.put<Requerimiento>(`${this.api}/api/requerimientos/${id}`, body);
  }

  publicarRequerimiento(id: number) {
    return this.http.post<Requerimiento>(`${this.api}/api/requerimientos/${id}/publicar`, {});
  }

  postular(requerimientoId: number, mensajePresentacion?: string) {
    return this.http.post<Postulacion>(
      `${this.api}/api/requerimientos/${requerimientoId}/postulaciones`,
      { mensajePresentacion: mensajePresentacion ?? '' }
    );
  }

  getPostulaciones(requerimientoId: number) {
    return this.http.get<Postulacion[]>(
      `${this.api}/api/requerimientos/${requerimientoId}/postulaciones`
    );
  }

  crearMatch(requerimientoId: number, postulacionId: number) {
    return this.http.post<Emparejamiento>(
      `${this.api}/api/requerimientos/${requerimientoId}/match`,
      { postulacionId }
    );
  }

  getConversacion(id: number) {
    return this.http.get<Conversacion>(`${this.api}/api/conversaciones/${id}`);
  }

  getConversacionPorEmparejamiento(emparejamientoId: number) {
    return this.http.get<Conversacion>(
      `${this.api}/api/conversaciones/emparejamiento/${emparejamientoId}`
    );
  }

  enviarMensaje(conversacionId: number, contenido: string) {
    return this.http.post<Mensaje>(
      `${this.api}/api/conversaciones/${conversacionId}/mensajes`,
      { contenido }
    );
  }
}
