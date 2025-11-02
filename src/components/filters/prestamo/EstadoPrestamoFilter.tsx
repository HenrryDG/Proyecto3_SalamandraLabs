import Label from "../../form/Label.tsx";
import Select from "../../form/Select.tsx";
import { estadosPrestamo } from "../../../shared/index.ts";

type Props = {
    estado: string;
    onChange: (value: string) => void;
};

export default function EstadoSolicitudFilter({ estado, onChange }: Props) {
    return (
        <div className="flex w-full md:w-auto flex-row gap-3 items-center">
            <Label>Estado</Label>
            <Select
                options={estadosPrestamo.map(e => ({ value: e.value.toString(), label: e.label }))}
                defaultValue={estado}
                onChange={onChange}
            />
        </div>
    );
}