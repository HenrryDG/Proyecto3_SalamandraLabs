import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";
import { registerLocale } from "react-datepicker";
import { es } from "date-fns/locale/es"; 

registerLocale("es", es);


type Props = {
    rango: [Date | null, Date | null];
    onChange: (rango: [Date | null, Date | null]) => void;
};

export default function FechaFilter({ rango, onChange }: Props) {
    const [startDate, endDate] = rango;

    return (
        <div className="relative w-full md:w-80">
            <DatePicker
                onChange={(dates) => {
                    const [start, end] = dates as [Date | null, Date | null];
                    onChange([start, end]);
                }}
                startDate={startDate}
                endDate={endDate}
                selectsRange
                locale="es"
                isClearable
                maxDate={new Date()}
                dateFormat="yyyy-MM-dd"
                placeholderText="Seleccionar rango de fechas"
                className="w-full pl-[50px] pr-3 py-2 rounded-md border border-gray-300 bg-white text-gray-700 text-sm shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-500 focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
            <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3 py-3 text-gray-500 dark:border-gray-700 dark:text-gray-400">
                <FaCalendarAlt className="size-3" />
            </span>
        </div>
    );
}