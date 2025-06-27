// api.ts
import axios from "axios";

// Types
export interface User {
  id: string;
  username: string;
  fullName: string;
  bio: string;
  profilePicture: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isFollowing: boolean;
  isPrivate: boolean;
  isVerified?: boolean;
  website?: string;
}

export interface Post {
  id: string;
  imageUrl: string;
  likesCount: number;
  commentsCount: number;
  caption?: string;
  isVideo?: boolean;
}

export interface FollowUser {
  id: string;
  username: string;
}

// API Configuration
const API_BASE_URL = "http://172.50.5.102:3011";
const POSTS_API_URL = "http://172.50.5.102:3000";

import { getInstagramUser } from "../../constants/localStorage";

const getAuthToken = (): string => {
  return (
    getInstagramUser() ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODQ4OWFlNzFkYzQ1NGZkYTkwYmE1MzciLCJlbWFpbCI6ImdhdXJhdkBleGFtcGxlLmNvbSIsInJvbGUiOiJ1c2VyIiwiZGV2aWNlSWQiOiJkZXZpY2UtMmZlaDI4YW1nLTE3NTA4MzA2MjA3MTYiLCJpcEFkZHJlc3MiOiIxNC4xOTQuMjIuMjAyIiwidXNlckFnZW50IjoiTW96aWxsYS81LjAgKExpbnV4OyBBbmRyb2lkIDYuMDsgTmV4dXMgNSBCdWlsZC9NUkE1OE4pIEFwcGxlV2ViS2l0LzUzNy4zNiAoS0hUTUwsIGxpa2UgR2Vja28pIENocm9tZS8xMzYuMC4wLjAgTW9iaWxlIFNhZmFyaS81MzcuMzYiLCJmY21Ub2tlbiI6ImRvaXNBcV9TVnd1T0xSNFNrem5zeGc6QVBBOTFiRjM4ZU4wZEdHaFVqbGZOdnR2QmtBMFRPeG9oLWRCZ0xPdzI4TTcxWkhIVGp1QWliMWQ5LXZxZ21oNU5GNDFQb3ZBWmlMN1JGWk1zbGR5ZGdpX0M3Si1JY0pGS0xkSTE2SG50ZTdYV1N6Ujo4elBQLWsiLCJpYXQiOjE3NTA4MzA2MjEsImV4cCI6MTc1MDkxNzAyMSwic3ViIjoiNjg0ODlhZTcxZGM0NTRmZGE5MGJhNTM3In0.W9VoUyrSNVV1nuyS3m_hEf9KBlS8qImSHAlXpJ7tCyc"
  );
};

// API Client
const apiClient = axios.create({
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${getAuthToken()}`;
  return config;
});

// API Functions
export const fetchUserProfile = async (): Promise<User> => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/users/profile`);
    const data = response.data;

    return {
      id: data._id,
      username: data.username,
      fullName: data.fullName,
      bio: data.bio,
      profilePicture: data.profilePicture,
      followersCount: data.followersCount,
      followingCount: data.followingCount,
      postsCount: data.posts?.length || 0,
      isFollowing: false,
      isPrivate: data.isPrivate,
      isVerified: false,
      website: data.website,
    };
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw new Error("Failed to load profile");
  }
};

export const fetchTaggedPosts = async (): Promise<Post[]> => {
  try {
    const response = await apiClient.get(`${POSTS_API_URL}/posts/tagged`);
    const data = response.data;

    return data.posts.map((post: any) => ({
      id: post._id,
      imageUrl: post.media[0]
        ? `${POSTS_API_URL}/${post.media[0]}`
        : "https://picsum.photos/300",
      likesCount: post.reactionCount || 0,
      commentsCount: post.commentCount || 0,
      caption: post.content,
      isVideo: false,
    }));
  } catch (error) {
    console.error("Error fetching tagged posts:", error);
    return [];
  }
};

export const fetchFollowers = async (): Promise<FollowUser[]> => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/posts/me/followers`);
    return response.data.users.map((u: any) => ({
      id: u._id || u.id,
      username: u.username,
    }));
  } catch (error) {
    console.error("Error fetching followers:", error);
    return [];
  }
};

export const fetchFollowing = async (): Promise<FollowUser[]> => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/users/me/following`);
    return response.data.users.map((u: any) => ({
      id: u.id,
      username: u.username,
    }));
  } catch (error) {
    console.error("Error fetching following:", error);
    return [];
  }
};
