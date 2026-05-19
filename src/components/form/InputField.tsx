import type { FieldProps } from "../../types";

export default function InputField({ type, placeholder, value, onChange }: FieldProps) {
    return (

        <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="border border-gray-300 rounded px-4 py-3 w-full"
        />

    )
}