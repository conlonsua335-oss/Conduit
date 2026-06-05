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
import { formatDate } from "../types/formatDate";

function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
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
        if (!cancelled) setIsCommentsLoading(false);
      }
    };
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

  const handleEditComment = (newComment: Comment) => {
    setComments((prev) => [newComment, ...prev])
  }

  const handleCommentAdded = (comment: Comment) => {
    setComments((prev) => [comment, ...prev]);
  };

  const handleCommentDeleted = (commentId: number) => {
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  };

  if (isLoading) return <Loading />;

  if (error || !article) {
    return (
      <p className="text-center text-red-500 mt-20">
        {error || "Article not found."}
      </p>
    );
  }

  const isOwner = user?.username === article.author.username;
  const thumbnailUrl = `https://picsum.photos/seed/${article.slug}/1200/600`;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">

      {/* Title */}
      <h1 className="text-4xl font-bold text-gray-900 leading-tight mb-4">
        {article.title}
      </h1>

      {/* Description */}
      {article.description && (
        <p className="text-xl text-gray-500 mb-6">{article.description}</p>
      )}

      {/* Author row */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {article.author.image ? (
            <img
              src={article.author.image}
              alt={article.author.username}
              className="w-10 h-10 rounded-full object-cover"
              onError={(e) => { e.currentTarget.style.display = "none"; }}
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
              {article.author.username[0].toUpperCase()}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <Link
                to={`/profile/${article.author.username}`}
                className="font-medium text-gray-900 hover:underline"
              >
                {article.author.username}
              </Link>
              <FollowButton
                username={article.author.username}
                following={article.author.following}
              />
            </div>
            <p className="text-sm text-gray-400">
              {formatDate(article.createdAt)}
            </p>
          </div>
        </div>

        {/* Owner actions */}
        {isOwner && (
          <div className="flex gap-2">
            <Link
              to={`/editor/${article.slug}`}
              className="border border-gray-300 text-gray-600 px-3 py-1 rounded text-sm hover:bg-gray-100"
            >
              Edit
            </Link>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="border border-red-400 text-red-400 px-3 py-1 rounded text-sm hover:bg-red-400 hover:text-white disabled:opacity-50"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        )}
      </div>

      {/* Thumbnail */}
      <div className="mb-8 rounded-lg overflow-hidden">
        <img
          src={thumbnailUrl}
          alt={article.title}
          className="w-full h-72 object-cover"
        />
      </div>

      {/* Body */}
      <div className="prose prose-lg max-w-none mb-8">
        <ReactMarkdown>{article.body}</ReactMarkdown>
      </div>

      {/* Tags */}
      {article.tagList.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-10">
          {article.tagList.map((tag) => (
            <span
              key={tag}
              className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <hr className="border-gray-200 mb-10" />

      {/* Comments */}
      <div className="mb-10">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Comments</h3>
        <AddComment slug={article.slug} onCommentAdded={handleCommentAdded} />

        {isCommentsLoading ? (
          <Loading />
        ) : comments.length === 0 ? (
          <p className="text-gray-400 text-sm mt-4">No comments yet.</p>
        ) : (
          <div className="mt-4 flex flex-col gap-4">
            {comments.map((comment) => (
              <CommentCard
                key={comment.id}
                comment={comment}
                slug={article.slug}
                onDeleted={handleCommentDeleted}
                onEdited={handleEditComment}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ArticlePage;