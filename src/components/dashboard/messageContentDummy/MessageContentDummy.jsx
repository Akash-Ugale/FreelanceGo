"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/api/AxiosServiceApi";
import { initChat } from "@/components/realtimechat/ably";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function MessageContentDummy({ receiverId = 3 }) {
  const { userId } = useAuth();
  const senderId = userId;
  const [messages, setMessages] = useState([]);
  const [ablyChannel, setAblyChannel] = useState(null);
  const [currentMessage, setCurrentMessage] = useState("");

  // Initialize Ably channel
  useEffect(() => {
    async function setupChannel() {
      // Ensure senderId and receiverId are valid
      const otherUserId = senderId === userId ? receiverId : senderId;

      const channel = await initChat(
        otherUserId,
        (msg) => setMessages((prev) => [...prev, msg]),
        userId
      );

      setAblyChannel(channel);
    }

    setupChannel();

    return () => {
      if (ablyChannel) ablyChannel.unsubscribe("message");
    };
  }, [senderId, receiverId, userId]);

  // Send dummy message
  const handleSendMessage = async () => {
    if (!ablyChannel) return;

    const messageData = {
      senderId: userId,
      receiverId,
      content: currentMessage,
    };

    try {
      // Send to backend
      await apiClient.post(
        "/api/chat/send",
        { channelName: ablyChannel.name, ...messageData },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}`},
        }
      );

      // Optimistic UI update
      setMessages((prev) => [...prev, {...messageData, data: messageData.content}]);
      setCurrentMessage("");
      toast("Message sent");
    } catch (err) {
      console.error("Send message error:", err);
    }
  };

  return (
    <div>
      <h2>
        Chat between {senderId} and {receiverId}
      </h2>
      <Input
        value={currentMessage}
        onChange={(e) => setCurrentMessage(e.target.value)}
      />
      <button
        className="bg-blue-500 text-white p-2 rounded mb-2"
        onClick={handleSendMessage}
      >
        Send Test Message
      </button>
      <ul>
        {messages.map((msg, idx) => (
          <li key={idx}>
            {msg.senderId}: {msg.data}
          </li>
        ))}
      </ul>
    </div>
  );
}