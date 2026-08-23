import WebSocket from "ws";

export const activeConnections = new Map<string, WebSocket>();
