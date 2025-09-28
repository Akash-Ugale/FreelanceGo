"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import axios from "axios";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  ChevronLeft,
  MoreVertical,
  Paperclip,
  Search,
  Send,
  UserPlus2Icon,
} from "lucide-react";
import { useState, useEffect } from "react";
import { set } from "date-fns";
import pusher from "@/components/pusher/pusher";

const conversations = [
  {
    id: 1,
    name: "TechCorp Inc.",
    role: "client",
    lastMessage: "Great progress on the frontend! The design looks amazing.",
    timestamp: "2 hours ago",
    unread: 2,
    online: true,
    project: "E-commerce Website Development",
    avatar: "TC",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    role: "freelancer",
    lastMessage: "I'll have the user authentication ready by tomorrow.",
    timestamp: "3 hours ago",
    unread: 0,
    online: true,
    project: "Mobile App Development",
    avatar: "SJ",
  },
  {
    id: 3,
    name: "FitLife Startup",
    role: "client",
    lastMessage:
      "The designs look fantastic! Just a few minor adjustments needed.",
    timestamp: "1 day ago",
    unread: 1,
    online: false,
    project: "Fitness App UI/UX",
    avatar: "FL",
  },
  {
    id: 4,
    name: "Mike Chen",
    role: "freelancer",
    lastMessage: "I've uploaded the latest prototypes for review.",
    timestamp: "2 days ago",
    unread: 0,
    online: false,
    project: "Brand Identity Design",
    avatar: "MC",
  },
];

const messages = [
  {
    id: 1,
    sender: "client",
    senderName: "TechCorp Inc.",
    message:
      "Hi Sarah! I wanted to check in on the progress of the e-commerce platform. How are things going?",
    timestamp: "10:30 AM",
    type: "text",
  },
  {
    id: 2,
    sender: "freelancer",
    senderName: "Sarah Johnson",
    message:
      "Hello! Things are going really well. I've completed the product catalog and shopping cart functionality. The user interface is looking great!",
    timestamp: "10:45 AM",
    type: "text",
  },
  {
    id: 3,
    sender: "freelancer",
    senderName: "Sarah Johnson",
    message:
      "I've also integrated the Stripe payment system as requested. Would you like me to send you a demo link?",
    timestamp: "10:46 AM",
    type: "text",
  },
  {
    id: 4,
    sender: "client",
    senderName: "TechCorp Inc.",
    message:
      "That sounds fantastic! Yes, please send the demo link. Also, I have a few additional features I'd like to discuss.",
    timestamp: "11:15 AM",
    type: "text",
  },
  {
    id: 5,
    sender: "freelancer",
    senderName: "Sarah Johnson",
    message:
      "Here's the demo link: https://demo.ecommerce-platform.com - Let me know what additional features you have in mind!",
    timestamp: "11:20 AM",
    type: "text",
  },
  {
    id: 6,
    sender: "client",
    senderName: "TechCorp Inc.",
    message: "Great progress on the frontend! The design looks amazing.",
    timestamp: "2:30 PM",
    type: "text",
  },
];

