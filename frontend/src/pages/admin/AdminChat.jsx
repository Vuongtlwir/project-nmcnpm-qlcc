import { useState, useEffect, useCallback } from "react";
import { getResidents } from "../../services/residentService";
import chatService from "../../services/chatService";

export default function AdminChat() {
  const [residents, setResidents] = useState([]);
  const [selectedResident, setSelectedResident] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});

  const loadResidents = useCallback(async () => {
    try {
      const data = await getResidents();
      setResidents(data || []);
    } catch (err) {
      console.error("Lỗi khi tải danh sách cư dân:", err);
    }
  }, []);

  useEffect(() => {
    loadResidents();
  }, [loadResidents]);

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
    <section className="page-card">
      <div className="page-card-header">
        <h2>Chat với cư dân</h2>
        <p>Gửi tin nhắn trực tiếp đến các cư dân</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "20px", marginTop: "20px", minHeight: "500px" }}>
        <div style={{ borderRight: "1px solid #e5e7eb", paddingRight: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3>Danh sách cư dân</h3>
          </div>
          <div style={{ maxHeight: "400px", overflowY: "auto" }}>
            {residents.map((resident) => (
              <div
                key={resident.id}
                onClick={() => handleSelectResident(resident)}
                style={{
                  padding: "12px",
                  marginBottom: "8px",
                  backgroundColor: selectedResident?.id === resident.id ? "#dbeafe" : "#f3f4f6",
                  borderRadius: "8px",
                  cursor: "pointer",
                  border: selectedResident?.id === resident.id ? "2px solid #3b82f6" : "none",
                  position: "relative"
                }}
              >
                <p style={{ margin: "0 0 4px", fontWeight: "500" }}>{resident.full_name || "N/A"}</p>
                <small style={{ color: "#6b7280" }}>{resident.apartment_code || "N/A"}</small>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {selectedResident ? (
            <>
              <div style={{ borderBottom: "1px solid #e5e7eb", paddingBottom: "12px", marginBottom: "20px" }}>
                <h3>{selectedResident.full_name}</h3>
                <small style={{ color: "#6b7280" }}>{selectedResident.apartment_code} - {selectedResident.apartment_building}</small>
              </div>

              <div style={{ flex: 1, overflowY: "auto", marginBottom: "20px", maxHeight: "350px" }}>
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    style={{
                      marginBottom: "12px",
                      textAlign: msg.sender === "admin" ? "right" : "left"
                    }}
                  >
                    <div
                      style={{
                        display: "inline-block",
                        maxWidth: "60%",
                        padding: "10px 12px",
                        backgroundColor: msg.sender === "admin" ? "#3b82f6" : "#f3f4f6",
                        color: msg.sender === "admin" ? "#fff" : "#000",
                        borderRadius: "8px",
                        wordWrap: "break-word"
                      }}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
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
            </>
          ) : (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#9ca3af" }}>
              Chọn cư dân để bắt đầu chat
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
