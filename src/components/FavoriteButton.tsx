import { useNavigate } from "react-router-dom";
import type { FavoriteButtonProps } from "../types";
import { useState } from "react";
import { favoriteArticle, unfavoriteArticle } from "../api/articles";
import { useAuth } from "../context/useAuth";


export default function FavoriteButton({
    slug,
    favorited: initialFavorited,
    favoritesCount: initialCount,
    onToggle
}: FavoriteButtonProps) {
    const { user } = useAuth()
    const navigate = useNavigate()

    const [favorited, setFavorite] = useState(initialFavorited)
    const [count, setCount] = useState(initialCount)
    const [isLoading, setIsLoading] = useState(false)

    const handleClick = async () => {
        if (!user) {
            navigate("/login")
            return
        }
        console.log("favorited hiện tại:", favorited)
        setIsLoading(true)
        try {
            if (favorited) {
                console.log("favorited gọi unfavorite")
                await unfavoriteArticle(slug)
                setFavorite(false)
                setCount((prev) => prev - 1)
                onToggle?.(false, count - 1)
            } else {
                console.log("đang gọi favorite")
                await favoriteArticle(slug)
                setFavorite(true)
                setCount((prev) => prev + 1)
                onToggle?.(true, count + 1)
            }
        } catch {
            console.error("Favorite failed")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <button
            onClick={handleClick}
            disabled={isLoading}
            className={`flex items-center gap-1 px-3 py-1 rounded text-sm border transition disabled:opacity-50 ${favorited
                ? "bg-green-500 text-white border-green-500"
                : "border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                }`}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill={favorited ? "currentColor" : "none"}
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-4 h-4"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                />
            </svg>
            {count}
        </button>
    )
}