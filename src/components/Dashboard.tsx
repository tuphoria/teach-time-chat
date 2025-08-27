import { useState, useEffect } from "react";
import { TeacherCard } from "./TeacherCard";
import { WalletCard } from "./WalletCard";
import { ChatInterface } from "./ChatInterface";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, BookOpen } from "lucide-react";
import { PresenceStatus } from "./PresenceIndicator";

// Mock data
const mockTeachers = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop&crop=face",
    subjects: ["Mathematics", "Physics", "Chemistry"],
    rating: 4.9,
    ratePerMinute: 25,
    status: "online" as PresenceStatus,
    totalStudents: 342
  },
  {
    id: "2",
    name: "Prof. Michael Chen",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    subjects: ["Computer Science", "Programming", "Data Structures"],
    rating: 4.8,
    ratePerMinute: 30,
    status: "busy" as PresenceStatus,
    totalStudents: 289
  },
  {
    id: "3",
    name: "Ms. Emily Rodriguez",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    subjects: ["English Literature", "Creative Writing", "Grammar"],
    rating: 4.7,
    ratePerMinute: 20,
    status: "online" as PresenceStatus,
    totalStudents: 156
  },
  {
    id: "4",
    name: "Dr. Ahmed Hassan",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    subjects: ["Biology", "Biochemistry", "Organic Chemistry"],
    rating: 4.9,
    ratePerMinute: 28,
    status: "offline" as PresenceStatus,
    totalStudents: 201
  },
  {
    id: "5",
    name: "Prof. Lisa Thompson",
    avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&h=100&fit=crop&crop=face",
    subjects: ["History", "Political Science", "Geography"],
    rating: 4.6,
    ratePerMinute: 22,
    status: "online" as PresenceStatus,
    totalStudents: 178
  },
  {
    id: "6",
    name: "Dr. James Wilson",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    subjects: ["Economics", "Finance", "Statistics"],
    rating: 4.8,
    ratePerMinute: 26,
    status: "busy" as PresenceStatus,
    totalStudents: 234
  }
];

const mockMessages = [
  {
    id: "1",
    sender: "teacher" as const,
    content: "Hello! I'm ready to help you with your questions. What would you like to learn today?",
    timestamp: new Date(Date.now() - 120000)
  },
  {
    id: "2",
    sender: "student" as const,
    content: "Hi! I'm struggling with calculus derivatives. Can you help me understand the chain rule?",
    timestamp: new Date(Date.now() - 60000)
  },
  {
    id: "3",
    sender: "teacher" as const,
    content: "Absolutely! The chain rule is fundamental in calculus. Let me break it down for you step by step...",
    timestamp: new Date(Date.now() - 30000)
  }
];

export const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [currentBalance, setCurrentBalance] = useState(127.50);
  const [activeSession, setActiveSession] = useState<any>(null);
  const [teachers, setTeachers] = useState(mockTeachers);

  // Simulate real-time presence updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTeachers(prev => prev.map(teacher => {
        if (Math.random() < 0.1) { // 10% chance to change status
          const statuses: PresenceStatus[] = ["online", "busy", "offline"];
          const currentIndex = statuses.indexOf(teacher.status);
          const newStatus = statuses[(currentIndex + 1) % statuses.length];
          return { ...teacher, status: newStatus };
        }
        return teacher;
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const allSubjects = Array.from(
    new Set(teachers.flatMap(teacher => teacher.subjects))
  ).sort();

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.subjects.some(subject => 
                           subject.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    const matchesSubject = !selectedSubject || teacher.subjects.includes(selectedSubject);
    return matchesSearch && matchesSubject;
  });

  const handleConnect = (teacherId: string, type: 'chat' | 'video') => {
    const teacher = teachers.find(t => t.id === teacherId);
    if (!teacher || teacher.status !== "online") return;

    // Mark teacher as busy
    setTeachers(prev => prev.map(t => 
      t.id === teacherId ? { ...t, status: "busy" as PresenceStatus } : t
    ));

    // Start session
    setActiveSession({
      id: `session-${Date.now()}`,
      teacher: {
        name: teacher.name,
        avatar: teacher.avatar,
        ratePerMinute: teacher.ratePerMinute
      },
      isActive: true,
      startTime: new Date(),
      messages: mockMessages
    });
  };

  const handleSendMessage = (content: string) => {
    if (!activeSession) return;
    
    const newMessage = {
      id: `msg-${Date.now()}`,
      sender: "student" as const,
      content,
      timestamp: new Date()
    };

    setActiveSession(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage]
    }));

    // Simulate teacher response
    setTimeout(() => {
      const teacherResponse = {
        id: `msg-${Date.now()}-teacher`,
        sender: "teacher" as const,
        content: "That's a great question! Let me explain that concept...",
        timestamp: new Date()
      };
      
      setActiveSession(prev => prev ? ({
        ...prev,
        messages: [...prev.messages, teacherResponse]
      }) : null);
    }, 1000 + Math.random() * 2000);
  };

  const handleEndSession = () => {
    if (!activeSession) return;
    
    // Mark teacher as online again
    const teacherName = activeSession.teacher.name;
    setTeachers(prev => prev.map(t => 
      t.name === teacherName ? { ...t, status: "online" as PresenceStatus } : t
    ));
    
    setActiveSession(null);
  };

  const handleTopUp = () => {
    // Simulate wallet top-up
    setCurrentBalance(prev => prev + 100);
  };

  if (activeSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ChatInterface
                session={activeSession}
                onSendMessage={handleSendMessage}
                onEndSession={handleEndSession}
                onStartVideoCall={() => console.log("Starting video call...")}
                currentBalance={currentBalance}
              />
            </div>
            <div>
              <WalletCard
                balance={currentBalance}
                onTopUp={handleTopUp}
                onViewHistory={() => console.log("View history")}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Find Your Perfect Tutor</h1>
          <p className="text-muted-foreground">
            Connect with expert teachers for personalized learning
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search teachers or subjects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedSubject === "" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedSubject("")}
            >
              All Subjects
            </Button>
            {allSubjects.slice(0, 8).map((subject) => (
              <Button
                key={subject}
                variant={selectedSubject === subject ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedSubject(subject)}
              >
                {subject}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Teachers Grid */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                Available Teachers ({filteredTeachers.length})
              </h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-online rounded-full"></div>
                <span>{teachers.filter(t => t.status === "online").length} Online</span>
                <div className="w-2 h-2 bg-busy rounded-full ml-2"></div>
                <span>{teachers.filter(t => t.status === "busy").length} Busy</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredTeachers.map((teacher) => (
                <TeacherCard
                  key={teacher.id}
                  teacher={teacher}
                  onConnect={handleConnect}
                />
              ))}
            </div>
            
            {filteredTeachers.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No teachers found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filters
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <WalletCard
              balance={currentBalance}
              onTopUp={handleTopUp}
              onViewHistory={() => console.log("View history")}
            />
            
            <div className="bg-gradient-card p-4 rounded-lg shadow-soft">
              <h3 className="font-semibold mb-3">Quick Stats</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Teachers:</span>
                  <span className="font-medium">{teachers.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Online Now:</span>
                  <Badge variant="secondary" className="text-xs">
                    {teachers.filter(t => t.status === "online").length}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Avg. Rate:</span>
                  <span className="font-medium">₹{Math.round(teachers.reduce((sum, t) => sum + t.ratePerMinute, 0) / teachers.length)}/min</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};