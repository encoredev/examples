import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight, Zap, Shield, CreditCard, Sparkles } from "lucide-react";
import { Navigation } from "@/components/navigation";

const features = [
  {
    title: "Lightning Fast Deployment",
    description: "Deploy your application in seconds with our automated CI/CD pipeline. Zero configuration needed - just push your code and we handle the rest.",
    icon: <Zap className="w-6 h-6" />,
    highlight: "Deploy in seconds, not hours",
    gradient: "from-zinc-900 to-zinc-800"
  },
  {
    title: "Stripe Payment Integration",
    description: "Built-in Stripe integration for seamless payment processing. Accept payments globally with support for multiple currencies and payment methods.",
    icon: <CreditCard className="w-6 h-6" />,
    highlight: "Ready-to-use payment system",
    gradient: "from-zinc-900 to-zinc-800"
  },
  {
    title: "Firebase Authentication",
    description: "Enterprise-grade authentication powered by Firebase. Social logins, email verification, and password recovery work right out of the box.",
    icon: <Shield className="w-6 h-6" />,
    highlight: "Secure user management",
    gradient: "from-zinc-900 to-zinc-800"
  },
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "CTO at TechFlow",
    content: "EncoreKit has transformed how we build and deploy applications. It's a game-changer.",
    avatar: "/avatars/sarah.png",
  },
  {
    name: "Mark Anderson",
    role: "Lead Developer",
    content: "The developer experience is unmatched. Our team's productivity has increased by 3x.",
    avatar: "/avatars/mark.png",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative px-4 pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col items-center text-center">
            
            <h1 className="max-w-4xl text-5xl font-bold tracking-tight sm:text-7xl mb-8">
              Build Better Apps with{" "}
              <span>
                EncoreKit
              </span>
            </h1>
            
            <p className="max-w-2xl text-xl text-zinc-900 mb-10">
              The complete development platform with built-in authentication, payments, and deployment. Start building your next big idea in minutes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
              <Link href="/pricing">
                <Button size="lg" className="bg-zinc-900 hover:bg-zinc-800 text-white">
                  Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="https://github.com/encoredev/examples">
                <Button size="lg" variant="outline" className="border-zinc-800 hover:bg-zinc-200">
                  View Documentation
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-[#EBEBDF] relative">
        <div className="container mx-auto max-w-7xl px-4 mt-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={feature.title} 
                className="group relative overflow-hidden border-zinc-200 bg-[#EBEBDF] transition-all duration-500"
              >
                {/* Gradient Border Top */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.gradient}`} />
                
                <div className="p-8">
                  {/* Icon with Gradient Background */}
                  <div className="relative mb-6">
                    <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-10 rounded-lg transform group-hover:scale-110 transition-transform duration-500`} />
                    <div className="relative h-12 w-12 rounded-lg flex items-center justify-center text-zinc-900">
                      {feature.icon}
                    </div>
                  </div>

                  {/* Title and Content */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-black transition-colors duration-300">
                      {feature.title}
                    </h3>
                    
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-zinc-900" />
                      <span className="text-sm font-medium text-zinc-900">
                        {feature.highlight}
                      </span>
                    </div>

                    <p className="text-zinc-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  {/* Hover State Link */}
                  <div className="mt-6 flex items-center text-zinc-900 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span>Learn more</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
