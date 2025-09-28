import BusquedaFilter from "../BusquedaFilter";
import EstadoFilter from "../EstadoFilter";

type Props = {
    filtro: string;
    setFiltro: (value: string) => void;
    estado: string;
    setEstado: (value: string) => void;
    child?: React.ReactNode;
}

export default function ClienteFilter({ filtro, setFiltro, estado, setEstado, child }: Props) {
       return (
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start md:items-center justify-between mb-5">
            <BusquedaFilter filtro={filtro} onChange={setFiltro} />
            <EstadoFilter estado={estado} onChange={setEstado} />
            {child}
        </div>
    );
}
