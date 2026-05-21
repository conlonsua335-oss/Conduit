import { Link } from "react-router-dom";
import type { Article } from "../types";

function ArticleCard({ article }: { article: Article }) {
    return (
        <div className="border-t border-gray-200 py-6">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    {article.author.image ? (
                        <img
                            src={article.author.image}
                            alt={article.author.username}
                            className="w-8 h-8 rounded-full"
                            onError={(e) => {
                                e.currentTarget.src = "https://i.imgur.com/hepj9ZS.jpg";
                            }}
                        />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold">
                            {article.author.username[0].toUpperCase()}
                        </div>
                    )}
                    <div>
                        <Link
                            to={`/profile/${article.author.username}`}
                            className="text-green-500 font-medium hover:underline block"
                        >
                            {article.author.username}
                        </Link>
                        <span className="text-gray-400 text-xs">
                            {new Date(article.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </span>
                    </div>
                </div>
                <button className="flex items-center gap-1 border border-green-500 text-green-500 px-3 py-1 rounded text-sm hover:bg-green-500 hover:text-white transition">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill={article.favorited ? "currentColor" : "none"}
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
                    {article.favoritesCount}
                </button>
            </div>

            <Link to={`/article/${article.slug}`}>
                <h2 className="text-xl font-bold text-gray-900 mb-1 hover:underline">
                    {article.title}
                </h2>
                <p className="text-gray-500 mb-3">{article.description}</p>
                <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Read more...</span>
                    <div className="flex gap-1">
                        {article.tagList.map((tag) => (
                            <span
                                key={tag}
                                className="border border-gray-300 text-gray-400 text-xs px-2 py-0.5 rounded-full"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </Link>
        </div>
    );
}

export default ArticleCard;