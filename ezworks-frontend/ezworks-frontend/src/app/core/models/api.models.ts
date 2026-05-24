export type RolCodigo = 'EMPLEADOR' | 'AYUDANTE' | 'ADMIN';
export type EstadoRequerimiento = 'BORRADOR' | 'PUBLICADO' | 'EN_MATCH' | 'FINALIZADO' | 'CANCELADO';
export type EstadoPostulacion = 'PENDIENTE' | 'ACEPTADA' | 'RECHAZADA' | 'RETIRADA';

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  userId: number;
  email: string;
  roles: string[];
  mensaje: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  telefono?: string;
  roles: RolCodigo[];
  aceptaTerminos: boolean;
}

export interface PerfilEmpleadorDto {
  id: number;
  calificacionPromedio: number;
  totalResenas: number;
}

export interface PerfilAyudanteDto {
  id: number;
  bio?: string;
  calificacionPromedio: number;
  totalResenas: number;
}

export interface UsuarioResponse {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  telefono?: string;
  estadoCuenta: string;
  roles: RolCodigo[];
  perfilEmpleador?: PerfilEmpleadorDto;
  perfilAyudante?: PerfilAyudanteDto;
  creadoEn: string;
}

export interface UpdatePerfilRequest {
  nombre?: string;
  apellido?: string;
  telefono?: string;
  bio?: string;
}

export interface Categoria {
  id: number;
  nombre: string;
  activa: boolean;
}

export interface Requerimiento {
  id: number;
  titulo: string;
  descripcion: string;
  remuneracion: number;
  estado: EstadoRequerimiento;
  categoriaId: number;
  categoriaNombre: string;
  empleadorId: number;
  zonaAproximada?: string;
  direccionExacta?: string;
  publicadoEn?: string;
  actualizadoEn?: string;
  emparejamientoId?: number;
}

export interface RequerimientoRequest {
  categoriaId: number;
  titulo: string;
  descripcion: string;
  remuneracion: number;
  zonaAproximada?: string;
  latitudAprox?: number;
  longitudAprox?: number;
  direccionExacta?: string;
  latitudExacta?: number;
  longitudExacta?: number;
}

export interface Postulacion {
  id: number;
  requerimientoId: number;
  ayudanteId: number;
  ayudanteNombre: string;
  ayudanteApellido: string;
  mensajePresentacion?: string;
  estado: EstadoPostulacion;
  creadoEn: string;
}

export interface Emparejamiento {
  id: number;
  requerimientoId: number;
  postulacionId: number;
  conversacionId: number;
  establecidoEn: string;
}

export interface Mensaje {
  id: number;
  conversacionId: number;
  emisorUsuarioId: number;
  emisorNombre: string;
  contenido: string;
  leido: boolean;
  enviadoEn: string;
}

export interface Conversacion {
  id: number;
  emparejamientoId: number;
  abiertaEn: string;
  mensajes: Mensaje[];
}

export interface ProblemDetail {
  title?: string;
  detail?: string;
  status?: number;
  errors?: Record<string, string>;
}
