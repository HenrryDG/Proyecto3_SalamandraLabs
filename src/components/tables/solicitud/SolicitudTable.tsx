import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import Button from "../../ui/button/Button";
import Badge from "../../ui/badge/Badge";
import { MoreDotIcon, FileIcon } from "../../../icons";
import { Solicitud } from "../../../types/solicitud";

type Props = {
  solicitudes: Solicitud[];
  onEdit: (solicitud: Solicitud) => void;
  onView: (solicitud: Solicitud) => void;
};

export default function SolicitudTable({ solicitudes, onEdit, onView }: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Empleado</TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Cliente</TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Monto Solicitado (Bs.)</TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Propósito</TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Fecha Solicitud</TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Estado</TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Acciones / Documentos</TableCell>            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {solicitudes.map((solicitud) => (
              <TableRow key={solicitud.id}>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <div className="flex items-center gap-3">
                    <div>
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {solicitud.empleado_nombre}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {solicitud.cliente_nombre}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {solicitud.monto_solicitado}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {solicitud.proposito}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {solicitud.fecha_solicitud ? solicitud.fecha_solicitud : "-"}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  <Badge
                    size="sm"
                    color={
                      solicitud.estado === "Aprobada"
                        ? "success"
                        : solicitud.estado === "Rechazada"
                          ? "error"
                          : "warning"
                    }
                  >
                    {solicitud.estado}
                  </Badge>
                </TableCell>

                <TableCell className="px-4 py-3 flex gap-2">
                  <Button
                    variant="outline"
                    size="md"
                    endIcon={<MoreDotIcon className="size-5" />}
                    onClick={() => onEdit(solicitud)}
                  >
                    {" "}
                  </Button>

                  <Button
                    variant="outline"
                    size="md"
                    endIcon={<FileIcon className="size-5" />}
                    onClick={() => onView(solicitud)}
                    disabled={solicitud.estado === "Rechazada"}
                  >
                    {" "}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
