import { useEffect, useState } from "react";
import { apiClient } from "../../config/apiClient";
import { API_ENDPOINTS } from "../../config/api";

type Comment = {
  id: number;
  content: string;
  authorName: string;
  authorEmail: string;
  createdAt: string;
  isEdited: boolean;
};

export function CommentsSection({ dealId }: { dealId: number }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  const fetchComments = async () => {
    try {
      const res = await apiClient.get(
        API_ENDPOINTS.getCommentsByOpportunity(dealId),
      );
      setComments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [dealId]);

  const postComment = async () => {
    if (!input.trim()) return;

    try {
      setPosting(true);

      await apiClient.post(API_ENDPOINTS.createComment(dealId), {
        content: input,
      });

      setInput("");
      fetchComments();
    } catch (err) {
      console.error(err);
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border shadow-sm">
      <div className="flex justify-between px-6 py-4 border-b">
        <h3 className="font-semibold">
          Comments
          <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
            {comments.length} updates
          </span>
        </h3>
      </div>

      <div className="p-6 space-y-6">
        {/* INPUT */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
            👤
          </div>

          <input
            className="flex-1 border-b outline-none pb-2"
            placeholder="Write a comment..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <button
            onClick={postComment}
            disabled={posting}
            className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm"
          >
            {posting ? "Posting..." : "Post"}
          </button>
        </div>

        {/* LIST */}
        {loading ? (
          <p className="text-sm text-gray-500">Loading comments...</p>
        ) : (
          <div className="space-y-5">
            {comments.map((c) => (
              <div key={c.id} className="flex gap-3">
                {/* AVATAR */}
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold">
                  {c.authorName?.[0] || "?"}
                </div>

                {/* CONTENT */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{c.authorName}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(c.createdAt).toLocaleString()}
                    </p>
                    {c.isEdited && (
                      <span className="text-xs bg-gray-200 px-2 rounded">
                        edited
                      </span>
                    )}
                  </div>

                  <div className="mt-2 bg-gray-50 border rounded-lg p-3 text-sm">
                    {c.content}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
