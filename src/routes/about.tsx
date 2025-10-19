import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "#client/components/ui/card";
import { Badge } from "#client/components/ui/badge";
import { Button } from "#client/components/ui/button";
import { 
  HeartHandshake, 
  Target, 
  Users, 
  TrendingUp,
  Award,
  Globe,
  Lightbulb,
  Shield
} from "lucide-react";

export const Route = createFileRoute("/about")({
  component: AboutUs,
});

function AboutUs() {
  const stats = [
    { label: "Active Students", value: "2,500+", icon: Users },
    { label: "CSP organisations", value: "150+", icon: Globe },
    { label: "Projects Listed", value: "500+", icon: Target },
    { label: "Service Hours", value: "50,000+", icon: Award },
  ];

  const values = [
    {
      icon: HeartHandshake,
      title: "Community Impact",
      description: "We believe in creating meaningful connections between students and organisations to drive positive social change.",
    },
    {
      icon: Target,
      title: "Purposeful Matching",
      description: "Our platform helps students find CSPs that align with their passions, skills, and academic requirements.",
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "Using technology to simplify the CSP discovery and application process for everyone involved.",
    },
    {
      icon: Shield,
      title: "Trust & Transparency",
      description: "We verify organisations and provide clear information to ensure safe and meaningful experiences.",
    },
  ];

  const team = [
    {
      name: "SMU Students",
      role: "Platform Creators",
      description: "Built by students, for students",
    },
    {
      name: "CSP Leaders",
      role: "Community Partners",
      description: "Dedicated to social impact",
    },
    {
      name: "Faculty Advisors",
      role: "Academic Guidance",
      description: "Ensuring alignment with SMU values",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#2563eb] to-[#10b981] mb-6">
              <HeartHandshake className="h-10 w-10 text-white" />
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
              About <span className="text-gradient-smunity">SMUnity</span>
            </h1>
            <p className="text-lg text-muted-foreground font-body max-w-2xl mx-auto">
              Empowering Singapore Management University students to discover, apply for, and manage 
              Community Service Projects that make a real difference in our community.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
                Our Mission
              </h2>
              <p className="text-lg text-muted-foreground font-body">
                To centralize community service opportunities and simplify the process of finding, 
                applying for, and managing CSPs while ensuring alignment with SMU's graduation requirements.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
              {stats.map((stat) => (
                <Card key={stat.label} className="text-center">
                  <CardContent className="pt-6">
                    <stat.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                    <div className="text-3xl font-bold text-foreground font-heading mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground font-body">
                      {stat.label}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
                Our Values
              </h2>
              <p className="text-muted-foreground font-body">
                The principles that guide everything we do
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {values.map((value) => (
                <Card key={value.title} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <value.icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="font-heading text-xl">
                        {value.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground font-body">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
                Our Story
              </h2>
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-muted-foreground font-body text-lg mb-6">
                SMUnity was born from a simple observation: SMU students wanted to engage in meaningful 
                community service, but finding the right opportunities was challenging and time-consuming.
              </p>
              
              <p className="text-muted-foreground font-body text-lg mb-6">
                Traditional methods of discovering CSPs involved scattered information across multiple platforms, 
                unclear application processes, and difficulty tracking service hours. We knew there had to be a better way.
              </p>

              <p className="text-muted-foreground font-body text-lg mb-6">
                That's why we created SMUnity - a centralized platform that brings together students, CSP organisations, 
                and project opportunities in one place. Our goal is to make community service accessible, transparent, 
                and aligned with your academic journey at SMU.
              </p>

              <div className="bg-primary/5 border-l-4 border-primary p-6 my-8 rounded-r-lg">
                <p className="text-foreground font-body text-lg italic">
                  "We envision a future where every SMU student can easily find and engage in community service 
                  that matches their passion, contributes to their growth, and creates lasting impact in Singapore."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
                Who We Are
              </h2>
              <p className="text-muted-foreground font-body">
                A collaborative effort bringing together multiple stakeholders
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {team.map((member) => (
                <Card key={member.name} className="text-center">
                  <CardHeader>
                    <div className="h-20 w-20 rounded-full bg-gradient-to-br from-[#2563eb] to-[#10b981] mx-auto mb-4 flex items-center justify-center">
                      <Users className="h-10 w-10 text-white" />
                    </div>
                    <CardTitle className="font-heading text-xl">
                      {member.name}
                    </CardTitle>
                    <Badge variant="secondary" className="mx-auto w-fit">
                      {member.role}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground font-body text-sm">
                      {member.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
              <CardContent className="p-12 text-center">
                <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
                  Ready to Make a Difference?
                </h2>
                <p className="text-muted-foreground font-body text-lg mb-8 max-w-2xl mx-auto">
                  Join thousands of SMU students who are creating positive change in our community. 
                  Start your CSP journey today.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" asChild>
                    <a href="/discover">Discover CSPs</a>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <a href="/auth/signup">Get Started</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
