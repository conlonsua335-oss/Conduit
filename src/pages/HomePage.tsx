import { useEffect, useState } from "react";
import { listArticles, feedArticles } from "../api/articles";
import { getTags } from "../api/tags";
import { useAuth } from "../context/useAuth";
import ArticleCard from "../components/ArticleCard";
import TagList from "../components/TagList";
import Pagination from "../components/Pagination";
import type { Article } from "../types";

const PAGE_SIZE = 10;
type FeedType = "global" | "your";

function HomePage() {
  const { user } = useAuth();

  const [articles, setArticles] = useState<Article[]>([]);
  const [articlesCount, setArticlesCount] = useState(0);
  const [isLoadingArticles, setIsLoadingArticles] = useState(true);

  const [tags, setTags] = useState<string[]>([]);
  const [isLoadingTags, setIsLoadingTags] = useState(true);

  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [feedType, setFeedType] = useState<FeedType>("global");

  const totalPages = Math.ceil(articlesCount / PAGE_SIZE);

  // Fetch tags 1 lần khi load
  useEffect(() => {
    getTags()
      .then((res) => setTags(res.tags))
      .catch((err) => console.error(err))
      .finally(() => setIsLoadingTags(false));
  }, []);

  // Fetch articles khi feedType, selectedTag, currentPage thay đổi
  useEffect(() => {
    let cancelled = false;

    const fetchArticles = async () => {
      try {
        const offset = (currentPage - 1) * PAGE_SIZE;
        const res = feedType === "your"
          ? await feedArticles(PAGE_SIZE, offset)
          : await listArticles(PAGE_SIZE, offset, selectedTag ?? undefined);

        if (!cancelled) {
          setArticles(res.articles);
          setArticlesCount(res.articlesCount);
          setIsLoadingArticles(false);
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) setIsLoadingArticles(false);
      }
    };

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setArticles([]);
    setIsLoadingArticles(true);
    fetchArticles();

    return () => { cancelled = true; };
  }, [feedType, selectedTag, currentPage]);

  const handleTagClick = (tag: string) => {
    setSelectedTag((prev) => (prev === tag ? null : tag));
    setFeedType("global");
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleFeedChange = (type: FeedType) => {
    setFeedType(type);
    setSelectedTag(null);
    setCurrentPage(1);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Banner */}
      <div className="bg-green-500 text-white text-center py-10 mb-8 rounded">
        <h1 className="text-4xl font-bold mb-2">conduit</h1>
        <p className="text-xl">A place to share your knowledge.</p>
      </div>

      <div className="flex gap-6">
        {/* Article List */}
        <div className="flex-1">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-4">
            {user && (
              <button
                onClick={() => handleFeedChange("your")}
                className={`pb-2 px-4 text-sm ${feedType === "your" && !selectedTag
                  ? "border-b-2 border-green-500 text-green-500"
                  : "text-gray-500 hover:text-gray-900"
                  }`}
              >
                Your Feed
              </button>
            )}
            <button
              onClick={() => handleFeedChange("global")}
              className={`pb-2 px-4 text-sm ${feedType === "global" && !selectedTag
                ? "border-b-2 border-green-500 text-green-500"
                : "text-gray-500 hover:text-gray-900"
                }`}
            >
              Global Feed
            </button>
            {selectedTag && (
              <span className="border-b-2 border-green-500 text-green-500 pb-2 px-4 text-sm">
                # {selectedTag}
              </span>
            )}
          </div>

          {isLoadingArticles && (
            <p className="text-gray-400 text-center py-10">
              Loading articles...
            </p>
          )}

          {!isLoadingArticles && articles.length === 0 && (
            <p className="text-gray-400 text-center py-10">
              No articles are here... yet.
            </p>
          )}

          {!isLoadingArticles &&
            articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>

        {/* Sidebar */}
        <div className="w-56 flex-shrink-0">
          <TagList
            tags={tags}
            selectedTag={selectedTag}
            isLoading={isLoadingTags}
            onTagClick={handleTagClick}
          />
        </div>
      </div>
    </div>
  );
}

export default HomePage;