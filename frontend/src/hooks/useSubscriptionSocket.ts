import { useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import type { SocketMessage } from "@/types";

export function useSubscriptionSocket(
  onMessage: (data: SocketMessage) => void,
) {
  const { user } = useAuth();
  const socketRef = useRef<WebSocket | null>(null);
  const callbackRef = useRef(onMessage);

  useEffect(() => {
    callbackRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    const userId = user?._id;
    if (!userId) return;

    const wsUrl = `ws://localhost:5000?userId=${userId}`;
    const ws = new WebSocket(wsUrl);
    socketRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected:", wsUrl);
    };

    ws.onmessage = (event) => {
      try {
        const data: SocketMessage = JSON.parse(event.data);
        console.log("Received event:", event);
        console.log("Received WebSocket message:", data);
        socketRef.current?.send("Sent new data");
        callbackRef.current(data);
      } catch (err) {
        console.error("Failed to parse WebSocket message:", err);
      }
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected.");
    };

    return () => {
      if (ws.readyState === WebSocket.CONNECTING) {
        ws.onopen = () => ws.close();
      } else if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [user?._id]);
}
