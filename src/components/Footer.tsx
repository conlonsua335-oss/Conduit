export default function Footer() {
    return (
        <footer className="border-t border-gray-200 py-6 mt-auto">
            <div className="max-w-5xl mx-auto px-4 flex items-center gap-2">
                <span className="text-green-500 font-bold">conduit</span>
                <span className="text-gray-400 text-sm">
                    An interactive learning project from {" "}
                    <a href="https://thinkster.io"
                        className="text-green-500 hover:underline"
                    >
                        Thinkster
                    </a>
                    . Code & design licensed under MIT.
                </span>
            </div>
        </footer>
    )
}