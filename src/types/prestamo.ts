export interface Prestamo {
  id: number;
  cliente_nombre: string;
  monto_solicitado: string;
  monto_aprobado: string;
  monto_restante: string;
  interes: string;
  plazo_meses: number;
  fecha_desembolso: string; // YYYY-MM-DD
  fecha_plazo: string; // YYYY-MM-DD
  estado: string; // e.g., 'En curso', 'Mora', 'Completado'
  created_at: string;
  updated_at: string;
  solicitud: number;
}
