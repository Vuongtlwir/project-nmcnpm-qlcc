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

const getUnreadCount = async (userId) => {
  try {
    const response = await api.get("/chat/unread");
    return response.data?.data?.count || 0;
  } catch {
    return 0;
  }
};

export default {
  createMessage,
  getConversation,
  sendMessage,
  markConversationRead,
  getUnreadCount,
};
