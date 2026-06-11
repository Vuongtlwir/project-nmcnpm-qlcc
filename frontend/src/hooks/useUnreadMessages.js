import { useEffect, useState } from "react";
import chatService from "../services/chatService";

export default function useUnreadMessages() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      const c = await chatService.getUnreadCount();
      setCount(c);
    };

    fetchCount();
    const interval = setInterval(fetchCount, 10000);
    return () => clearInterval(interval);
  }, []);

  return count;
}
