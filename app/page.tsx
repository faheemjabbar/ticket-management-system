'use client'

import React from 'react';
import { CheckCircle2, Mail } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// --- Types ---
interface FeatureCardProps {
  title: string;
  description: string;
  points: string[];
  buttonText: string;
}

interface TestimonialProps {
  image: string;
  quote: string;
  name: string;
  title: string;
  reverse?: boolean;
}

// --- Sub-Components ---
const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, points, buttonText }) => (
  <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col h-full">
    <h3 className="text-3xl font-bold mb-4 text-slate-900">{title}</h3>
    <p className="text-gray-600 mb-6 text-base leading-relaxed">{description}</p>
    <ul className="space-y-3 mb-8 flex-grow">
      {points.map((point, i) => (
        <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
          <CheckCircle2 className="text-orange-500 w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>{point}</span>
        </li>
      ))}
    </ul>
    <button className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-lg transition-all w-full shadow-md hover:shadow-lg">
      {buttonText}
    </button>
  </div>
);

const Testimonial: React.FC<TestimonialProps> = ({ image, quote, name, title, reverse }) => (
  <div className={`flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12 my-16 max-w-5xl mx-auto px-4`}>
    <div className="w-32 h-32 md:w-40 md:h-40 flex-shrink-0">
      <img src={image} alt={name} className="rounded-full w-full h-full object-cover" />
    </div>
    <div className="flex-1 text-left">
      <blockquote className="text-lg md:text-xl text-gray-700 italic mb-6 leading-relaxed">
        "{quote}"
      </blockquote>
      <p className="font-bold text-gray-900 text-base">{name}</p>
      <p className="text-orange-600 text-sm mt-1">{title}</p>
    </div>
  </div>
);

