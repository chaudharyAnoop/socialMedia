import React, { useReducer, useEffect } from "react";

import styles from "./ProfilePage.module.css";

import { User, Post, fetchUserProfile, fetchTaggedPosts } from "./api";
import {
  ProfileHeader,
  PostsGrid,
  FollowModal,
  ProfileTabs,
} from "./components";
import { EditProfileModal } from "./EditProfileModal";
import ProfileTabContent from "./ProfileTabContent";
import ProfileLoading from "./ProfileLoading";
import ProfileError from "./ProfileError";

import {
  ProfileTabsEnum,
  ProfileModalTypeEnum,
} from "../../enums/ProfileTabsEnum";

type State = {
  user: User | null;
  taggedPosts: Post[];
  loading: boolean;
  postsLoading: boolean;
  error: string | null;
  activeTab: ProfileTabsEnum;
  modalOpen: boolean;
  modalType: ProfileModalTypeEnum;
  editModalOpen: boolean;
};

type Action =
  | { type: "SET_USER"; payload: User }
  | { type: "SET_TAGGED_POSTS"; payload: Post[] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_POSTS_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_ACTIVE_TAB"; payload: ProfileTabsEnum }
  | { type: "SET_MODAL_OPEN"; payload: boolean }
  | { type: "SET_MODAL_TYPE"; payload: ProfileModalTypeEnum }
  | { type: "SET_EDIT_MODAL_OPEN"; payload: boolean };

const initialState: State = {
  user: null,
  taggedPosts: [],
  loading: true,
  postsLoading: true,
  error: null,
  activeTab: ProfileTabsEnum.Posts,
  modalOpen: false,
  modalType: ProfileModalTypeEnum.Followers,
  editModalOpen: false,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload };
    case "SET_TAGGED_POSTS":
      return { ...state, taggedPosts: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_POSTS_LOADING":
      return { ...state, postsLoading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_ACTIVE_TAB":
      return { ...state, activeTab: action.payload };
    case "SET_MODAL_OPEN":
      return { ...state, modalOpen: action.payload };
    case "SET_MODAL_TYPE":
      return { ...state, modalType: action.payload };
    case "SET_EDIT_MODAL_OPEN":
      return { ...state, editModalOpen: action.payload };
    default:
      return state;
  }
}

const ProfilePage: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const {
    user,
    taggedPosts,
    loading,
    postsLoading,
    error,
    activeTab,
    modalOpen,
    modalType,
    editModalOpen,
  } = state;

  // Wrapper to convert enum to string for ProfileTabs component
  const handleTabChange = (tab: "posts" | "reels" | "tagged") => {
    dispatch({ type: "SET_ACTIVE_TAB", payload: tab as ProfileTabsEnum });
  };

  useEffect(() => {
    loadProfile();
    loadTaggedPosts();
  }, []);

  const loadProfile = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const userData = await fetchUserProfile();
      dispatch({ type: "SET_USER", payload: userData });
    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: "Failed to load profile" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const loadTaggedPosts = async () => {
    try {
      dispatch({ type: "SET_POSTS_LOADING", payload: true });
      const posts = await fetchTaggedPosts();
      dispatch({ type: "SET_TAGGED_POSTS", payload: posts });
    } catch (err) {
      console.error("Failed to load tagged posts:", err);
    } finally {
      dispatch({ type: "SET_POSTS_LOADING", payload: false });
    }
  };

  const handleFollowersClick = () => {
    dispatch({
      type: "SET_MODAL_TYPE",
      payload: ProfileModalTypeEnum.Followers,
    });
    dispatch({ type: "SET_MODAL_OPEN", payload: true });
  };

  const handleFollowingClick = () => {
    dispatch({
      type: "SET_MODAL_TYPE",
      payload: ProfileModalTypeEnum.Following,
    });
    dispatch({ type: "SET_MODAL_OPEN", payload: true });
  };

  const handleCloseModal = () => {
    dispatch({ type: "SET_MODAL_OPEN", payload: false });
  };

  const handleEditProfile = () => {
    dispatch({ type: "SET_EDIT_MODAL_OPEN", payload: true });
  };

  const handleSaveProfile = (updatedUser: Partial<User>) => {
    if (user) {
      dispatch({ type: "SET_USER", payload: { ...user, ...updatedUser } });
      console.log("Saving profile changes:", updatedUser);
    }
  };

  if (loading) {
    return <ProfileLoading />;
  }
  if (error || !user) {
    return (
      <ProfileError
        errorMessage={error || "User not found"}
        onRetry={loadProfile}
      />
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <ProfileHeader
          user={user}
          onFollowersClick={handleFollowersClick}
          onFollowingClick={handleFollowingClick}
          onEditProfile={handleEditProfile}
        />

        <ProfileTabs activeTab={activeTab} onTabChange={handleTabChange} />

        <div className={styles.tabContent}>
          <ProfileTabContent
            activeTab={activeTab}
            taggedPosts={taggedPosts}
            postsLoading={postsLoading}
          />
        </div>
      </div>

      <FollowModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        type={modalType}
        count={
          modalType === "followers" ? user.followersCount : user.followingCount
        }
      />

      <EditProfileModal
        isOpen={editModalOpen}
        onClose={() =>
          dispatch({ type: "SET_EDIT_MODAL_OPEN", payload: false })
        }
        user={user}
        onSave={handleSaveProfile}
      />
    </div>
  );
};

export default ProfilePage;
