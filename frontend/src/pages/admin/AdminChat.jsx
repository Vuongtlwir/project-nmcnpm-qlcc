import { useState, useEffect, useCallback, useRef } from "react";
import { useLocation } from "react-router-dom";
import { getResidents } from "../../services/residentService";
import chatService from "../../services/chatService";

const rootStyle = {
  display: "flex", flexDirection: "column",
  height: "calc(100vh - 68px - 56px)",
  overflow: "hidden",
  borderRadius: 14, border: "1px solid #e8edf4",
  background: "#fff",
  boxShadow: "0 1px 3px rgba(15,23,42,0.04)",
};

const chatBodyStyle = {
  display: "flex", flex: 1, minHeight: 0, overflow: "hidden",
};

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
    <div style={rootStyle}>
      <div style={{ padding: "12px 24px", borderBottom: "1px solid #f1f5f9", flexShrink: 0 }}>
        <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "#0f172a", margin: 0, textTransform: "none", letterSpacing: "normal" }}>Chat với cư dân</h2>
      </div>

      <div style={chatBodyStyle}>
        <div style={{ width: 280, borderRight: "1px solid #e8edf4", display: "flex", flexDirection: "column", flexShrink: 0 }}>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid #e8edf4" }}>
            <h3 style={{ margin: 0, fontSize: "0.83rem", fontWeight: 600, color: "#0f172a" }}>Danh sách cư dân</h3>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: 4 }}>
            {residents.map((resident) => (
              <div
                key={resident.id}
                onClick={() => resident.user_id && handleSelectResident(resident)}
                style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "8px 10px",
                  borderRadius: 8, cursor: resident.user_id ? "pointer" : "default",
                  background: selectedResident?.id === resident.id ? "#eff6ff" : "transparent",
                  opacity: resident.user_id ? 1 : 0.5,
                }}
                onMouseEnter={e => { if (selectedResident?.id !== resident.id) e.currentTarget.style.background = "#f1f5f9"; }}
                onMouseLeave={e => { if (selectedResident?.id !== resident.id) e.currentTarget.style.background = "transparent"; }}
              >
                <div style={{
                  width: 34, height: 34, borderRadius: 8, flexShrink: 0,
                  background: "linear-gradient(135deg, #3b82f6, #60a5fa)", color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 700, fontSize: "0.75rem",
                }}>
                  {(resident.full_name || "?").split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: "0.8rem", color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{resident.full_name || "N/A"}</div>
                  <div style={{ fontSize: "0.72rem", color: "#94a3b8" }}>
                    {resident.apartment_code || "N/A"}
                    {!resident.user_id && <span style={{ color: "#ef4444" }}> (Chưa có TK)</span>}
                  </div>
                </div>
                {unreadCounts[resident.user_id] > 0 && (
                  <span style={{
                    background: "#3b82f6", color: "#fff", borderRadius: 999,
                    fontSize: "0.6rem", fontWeight: 700, minWidth: 16,
                    padding: "0 5px", textAlign: "center", display: "inline-block",
                  }}>
                    {unreadCounts[resident.user_id]}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
          {selectedResident ? (
            <>
              <div style={{ padding: "12px 20px", borderBottom: "1px solid #e8edf4", display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                  background: "linear-gradient(135deg, #3b82f6, #60a5fa)", color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 700, fontSize: "0.75rem",
                }}>
                  {(selectedResident.full_name || "?").split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)}
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: "0.88rem", fontWeight: 600, color: "#0f172a" }}>{selectedResident.full_name}</h4>
                  <small style={{ color: "#64748b", fontSize: "0.75rem" }}>{selectedResident.apartment_code}</small>
                </div>
              </div>

              <div style={{ flex: 1, overflowY: "auto", padding: "12px 20px", display: "flex", flexDirection: "column", gap: 6, background: "#f8fafc" }}>
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    style={{
                      alignSelf: msg.sender === "admin" ? "flex-end" : "flex-start",
                      background: msg.sender === "admin" ? "#3b82f6" : "#fff",
                      color: msg.sender === "admin" ? "#fff" : "#0f172a",
                      border: msg.sender === "admin" ? "none" : "1px solid #e8edf4",
                      maxWidth: "75%", padding: "8px 14px", borderRadius: 12,
                      borderBottomRightRadius: msg.sender === "admin" ? 4 : 12,
                      borderBottomLeftRadius: msg.sender === "admin" ? 12 : 4,
                      fontSize: "0.83rem", lineHeight: 1.5, wordWrap: "break-word",
                    }}
                  >
                    {msg.text}
                    {msg.created_at && (
                      <div style={{ fontSize: "0.6rem", opacity: 0.6, marginTop: 2 }}>
                        {new Date(msg.created_at).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div style={{ padding: "12px 20px", borderTop: "1px solid #e8edf4", display: "flex", gap: 10, alignItems: "center", flexShrink: 0 }}>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Nhập tin nhắn..."
                  style={{
                    flex: 1, border: "1px solid #e2e8f0", borderRadius: 10,
                    padding: "10px 14px", outline: "none", fontSize: "0.85rem",
                    fontFamily: "inherit",
                  }}
                />
                <button className="primary-btn" onClick={handleSendMessage} style={{ padding: "10px 20px", borderRadius: 10, border: "none", background: "#3b82f6", color: "#fff", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer", fontFamily: "inherit" }}>Gửi</button>
              </div>
            </>
          ) : (
            <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontSize: "0.9rem" }}>
              Chọn cư dân để bắt đầu chat
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
