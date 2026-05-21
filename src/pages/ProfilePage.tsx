import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProfile } from "../api/articles";
import { listArticles } from "../api/articles";
import { useAuth } from "../context/useAuth";
import FollowButton from "../components/FollowButton";
import ArticleCard from "../components/ArticleCard";
import Pagination from "../components/Pagination";
import type { Profile, Article } from "../types";

const PAGE_SIZE = 10;
type TabType = "my" | "favorited";

function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const { user } = useAuth();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [error, setError] = useState("");

  const [articles, setArticles] = useState<Article[]>([]);
  const [articlesCount, setArticlesCount] = useState(0);
  const [isLoadingArticles, setIsLoadingArticles] = useState(true);

  const [tab, setTab] = useState<TabType>("my");
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(articlesCount / PAGE_SIZE);

  // Fetch profile
  useEffect(() => {
    if (!username) return;
    let cancelled = false;

    const fetchProfile = async () => {
      try {
        const res = await getProfile(username);
        if (!cancelled) {
          setProfile(res.profile);
          setIsLoadingProfile(false);
        }
      } catch {
        if (!cancelled) {
          setError("Profile not found.");
          setIsLoadingProfile(false);
        }
      }
    };

    fetchProfile();
    return () => { cancelled = true; };
  }, [username]);

  // Fetch articles theo tab
  useEffect(() => {
    if (!username) return;
    let cancelled = false;

    const fetchArticles = async () => {
      try {
        const offset = (currentPage - 1) * PAGE_SIZE;
        const res = tab === "my"
          ? await listArticles(PAGE_SIZE, offset, undefined, username)
          : await listArticles(PAGE_SIZE, offset, undefined, undefined, username);

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
  }, [username, tab, currentPage]);

  const handleTabChange = (newTab: TabType) => {
    setTab(newTab);
    setCurrentPage(1);
  };

  if (isLoadingProfile) {
    return <p className="text-center text-gray-400 mt-20">Loading profile...</p>;
  }

  if (error || !profile) {
    return <p className="text-center text-red-500 mt-20">{error || "Profile not found."}</p>;
  }

  const isOwnProfile = user?.username === profile.username;

  return (
    <div>
      {/* Banner */}
      <div className="bg-gray-100 py-10 text-center">
        {profile.image ? (
          <img
            src={profile.image}
            alt={profile.username}
            className="w-20 h-20 rounded-full mx-auto mb-3"
            onError={(e) => { e.currentTarget.style.display = "none"; }}
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-green-500 text-white flex items-center justify-center text-2xl font-bold mx-auto mb-3">
            {profile.username[0].toUpperCase()}
          </div>
        )}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {profile.username}
        </h2>
        {profile.bio && (
          <p className="text-gray-500 text-sm mb-4">{profile.bio}</p>
        )}
        {!isOwnProfile && (
          <FollowButton
            username={profile.username}
            following={profile.following}
          />
        )}
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => handleTabChange("my")}
            className={`pb-2 px-4 text-sm ${tab === "my"
              ? "border-b-2 border-green-500 text-green-500"
              : "text-gray-500 hover:text-gray-900"
              }`}
          >
            My Articles
          </button>
          <button
            onClick={() => handleTabChange("favorited")}
            className={`pb-2 px-4 text-sm ${tab === "favorited"
              ? "border-b-2 border-green-500 text-green-500"
              : "text-gray-500 hover:text-gray-900"
              }`}
          >
            Favorited Articles
          </button>
        </div>

        {/* Article List */}
        {isLoadingArticles && (
          <p className="text-gray-400 text-center py-10">Loading articles...</p>
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
          onPageChange={(page) => {
            setCurrentPage(page);
            window.scrollTo(0, 0);
          }}
        />
      </div>
    </div>
  );
}

export default ProfilePage;