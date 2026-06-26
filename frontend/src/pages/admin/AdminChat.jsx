import { useState, useEffect, useCallback, useRef } from "react";
import { useLocation } from "react-router-dom";
import { getResidents } from "../../services/residentService";
import chatService from "../../services/chatService";

export default function AdminChat() {
  const location = useLocation();
  const focusUserId = location.state?.focusUserId;

  const [residents, setResidents] = useState([]);
  const [selectedResident, setSelectedResident] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const messagesEndRef = useRef(null);
  const focusedRef = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadResidents = useCallback(async () => {
    try {
      const data = await getResidents({ limit: 100 });
      setResidents(data || []);
    } catch (err) {
      console.error("Lỗi khi tải danh sách cư dân:", err);
    }
  }, []);

  useEffect(() => {
    loadResidents();
  }, [loadResidents]);

  const focusByUserId = useCallback(async (userId) => {
    const target = residents.find(r => r.user_id === Number(userId));
    if (target) {
      setSelectedResident(target);
      const history = await chatService.getConversation(target.user_id);
      if (history.length === 0) {
        const initialMsg = chatService.createMessage({ sender: "admin", text: "Xin chào, tôi là quản trị viên. Có gì tôi có thể giúp bạn?" });
        setMessages([initialMsg]);
        await chatService.sendMessage({ user_id: target.user_id, text: initialMsg.text });
      } else {
        setMessages(history);
      }
      await chatService.markConversationRead(target.user_id);
    }
  }, [residents]);

  useEffect(() => {
    if (focusUserId && residents.length > 0 && !focusedRef.current) {
      focusedRef.current = true;
      focusByUserId(focusUserId);
    }
  }, [focusUserId, residents, focusByUserId]);

  useEffect(() => {
    const fetchUnreadCounts = async () => {
      const counts = await chatService.getAdminUnreadCounts();
      const map = {};
      counts.forEach((item) => { map[item.user_id] = Number(item.count) || 0; });
      setUnreadCounts(map);
    };
    fetchUnreadCounts();
    const interval = setInterval(fetchUnreadCounts, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (selectedResident?.user_id) {
        const history = await chatService.getConversation(selectedResident.user_id);
        setMessages(history);
        await chatService.markConversationRead(selectedResident.user_id);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [selectedResident]);

  const loadConversation = async (resident) => {
    const history = await chatService.getConversation(resident.user_id);
    if (history.length === 0) {
      const initialMsg = chatService.createMessage({ sender: "admin", text: "Xin chào, tôi là quản trị viên. Có gì tôi có thể giúp bạn?" });
      setMessages([initialMsg]);
      await chatService.sendMessage({ user_id: resident.user_id, text: initialMsg.text });
    } else {
      setMessages(history);
    }
    await chatService.markConversationRead(resident.user_id);
  };

  const handleSelectResident = (resident) => {
    setSelectedResident(resident);
    loadConversation(resident);
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedResident) return;

    const tempMsg = chatService.createMessage({ sender: "admin", text: message });
    setMessages((prev) => [...prev, tempMsg]);

    await chatService.sendMessage({ user_id: selectedResident.user_id, text: message });
    setMessage("");

    const history = await chatService.getConversation(selectedResident.user_id);
    setMessages(history);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, margin: "-28px -32px" }}>
      <div style={{
        padding: "20px 32px 0",
        display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0,
      }}>
        <div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0f172a", margin: "0 0 4px", textTransform: "none", letterSpacing: "normal" }}>Chat với cư dân</h2>
          <p style={{ margin: "0 0 16px", color: "#64748b", fontSize: "0.85rem" }}>Gửi tin nhắn trực tiếp đến các cư dân</p>
        </div>
      </div>

      <div className="chat-container" style={{ borderRadius: 0, borderLeft: "none", borderRight: "none", borderBottom: "none" }}>
        <div className="chat-sidebar">
          <div className="chat-sidebar-header">
            <h3 style={{ margin: 0, fontSize: "0.95rem" }}>Danh sách cư dân</h3>
          </div>
          <div className="chat-sidebar-list">
            {residents.map((resident) => (
              <div
                key={resident.id}
                onClick={() => resident.user_id && handleSelectResident(resident)}
                className={`chat-user-item ${selectedResident?.id === resident.id ? "active" : ""}`}
                style={resident.user_id ? {} : { opacity: 0.5, cursor: "default" }}
              >
                <div className="chat-user-avatar">
                  {(resident.full_name || "?").split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)}
                </div>
                <div className="chat-user-info">
                  <div className="chat-user-name">{resident.full_name || "N/A"}</div>
                  <div className="chat-user-preview">
                    {resident.apartment_code || "N/A"}
                    {!resident.user_id && <span style={{ color: "#ef4444", fontSize: "0.7rem", marginLeft: 6 }}>Chưa có TK</span>}
                  </div>
                </div>
                <div className="chat-user-meta">
                  {unreadCounts[resident.user_id] > 0 && (
                    <span className="chat-user-unread">{unreadCounts[resident.user_id]}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="chat-main">
          {selectedResident ? (
            <>
              <div className="chat-main-header">
                <div className="chat-user-avatar" style={{ width: 36, height: 36, fontSize: "0.8rem" }}>
                  {(selectedResident.full_name || "?").split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)}
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: "0.95rem" }}>{selectedResident.full_name}</h4>
                  <small style={{ color: "#64748b" }}>{selectedResident.apartment_code} - {selectedResident.apartment_building}</small>
                </div>
              </div>

              <div className="chat-messages">
                {messages.map((msg) => (
                  <div key={msg.id} className={`chat-message ${msg.sender === "admin" ? "sent" : "received"}`}>
                    <div>
                      {msg.text}
                      {msg.created_at && (
                        <div className="chat-message-time">
                          {new Date(msg.created_at).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                        </div>
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
                <button className="primary-btn" onClick={handleSendMessage}>Gửi</button>
              </div>
            </>
          ) : (
            <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontSize: "0.95rem" }}>
              Chọn cư dân để bắt đầu chat
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
