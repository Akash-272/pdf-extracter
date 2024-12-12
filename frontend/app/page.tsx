"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Upload, Search, Zap, ArrowRight, FileText, BarChart3, Shield } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      

      <main>
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-semibold !leading-snug mb-6">
              Powerful AI Model Processing
              <br />
              <span className="text-purple-600"> Made Simple</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Upload, process, and analyze your data with state-of-the-art AI models.
              Get insights faster than ever before.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/upload">
                <Button size="lg" className="gap-2">
                  Start Processing <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Powerful Features</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Upload className="w-10 h-10 text-purple-600" />}
                title="Easy Upload"
                description="Drag and drop multiple files or use our intuitive file picker"
              />
              <FeatureCard
                icon={<Zap className="w-10 h-10 text-purple-600" />}
                title="Fast Processing"
                description="Get results in seconds with our optimized AI models"
              />
              <FeatureCard
                icon={<BarChart3 className="w-10 h-10 text-purple-600" />}
                title="Advanced Analytics"
                description="Detailed insights and visualizations for your data"
              />
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 border-t">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <StatCard number="10M+" label="Processed Files" />
              <StatCard number="99.9%" label="Accuracy Rate" />
              <StatCard number="24/7" label="Support Available" />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-purple-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-lg mb-8 opacity-90">
              Join thousands of users who trust our AI models for their data processing needs.
            </p>
            <Button size="lg" variant="white" className="gap-2">
              Start Free Trial <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Brain className="w-6 h-6 text-purple-600" />
                <span className="font-bold">
                  Cipher
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Powerful AI processing solutions for your data needs.
              </p>
            </div>
            <FooterLinks
              title="Product"
              links={["Features", "Pricing", "Documentation", "API"]}
            />
            <FooterLinks
              title="Company"
              links={["About", "Blog", "Careers", "Contact"]}
            />
            <FooterLinks
              title="Legal"
              links={["Privacy", "Terms", "Security", "Compliance"]}
            />
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center">
          {icon}
          <h3 className="text-xl font-semibold mt-4 mb-2">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div>
      <div className="text-4xl font-bold text-purple-600 mb-2">{number}</div>
      <div className="text-gray-600">{label}</div>
    </div>
  );
}

function FooterLinks({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h3 className="font-semibold mb-4">{title}</h3>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link}>
            <Link href="#" className="text-sm text-gray-600 hover:text-gray-900">
              {link}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}