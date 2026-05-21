import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { updateUserApi } from "../api/auth";
import { useAuth } from "../context/useAuth";

function SettingsPage() {
  const navigate = useNavigate();
  const { user, setUser, logout } = useAuth();

  const [image, setImage] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // US-31: Load user — prefill form với thông tin hiện tại
  useEffect(() => {
    if (!user) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setImage(user.image ?? "");
    setUsername(user.username);
    setBio(user.bio ?? "");
    setEmail(user.email);
  }, [user]);

  // US-32: Update user
  const handleSubmit = async () => {
    setError("");
    setSuccess(false);
    setIsLoading(true);

    try {
      const data: Record<string, string> = {};
      if (image) data.image = image;
      if (username) data.username = username;
      if (bio) data.bio = bio;
      if (email) data.email = email;
      if (password) data.password = password;

      const res = await updateUserApi(data);
      setUser(res.user);  // cập nhật lại user trong AuthContext
      setSuccess(true);
      setPassword(""); // xoá password sau khi cập nhật
    } catch {
      setError("Update failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-8">Your Settings</h1>

      {error && (
        <div className="bg-red-100 text-red-600 px-4 py-3 rounded mb-4 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 text-green-600 px-4 py-3 rounded mb-4 text-sm">
          Settings updated successfully!
        </div>
      )}

      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="URL of profile picture"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 text-sm w-full"
        />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border border-gray-300 rounded px-4 py-3 w-full"
        />
        <textarea
          placeholder="Short bio about you"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={5}
          className="border border-gray-300 rounded px-4 py-3 w-full resize-none"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-300 rounded px-4 py-3 w-full"
        />
        <input
          type="password"
          placeholder="New Password (leave blank to keep current)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-gray-300 rounded px-4 py-3 w-full"
        />

        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600 disabled:opacity-50"
          >
            {isLoading ? "Saving..." : "Update Settings"}
          </button>
        </div>
      </div>

      <hr className="border-gray-200 my-8" />

      <button
        onClick={handleLogout}
        className="text-red-500 hover:underline text-sm"
      >
        Or click here to logout
      </button>
    </div>
  );
}

export default SettingsPage;