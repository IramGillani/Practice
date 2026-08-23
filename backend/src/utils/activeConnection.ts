import WebSocket from "ws";
import { activeConnections } from "@/config/websocketManager";

export const sendToUser = <T>(
  userId: string,
  event: string,
  payload: T,
): boolean => {
  const ws = activeConnections.get(userId);
  console.log("readyState for connection", ws?.readyState);
  console.log("sending to userId", userId);

  console.log("WS LOOKUP:", {
    requestedUserId: userId,
    theWebsocket: ws,
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
  console.log(`[WS Sent] Event: ${event} to User: ${userId}`);
  return true;
};
