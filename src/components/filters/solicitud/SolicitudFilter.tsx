import BusquedaFilter from "../BusquedaFilter";

type Props = {
  filtro: string;
  setFiltro: (v: string) => void;
  // estado: string;
  // setEstado: (v: string) => void;
  child?: React.ReactNode;
};

export default function SolicitudFilter({ filtro, setFiltro, child }: Props) {
  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start md:items-center justify-between mb-5">
      <BusquedaFilter filtro={filtro} onChange={setFiltro} />
      {child}
    </div>
  );
}
