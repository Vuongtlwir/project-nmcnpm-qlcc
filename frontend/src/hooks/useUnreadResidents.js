import { useEffect, useRef, useState } from "react";
import chatService from "../services/chatService";

export default function useUnreadResidents() {
  const [residents, setResidents] = useState([]);
  const prevCountsRef = useRef("");

  const total = residents.reduce((sum, r) => sum + (Number(r.count) || 0), 0);

  useEffect(() => {
    const fetchData = async () => {
      const data = await chatService.getAdminUnreadCounts();
      if (Array.isArray(data)) {
        const key = JSON.stringify(data.map(r => r.user_id + ":" + r.count));
        if (key !== prevCountsRef.current) {
          prevCountsRef.current = key;
        }
        setResidents(data);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  return { total, residents };
}
