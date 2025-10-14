import BusquedaFilter from "../BusquedaFilter";
import EstadoSolicitudFilter from "./EstadoSolicitudFilter";
import FechaFilter from "../FechaFilter";

type Props = {
  filtro: string;
  setFiltro: (v: string) => void;
  estado: string;
  setEstado: (v: string) => void;
  rango: [Date | null, Date | null];
  setRango: (value: [Date | null, Date | null]) => void;
  child?: React.ReactNode;
};

export default function SolicitudFilter({ filtro, setFiltro, estado, setEstado, rango, setRango, child }: Props) {
  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start md:items-center justify-between mb-5">
      <BusquedaFilter filtro={filtro} onChange={setFiltro} />
      <FechaFilter rango={rango} onChange={setRango} />
      <EstadoSolicitudFilter estado={estado} onChange={setEstado} />
      {child}
    </div>
  );
}
