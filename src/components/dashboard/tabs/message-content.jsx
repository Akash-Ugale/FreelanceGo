"use client"

import { apiClient } from "@/api/AxiosServiceApi"
import ChatArea from "@/components/ChatArea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/context/AuthContext"
import { Search, UserPlus2Icon } from "lucide-react"
import { useEffect, useState } from "react"

export default function MessagesContent() {
  const [conversations, setConversations] = useState([])
  const [selectedConversation, setSelectedConversation] = useState()
  const { userId, authLoading } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [mobileView, setMobileView] = useState("list")

  useEffect(() => {
    if (authLoading || !userId) return
    async function fetchConversations() {
      try {
        const response = await apiClient.get("/api/chat-history/" + userId)
        const { data } = response
        setConversations(Array.isArray(data) ? data : [])
      } catch (error) {
        console.log(error)
      }
    }
    fetchConversations()
  }, [authLoading, userId])

  const handleSelectConversation = (conversation) => {
    if (conversation.id === selectedConversation?.id) {
      setSelectedConversation(null)
      return
    }
    setSelectedConversation(conversation)
    setMobileView("chat")
  }

  const filteredConversations = conversations.filter((conv) =>
    conv.opponent.username.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (authLoading) return null

  return (
    <div className="space-y-6 flex flex-col overflow-hidden">
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
                        {conversation?.chats?.content ??
                          `Say hi to ${conversation.opponent.username}!`}
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

        {/* Chat Area (modular component) */}
        <ChatArea
          selectedConversation={selectedConversation}
          mobileView={mobileView}
          setMobileView={setMobileView}
        />
      </div>
    </div>
  )
}
