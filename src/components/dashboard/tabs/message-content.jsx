"use client"

import { apiClient } from "@/api/AxiosServiceApi"
import { initChat } from "@/components/realtimechat/ably"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/context/AuthContext"
import {
  ChevronLeft,
  MoreVertical,
  Paperclip,
  Search,
  Send,
  UserPlus2Icon,
} from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

function timeAgoFromOffset(offsetDateTime) {
  const start = new Date(offsetDateTime)
  const now = new Date()
  const diffMs = now - start

  if (diffMs < 0) return "just now" // future dates guard

  const seconds = Math.floor(diffMs / 1000)
  if (seconds < 10) return "just now"
  if (seconds < 60) return `${seconds}s ago`

  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`

  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`

  const weeks = Math.floor(days / 7)
  if (weeks < 4) return `${weeks}w ago`

  const months = Math.floor(days / 30)
  if (months < 12) return `${months}mo ago`

  const years = Math.floor(days / 365)
  return `${years}y ago`
}

export default function MessagesContent() {
  const [conversations, setConversations] = useState([])
  const [selectedConversation, setSelectedConversation] = useState()
  const { userRole, userId, authLoading } = useAuth()
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [mobileView, setMobileView] = useState("list")
  const [ablyChannel, setAblyChannel] = useState(null)

  // Fetch conversations (example API)
  useEffect(() => {
    async function fetchConversations() {
      try {
        const response = await apiClient.get("/api/chat-history/" + userId)
        console.log("conversation response", response)
        const { data } = response

        if (Array.isArray(data)) {
          setConversations(data)
        } else {
          setConversations([])
          console.warn("Conversations API returned non-array:", data)
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchConversations()
  }, [])

  // Handle conversation selection
  const handleSelectConversation = async (conversation) => {
    console.log("conversation clicked:", conversation)

    setSelectedConversation(conversation)

    if (Array.isArray(conversation.chats)) {
      setMessages(conversation.chats)
      console.log(conversation.chats)
      setMobileView("chat")
    }

    // Initialize Ably channel

    const channel = await initChat(
      conversation.opponent.id,
      (msg) => setMessages((prev) => [...prev, msg]),
      userId
    )

    setAblyChannel(channel)

    // Fetch previous messages
    /* try {
      const msgRes = await axios.get(
        `/chat/history/${userId}/${conversation.opponent.id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setMessages(msgRes.data);
    } catch (err) {
      console.error("Error fetching history:", err);
    } */
  }

  // Send a new message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !ablyChannel || !selectedConversation) return

    const messageData = {
      senderId: userId,
      receiverId: selectedConversation.opponent.id,
      content: newMessage,
    }

    try {
      // Persist to backend
      await apiClient.post(
        "/api/chat/send",
        {
          channelName: ablyChannel.name,
          ...messageData,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      )

      // Optimistic UI update
      setMessages((prev) => [...prev, { ...messageData, data: newMessage }])
      setNewMessage("")

      toast("Message sent")
      //setNewMessage("");
    } catch (err) {
      console.error("Send message failed:", err)
    }
  }
  // Cleanup on unmount or switching conversation
  useEffect(() => {
    return () => {
      if (ablyChannel) ablyChannel.unsubscribe("message")
    }
  }, [ablyChannel])

  const filteredConversations = conversations.filter((conv) =>
    conv.opponent.username.toLowerCase().includes(searchTerm.toLowerCase())
  )

  useEffect(() => {
    console.log(messages)
  }, [messages])

  if (authLoading) {
    return null
  }

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
                    selectedConversation?.id === conversation.id
                      ? "bg-accent"
                      : ""
                  }`}
                  onClick={() => handleSelectConversation(conversation)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={`data:image/png;base64,${conversation.opponent.imageData}`}
                          alt="avatar"
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
                          {conversation.opponent.username}
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
                      <p className="text-xs text-muted-foreground truncate">
                        {conversation.lastMessage ??
                          "Hi there, I want this new feature"}
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
                      src={`data:image/png;base64,${selectedConversation.opponent.imageData}`}
                    />
                    <AvatarFallback>
                      {selectedConversation.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">
                      {selectedConversation.opponent.username}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {timeAgoFromOffset(
                        selectedConversation.chats.timestamp ?? new Date()
                      )}
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
              <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col">
                {Array.isArray(messages) &&
                  messages.length > 0 &&
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.senderId === userId
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div className="flex flex-col">
                        <div
                          className={`${
                            message.senderId === userId
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          } rounded-lg p-3`}
                        >
                          {message.content}
                        </div>
                        <div className="text-xs opacity-70 mt-1 text-right">
                          {timeAgoFromOffset(message.timestamp ?? new Date())}
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
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={
                      !newMessage.trim() ||
                      !ablyChannel ||
                      !selectedConversation
                    }
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
  )
}
