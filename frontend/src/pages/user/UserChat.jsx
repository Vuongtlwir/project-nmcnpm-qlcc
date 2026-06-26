import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import chatService from "../../services/chatService";

export default function UserChat() {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadChat = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    setError(null);
    try {
      const history = await chatService.getMyConversation();
      if (history.length === 0) {
        const initialMsg = chatService.createMessage({ sender: "admin", text: "Xin chào, tôi là quản trị viên. Có gì tôi có thể giúp bạn?" });
        setMessages([initialMsg]);
        await chatService.sendMessage({ user_id: user.id, text: initialMsg.text, sender: "admin" });
      } else {
        setMessages(history);
      }
      await chatService.markMyConversationRead();
      const count = await chatService.getUnreadCount();
      setUnreadCount(count);
    } catch (err) {
      setError("Không thể tải tin nhắn. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadChat();
  }, [loadChat]);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (!user?.id) return;
      try {
        const history = await chatService.getMyConversation();
        setMessages(history);
        const count = await chatService.getUnreadCount();
        setUnreadCount(count);
      } catch {
        // silent
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [user]);

  const handleSendMessage = async () => {
    if (!message.trim() || !user?.id) return;

    const tempMsg = chatService.createMessage({ sender: "user", text: message });
    setMessages((prev) => [...prev, tempMsg]);
    const sentText = message;
    setMessage("");

    try {
      await chatService.sendMessage({ user_id: user.id, text: sentText });
      const history = await chatService.getMyConversation();
      setMessages(history);
      await chatService.markMyConversationRead();
      const count = await chatService.getUnreadCount();
      setUnreadCount(count);
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== tempMsg.id));
      setError("Gửi tin nhắn thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <section className="page-card" style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div className="chat-header" style={{ padding: "20px 24px 16px", margin: 0, borderBottom: "1px solid #f1f5f9" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div className="chat-header-avatar" style={{ width: 42, height: 42, fontSize: "0.9rem" }}>QV</div>
          <div>
            <h4 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 700, color: "#0f172a" }}>Quản trị viên</h4>
            <p style={{ margin: "2px 0 0", fontSize: "0.8rem", color: "#94a3b8" }}>Thường trả lời trong vài phút</p>
          </div>
        </div>
        {unreadCount > 0 && (
          <div className="chat-unread-badge" style={{ marginTop: 10 }}>
            Bạn có {unreadCount} tin nhắn chưa đọc.
          </div>
        )}
      </div>

      <div className="chat-container" style={{ marginTop: 0 }}>
        <div className="chat-messages" style={{ maxHeight: "calc(100vh - 280px)", border: "none", borderRadius: 0, marginBottom: 0 }}>
          {loading ? (
            <div className="chat-loading">
              <div className="spinner" />
              <p>Đang tải tin nhắn...</p>
            </div>
          ) : error ? (
            <div className="chat-error">
              <p>{error}</p>
              <button className="secondary-btn" onClick={loadChat}>Thử lại</button>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className={`chat-bubble ${msg.sender === "user" ? "sent" : "received"}`}>
                <div className="chat-bubble-content">
                  {msg.text}
                  {msg.created_at && (
                    <span className="chat-bubble-time">
                      {new Date(msg.created_at).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-area" style={{ border: "none", borderRadius: 0, padding: "16px 24px" }}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Nhập tin nhắn..."
            disabled={loading}
          />
          <button className="primary-btn" onClick={handleSendMessage} disabled={loading}>
            Gửi
          </button>
        </div>
      </div>
    </section>
  );
}
