import axios from "axios";
import { Post } from "../interfaces/posts.interface";

const BASE_URL = "http://172.50.5.102:3000";

const getAuthHeaders = () => {
  const token = localStorage.getItem("instagram_user");
  return token
    ? {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    : {};
};

export const fetchPostsApi = async (page: number, limit: number) => {
  if (page < 1 || limit < 1) throw new Error("Invalid page or limit");
  const headers = getAuthHeaders();
  const response = await axios.get<{ data: Post[]; total: number }>(
    `${BASE_URL}/posts/feed?limit=${limit}&skip=${(page - 1) * limit}`,
    { headers }
  );
  const { data: posts, total } = response.data;
  return { posts, total };
};

export const likePostApi = async (postId: number) => {
  if (!postId) throw new Error("Post ID is required");
  const headers = getAuthHeaders();
  const response = await axios.post<{ reactions: number }>(
    `${BASE_URL}/posts/${postId}/like`,
    { userId: "Anoop Kumar Chaudhary" },
    { headers }
  );
  return { postId, reactions: response.data.reactions };
};
