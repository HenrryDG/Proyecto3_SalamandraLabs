import type React from "react";
import type { FC } from "react";

interface InputProps {
  label?: string;
  type?: "text" | "number" | "email" | "password" | "date" | "time" | string;
  id?: string;
  name?: string;
  placeholder?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  min?: string | number;  // ✅ acepta string o number
  max?: string | number;  // ✅ acepta string o number
  step?: number;
  disabled?: boolean;
  success?: boolean;
  error?: boolean;
  hint?: string;
  required?: boolean;
  maxLength?: number;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  // Filtra solo dígitos y respeta maxLength
  digitsOnly?: boolean;
  // Filtra solo letras (incluye acentos y espacios) y respeta maxLength
  lettersOnly?: boolean;
  // Modo decimal: restringe a formato \d{0,maxInteger}(\.\d{0,maxDecimal})?
  decimal?: boolean;
  maxIntegerDigits?: number;
  maxDecimalDigits?: number;
}


const Input: FC<InputProps> = ({
  label,
  type = "text",
  id,
  name,
  placeholder,
  value,
  onChange,
  className = "",
  min,
  max,
  step,
  disabled = false,
  success = false,
  error = false,
  hint,
  required = false,
  maxLength,
  inputMode,
  digitsOnly,
  lettersOnly,
  decimal,
  maxIntegerDigits = 6,
  maxDecimalDigits = 2,
}) => {
  let inputClasses = `h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 ${className}`;

  if (disabled) {
    inputClasses += ` text-gray-500 border-gray-300 opacity-40 bg-gray-100 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700`;
  } else if (error) {
    inputClasses += ` border-error-500 focus:border-error-300 focus:ring-error-500/20 dark:text-error-400 dark:border-error-500 dark:focus:border-error-800`;
  } else if (success) {
    inputClasses += ` border-success-500 focus:border-success-300 focus:ring-success-500/20 dark:text-success-400 dark:border-success-500 dark:focus:border-success-800`;
  } else {
    inputClasses += ` bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-800`;
  }

  const nextValueFromInsertion = (
    currentValue: string,
    data: string,
    selectionStart: number,
    selectionEnd: number,
  ): string => {
    const before = currentValue.slice(0, selectionStart);
    const after = currentValue.slice(selectionEnd);
    return `${before}${data}${after}`;
  };

  const isValidDecimalValue = (value: string): boolean => {
    const regex = new RegExp(`^\\d{0,${maxIntegerDigits}}(\\.\\d{0,${maxDecimalDigits}})?$`);
    return regex.test(value);
  };

  // Prevención de entrada antes de insertar (digitsOnly / lettersOnly / decimal)
  const handleBeforeInput: React.FormEventHandler<HTMLInputElement> | undefined =
    digitsOnly
      ? (e) => {
        const be = e as unknown as InputEvent;
        const data = (be && (be as any).data) as string | null;
        if (!data) return; // borrar/inputs especiales
        if (!/^\d+$/.test(data)) {
          e.preventDefault();
        }
      }
      : lettersOnly
        ? (e) => {
          const be = e as unknown as InputEvent;
          const data = (be && (be as any).data) as string | null;
          if (!data) return;
          // Permite letras unicode y espacio
          const lettersRegex = /^[\p{L} ]+$/u;
          if (!lettersRegex.test(data)) {
            e.preventDefault();
          }
        }
        : decimal
          ? (e) => {
            const input = e.target as HTMLInputElement;
            const be = e as unknown as InputEvent;
            const data = (be && (be as any).data) as string | null;
            if (!data) return;
            // solo permitir dígitos o punto
            if (!/^[0-9.]$/.test(data)) {
              e.preventDefault();
              return;
            }
            const start = input.selectionStart ?? input.value.length;
            const end = input.selectionEnd ?? input.value.length;
            const next = nextValueFromInsertion(input.value, data, start, end);
            // no permitir más de un punto
            if ((next.match(/\./g) || []).length > 1) {
              e.preventDefault();
              return;
            }
            if (!isValidDecimalValue(next)) {
              e.preventDefault();
            }
          }
          : undefined;

  // Filtrado de teclas
  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> | undefined =
    digitsOnly
      ? (e) => {
        const allowedKeys = [
          "Backspace",
          "Delete",
          "Tab",
          "ArrowLeft",
          "ArrowRight",
          "Home",
          "End",
          "Enter",
        ];
        if (allowedKeys.includes(e.key)) return;
        if (!/^[0-9]$/.test(e.key)) {
          e.preventDefault();
        }
      }
      : lettersOnly
        ? (e) => {
          const allowedKeys = [
            "Backspace",
            "Delete",
            "Tab",
            "ArrowLeft",
            "ArrowRight",
            "Home",
            "End",
            "Enter",
            " ", // espacio
          ];
          if (allowedKeys.includes(e.key)) return;
          // Permite letras unicode (una sola tecla)
          const singleLetter = /^\p{L}$/u;
          if (!singleLetter.test(e.key)) {
            e.preventDefault();
          }
        }
        : decimal
          ? (e) => {
            const input = e.target as HTMLInputElement;
            const allowedKeys = [
              "Backspace",
              "Delete",
              "Tab",
              "ArrowLeft",
              "ArrowRight",
              "Home",
              "End",
              "Enter",
            ];
            if (allowedKeys.includes(e.key)) return;
            if (!/^[0-9.]$/.test(e.key)) {
              e.preventDefault();
              return;
            }
            // bloquear segundo punto
            if (e.key === "." && input.value.includes(".")) {
              e.preventDefault();
              return;
            }
            // validar siguiente valor (relleno simple)
            const start = input.selectionStart ?? input.value.length;
            const end = input.selectionEnd ?? input.value.length;
            const next = nextValueFromInsertion(input.value, e.key, start, end);
            if (!isValidDecimalValue(next)) {
              e.preventDefault();
            }
          }
          : undefined;

  // Validación de pegado: aplica filtro y respeta maxLength / formato decimal
  const handlePaste: React.ClipboardEventHandler<HTMLInputElement> | undefined =
    digitsOnly
      ? (e) => {
        const text = e.clipboardData.getData("text");
        const filtered = text.replace(/\D+/g, "");
        if (filtered.length === 0) {
          e.preventDefault();
          return;
        }
        if (maxLength) {
          const current = (e.target as HTMLInputElement).value;
          const selectionStart = (e.target as HTMLInputElement).selectionStart ?? current.length;
          const selectionEnd = (e.target as HTMLInputElement).selectionEnd ?? current.length;
          const newLen = current.length - (selectionEnd - selectionStart) + filtered.length;
          if (newLen > maxLength) {
            e.preventDefault();
            const room = maxLength - (current.length - (selectionEnd - selectionStart));
            const toInsert = room > 0 ? filtered.slice(0, room) : "";
            const next = current.slice(0, selectionStart) + toInsert + current.slice(selectionEnd);
            (e.target as HTMLInputElement).value = next;
            if (onChange) {
              const evt = {
                ...e,
                target: e.target as HTMLInputElement,
                currentTarget: e.target as HTMLInputElement,
              } as unknown as React.ChangeEvent<HTMLInputElement>;
              onChange(evt);
            }
          }
        }
      }
      : lettersOnly
        ? (e) => {
          const text = e.clipboardData.getData("text");
          // Mantener solo letras unicode y espacios
          const filtered = text.replace(/[^\p{L} ]+/gu, "");
          if (filtered.length === 0) {
            e.preventDefault();
            return;
          }
          if (maxLength) {
            const current = (e.target as HTMLInputElement).value;
            const selectionStart = (e.target as HTMLInputElement).selectionStart ?? current.length;
            const selectionEnd = (e.target as HTMLInputElement).selectionEnd ?? current.length;
            const newLen = current.length - (selectionEnd - selectionStart) + filtered.length;
            if (newLen > maxLength) {
              e.preventDefault();
              const room = maxLength - (current.length - (selectionEnd - selectionStart));
              const toInsert = room > 0 ? filtered.slice(0, room) : "";
              const next = current.slice(0, selectionStart) + toInsert + current.slice(selectionEnd);
              (e.target as HTMLInputElement).value = next;
              if (onChange) {
                const evt = {
                  ...e,
                  target: e.target as HTMLInputElement,
                  currentTarget: e.target as HTMLInputElement,
                } as unknown as React.ChangeEvent<HTMLInputElement>;
                onChange(evt);
              }
            }
          }
        }
        : decimal
          ? (e) => {
            const input = e.target as HTMLInputElement;
            const text = e.clipboardData.getData("text");
            // Mantener dígitos y el primer punto
            const onlyValid = text.replace(/[^0-9.]+/g, "");
            const firstDotIndex = onlyValid.indexOf(".");
            let intPart = onlyValid;
            let decPart = "";
            if (firstDotIndex !== -1) {
              intPart = onlyValid.slice(0, firstDotIndex);
              // remover puntos restantes
              decPart = onlyValid.slice(firstDotIndex + 1).replace(/\./g, "");
            }
            intPart = intPart.slice(0, maxIntegerDigits);
            decPart = decPart.slice(0, maxDecimalDigits);
            const pasteValue = firstDotIndex !== -1 ? `${intPart}.${decPart}` : intPart;

            const current = input.value;
            const selectionStart = input.selectionStart ?? current.length;
            const selectionEnd = input.selectionEnd ?? current.length;
            const next = nextValueFromInsertion(current, pasteValue, selectionStart, selectionEnd);

            if (!isValidDecimalValue(next)) {
              e.preventDefault();
              const truncated = (() => {
                // construir valor truncado válido
                const before = current.slice(0, selectionStart);
                const after = current.slice(selectionEnd);
                // intentar insertar de forma incremental
                let candidate = before + pasteValue + after;
                // normalizar múltiples puntos
                const idx = candidate.indexOf(".");
                if (idx !== -1) {
                  const left = candidate.slice(0, idx).replace(/\./g, "").slice(0, maxIntegerDigits);
                  const right = candidate.slice(idx + 1).replace(/\./g, "").slice(0, maxDecimalDigits);
                  candidate = `${left}${right.length > 0 ? "." + right : "." + right}`;
                } else {
                  candidate = candidate.replace(/\./g, "").slice(0, maxIntegerDigits);
                }
                // como fallback, asegurar regex
                const match = candidate.match(new RegExp(`^\\d{0,${maxIntegerDigits}}(\\.\\d{0,${maxDecimalDigits}})?`));
                return match ? match[0] : "";
              })();
              (e.target as HTMLInputElement).value = truncated;
              if (onChange) {
                const evt = {
                  ...e,
                  target: e.target as HTMLInputElement,
                  currentTarget: e.target as HTMLInputElement,
                } as unknown as React.ChangeEvent<HTMLInputElement>;
                onChange(evt);
              }
              return;
            }
          }
          : undefined;

  return (
    <div className="relative w-full flex flex-col gap-1">
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          {label}
        </label>
      )}

      <input
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        required={required}
        className={inputClasses}
        maxLength={maxLength}
        inputMode={inputMode}
        onBeforeInput={handleBeforeInput}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
      />

      {hint && (
        <p
          className={`mt-1.5 text-xs ${error
            ? "text-error-500"
            : success
              ? "text-success-500"
              : "text-gray-500"
            }`}
        >
          {hint}
        </p>
      )}
    </div>
  );
};

export default Input;