import React from "react";
import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
// import { type User } from "../types/types";

const ChatHeader: React.FC = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  return (
    <div className="p-2.5 border-b border-gray-800 bg-gray-900 text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img src={selectedUser?.profilePic || "/avatar.png"} alt={selectedUser?.fullName} />
            </div>
          </div>

          <div>
            <h3 className="font-medium">{selectedUser?.fullName}</h3>
            <p className="text-sm text-gray-400">
              {onlineUsers.includes(selectedUser?._id || "") ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        <button onClick={() => setSelectedUser(null)}>
          <X className="text-white" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;