export interface Solicitud {
  id: number;
  empleado_nombre: string;
  cliente_nombre: string;
  cliente_ingreso_mensual?: string; // Ingreso mensual
  monto_solicitado: string;
  monto_aprobado?: string | null; // Monto aprobado del préstamo asociado
  plazo_meses?: number | null;
  proposito: string;
  fecha_solicitud: string; // YYYY-MM-DD
  fecha_aprobacion: string | null; // YYYY-MM-DD or null
  fecha_plazo?: string | null; // YYYY-MM-DD or null
  estado: string; // e.g., 'Aprobada', 'Rechazada', 'Pendiente'
  observaciones: string | null;
  created_at: string;
  updated_at: string;
  empleado: number;
  cliente: number;
}

