import { activeConnections } from "@/main";
import WebSocket from "ws";
export const sendToUser = <T>(
  userId: string,
  event: string,
  payload: T,
): boolean => {
  const ws = activeConnections.get(userId);
  console.log("ws for activeConnections", ws);
  console.log("readyState for connection", ws?.readyState);
  console.log("sending to userId", userId);

  console.log("WS LOOKUP:", {
    requestedUserId: userId,
    connections: [...activeConnections.keys()],
  });

  if (!ws || ws.readyState !== WebSocket.OPEN) {
    console.log("websocket not open for userId:", userId);
    return false;
  }
  ws.send(
    JSON.stringify({
      event,
      payload,
    }),
  );

  return true;
};
