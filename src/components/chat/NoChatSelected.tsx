// import { MessageSquare } from "lucide-react";

const NoChatSelected = () => {
   return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-16 bg-black">
      <div className="max-w-md text-center space-y-6">
        <div className="flex justify-center gap-4 mb-4">
          <div className="relative">
            <div
              className="w-16 h-16 rounded-2xl bg-[#0095F6]/10 flex items-center
              justify-center animate-bounce"
            >
              <img src="/assets/instagram-icon.svg" alt="Instagram" className="w-8 h-8" />
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white">Welcome to Instagram!</h2>
        <p className="text-gray-400">
          Select a conversation from the sidebar to start chatting
        </p>
      </div>
    </div>
  );
};
export default NoChatSelected;