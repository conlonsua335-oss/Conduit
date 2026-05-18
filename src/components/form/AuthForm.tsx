import InputField from "./InputField"

type Field<T> = {
    name: keyof T
    type: string
    placeholder: string
}

type Props<T> = {
    fields: readonly Field<T>[]
    form: T
    setForm: React.Dispatch<React.SetStateAction<T>>
    onSubmit: () => void
    isLoading?: boolean
    buttonText: string
}

export default function AuthForm<T extends Record<string, string>>({
    fields,
    form,
    setForm,
    onSubmit,
    isLoading,
    buttonText,
}: Props<T>) {
    return (
        <div className="flex flex-col gap-4">
            {fields.map((field) => (
                <InputField
                    key={String(field.name)}
                    type={field.type}
                    placeholder={field.placeholder}
                    value={form[field.name] || ""}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            [field.name]: e.target.value,
                        })
                    }
                />
            ))}

            <button
                onClick={onSubmit}
                disabled={isLoading}
                className="bg-green-500 text-white px-6 py-3 rounded text-lg self-end hover:bg-green-600 disabled:opacity-50"
            >
                {isLoading ? "Đang xử lý..." : buttonText}
            </button>
        </div>
    )
}
