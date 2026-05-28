import { useState } from "react";
import { Link } from "react-router-dom";
import { deleteComment, addComment } from "../api/articles";
import { useAuth } from "../context/useAuth";
import { formatDate } from "../types/formatDate";
import type { Comment } from "../types";

type CommentCardProps = {
    comment: Comment;
    slug: string;
    onDeleted: (id: number) => void;
    onEdited: (updated: Comment) => void;
};

function CommentCard({ comment, slug, onDeleted, onEdited }: CommentCardProps) {
    const { user } = useAuth();
    const [isDeleting, setIsDeleting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editBody, setEditBody] = useState(comment.body);
    const [isSaving, setIsSaving] = useState(false);

    const isOwner = user?.username === comment.author.username;

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteComment(slug, comment.id);
            onDeleted(comment.id);
        } catch {
            console.error("Failed to delete comment");
            setIsDeleting(false);
        }
    };

    const handleSave = async () => {
        if (!editBody.trim()) return;
        setIsSaving(true);
        try {
            // xóa cmt cũ
            await deleteComment(slug, comment.id)
            //tạo cmt mới với nội dung đã sửa
            const res = await addComment(slug, editBody);
            onDeleted(comment.id)
            onEdited(res.comment);
            setIsEditing(false);
        } catch {
            console.error("Failed to edit comment");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="border border-gray-200 rounded mb-4">
            {/* Body */}
            <div className="px-4 py-3">
                {isEditing ? (
                    <textarea
                        value={editBody}
                        onChange={(e) => setEditBody(e.target.value)}
                        rows={3}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm resize-none outline-none"
                    />
                ) : (
                    <p className="text-gray-700 text-sm leading-relaxed">{comment.body}</p>
                )}
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-4 py-2 flex items-center justify-between border-t border-gray-200">
                <div className="flex items-center gap-2">
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
                    <span className="text-gray-400 text-xs">{formatDate(comment.createdAt)}</span>
                </div>

                {/* Action buttons — chỉ hiện với owner */}
                {isOwner && (
                    <div className="flex items-center gap-2">
                        {isEditing ? (
                            <>
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving || !editBody.trim()}
                                    className="text-green-500 hover:text-green-700 text-xs font-medium disabled:opacity-50"
                                >
                                    {isSaving ? "Saving..." : "Save"}
                                </button>
                                <button
                                    onClick={() => {
                                        setIsEditing(false);
                                        setEditBody(comment.body);
                                    }}
                                    className="text-gray-400 hover:text-gray-600 text-xs"
                                >
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="text-gray-400 hover:text-gray-600 text-xs"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="text-red-400 hover:text-red-600 text-xs disabled:opacity-50"
                                >
                                    {isDeleting ? "Deleting..." : "🗑️ Delete"}
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default CommentCard;