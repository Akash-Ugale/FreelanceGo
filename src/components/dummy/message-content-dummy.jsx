import { useEffect, useState } from "react";
import pusher from "../pusher/pusher";
import { apiClient } from "@/api/AxiosServiceApi";

export default function MessageContentDummy({ senderId = 2, receiverId = 1 }) {
  const [messages, setMessages] = useState([]);
  const [pusherChannel, setPusherChannel] = useState(null);
  const [subscribed,setSubscribed] = useState(false);
  useEffect(() => {
    // Generate channel name (always smaller ID first)

    const minId = Math.min(senderId, receiverId);
    const maxId = Math.max(senderId, receiverId);
    const channelName = `private-chat-${minId}-${maxId}`;

    // Subscribe to the channel
    const channel = pusher.subscribe(channelName);
    console.log("channel :", channel);
    console.log("Subscribed: ", channel.subscribed);

    
    // setSubscribed(true);
    // setPusherChannel(channel);
    

    channel.bind("pusher:subscription_succeeded", () => {
      console.log("✅ Successfully subscribed to private channel",channelName);
      setSubscribed(true);
      setPusherChannel(channel);
      console.log("channel.subscribed:", channel.subscribed);

      handleSendMessage();
    });

    // Bind to "new-message" event
    channel.bind("new-message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    // Cleanup on unmount
    return () => {
      channel.unbind_all();
      pusher.unsubscribe(channelName);
      setSubscribed(false);
      setPusherChannel(null);
    };
  }, [senderId, receiverId]);

  // Send message
  const handleSendMessage = async () => {
    if (!pusherChannel  || !subscribed) {
      console.warn("Channel not ready yet!");
      return;
    }

    const messageData = {
      senderId,
      receiverId: 1,
      content: "hello",
    };

    try {
      await apiClient.post(
        "/api/chat/send",
        {
          channelName: pusherChannel.name,
          ...messageData,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
    } catch (err) {
      console.error("Send message error:", err);
    }
  };

  // useEffect(() => {
  //   handleSendMessage();
  // }, [pusherChannel]);

  return (
    <div>
      <h2>
        Chat between {senderId} and {receiverId}
      </h2>
      <ul>
        {messages.map((msg, idx) => (
          <li key={idx}>
            {msg.senderId}: {msg.message}
          </li>
        ))}
      </ul>
    </div>
  );
}
