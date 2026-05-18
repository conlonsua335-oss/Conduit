import type { PaginationProps } from "../types";

export default function Pagination({
    currentPage,
    totalPages,
    onPageChange
}: PaginationProps) {
    if (totalPages <= 1) return null;

    const getPages = () => {
        if (totalPages <= 7) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        const pages: (number | string)[] = [];
        const delta = 2; // số trang hiện xung quanh currentPage

        // Luôn hiện trang 1
        pages.push(1);

        // Dấu ... bên trái nếu currentPage cách trang 1 xa
        if (currentPage > delta + 2) {
            pages.push("...");
        }

        // Các trang xung quanh currentPage
        const start = Math.max(2, currentPage - delta);
        const end = Math.min(totalPages - 1, currentPage + delta);

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        // Dấu ... bên phải nếu currentPage cách trang cuối xa
        if (currentPage < totalPages - delta - 1) {
            pages.push("...");
        }

        // Luôn hiện trang cuối
        pages.push(totalPages);

        return pages;
    };

    return (
        <div className="flex gap-1 mt-4 flex-wrap">
            {getPages().map((page, index) =>
                page === "..." ? (
                    <span key={`dots-${index}`} className="px-3 py-1 text-gray-400">
                        ...
                    </span>
                ) : (
                    <button
                        key={page}
                        onClick={() => onPageChange(page as number)}
                        className={`px-3 py-1 rounded text-sm ${currentPage === page
                            ? "bg-green-500 text-white"
                            : "text-green-500 hover:bg-green-100"
                            }`}
                    >
                        {page}
                    </button>
                )
            )}
        </div>
    );
}