import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../ui/table";
import Button from "../../ui/button/Button";
import Badge from "../../ui/badge/Badge";
import { TbReportMoney } from "react-icons/tb";
import { Prestamo } from "../../../types/prestamo";
import PlanPagosModal from "../../modals/planPago/PlanPagosModal";

type Props = {
    prestamos: Prestamo[];
}

export default function PrestamoTable({ prestamos }: Props) {
    const [selectedPrestamoId, setSelectedPrestamoId] = useState<number | null>(null);
    const [selectedClienteNombre, setSelectedClienteNombre] = useState<string>("");
    const [isPlanPagosModalOpen, setIsPlanPagosModalOpen] = useState(false);

    const handleOpenPlanPagos = (prestamo: Prestamo) => {
        setSelectedPrestamoId(prestamo.id);
        setSelectedClienteNombre(prestamo.cliente_nombre);
        setIsPlanPagosModalOpen(true);
    };

    const handleClosePlanPagos = () => {
        setIsPlanPagosModalOpen(false);
        setSelectedPrestamoId(null);
        setSelectedClienteNombre("");
    };
    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
                <Table>
                    <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                        <TableRow>
                            <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Cliente</TableCell>
                            <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Monto Solicitado (Bs.)</TableCell>
                            <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Monto Aprobado (Bs.)</TableCell>
                            <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Fecha Desembolso</TableCell>
                            <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Interes Mensual</TableCell>
                            <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Plazo Meses</TableCell>
                            <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Fecha Plazo</TableCell>
                            <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Estado</TableCell>
                            <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Plan de Pagos</TableCell>
                        </TableRow>
                    </TableHeader>

                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                        {prestamos.map((prestamo) => (
                            <TableRow key={prestamo.id}>
                                <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                    {prestamo.cliente_nombre}
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                    {prestamo.monto_solicitado}
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                    {prestamo.monto_aprobado}
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                    {prestamo.fecha_desembolso}
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                    {prestamo.interes}%
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                    {prestamo.plazo_meses}
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                    {prestamo.fecha_plazo}
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                    <Badge
                                        size="sm"
                                        color={
                                            prestamo.estado === "En Curso"
                                                ? "warning"
                                                : prestamo.estado === "Completado"
                                                    ? "success"
                                                    : "error"
                                        }
                                    >
                                        {prestamo.estado}
                                    </Badge>
                                </TableCell>

                                <TableCell className="px-4 py-3 flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="md"
                                        endIcon={<TbReportMoney className="size-5" />}
                                        title="Ver Plan de Pagos"
                                        onClick={() => handleOpenPlanPagos(prestamo)}
                                    >
                                        {" "}
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Modal de Plan de Pagos */}
            <PlanPagosModal
                isOpen={isPlanPagosModalOpen}
                onClose={handleClosePlanPagos}
                prestamoId={selectedPrestamoId}
                clienteNombre={selectedClienteNombre}
            />
        </div>
    );
}
