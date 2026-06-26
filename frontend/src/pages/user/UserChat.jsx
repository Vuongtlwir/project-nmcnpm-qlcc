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
      await chatService.sendMessage({ user_id: user.id, text: initialMsg.text, sender: "admin" });
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
          <div className="chat-unread-badge">
            Bạn có {unreadCount} tin nhắn chưa đọc.
          </div>
        )}
      </div>

      <div className="chat-container">
        <div className="chat-header">
          <div className="chat-header-avatar">QV</div>
          <div className="chat-header-info">
            <h4>Quản trị viên</h4>
            <p>Thường trả lời trong vài phút</p>
          </div>
        </div>

        <div className="chat-messages">
          {messages.map((msg) => (
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
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-area">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Nhập tin nhắn..."
          />
          <button className="primary-btn" onClick={handleSendMessage}>
            Gửi
          </button>
        </div>
      </div>
    </section>
  );
}