// --- Main Page Component ---
export default function TickFloLanding() {

  const router = useRouter();

  const handleSignInClick = () => {
    const isRegistered = localStorage.getItem("isRegistered");
    
    if(isRegistered){
      router.push("/login")
    }else{
      router.push("/register")
    }
  }

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white shadow-sm w-full">
        <div className="flex items-center justify-between px-8 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">T</div>
            <span className="text-xl font-extrabold tracking-tight">Tick<span className="text-orange-600">Flo</span></span>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium text-gray-600">
            <button onClick={handleSignInClick} className="hover:text-orange-600 transition-colors">Sign in</button>
            <a href="#" className="hover:text-orange-600 transition-colors">About</a>
            <a href="#" className="hover:text-orange-600 transition-colors">Contact Us</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="text-center py-16 md:py-20 px-4 bg-white relative overflow-hidden">
        {/* Decorative dotted pattern - top right */}
        <div className="absolute top-10 right-10 w-60 h-60 opacity-40 hidden lg:block">
          <Image
            src="/dotted.jpg"
            alt=""
            fill
            className="object-contain"
          />
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 max-w-4xl mx-auto leading-tight">
          Save time managing tickets <br />
          <span className="text-orange-600">higher quality support</span>
        </h1>
        <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed">
          A dedicated platform for customers to submit tickets and get answers. While developers get insights to improve their products and services.
        </p>
        <div className="max-w-5xl mx-auto rounded-lg overflow-hidden shadow-2xl">
           <div className="bg-white relative aspect-[16/9]">
            <Image
              src="/inbox_overview_page.png"
              alt="Dashboard Screenshot"
              fill
              className="object-contain"
              priority
            />
           </div>
        </div>
      </header>

      {/* Feature Split Section */}
      <section className="bg-slate-900 py-16 md:py-20 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">See how you can use Tick<span className="text-orange-600">Flo</span></h2>
            <p className="text-slate-300 text-base md:text-lg max-w-3xl mx-auto">Developers and customers want different functionalities so we split the information for you.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <FeatureCard 
              title="Developers"
              description="You prefer to spend your time building and resolving issues as efficiently as possible."
              points={[
                "Clear overview of all tickets",
                "Auto-assign tickets to team members",
                "Detailed insights into all requests",
                "Analytics to understand customer needs and pain points"
              ]}
              buttonText="Read more"
            />
            <FeatureCard 
              title="Customers"
              description="From simple to complex issues, you want to report them easily and get timely responses."
              points={[
                "Easy ticket submission process",
                "Support for rich text and formatting",
                "Upload images and files with your ticket",
                "Track status and have conversations about your issues"
              ]}
              buttonText="Read more"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-20 text-center bg-white relative overflow-hidden">
        
        <h2 className="text-3xl md:text-4xl font-bold mb-16">Trusted by developers and customers</h2>
        <div className="flex flex-wrap justify-center gap-16 md:gap-24 lg:gap-32 max-w-4xl mx-auto px-4">
          {[ 
            { n: "2500+", l: "Users" }, 
            { n: "4000+", l: "Tickets created" }, 
            { n: "100+", l: "Inboxes" } 
          ].map((stat, i) => (
            <div key={i}>
              <div className="text-4xl md:text-5xl font-black text-orange-600 mb-2">{stat.n}</div>
              <div className="text-gray-600 font-medium text-sm md:text-base">{stat.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 md:py-16 bg-gray-50 relative overflow-hidden">
        {/* Decorative dotted pattern - top left - large background */}
        <div className="absolute top-0 left-0 w-64 h-64 opacity-20 hidden lg:block">
          <Image
            src="/dotted.jpg"
            alt=""
            fill
            className="object-contain"
          />
        </div>
        
        {/* Decorative dotted pattern - bottom right - large background */}
        <div className="absolute bottom-0 right-0 w-60 h-60 opacity-20 hidden lg:block">
          <Image
            src="/dotted.jpg"
            alt=""
            fill
            className="object-contain"
          />
        </div>
        
        {/* Decorative dotted pattern - center background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-90 h-90 opacity-10 hidden md:block">
          <Image
            src="/dotted.jpg"
            alt=""
            fill
            className="object-contain"
          />
        </div>
        
        <Testimonial 
          image="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200"
          name="Michael Chen"
          title="Lead Developer, TechFlow Solutions"
          quote="TickFlo has transformed how our development team handles support tickets. The clear overview and auto-assignment features help us resolve issues faster, and the analytics give us valuable insights into what our customers really need."
        />
        <Testimonial 
          reverse
          image="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200"
          name="Sarah Martinez"
          title="Product Manager, CloudBase Inc"
          quote="As a customer-facing team lead, TickFlo has been a game-changer. Our customers can easily submit tickets with all the details we need, and we can track everything in one place. The conversation feature ensures nothing falls through the cracks."
        />
      </section>

      {/* Footer CTA */}
      <section className="max-w-6xl mx-auto px-4 py-16 md:py-20 relative">
        {/* Decorative dotted pattern - bottom right */}
        <div className="absolute bottom-10 right-10 w-44 h-44 opacity-40 hidden lg:block">
          <Image
            src="/dotted.jpg"
            alt=""
            fill
            className="object-contain"
          />
        </div>
        
        <div className="bg-orange-600 rounded-2xl p-8 md:p-12 lg:p-16 flex flex-col md:flex-row items-center justify-between text-white overflow-hidden relative shadow-2xl">
          <div className="z-10 md:w-1/2 mb-8 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">Ready to dive in?<br />Get in contact with us!</h2>
            <p className="mb-8 text-orange-100 text-base md:text-lg leading-relaxed">We love to have a conversation with you and discuss the possibilities.</p>
            <button className="bg-white text-orange-600 font-bold py-3 px-8 rounded-lg flex items-center gap-2 hover:bg-orange-50 transition-all shadow-lg hover:shadow-xl">
              <Mail size={18} />
              Send us an email
            </button>
          </div>
          <div className="hidden md:block md:w-1/2 relative h-64 lg:h-80">
            <div className="absolute inset-0 opacity-30">
              <Image
                src="/inbox_overview_page.png"
                alt="Dashboard Preview"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Footer */}
      <footer className="border-t py-8 text-sm text-gray-500 bg-white">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>© 2026 TickFlo</div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-orange-600 transition-colors">Contact</a>
            <a href="#" className="hover:text-orange-600 transition-colors">Privacy policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
