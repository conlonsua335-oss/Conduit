import { Link } from "react-router-dom";
import type { Article } from "../types";
// import FavoriteButton from "./FavoriteButton";
import { formatDate } from "../types/formatDate";

function ArticleCard({ article }: { article: Article }) {
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
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-3 text-gray-400 text-xs">
                    <span>{formatDate(article.createdAt)}</span>
                    {article.tagList.slice(0, 2).map((tag) => (
                        <span
                            key={tag}
                            className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
                {/* <FavoriteButton
                    slug={article.slug}
                    favorited={article.favorited}
                    favoritesCount={article.favoritesCount}
                /> */}
            </div>
        </div>
    );
}

export default ArticleCard;