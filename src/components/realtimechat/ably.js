// src/components/realtimechat/ably.js
import { apiClient } from "@/api/AxiosServiceApi";
import * as Ably from "ably";
import axios from "axios";

/**
 * Initialize Ably chat channel
 * @param {number} otherUserId - The ID of the other chat participant
 * @param {function} onMessageReceived - Callback when a new message arrives
 * @param {number} currentUserId - ID of the current logged-in user from AuthContext
 * @returns {object} - Ably channel instance
 */
export const initChat = async (
  otherUserId,
  onMessageReceived,
  currentUserId
) => {
  try {
    // Request token from backend
    const response = await apiClient.get(
      `/api/chat/token?otherUserId=${otherUserId}`
    );

    const tokenRequest = response.data;

    // Initialize Ably Realtime with token request
    const ably = new Ably.Realtime({ token: tokenRequest });

    // Compute unique channel name using currentUserId
    const id1 = Math.min(currentUserId, otherUserId);
    const id2 = Math.max(currentUserId, otherUserId);
    const channelName = `chat-${id1}-${id2}`;

    // Get Ably channel
    const channel = ably.channels.get(channelName);

    // Subscribe to real-time messages
    channel.subscribe("new-message", (msg) => {
      if (typeof onMessageReceived === "function") {
        onMessageReceived(msg.data);
      }
    });

    return channel;
  } catch (error) {
    console.error("Failed to initialize Ably chat:", error);
    return null;
  }
};
