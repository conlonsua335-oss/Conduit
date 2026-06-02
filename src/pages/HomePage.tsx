import { useEffect, useState } from "react";
import { apiRequest } from "../api/client";
import type { TagsResponse } from "../types";

function HomePage() {
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    apiRequest<TagsResponse>("/tags")
      .then((res) => setTags(res.tags))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-4">
      <h1>Home Page</h1>
      <p>Tags từ API:</p>
      <ul>
        {tags.map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>
    </div>
  );
}

export default HomePage;