import { useState } from "react";
import { Link } from "react-router-dom";
import { addComment } from "../api/articles";
import { useAuth } from "../context/useAuth";
import type { AddCommentProps } from "../types";



function AddComment({ slug, onCommentAdded }: AddCommentProps) {
    const { user } = useAuth();
    const [body, setBody] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Chưa login → hiện link đăng nhập
    if (!user) {
        return (
            <p className="text-center text-gray-400 text-sm mb-4">
                <Link to="/login" className="text-green-500 hover:underline">
                    Sign in
                </Link>{" "}
                or{" "}
                <Link to="/register" className="text-green-500 hover:underline">
                    Sign up
                </Link>{" "}
                to add comments on this article.
            </p>
        );
    }

    const handleSubmit = async () => {
        if (!body.trim()) return;

        setIsLoading(true);
        try {
            const res = await addComment(slug, body);
            onCommentAdded(res.comment); // thêm comment mới vào list ngay lập tức
            setBody(""); // xoá textarea
        } catch {
            console.error("Failed to add comment");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="border border-gray-200 rounded mb-6">
            <textarea
                placeholder="Write a comment..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 text-sm resize-none outline-none rounded-t"
            />
            <div className="bg-gray-50 px-4 py-2 flex justify-between items-center border-t border-gray-200">
                <div className="flex items-center gap-2">
                    {user.image ? (
                        <img
                            src={user.image}
                            alt={user.username}
                            className="w-7 h-7 rounded-full"
                            onError={(e) => { e.currentTarget.style.display = "none"; }}
                        />
                    ) : (
                        <div className="w-7 h-7 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold">
                            {user.username[0].toUpperCase()}
                        </div>
                    )}
                    <span className="text-gray-500 text-sm">{user.username}</span>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={isLoading || !body.trim()}
                    className="bg-green-500 text-white px-4 py-1 rounded text-sm hover:bg-green-600 disabled:opacity-50"
                >
                    {isLoading ? "Posting..." : "Post Comment"}
                </button>
            </div>
        </div>
    );
}

export default AddComment;