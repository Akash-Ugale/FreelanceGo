import { apiClient } from "@/api/AxiosServiceApi"
import { initChat } from "@/components/realtimechat/ably"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/context/AuthContext"
import { ChevronLeft, MoreVertical, Paperclip, Send } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

function timeAgoFromOffset(offsetDateTime) {
  const start = new Date(offsetDateTime)
  const now = new Date()
  const diffMs = now - start
  if (diffMs < 0) return "just now"
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

export default function ChatArea({
  selectedConversation,
  mobileView,
  setMobileView,
}) {
  const { userId } = useAuth()
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [ablyChannel, setAblyChannel] = useState(null)

  // Subscribe to conversation
  useEffect(() => {
    if (!selectedConversation) return

    if (selectedConversation.chats) {
      setMessages([selectedConversation.chats])
    }

    async function init() {
      const channel = await initChat(
        selectedConversation.opponent.id,
        (msg) => setMessages((prev) => [...prev, msg]),
        userId
      )
      setAblyChannel(channel)
    }
    init()

    return () => {
      if (ablyChannel) ablyChannel.unsubscribe("message")
    }
  }, [selectedConversation])

  // Send message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !ablyChannel || !selectedConversation) return

    const messageData = {
      senderId: userId,
      receiverId: selectedConversation.opponent.id,
      content: newMessage,
    }

    try {
      await apiClient.post("/api/chat/send", {
        channelName: ablyChannel.name,
        ...messageData,
      })

      setMessages((prev) => [...prev, messageData])
      setNewMessage("")
      toast("Message sent")
    } catch (err) {
      console.error("Send message failed:", err)
    }
  }

  return (
    <Card
      className={`flex flex-col h-[85vh] sm:h-full overflow-auto relative ${
        mobileView === "list" ? "hidden" : "flex"
      } lg:flex lg:col-span-3 ${
        selectedConversation ? "" : "opacity-50 pointer-events-none"
      }`}
    >
      {/* Chat Header */}
      <CardHeader className="sticky top-0 z-[2] bg-background flex flex-row items-center justify-between gap-2 border-b p-4">
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
                <AvatarFallback>{selectedConversation.avatar}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">
                  {selectedConversation.opponent.username}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {timeAgoFromOffset(
                    selectedConversation.chats?.timestamp ?? new Date()
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
            <Button size="icon" variant="outline" className="bg-transparent">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={5}>
            <DropdownMenuItem>View Profile</DropdownMenuItem>
            <DropdownMenuItem>Internship Information</DropdownMenuItem>
            <DropdownMenuItem className="text-red-500">
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
              messages.map((message, idx) => (
                <div
                  key={idx}
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
                      <span>{message.content}</span>
                    </div>
                    <div className="text-xs opacity-70 mt-1 text-right">
                      {timeAgoFromOffset(message.timestamp ?? new Date())}
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* Message Input */}
          <div className="border-t p-4 sticky bottom-0">
            <div className="flex items-center space-x-2">
              <Button size="icon" variant="outline" className="bg-transparent">
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
                  !newMessage.trim() || !ablyChannel || !selectedConversation
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
  )
}
