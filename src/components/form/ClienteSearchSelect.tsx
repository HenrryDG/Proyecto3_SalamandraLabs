import { useState, useEffect, useRef } from "react";
import { useClientes } from "../../hooks/cliente/useClientes";
import { Cliente } from "../../types/cliente";
import { ChevronDownIcon } from "../../icons";

interface ClienteSearchSelectProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    error?: boolean;
    hint?: string;
    disabled?: boolean;
}

export default function ClienteSearchSelect({
    value,
    onChange,
    placeholder = "Seleccionar cliente",
    error = false,
    hint,
    disabled = false,
}: ClienteSearchSelectProps) {
    const { clientes, loading } = useClientes();
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredClientes, setFilteredClientes] = useState<Cliente[]>([]);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Filtrar clientes basado en el término de búsqueda
    useEffect(() => {
        if (!searchTerm) {
            setFilteredClientes(clientes);
        } else {
            const filtered = clientes.filter((cliente) =>
                `${cliente.nombre} ${cliente.apellido_paterno} ${cliente.apellido_materno}`
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
            );
            setFilteredClientes(filtered);
        }
    }, [searchTerm, clientes]);

    // Cerrar dropdown al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearchTerm("");
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Obtener el cliente seleccionado
    const selectedCliente = clientes.find((cliente) => cliente.id.toString() === value);

    const handleSelect = (cliente: Cliente) => {
        onChange(cliente.id.toString());
        setIsOpen(false);
        setSearchTerm("");
    };

    const handleInputFocus = () => {
        setIsOpen(true);
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setIsOpen(true);
    };

    const displayValue = selectedCliente
        ? `${selectedCliente.nombre} ${selectedCliente.apellido_paterno} ${selectedCliente.apellido_materno}`
        : "";

    return (
        <div className="relative" ref={dropdownRef}>
            <div className="relative">
                <input
                    ref={inputRef}
                    type="text"
                    value={isOpen ? searchTerm : displayValue}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={`h-11 w-full rounded-lg border px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${error
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                        : "border-gray-300 dark:border-gray-700"
                        } ${disabled
                            ? "bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
                            : "bg-transparent"
                        }`}
                />
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    disabled={disabled}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
                >
                    <ChevronDownIcon
                        className={`size-4 transition-transform ${isOpen ? "rotate-180" : ""
                            }`}
                    />
                </button>
            </div>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute z-50 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900">
                    {loading ? (
                        <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                            Cargando clientes...
                        </div>
                    ) : filteredClientes.length === 0 ? (
                        <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                            {searchTerm ? "No se encontraron clientes" : "No hay clientes disponibles"}
                        </div>
                    ) : (
                        <div
                            className="overflow-y-auto no-scrollbar"
                            style={{
                                maxHeight: `${Math.min(filteredClientes.length, 3) * 48}px`,
                            }}
                        >
                            {filteredClientes.map((cliente) => (
                                <button
                                    key={cliente.id}
                                    type="button"
                                    onClick={() => handleSelect(cliente)}
                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                >
                                    {cliente.nombre} {cliente.apellido_paterno} {cliente.apellido_materno}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Hint/Error message */}
            {hint && (
                <p className={`mt-1 text-xs ${error ? "text-red-500" : "text-gray-500 dark:text-gray-400"}`}>
                    {hint}
                </p>
            )}
        </div>
    );
}
