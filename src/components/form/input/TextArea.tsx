import React from "react";

interface TextareaProps {
  placeholder?: string; // Placeholder text
  rows?: number; // Number of rows
  value?: string; // Current value
  onChange?: (value: string) => void; // Change handler
  className?: string; // Additional CSS classes
  disabled?: boolean; // Disabled state
  error?: boolean; // Error state
  hint?: string; // Hint text to display
  lettersOnly?: boolean; // Filtra letras, números, espacios y caracteres de puntuación básicos
  maxLength?: number; // Longitud máxima de caracteres
}

const TextArea: React.FC<TextareaProps> = ({
  placeholder = "Enter your message", // Default placeholder
  rows = 3, // Default number of rows
  value = "", // Default value
  onChange, // Callback for changes
  className = "", // Additional custom styles
  disabled = false, // Disabled state
  error = false, // Error state
  hint = "", // Default hint text
  lettersOnly = false, // Permite letras, números y puntuación
  maxLength, // Longitud máxima de caracteres
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) {
      let value = e.target.value;

      // Eliminar espacios iniciales
      value = value.replace(/^\s+/, "");

      // Evitar que el campo quede con solo espacios
      if (value.trim() === "") value = "";

      onChange(value);
    }
  };

  // Prevención de entrada antes de insertar (lettersOnly)
  const handleBeforeInput: React.FormEventHandler<HTMLTextAreaElement> | undefined =
    lettersOnly
      ? (e) => {
        const be = e as unknown as InputEvent;
        const data = (be && (be as any).data) as string | null;
        if (!data) return;
        // Permite letras unicode, números, espacios y caracteres de puntuación: . , : ; - ( )
        const allowedRegex = /^[\p{L}0-9 .,;:\-()]+$/u;
        if (!allowedRegex.test(data)) {
          e.preventDefault();
        }
      }
      : undefined;

  // Filtrado de teclas
  const handleKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> | undefined =
    lettersOnly
      ? (e) => {
        const allowedKeys = [
          "Backspace",
          "Delete",
          "Tab",
          "ArrowLeft",
          "ArrowRight",
          "ArrowUp",
          "ArrowDown",
          "Home",
          "End",
          "Enter",
          " ", // espacio
        ];
        if (allowedKeys.includes(e.key)) return;
        // Permite letras unicode, números y caracteres de puntuación
        const allowedCharRegex = /^[\p{L}0-9.,;:\-()]$/u;
        if (!allowedCharRegex.test(e.key)) {
          e.preventDefault();
        }
      }
      : undefined;

  // Validación de pegado: aplica filtro
  const handlePaste: React.ClipboardEventHandler<HTMLTextAreaElement> | undefined =
    lettersOnly
      ? (e) => {
        const text = e.clipboardData.getData("text");
        // Mantener solo letras unicode, números, espacios y caracteres de puntuación permitidos
        const filtered = text.replace(/[^\p{L}0-9 .,;:\-()]+/gu, "");
        if (filtered.length === 0) {
          e.preventDefault();
          return;
        }
        // Si el texto filtrado es diferente al original, prevenir el pegado
        if (filtered !== text) {
          e.preventDefault();
          // Insertar solo el texto filtrado
          const textarea = e.target as HTMLTextAreaElement;
          const start = textarea.selectionStart ?? textarea.value.length;
          const end = textarea.selectionEnd ?? textarea.value.length;
          const before = textarea.value.slice(0, start);
          const after = textarea.value.slice(end);
          const newValue = before + filtered + after;
          if (onChange) {
            onChange(newValue);
          }
        }
      }
      : undefined;

  let textareaClasses = `w-full rounded-lg border px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden resize-none no-scrollbar ${className} `;

  if (disabled) {
    textareaClasses += ` bg-gray-100 opacity-50 text-gray-500 border-gray-300 cursor-not-allowed opacity40 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700`;
  } else if (error) {
    textareaClasses += ` bg-transparent  border-gray-300 focus:border-error-300 focus:ring-3 focus:ring-error-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-error-800`;
  } else {
    textareaClasses += ` bg-transparent text-gray-900 dark:text-gray-300 text-gray-900 border-gray-300 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800`;
  }

  return (
    <div className="relative">
      <textarea
        placeholder={placeholder}
        rows={rows}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className={textareaClasses}
        onBeforeInput={handleBeforeInput}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        maxLength={maxLength}
      />
      {hint && (
        <p
          className={`mt-2 text-sm ${error ? "text-error-500" : "text-gray-500 dark:text-gray-400"
            }`}
        >
          {hint}
        </p>
      )}
    </div>
  );
};

export default TextArea;
