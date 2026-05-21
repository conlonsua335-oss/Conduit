import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getArticle, deleteArticle, getComment } from "../api/articles";
import { useAuth } from "../context/useAuth";
import type { Article } from "../types";
import ReactMarkdown from "react-markdown";
import FollowButton from "../components/FollowButton";
import type { Comment } from "../types";
import CommentCard from "../components/CommentCard";
import AddComment from "../components/AddComments";
import Loading from "../components/Loading";

function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const [comments, setComments] = useState<Comment[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isCommentsLoading, setIsCommentsLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    let cancelled = false;

    const fetchArticle = async () => {
      try {
        const res = await getArticle(slug);
        if (!cancelled) {
          setArticle(res.article);
          setIsLoading(false);
        }
      } catch {
        if (!cancelled) {
          setError("Article not found.");
          setIsLoading(false);
        }
      }
    };

    fetchArticle();

    return () => { cancelled = true; };
  }, [slug]);

  useEffect(() => {
    if (!slug) return;

    let cancelled = false;

    const fetchComments = async () => {
      try {
        const res = await getComment(slug);
        if (!cancelled) {
          setComments(res.comments);
          setIsCommentsLoading(false);
        }
      } catch {
        if (!cancelled) {
          setIsCommentsLoading(false);
        }
      }
    }
    fetchComments();
    return () => { cancelled = true; };
  }, [slug]);

  const handleDelete = async () => {
    if (!slug) return;
    if (!confirm("Are you sure you want to delete this article?")) return;

    setIsDeleting(true);
    try {
      await deleteArticle(slug);
      navigate("/");
    } catch {
      setIsDeleting(false);
    }
  };

  const handleCommentAdded = (comment: Comment) => {
    setComments((prev) => [comment, ...prev]);
  }

  const handleCommentDeleted = (commentId: number) => {
    setComments((prev) => prev.filter(c => c.id !== commentId));
  }

  if (isLoading) {
    return (
      <p className="text-center text-gray-400 mt-20">Loading article...</p>
    );
  }

  if (error || !article) {
    return (
      <p className="text-center text-red-500 mt-20">{error || "Article not found."}</p>
    );
  }

  const isOwner = user?.username === article.author.username;

  return (
    <div>
      {/* Banner */}
      <div className="bg-gray-800 text-white py-10">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-6">{article.title}</h1>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {article.author.image ? (
                <img
                  src={article.author.image}
                  alt={article.author.username}
                  className="w-10 h-10 rounded-full"
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center font-bold">
                  {article.author.username[0].toUpperCase()}
                </div>
              )}
              <div>
                <Link
                  to={`/profile/${article.author.username}`}
                  className="text-green-400 hover:underline font-medium"
                >
                  {article.author.username}
                </Link>
                <p className="text-gray-400 text-xs">
                  {new Date(article.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* Action buttons — chỉ hiện với owner */}
            {isOwner && (
              <div className="flex gap-2">
                <Link
                  to={`/editor/${article.slug}`}
                  className="border border-gray-400 text-gray-300 px-3 py-1 rounded text-sm hover:bg-gray-700"
                >
                  Edit Article
                </Link>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="border border-red-400 text-red-400 px-3 py-1 rounded text-sm hover:bg-red-400 hover:text-white disabled:opacity-50"
                >
                  {isDeleting ? "Deleting..." : "Delete Article"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="prose max-w-none mb-8">
          <ReactMarkdown>{article.body}</ReactMarkdown>
        </div>

        {/* Tags */}
        <div className="flex gap-2 flex-wrap mb-8">
          {article.tagList.map((tag) => (
            <span
              key={tag}
              className="border border-gray-300 text-gray-400 text-sm px-3 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        <hr className="border-gray-200 mb-8" />

        {/**comments section**/}

        <div className="max-w-2xl mx-auto mt-8">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Comments</h3>

          {/**Form thêm comment**/}
          <AddComment slug={article.slug} onCommentAdded={handleCommentAdded} />
          {(isLoading && <Loading />) ? (
            <p className="text-gray-400">Loading comments...</p>
          ) : comments.length === 0 ? (
            <p className="text-gray-400">No comments yet.</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="mb-4">
                <CommentCard
                  comment={comment}
                  key={comment.id}
                  slug={article.slug}
                  onDeleted={handleCommentDeleted}
                />
              </div>
            ))
          )}
        </div>

        {/* Author info bottom */}
        <div className="flex justify-center">
          <div className="text-center">
            <Link
              to={`/profile/${article.author.username}`}
              className="text-green-500 hover:underline font-medium"
            >
              {article.author.username}
            </Link>
            <p className="text-gray-400 text-xs mt-1">
              {new Date(article.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        <FollowButton username={article.author.username} following={article.author.following} />
      </div>
    </div>
  );
}

export default ArticlePage;