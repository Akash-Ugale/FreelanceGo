import * as Ably from "ably"

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
        const newMessage = JSON.parse(msg.data)
        console.log("New Message:", newMessage);
        onMessageReceived(newMessage)
      }
    })

    return channel
  } catch (error) {
    console.error("Failed to initialize Ably chat:", error)
    return null
  }
}
