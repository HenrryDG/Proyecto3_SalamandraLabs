export interface Empleado {
  id: number;
  user: string;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  correo: string | null;
  telefono: number;
  rol: string;
  activo: boolean;
  password?: string;
  created_at: string; 
  updated_at: string;
}

export interface EmpleadoDTO {
  username: string;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  correo?: string;
  telefono: number;
  rol: string;
  password?: string;
}

export interface EmpleadoEditDTO {
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  correo?: string;
  telefono: number;
  rol: string;
}
