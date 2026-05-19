import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import type { FollowButtonProps } from "../types";
import { useState } from "react";
import { unfollowUser, followUser } from "../api/articles";

export default function FollowButton({ username, following: initialFollowing }: FollowButtonProps) {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [following, setFollowing] = useState(initialFollowing);
    const [isLoading, setIsLoading] = useState(false);

    //không hiện nút nếu chưa login hoặc đang xem profile của chính mình
    if (!user) return
    if (!user || user.username === username) return null;

    const handleClick = async () => {
        if (!user) {
            navigate("/login")
            return
        }

        setIsLoading(true);
        try {
            if (following) {
                await unfollowUser(username);
                setFollowing(false)
            } else {
                await followUser(username);
                setFollowing(true)
            }
        } catch {
            console.error("Follow/unfollow failed");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <button className={`flex items-center gap-1 px-3 py-1 rounded text-sm border transition disabled:opacity-50 ${following
            ? "border-gray-400 text-gray-600 hover:bg-gray-100"
            : "border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
            }`}
            onClick={handleClick}
            disabled={isLoading}
        >
            {isLoading ? "..." : following ? "✓ Unfollow" : "+ Follow"}
            {" "}{username}
        </button>
    )
}