import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createArticle } from "../api/articles";

function EditorPage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [body, setBody] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tagList, setTagList] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    console.log("key pressed:", e.key);
    if (e.key === "Enter") {
      e.preventDefault();
      // logic
      const tag = tagInput.trim()
      console.log("tag sẽ thêm:", tag);
      if (tag && !tagList.includes(tag)) {
        setTagList((prev) => [...prev, tag])
      }
      setTagInput("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    setTagList((prev) => prev.filter(t => t !== tag))
  }

  const handleSubmit = async () => {
    setError("");

    if (!title.trim()) {
      setError("Title cannot be empty.");
      return
    }
    if (!body.trim()) {
      setError("Body cannot be empty.");
      return
    }

    console.log("Data gửi lên", { title, description, body, tagList });

    setIsLoading(true);
    try {
      const res = await createArticle({ title, description, body, tagList });
      navigate(`/article/${res.article.slug}`);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {error && (
        <div className="bg-red-100 text-red-600 px-4 py-3 rounded mb-4 text-sm">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Article Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border border-gray-300 rounded px-4 py-3 text-xl w-full"
        />
        <input
          type="text"
          placeholder="What's this article about?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border border-gray-300 rounded px-4 py-3 w-full"
        />
        <textarea
          placeholder="Write your article"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={12}
          className="border border-gray-300 rounded px-4 py-3 w-full resize-none"
        />

        {/* Tag input */}
        <div className="border border-gray-300 rounded px-4 py-3">
          <input
            type="text"
            placeholder="Enter tags — press Enter to add"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyUp={handleAddTag}
            className="w-full outline-none"
          />
          {tagList.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {tagList.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-red-300 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600 disabled:opacity-50"
          >
            {isLoading ? "Publishing..." : "Publish Article"}
          </button>
        </div>
      </div>
    </div>
  );
}
export default EditorPage;