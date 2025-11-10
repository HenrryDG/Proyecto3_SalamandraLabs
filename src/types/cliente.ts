export interface Cliente {
  id: number;
  user?: string;             // El username del usuario asociado (opcional)
  carnet: string;
  complemento?: string;
  nombre: string;
  apellido_paterno: string;
  apellido_materno?: string;
  lugar_trabajo: string;
  tipo_trabajo: string;
  ingreso_mensual: number;
  direccion: string;
  correo?: string;
  telefono: number;
  activo: boolean;  
  created_at: string;
  updated_at: string;
}

export interface ClienteDTO {
  username?: string;        
  password?: string;     
  carnet: string;
  complemento?: string;
  nombre: string;
  apellido_paterno: string;
  apellido_materno?: string;
  lugar_trabajo: string;
  tipo_trabajo: string;
  ingreso_mensual: string; 
  direccion: string;
  correo?: string;
  telefono: number;
}

export interface ClienteEditDTO {
  carnet?: string;
  complemento?: string;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  lugar_trabajo: string;
  tipo_trabajo: string;
  ingreso_mensual: number;
  direccion: string;
  correo?: string;
  telefono: number;
}
