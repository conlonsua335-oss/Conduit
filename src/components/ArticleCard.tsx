import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import type { Article } from "../types";
import { formatDate } from "../types/formatDate";
import FavoriteButton from "./FavoriteButton";
import { getComment } from "../api/articles";

function ArticleCard({ article }: { article: Article }) {
    const [commentCount, setCommentCount] = useState<number | null>(null);

    useEffect(() => {
        let cancelled = false;
        getComment(article.slug)
            .then((res) => {
                if (!cancelled) setCommentCount(res.comments.length);
            })
            .catch(() => {
                if (!cancelled) setCommentCount(0);
            });
        return () => { cancelled = true; };
    }, [article.slug]);

    return (
        <div className="py-6 border-b border-gray-200 last:border-0">
            {/* Author info */}
            <div className="flex items-center gap-2 mb-3">
                {article.author.image ? (
                    <img
                        src={article.author.image}
                        alt={article.author.username}
                        className="w-6 h-6 rounded-full"
                        onError={(e) => { e.currentTarget.style.display = "none"; }}
                    />
                ) : (
                    <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold">
                        {article.author.username[0].toUpperCase()}
                    </div>
                )}
                <Link
                    to={`/profile/${article.author.username}`}
                    className="text-sm font-medium text-gray-900 hover:underline"
                >
                    {article.author.username}
                </Link>
                <span className="text-gray-300 text-xs">·</span>
                <span className="text-xs text-gray-400">{formatDate(article.createdAt)}</span>
            </div>

            {/* Content */}
            <div className="flex gap-6 items-start">
                <Link to={`/article/${article.slug}`} className="flex-1 min-w-0">
                    <h2 className="text-xl font-bold text-gray-900 mb-1 hover:text-gray-600 leading-snug">
                        {article.title}
                    </h2>
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
                        {article.description}
                    </p>
                </Link>

                {/* Thumbnail */}
                <div className="shrink-0 w-24 h-16 rounded overflow-hidden bg-gray-100">
                    <img
                        src={`https://picsum.photos/seed/${article.slug}/200/120`}
                        alt={article.title}
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>

            {/* Footer */}
            <div className="flex items-center gap-4 mt-4 text-gray-400 text-xs">
                <FavoriteButton
                    slug={article.slug}
                    favorited={article.favorited}
                    favoritesCount={article.favoritesCount}
                />

                <Link
                    to={`/article/${article.slug}`}
                    className="flex items-center gap-1 hover:text-gray-600 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
                    </svg>
                    <span>
                        {commentCount === null ? "..." : commentCount}
                    </span>
                </Link>

                {article.tagList.slice(0, 2).map((tag) => (
                    <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        {tag}
                    </span>
                ))}
            </div>
        </div>
    );
}

export default ArticleCard;