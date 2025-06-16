// import { useChatStore } from "../store/useChatStore";
// import Sidebar from "../components/Sidebar";
// import NoChatSelected from "../components/NoChatSelected";
// import ChatContainer from "../components/ChatContainer";
// import Navbar from "../components/Navbar";

import ChatContainer from "../../components/chat/ChatContainer";
import NoChatSelected from "../../components/chat/NoChatSelected";
import Sidebar from "../../components/chat/Sidebar";
import { useChatStore } from "../../redux/useChatStore";

const HomePage = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="h-screen bg-black">
      {/* <Navbar /> */}
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-gray-900 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />
            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
