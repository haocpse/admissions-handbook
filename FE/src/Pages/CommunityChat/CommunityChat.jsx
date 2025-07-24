import React, { useEffect, useState } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";
import axios from "axios";
import "./CommunityChat.css";
import { jwtDecode } from "jwt-decode"; // ✅ Đúng


const CommunityChat = () => {
  const [chats, setChats] = useState([]);
  const [newChat, setNewChat] = useState("");
  const [replyMap, setReplyMap] = useState({});
  const [activeReplyChatId, setActiveReplyChatId] = useState(null);
    const [userRole, setUserRole] = useState(null); // lưu role
  

   useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserRole(decoded.scope); // ví dụ: "ADMIN", "USER"
        console.log(decoded.scope)
      } catch (error) {
        console.error("Invalid token", error);
      }
    }

    fetchChats();
  }, []);
  

  const fetchChats = async () => {
    try {
      const res = await axios.get("/api/communityChats/getAllChats");
      const rawChats = Array.isArray(res.data.data.chatListDetails)
        ? res.data.data.chatListDetails
        : [];
      setChats(buildChatTree(rawChats));
    } catch (error) {
      console.error("Error fetching chats", error);
    }
  };

  const sendChat = async () => {
    if (!newChat.trim()) return;
    try {
      await axios.post("/api/communityChats/create", { content: newChat });
      setNewChat("");
      fetchChats();
    } catch (error) {
      console.error("Error sending chat", error);
    }
  };

  const sendReply = async (chatId) => {
    const replyContent = replyMap[chatId];
    if (!replyContent?.trim()) return;
    try {
      await axios.post(`/api/communityChats/replyChat/${chatId}`, {
        content: replyContent,
      });
      setReplyMap({ ...replyMap, [chatId]: "" });
      setActiveReplyChatId(null);
      fetchChats();
    } catch (error) {
      console.error("Error replying chat", error);
    }
  };

 const handleAdminAction = async (action, chatId) => {
  try {
    const url = `/api/communityChats/${action}/${chatId}`;

    if (action === "pin" || action === "unPin") {
      await axios.put(url); // method PUT cho pin và unPin
    } else if (action === "delete") {
      await axios.delete(url); // method DELETE cho delete
    } else {
      console.warn(`Unknown action: ${action}`);
    }

    fetchChats();
  } catch (error) {
    console.error(`${action} failed`, error);
  }
};


  const buildChatTree = (flatChats) => {
    const chatMap = {};
    const roots = [];

    flatChats.forEach((chat) => {
      chat.replies = [];
      chatMap[chat.communityChatId] = chat;
    });

    flatChats.forEach((chat) => {
      if (chat.parentCommunityChatId) {
        const parent = chatMap[chat.parentCommunityChatId];
        if (parent) {
          parent.replies.push(chat);
        }
      } else {
        roots.push(chat);
      }
    });

    return roots;
  };

  const pinnedChats = chats.filter((chat) => chat.pin);
  const normalChats = chats.filter((chat) => !chat.pin);

  return (
    <div className="community-chat-page">
      <Navbar />

      <div className="chat-container">
        <h1 className="chat-title">🌍 360Book Community</h1>

        {pinnedChats.length > 0 && (
          <div className="pinned-section">
            <h2>📌 Tin nhắn được ghim</h2>
            {pinnedChats.map((chat) => (
              <ChatCard
                key={chat.communityChatId}
                chat={chat}
                replyMap={replyMap}
                setReplyMap={setReplyMap}
                sendReply={sendReply}
                handleAdminAction={handleAdminAction}
                activeReplyChatId={activeReplyChatId}
                setActiveReplyChatId={setActiveReplyChatId}
                 isAdmin={userRole === "ADMIN"}
              />
            ))}
          </div>
        )}

        <div className="chat-list-section">
          <h2>🗨️ Tất cả tin nhắn</h2>
          {normalChats.map((chat) => (
            <ChatCard
              key={chat.communityChatId}
              chat={chat}
              replyMap={replyMap}
              setReplyMap={setReplyMap}
              sendReply={sendReply}
              handleAdminAction={handleAdminAction}
              activeReplyChatId={activeReplyChatId}
              setActiveReplyChatId={setActiveReplyChatId}
                isAdmin={userRole === "ADMIN"}
            />
          ))}
        </div>

        <div className="new-chat-box">
          <textarea
            value={newChat}
            onChange={(e) => setNewChat(e.target.value)}
            placeholder="Chia sẻ điều gì đó với cộng đồng..."
          />
          <button onClick={sendChat}>Gửi</button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

const ChatCard = ({
  chat,
  isAdmin,
  replyMap,
  setReplyMap,
  sendReply,
  handleAdminAction,
  activeReplyChatId,
  setActiveReplyChatId,
}) => (
  <div className="chat-card">
    <div className="chat-header">
      <strong>{chat.userId || "Người dùng ẩn danh"}</strong>
      <span className="timestamp">
        {new Date(chat.createAt).toLocaleString()}
      </span>
    </div>

    <div className="chat-content">{chat.content}</div>

    <div className="chat-actions">
      {activeReplyChatId === chat.communityChatId ? (
        <>
          <input
            type="text"
            placeholder="Trả lời..."
            value={replyMap[chat.communityChatId] || ""}
            onChange={(e) =>
              setReplyMap((prev) => ({
                ...prev,
                [chat.communityChatId]: e.target.value,
              }))
            }
          />
          <button onClick={() => sendReply(chat.communityChatId)}>Gửi</button>
          <button onClick={() => setActiveReplyChatId(null)}>Hủy</button>
        </>
      ) : (
        <button onClick={() => setActiveReplyChatId(chat.communityChatId)}>
          Trả lời
        </button>
      )}

      {isAdmin && (
  <>
    {!chat.parentCommunityChatId && ( // chỉ hiện ghim nếu là chat gốc
      chat.pin ? (
        <button
          onClick={() => handleAdminAction("unPin", chat.communityChatId)}
        >
          Bỏ ghim
        </button>
      ) : (
        <button
          onClick={() => handleAdminAction("pin", chat.communityChatId)}
        >
          Ghim
        </button>
      )
    )}

    <button
      onClick={() => handleAdminAction("delete", chat.communityChatId)}
      className="btn btn-sm btn-danger"
      style={{ backgroundColor: "red", marginLeft: "0.5rem" }}
    >
      <i className="bi bi-trash"></i> Xóa
    </button>
  </>
)}

    </div>

    {chat.replies && chat.replies.length > 0 && (
      <div className="chat-replies">
        {chat.replies.map((reply) => (
          <ChatCard
            key={reply.communityChatId}
            chat={reply}
            replyMap={replyMap}
            setReplyMap={setReplyMap}
            sendReply={sendReply}
            handleAdminAction={handleAdminAction}
            activeReplyChatId={activeReplyChatId}
            setActiveReplyChatId={setActiveReplyChatId}
               isAdmin={isAdmin} // 👈 THÊM DÒNG NÀY
          />
        ))}
      </div>
    )}
  </div>
);

export default CommunityChat;
