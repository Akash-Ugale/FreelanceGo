// src/components/realtimechat/ably.js
import * as Ably from "ably"

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
    const ably = new Ably.Realtime({
      authUrl: `https://freelancegobackend.onrender.com/api/chat/token?otherUserId=${otherUserId}`, // your backend endpoint
      //  clientId: currentUserId ? currentUserId.toString() : "1", // optional but recommended
      authHeaders: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })

    // Compute unique channel name using currentUserId
    const id1 = Math.min(currentUserId, otherUserId)
    const id2 = Math.max(currentUserId, otherUserId)
    const channelName = `chat-${id1}-${id2}`

    // Get Ably channel
    const channel = ably.channels.get(channelName)
    console.log("channel", channel)

    // Subscribe to real-time messages
    channel.subscribe("message", (msg) => {
      console.log(msg)
      if (typeof onMessageReceived === "function") {
        const newMessage = {
          senderId: otherUserId,
          data: msg.data,
          receiverId: currentUserId,
        }
        console.log("New Message:", newMessage)
        onMessageReceived(newMessage)
      }
    })

    return channel
  } catch (error) {
    console.error("Failed to initialize Ably chat:", error)
    return null
  }
}
