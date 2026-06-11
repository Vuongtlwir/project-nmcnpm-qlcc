import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import chatService from "../../services/chatService";

export default function UserChat() {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadChat = useCallback(async () => {
    if (!user?.id) return;

    const history = await chatService.getMyConversation();
    if (history.length === 0) {
      const initialMsg = chatService.createMessage({ sender: "admin", text: "Xin chào, tôi là quản trị viên. Có gì tôi có thể giúp bạn?" });
      setMessages([initialMsg]);
      await chatService.sendMessage({ user_id: user.id, text: initialMsg.text });
    } else {
      setMessages(history);
    }

    await chatService.markMyConversationRead();
    const count = await chatService.getUnreadCount();
    setUnreadCount(count);
  }, [user]);

  useEffect(() => {
    loadChat();
  }, [loadChat]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (user?.id) {
        chatService.getMyConversation().then(setMessages);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [user]);

  const handleSendMessage = async () => {
    if (!message.trim() || !user?.id) return;

    const tempMsg = chatService.createMessage({ sender: "user", text: message });
    setMessages((prev) => [...prev, tempMsg]);

    await chatService.sendMessage({ user_id: user.id, text: message });
    setMessage("");

    const history = await chatService.getMyConversation();
    setMessages(history);
  };

  return (
    <section className="page-card">
      <div className="page-card-header">
        <h2>Chat với quản trị viên</h2>
        <p>Liên hệ với quản trị viên để được hỗ trợ</p>
        {unreadCount > 0 && (
          <div style={{ marginTop: 12, color: "#dc2626", fontWeight: 600 }}>
            Bạn có {unreadCount} tin nhắn chưa đọc.
          </div>
        )}
      </div>

      <div style={{ marginTop: "20px", maxWidth: "600px", margin: "20px auto" }}>
        <div
          style={{
            maxHeight: "400px",
            overflowY: "auto",
            marginBottom: "20px",
            padding: "12px",
            backgroundColor: "#f9fafb",
            borderRadius: "8px"
          }}
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                marginBottom: "12px",
                textAlign: msg.sender === "user" ? "right" : "left"
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  maxWidth: "70%",
                  padding: "10px 12px",
                  backgroundColor: msg.sender === "user" ? "#3b82f6" : "#e5e7eb",
                  color: msg.sender === "user" ? "#fff" : "#000",
                  borderRadius: "8px",
                  wordWrap: "break-word"
                }}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Nhập tin nhắn..."
            style={{
              flex: 1,
              padding: "10px 12px",
              borderRadius: "8px",
              border: "1px solid #d1d5db"
            }}
          />
          <button className="primary-btn" onClick={handleSendMessage}>
            Gửi
          </button>
        </div>
      </div>
    </section>
  );
}
