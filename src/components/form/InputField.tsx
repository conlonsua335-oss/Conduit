import type { FieldProps } from "../../types";

export default function InputField({ type, placeholder, value, onChange, hasError }: FieldProps) {
    return (

        <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={`border rounded px-4 py-3 w-full outline-none transition ${hasError
                ? "border-red-400 bg-red-50 focus:border-red-500"
                : "border-gray-300 focus:border-green-500"
                }`}

        />

    )
}