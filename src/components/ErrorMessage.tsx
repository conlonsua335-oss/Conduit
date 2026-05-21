import type { Props } from "../types";

export default function ErrorMessage({ message }: Props) {
    if (!message) return null;
    return (
        <div className="bg-red-100 text-red-600 px-4 py-3 rounded mb-4 text-sm">
            {message}
        </div>
    );
}