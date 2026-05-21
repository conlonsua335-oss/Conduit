export default function Loading({ text = "Loading..." }: { text?: string }) {
    return (
        <div className="flex justify-center items-center py-10">
            <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mr-3">
                <span className="text-gray-400">{text}</span>
            </div>
        </div>
    )
}