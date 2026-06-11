import api from "./api";

const createMessage = ({ sender, text }) => ({
  id: `temp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
  sender,
  text,
  timestamp: new Date().toISOString(),
});

const getConversation = async (userId) => {
  try {
    const response = await api.get(`/chat/conversation/${userId}`);
    return response.data?.data || [];
  } catch {
    return [];
  }
};

const getMyConversation = async () => {
  try {
    const response = await api.get("/chat/conversation");
    return response.data?.data || [];
  } catch {
    return [];
  }
};

const sendMessage = async ({ user_id, text }) => {
  try {
    const response = await api.post("/chat/send", { user_id, text });
    return response.data?.data || null;
  } catch {
    return null;
  }
};

const markConversationRead = async (userId) => {
  try {
    await api.put(`/chat/read/${userId}`);
  } catch {
    // ignore
  }
};

const markMyConversationRead = async () => {
  try {
    await api.put("/chat/read");
  } catch {
    // ignore
  }
};

const getUnreadCount = async () => {
  try {
    const response = await api.get("/chat/unread");
    const data = response.data?.data;
    if (!data) return 0;
    if (typeof data.count === "number") return data.count;
    if (Array.isArray(data)) {
      return data.reduce((sum, row) => sum + (Number(row.count) || 0), 0);
    }
    return 0;
  } catch {
    return 0;
  }
};

const getAdminUnreadCounts = async () => {
  try {
    const response = await api.get("/chat/unread");
    const data = response.data?.data;
    if (!Array.isArray(data)) return [];
    return data;
  } catch {
    return [];
  }
};

export default {
  createMessage,
  getConversation,
  getMyConversation,
  sendMessage,
  markConversationRead,
  markMyConversationRead,
  getUnreadCount,
  getAdminUnreadCounts,
};