export default function MessagesContent({ userRole, senderId }) {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileView, setMobileView] = useState("list");

  const [pusherChannel, setPusherChannel] = useState(null);

  // Fetch conversations (example API)
  useEffect(() => {
    async function fetchConversations() {
      try {
        const response = await axios.get("/chat/conversations");
        const { data } = response;

        if (Array.isArray(data)) {
          setConversations(data);
        } else {
          setConversations([]);
          console.warn("Conversations API returned non-array:", data);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchConversations();
  }, []);

  // Handle selecting a conversation
  const handleSelectConversation = async (conversation) => {
    setSelectedConversation(conversation);

    // 1️⃣ Generate channel name with minimum ID first
    const minId = Math.min(senderId, conversation.receiverId);
    const maxId = Math.max(senderId, conversation.receiverId);
    const generatedChannelName = `private-chat-${minId}-${maxId}`;

    try {
      // 2️⃣ Fetch old messages
      const msgRes = await axios.get(
        `/chat/history/${senderId}/${conversation.receiverId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setMessages(msgRes.data);

      // 3️⃣ Subscribe directly (Pusher will auto-authenticate via backend)
      const channel = pusher.subscribe(generatedChannelName);
      console.log(channel)
            channel.bind("new-message", (data) => {
        setMessages((prev) => [...prev, data]);
      });
      setPusherChannel(channel);
    } catch (err) {
      console.error("Error initializing chat:", err);
    }
  };

  // Send message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !pusherChannel) return;

    const messageData = {
      senderId,
      receiverId: selectedConversation.id,
      message: newMessage,
      timestamp: new Date().toISOString(),
    };

    try {
      await axios.post(
        "/chat/send",
        {
          channelName: pusherChannel.name,
          ...messageData,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      // Optimistically update messages
      setMessages((prev) => [...prev, { ...messageData, senderName: "You" }]);
      setNewMessage("");
    } catch (err) {
      console.error("Send message error:", err);
    }
  };

  // Cleanup when switching conversation/unmount
  useEffect(() => {
    handleSelectConversation();

    return () => {
      if (pusherChannel) {
        pusher.unsubscribe(pusherChannel.name);
        setPusherChannel(null);
      }
    };
  }, [selectedConversation]);

  const filteredConversations = (conversations || []).filter(
    (conv) =>
      conv.role !== userRole &&
      (conv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conv.project.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 flex flex-col">
      <div className="grid gap-6 lg:grid-cols-4 h-[85vh] overflow-auto sm:overflow-hidden">
        {/* Conversations List */}
        <Card
          className={`h-full overflow-auto ${
            mobileView === "chat" ? "hidden" : "block"
          } lg:block`}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Conversations</CardTitle>
              <Button size="icon" variant="outline" className="bg-transparent">
                <UserPlus2Icon className="h-4 w-4 font-bold" />
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[500px] overflow-y-auto">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-4 border-b cursor-pointer transition-colors hover:bg-accent/50 ${
                    selectedConversation.id === conversation.id
                      ? "bg-accent"
                      : ""
                  }`}
                  onClick={() => {
                    setSelectedConversation(conversation);
                    setMobileView("chat"); // 👈 switch to chat on mobile
                  }}
                >
                  <div className="flex items-start space-x-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={`/placeholder.svg?height=40&width=40&text=${conversation.avatar}`}
                        />
                        <AvatarFallback>{conversation.avatar}</AvatarFallback>
                      </Avatar>
                      {conversation.online && (
                        <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-background" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm truncate">
                          {conversation.name}
                        </h4>
                        {conversation.unread > 0 && (
                          <Badge
                            variant="default"
                            className="text-xs h-5 w-5 rounded-full p-0 flex items-center justify-center"
                          >
                            {conversation.unread}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">
                        {conversation.project}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {conversation.lastMessage}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {conversation.timestamp}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat Area */}

        <Card
          className={`flex flex-col h-[85vh] sm:h-full overflow-auto relative ${
            mobileView === "list" ? "hidden" : "flex"
          } lg:flex lg:col-span-3 ${
            selectedConversation ? "" : "opacity-50 pointer-events-none"
          }`}
        >
          {/* Chat Header */}
          <CardHeader className="sticky top-0 z-[2] bg-background flex flex-row items-center justify-between gap-2 border-b p-4">
            {/* Back button for mobile */}
            <div className="flex gap-1 items-center">
              <Button
                size="icon"
                variant="ghost"
                className="lg:hidden"
                onClick={() => setMobileView("list")}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {selectedConversation ? (
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={`/placeholder.svg?height=40&width=40&text=${selectedConversation.avatar}`}
                    />
                    <AvatarFallback>
                      {selectedConversation.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{selectedConversation.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {selectedConversation.online
                        ? "Online now"
                        : "Last seen 2 hours ago"}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-muted-foreground">
                  Select a conversation to start chat
                </div>
              )}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon"
                  variant="outline"
                  className="bg-transparent"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" sideOffset={5}>
                <DropdownMenuItem onClick={() => alert("Delete")}>
                  View Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => alert("Delete")}>
                  Internship Information
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => alert("Delete")}
                  className="text-red-500"
                >
                  Delete Conversation
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>

          {/* Messages */}
          <CardContent className="flex-1 p-0">
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages
                  .filter(
                    (msg) =>
                      msg.sender === selectedConversation.role ||
                      msg.sender === userRole
                  )
                  .map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender === userRole
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[70%] ${
                          message.sender === userRole
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        } rounded-lg p-3`}
                      >
                        <div className="text-sm font-medium mb-1">
                          {message.senderName}
                        </div>
                        <div className="text-sm">{message.message}</div>
                        <div className="text-xs opacity-70 mt-1">
                          {message.timestamp}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Message Input */}
              <div className="border-t p-4 sticky bottom-0 bg-white">
                <div className="flex items-center space-x-2">
                  <Button
                    size="icon"
                    variant="outline"
                    className="bg-transparent"
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="resize-none flex-1 min-h-[20px]"
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    size="icon"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
