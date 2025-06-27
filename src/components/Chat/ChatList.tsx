import { useState, useEffect } from "react";
import { Search, Edit } from "lucide-react";
import { Chat } from "../../interfaces/types";
import ChatListItem from "./ChatListItem";
import styles from "./ChatList.module.css";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { loadFollowing } from "../../redux/chatSlice/chatSlice";

interface ChatListProps {
  chats: Chat[];
  selectedChat: Chat | null;
  onChatSelect: (chat: Chat) => void;
}

const ChatList = ({ chats, selectedChat, onChatSelect }: ChatListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useAppDispatch();
  const { following } = useAppSelector((state) => state.chat);

  useEffect(() => {
    if (searchQuery)
      dispatch(loadFollowing({ query: searchQuery.trim(), page: 1 }));
  }, [searchQuery, dispatch]);

  const filteredChats = chats.filter((chat) =>
    chat.user?.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFollowing = searchQuery.trim()
    ? following.filter(
        (user) =>
          user.username?.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !chats.some((chat) => chat.user.id === user.id)
      )
    : [];

  const followingChats = filteredFollowing.map((user) => ({
    id: `temp_${user.id}`,
    user,
    lastMessage: {
      id: "default",
      text: "Start a conversation",
      timestamp: new Date().toISOString(),
      senderId: "system",
      status: "sent",
      roomId: undefined,
    },
    unreadCount: 0,
    roomId: undefined,
  }));

  const combinedChats = [...filteredChats, ...followingChats];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <h1 className={styles.title}>Messages</h1>
          <button className={styles.editButton}>
            <Edit size={20} />
          </button>
        </div>
        <div className={styles.searchContainer}>
          <Search className={styles.searchIcon} size={16} />
          <input
            type="text"
            placeholder="Search people or messages"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
            aria-label="Search conversations"
          />
        </div>
      </div>
      <div className={styles.chatListContainer}>
        {combinedChats.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No conversations or users found</p>
          </div>
        ) : (
          combinedChats.map((chat) => (
            <ChatListItem
              key={chat.id}
              chat={chat}
              isSelected={selectedChat?.id === chat.id}
              onClick={() => onChatSelect(chat)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ChatList;
