import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../ui/table";
import Button from "../../ui/button/Button";
import Badge from "../../ui/badge/Badge";
import { PlanPago } from "../../../types/planPago";
import { MdPayment } from "react-icons/md";

type Props = {
    planPagos: PlanPago[];
    onPagar: (planPago: PlanPago) => void;
}

export default function PlanPagoTable({ planPagos, onPagar }: Props) {
    const formatCurrency = (value: string) => {
        return parseFloat(value).toFixed(2);
    };

    const getEstadoBadgeColor = (estado: string): 'success' | 'warning' | 'error' => {
        switch (estado) {
            case 'Pagada':
                return 'success';
            case 'Pendiente':
                return 'warning';
            case 'Vencida':
                return 'error';
            default:
                return 'warning';
        }
    };

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
                <Table>
                    <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                        <TableRow>
                            <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                                Cuota #
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                                Fecha Vencimiento
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                                Monto Cuota (Bs.)
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                                Mora (Bs.)
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                                Total (Bs.)
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                                Fecha Pago
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                                Método Pago
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                                Estado
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                                Acciones
                            </TableCell>
                        </TableRow>
                    </TableHeader>

                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                        {planPagos.map((planPago, index) => {
                            const total = parseFloat(planPago.monto_cuota) + parseFloat(planPago.mora_cuota);
                            
                            return (
                                <TableRow key={planPago.id}>
                                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                        {index + 1}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                        {new Date(planPago.fecha_vencimiento).toLocaleDateString('es-ES')}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                        {formatCurrency(planPago.monto_cuota)}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                        {parseFloat(planPago.mora_cuota) > 0 ? (
                                            <span className="text-red-600 dark:text-red-400 font-semibold">
                                                {formatCurrency(planPago.mora_cuota)}
                                            </span>
                                        ) : (
                                            formatCurrency(planPago.mora_cuota)
                                        )}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400 font-semibold">
                                        {total.toFixed(2)}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                        {planPago.fecha_pago 
                                            ? new Date(planPago.fecha_pago).toLocaleDateString('es-ES')
                                            : '-'
                                        }
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                        {planPago.metodo_pago || '-'}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                        <Badge
                                            size="sm"
                                            color={getEstadoBadgeColor(planPago.estado)}
                                        >
                                            {planPago.estado}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="px-4 py-3">
                                        {planPago.estado !== 'Pagada' && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                startIcon={<MdPayment className="size-4" />}
                                                onClick={() => onPagar(planPago)}
                                            >
                                                Pagar
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
