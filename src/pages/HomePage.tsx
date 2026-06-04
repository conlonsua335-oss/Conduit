import { useEffect, useState } from "react";
import { listArticles, feedArticles } from "../api/articles";
import { getTags } from "../api/tags";
import { useAuth } from "../context/useAuth";
import ArticleCard from "../components/ArticleCard";
import Pagination from "../components/Pagination";
import Loading from "../components/Loading";
import type { Article } from "../types";

const PAGE_SIZE = 5;
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

  const [showAllTags, setShowAlltags] = useState(false)

  const totalPages = Math.ceil(articlesCount / PAGE_SIZE);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await getTags()
        setTags(res.tags)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoadingTags(false)
      }
    }
    fetchTags()
  }, []);

  useEffect(() => {
    let cancelled = false;
    const fetchArticles = async () => {
      try {
        // const offset = (currentPage - 1) * PAGE_SIZE;
        const res = feedType === "your"
          ? await feedArticles(PAGE_SIZE, currentPage)
          : await listArticles(PAGE_SIZE, currentPage, selectedTag ?? undefined);
        if (!cancelled) {
          setArticles(res.articles);
          setArticlesCount(res.articlesCount);
          setIsLoadingArticles(false);
        }
      } catch {
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

  const handleFeedChange = (type: FeedType) => {
    setFeedType(type);
    setSelectedTag(null);
    setCurrentPage(1);
  };

  return (
    <div className="flex gap-12">
      {/* Article Feed */}
      <div className="flex-1 min-w-0">
        {/* Tabs */}
        <div className="flex gap-6 border-b border-gray-200 mb-6">
          {user && (
            <button
              onClick={() => handleFeedChange("your")}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${feedType === "your" && !selectedTag
                ? "border-gray-900 text-gray-900"
                : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
            >
              For you
            </button>
          )}
          <button
            onClick={() => handleFeedChange("global")}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${feedType === "global" && !selectedTag
              ? "border-gray-900 text-gray-900"
              : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
          >
            Featured
          </button>
          {selectedTag && (
            <span className="pb-3 text-sm font-medium border-b-2 border-green-600 text-green-600">
              #{selectedTag}
            </span>
          )}
        </div>

        {/* Articles */}
        {isLoadingArticles && <Loading />}

        {!isLoadingArticles && articles.length === 0 && (
          <p className="text-gray-400 text-center py-20">
            No articles are here... yet.
          </p>
        )}

        {!isLoadingArticles && articles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => {
            setCurrentPage(page);
            window.scrollTo(0, 0);
          }}
        />
      </div>

      {/* Right Sidebar */}
      <aside className="hidden xl:block w-72 shrink-0">
        {/* Recommended Topics */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            Recommended topics
          </h3>
          {isLoadingTags ? (
            <p className="text-gray-400 text-sm">Loading...</p>
          ) : (
            <>
              <div className="flex flex-wrap gap-2">
                {(showAllTags ? tags : tags.slice(0, 20)).filter((tag) => tag !== null && tag !== "").map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagClick(tag)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedTag === tag
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              {tags.length > 20 && (
                <button onClick={() => setShowAlltags(prev => !prev)} className="text-sm text-green-600 mt-3 hover:underline">
                  {showAllTags ? "Show less" : "Show more"}
                </button>
              )}
            </>

          )}
        </div>

        {/* Footer links */}
        <div className="text-xs text-gray-400 flex flex-wrap gap-2">
          <span>Help</span>
          <span>·</span>
          <span>Status</span>
          <span>·</span>
          <span>About</span>
          <span>·</span>
          <span>Careers</span>
          <span>·</span>
          <span>Privacy</span>
          <span>·</span>
          <span>Terms</span>
        </div>
      </aside>
    </div>
  );
}

export default HomePage;