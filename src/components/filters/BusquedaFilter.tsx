import { FaSearch } from "react-icons/fa";
import Input from "../form/input/InputField";


type Props = {
    filtro: string;
    onChange: (value: string) => void;
};

export default function BusquedaFilter({ filtro, onChange }: Props) {
    return (
        <div className="relative w-full md:w-64">
            <Input
                placeholder="Buscar..."
                type="text"
                value={filtro}
                onChange={(e) => onChange(e.target.value)}
                className="pl-[62px] w-full"
            />
            <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
                <FaSearch className="size-3" />
            </span>
        </div>
    );
}
