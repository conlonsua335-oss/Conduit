import { Link } from "react-router-dom";
import type { CommentCardProps } from "../types";
import { useState } from "react";
import { useAuth } from "../context/useAuth";
import { deleteComment } from "../api/articles";
import { formatDate } from "../types/formatDate";



function CommentCard({ comment, slug, onDeleted }: CommentCardProps) {
    const { user } = useAuth();
    const [isDeleting, setIsDeleting] = useState(false);

    const isOwner = user?.username === comment.author.username;

    const handleDelete = async () => {
        setIsDeleting(true)

        try {
            await deleteComment(slug, comment.id);
            onDeleted(comment.id);
        } catch {
            console.error("Failed to delete comment");
            setIsDeleting(false);
        }
    }

    return (
        <div className="border border-gray-200 rounded mb-4">
            {/* Body */}
            <div className="px-4 py-3">
                <p className="text-gray-700 text-sm leading-relaxed">{comment.body}</p>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-4 py-2 flex items-center gap-2 border-t border-gray-200">
                {comment.author.image ? (
                    <img
                        src={comment.author.image}
                        alt={comment.author.username}
                        className="w-6 h-6 rounded-full"
                        onError={(e) => { e.currentTarget.style.display = "none"; }}
                    />
                ) : (
                    <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold">
                        {comment.author.username[0].toUpperCase()}
                    </div>
                )}
                <Link
                    to={`/profile/${comment.author.username}`}
                    className="text-green-500 text-sm hover:underline font-medium"
                >
                    {comment.author.username}
                </Link>
                <span className="text-gray-400 text-xs">
                    {formatDate(comment.createdAt)}
                </span>
            </div>

            {isOwner && (
                <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                    {isDeleting ? "Deleting..." : "Delete"}
                </button>
            )}
        </div>
    );
}

export default CommentCard;