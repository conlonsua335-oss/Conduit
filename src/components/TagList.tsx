import type { TagListProps } from "../types";


function TagList({ tags, selectedTag, isLoading, onTagClick }: TagListProps) {
  return (
    <div className="bg-gray-100 rounded p-4">
      <p className="text-sm font-medium mb-3">Popular Tags</p>

      {isLoading && (
        <p className="text-gray-400 text-sm">Loading tags...</p>
      )}

      {!isLoading && tags.length === 0 && (
        <p className="text-gray-400 text-sm">No tags found.</p>
      )}

      {!isLoading && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => onTagClick(tag)}
              className={`text-xs px-2 py-1 rounded-full transition ${selectedTag === tag
                ? "bg-gray-600 text-white"
                : "bg-gray-400 text-white hover:bg-gray-600"
                }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default TagList;