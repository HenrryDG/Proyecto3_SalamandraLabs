export interface Solicitud {
  id: number;
  empleado_nombre: string;
  cliente_nombre: string;
  monto_solicitado: string;
  proposito: string;
  plazo_meses: number;
  fecha_solicitud: string; // YYYY-MM-DD
  fecha_aprobacion: string | null; // YYYY-MM-DD or null
  estado: string; // e.g., 'Aprobada', 'Rechazada', 'Pendiente'
  observaciones: string | null;
  created_at: string;
  updated_at: string;
  empleado: number;
  cliente: number;
}

