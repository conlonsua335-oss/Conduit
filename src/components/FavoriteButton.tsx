import { useState } from "react";
import { useAuth } from "../context/useAuth";
import { favoriteArticle, unfavoriteArticle } from "../api/articles";

type Props = {
    slug: string;
    favorited: boolean;
    favoritesCount: number;
};

function FavoriteButton({ slug, favorited, favoritesCount }: Props) {
    const { user } = useAuth();
    const [isFavorited, setIsFavorited] = useState(favorited);
    const [count, setCount] = useState(favoritesCount);
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) return;
        if (isLoading) return;

        setIsLoading(true);
        try {
            if (isFavorited) {
                const res = await unfavoriteArticle(slug);
                setIsFavorited(res.article.favorited);
                setCount(res.article.favoritesCount);
            } else {
                const res = await favoriteArticle(slug);
                setIsFavorited(res.article.favorited);
                setCount(res.article.favoritesCount);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleClick}
            disabled={isLoading || !user}
            className={`flex items-center gap-1 border px-3 py-1 rounded text-sm transition-colors ${isFavorited
                    ? "bg-green-500 border-green-500 text-white"
                    : "border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill={isFavorited ? "currentColor" : "none"}
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-4 h-4"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
            </svg>
            {count}
        </button>
    );
}

export default FavoriteButton;