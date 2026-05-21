import { Link } from "react-router-dom";
import type { Article } from "../types";
import FavoriteButton from "./FavoriteButton";

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
                <FavoriteButton
                    slug={article.slug}
                    favorited={article.favorited}
                    favoritesCount={article.favoritesCount}
                />

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