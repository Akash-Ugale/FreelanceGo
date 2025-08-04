"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Send, Paperclip, MoreVertical, Phone, Video, Star, Archive, Trash2 } from "lucide-react"

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
    lastMessage: "The designs look fantastic! Just a few minor adjustments needed.",
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
]

const messages = [
  {
    id: 1,
    sender: "client",
    senderName: "TechCorp Inc.",
    message: "Hi Sarah! I wanted to check in on the progress of the e-commerce platform. How are things going?",
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
    message: "I've also integrated the Stripe payment system as requested. Would you like me to send you a demo link?",
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
]


export default function MessagesContent({ userRole }) {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0])
  const [newMessage, setNewMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Add message logic here
      setNewMessage("")
    }
  }

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.project.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Messages</h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Communicate with your {userRole === "freelancer" ? "clients" : "freelancers"}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-4 h-[calc(100vh-200px)]">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Conversations</CardTitle>
              <Button size="sm" variant="outline" className="bg-transparent">
                New Chat
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
                    selectedConversation.id === conversation.id ? "bg-accent" : ""
                  }`}
                  onClick={() => setSelectedConversation(conversation)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={`/placeholder.svg?height=40&width=40&text=${conversation.avatar}`} />
                        <AvatarFallback>{conversation.avatar}</AvatarFallback>
                      </Avatar>
                      {conversation.online && (
                        <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-background" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm truncate">{conversation.name}</h4>
                        {conversation.unread > 0 && (
                          <Badge
                            variant="default"
                            className="text-xs h-5 w-5 rounded-full p-0 flex items-center justify-center"
                          >
                            {conversation.unread}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">{conversation.project}</p>
                      <p className="text-xs text-muted-foreground truncate">{conversation.lastMessage}</p>
                      <p className="text-xs text-muted-foreground mt-1">{conversation.timestamp}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-3 flex flex-col">
          {/* Chat Header */}
          <CardHeader className="pb-3 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={`/placeholder.svg?height=40&width=40&text=${selectedConversation.avatar}`} />
                    <AvatarFallback>{selectedConversation.avatar}</AvatarFallback>
                  </Avatar>
                  {selectedConversation.online && (
                    <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-background" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium">{selectedConversation.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedConversation.project}</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedConversation.online ? "Online now" : "Last seen 2 hours ago"}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="outline" className="bg-transparent">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" className="bg-transparent">
                  <Video className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" className="bg-transparent">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          {/* Messages */}
          <CardContent className="flex-1 p-0">
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      (userRole === "client" && message.sender === "client") ||
                      (userRole === "freelancer" && message.sender === "freelancer")
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] ${
                        (userRole === "client" && message.sender === "client") ||
                        (userRole === "freelancer" && message.sender === "freelancer")
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      } rounded-lg p-3`}
                    >
                      <div className="text-sm font-medium mb-1">{message.senderName}</div>
                      <div className="text-sm">{message.message}</div>
                      <div className="text-xs opacity-70 mt-1">{message.timestamp}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="border-t p-4">
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" className="bg-transparent">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Textarea
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="min-h-[60px] resize-none flex-1"
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                  />
                  <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                  <span>Press Enter to send, Shift+Enter for new line</span>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="ghost" className="h-6 px-2">
                      <Star className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-6 px-2">
                      <Archive className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-6 px-2 text-red-500 hover:text-red-600">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
