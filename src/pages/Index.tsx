import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dashboard } from "@/components/Dashboard";
import { GraduationCap, MessageCircle, Users, Clock } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";

const Index = () => {
  const [showDashboard, setShowDashboard] = useState(false);

  if (showDashboard) {
    return <Dashboard />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-8 h-8 text-primary" />
              <span className="text-xl font-bold">TutorConnect</span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost">Login</Button>
              <Button>Sign Up</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-90"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                Learn from Expert
                <span className="block text-primary-glow">Tutors Worldwide</span>
              </h1>
              <p className="text-xl mb-8 text-white/90 leading-relaxed">
                Connect with qualified teachers for personalized learning sessions. 
                Pay per minute, learn at your pace, achieve your goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  variant="hero" 
                  size="lg"
                  onClick={() => setShowDashboard(true)}
                  className="text-lg px-8 py-6"
                >
                  Find Your Tutor
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="text-lg px-8 py-6 border-white/30 text-white hover:bg-white/10"
                >
                  Become a Teacher
                </Button>
              </div>
            </div>
            <div className="relative">
              <img
                src={heroBanner}
                alt="Students learning with tutors"
                className="rounded-2xl shadow-glow w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-background to-secondary/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Why Choose TutorConnect?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the future of personalized learning with our innovative platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <MessageCircle className="w-8 h-8" />,
                title: "Real-time Chat",
                description: "Instant messaging with your tutor for quick clarifications and discussions"
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Expert Tutors",
                description: "Verified teachers with proven track records and excellent ratings"
              },
              {
                icon: <Clock className="w-8 h-8" />,
                title: "Flexible Timing",
                description: "Learn at your own pace with pay-per-minute billing system"
              },
              {
                icon: <GraduationCap className="w-8 h-8" />,
                title: "All Subjects",
                description: "From basic math to advanced programming - find tutors for any subject"
              }
            ].map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="bg-gradient-card rounded-2xl p-8 shadow-soft hover:shadow-medium transition-all duration-300 group-hover:scale-105">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 text-primary rounded-full mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl lg:text-4xl font-bold text-primary-foreground mb-6">
            Ready to Start Learning?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8">
            Join thousands of students already learning with expert tutors
          </p>
          <Button 
            variant="secondary" 
            size="lg"
            onClick={() => setShowDashboard(true)}
            className="text-lg px-8 py-6"
          >
            Get Started Today
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
