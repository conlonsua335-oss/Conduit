import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createArticle, getArticle, updateArticle } from "../api/articles";
import ErrorMessage from "../components/ErrorMessage";

function EditorPage() {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug?: string }>();
  const isEditing = Boolean(slug); // có slug = đang edit, không có = đang tạo mới

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [body, setBody] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tagList, setTagList] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(isEditing); // đang fetch bài cũ

  // Nếu đang edit → fetch bài cũ về prefill form
  useEffect(() => {
    if (!slug) return;

    let cancelled = false;

    const fetchArticle = async () => {
      try {
        const res = await getArticle(slug);
        if (!cancelled) {
          setTitle(res.article.title);
          setDescription(res.article.description);
          setBody(res.article.body);
          setTagList(res.article.tagList);
          setIsFetching(false);
        }
      } catch {
        if (!cancelled) {
          setError("Article not found.");
          setIsFetching(false);
        }
      }
    };

    fetchArticle();
    return () => { cancelled = true; };
  }, [slug]);

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const tag = tagInput.trim();
      if (tag && !tagList.includes(tag)) {
        setTagList((prev) => [...prev, tag]);
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTagList((prev) => prev.filter((t) => t !== tag));
  };

  const handleSubmit = async () => {
    setError("");

    if (!title.trim()) {
      setError("Title cannot be empty.");
      return;
    }
    if (!body.trim()) {
      setError("Body cannot be empty.");
      return;
    }

    setIsLoading(true);
    try {
      const data = { title, description, body, tagList };
      const res = isEditing
        ? await updateArticle(slug!, data)   // edit → PUT
        : await createArticle(data);          // tạo mới → POST
      navigate(`/article/${res.article.slug}`);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return <p className="text-center text-gray-400 mt-20">Loading article...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <ErrorMessage message={error} />

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
          placeholder="Write your article (in markdown)"
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
            onKeyDown={handleAddTag}
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
            {isLoading
              ? (isEditing ? "Updating..." : "Publishing...")
              : (isEditing ? "Update Article" : "Publish Article")
            }
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditorPage;