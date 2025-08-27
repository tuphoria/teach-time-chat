import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PresenceIndicator, PresenceStatus } from "./PresenceIndicator";
import { Star, MessageCircle, Video } from "lucide-react";

interface Teacher {
  id: string;
  name: string;
  avatar?: string;
  subjects: string[];
  rating: number;
  ratePerMinute: number;
  status: PresenceStatus;
  totalStudents: number;
}

interface TeacherCardProps {
  teacher: Teacher;
  onConnect: (teacherId: string, type: 'chat' | 'video') => void;
}

export const TeacherCard = ({ teacher, onConnect }: TeacherCardProps) => {
  const isAvailable = teacher.status === "online";
  
  const getConnectVariant = () => {
    switch (teacher.status) {
      case "online": return "connect";
      case "busy": return "busy";
      case "offline": return "offline";
      default: return "outline";
    }
  };

  return (
    <Card className="bg-gradient-card shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-[1.02] border-0">
      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
          <div className="relative">
            <Avatar className="w-16 h-16">
              <AvatarImage src={teacher.avatar} alt={teacher.name} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                {teacher.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1">
              <PresenceIndicator status={teacher.status} />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-card-foreground truncate">
              {teacher.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{teacher.rating}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                ({teacher.totalStudents} students)
              </span>
            </div>
            <PresenceIndicator 
              status={teacher.status} 
              showText 
              className="mt-2" 
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-4">
        <div className="space-y-3">
          <div className="flex flex-wrap gap-1">
            {teacher.subjects.slice(0, 3).map((subject) => (
              <Badge key={subject} variant="secondary" className="text-xs">
                {subject}
              </Badge>
            ))}
            {teacher.subjects.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{teacher.subjects.length - 3} more
              </Badge>
            )}
          </div>
          
          <div className="text-center py-2 bg-primary/5 rounded-lg">
            <span className="text-2xl font-bold text-primary">
              ₹{teacher.ratePerMinute}
            </span>
            <span className="text-sm text-muted-foreground">/min</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0 gap-2">
        <Button
          variant={getConnectVariant()}
          className="flex-1"
          disabled={!isAvailable}
          onClick={() => onConnect(teacher.id, 'chat')}
        >
          <MessageCircle className="w-4 h-4" />
          {teacher.status === "online" ? "Start Chat" : 
           teacher.status === "busy" ? "Busy" : "Offline"}
        </Button>
        
        <Button
          variant={isAvailable ? "default" : "outline"}
          size="icon"
          disabled={!isAvailable}
          onClick={() => onConnect(teacher.id, 'video')}
        >
          <Video className="w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};