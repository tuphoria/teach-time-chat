import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Send, 
  Phone, 
  Video, 
  X, 
  Clock,
  DollarSign
} from "lucide-react";

interface Message {
  id: string;
  sender: "student" | "teacher";
  content: string;
  timestamp: Date;
}

interface ChatSession {
  id: string;
  teacher: {
    name: string;
    avatar?: string;
    ratePerMinute: number;
  };
  isActive: boolean;
  startTime: Date;
  messages: Message[];
}

interface ChatInterfaceProps {
  session: ChatSession;
  onSendMessage: (content: string) => void;
  onEndSession: () => void;
  onStartVideoCall: () => void;
  currentBalance: number;
}

export const ChatInterface = ({ 
  session, 
  onSendMessage, 
  onEndSession, 
  onStartVideoCall,
  currentBalance 
}: ChatInterfaceProps) => {
  const [newMessage, setNewMessage] = useState("");
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentCost, setCurrentCost] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!session.isActive) return;

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - session.startTime.getTime()) / 1000);
      setElapsedTime(elapsed);
      
      const costPerSecond = session.teacher.ratePerMinute / 60;
      setCurrentCost(elapsed * costPerSecond);
    }, 1000);

    return () => clearInterval(interval);
  }, [session.isActive, session.startTime, session.teacher.ratePerMinute]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [session.messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    onSendMessage(newMessage);
    setNewMessage("");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const remainingBalance = currentBalance - currentCost;
  const isLowBalance = remainingBalance < session.teacher.ratePerMinute;

  return (
    <Card className="h-[600px] flex flex-col bg-gradient-card shadow-medium border-0">
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={session.teacher.avatar} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {session.teacher.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{session.teacher.name}</CardTitle>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatTime(elapsedTime)}
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  ₹{currentCost.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={onStartVideoCall}
            >
              <Video className="w-4 h-4" />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={onEndSession}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {isLowBalance && (
          <Badge variant="destructive" className="w-fit">
            ⚠️ Low balance: ₹{remainingBalance.toFixed(2)} remaining
          </Badge>
        )}
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-4">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {session.messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "student" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender === "student"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            disabled={!session.isActive}
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!newMessage.trim() || !session.isActive}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};