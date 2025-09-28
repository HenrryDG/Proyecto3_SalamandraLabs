export interface Cliente{
    id: number;
    carnet: string;
    nombre: string;
    apellido_paterno: string;
    apellido_materno: string;
    lugar_trabajo: string;
    tipo_trabajo: string;
    ingreso_mensual: number;
    direccion: string;
    correo: string;
    telefono: number;
    activo: boolean;
}

export interface ClienteDTO {
  carnet: string;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  lugar_trabajo: string;
  tipo_trabajo: string;
  ingreso_mensual: string;
  direccion: string;
  correo: string;
  telefono: number;
}