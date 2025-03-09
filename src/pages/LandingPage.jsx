import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { Button } from "../components/ui/button";
import { useEffect, useState } from "react";
import logoImage from '../assets/logodash.png';
import { MarqueeVerticalImages } from "../components/ui/MarqueeVerticalImages";

export default function LandingPage() {
  return (
    <div className="dark min-h-screen bg-black text-white">
      {/* Navigation */}
      <header className="container mx-auto py-4 px-4 md:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-12">
            <Link to="/" className="flex items-center">
              <img 
                src={logoImage} 
                alt="Sentia Logo" 
                className="h-10 w-auto rounded-md"
              />
            </Link>
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="#" className="text-gray-300 hover:text-white transition-colors">
                About
              </Link>
              <Link to="#" className="text-gray-300 hover:text-white transition-colors">
                Features
              </Link>
              <Link to="#" className="text-gray-300 hover:text-white transition-colors">
                Pricing
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="hidden md:inline-block text-white hover:text-gray-200 transition-colors">
              Login
            </Link>
            <Link to="/login">
              <Button className="bg-white text-black hover:bg-gray-200 rounded-full px-6">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 md:px-6 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            {/* Rating Badge */}
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-green-400">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              <span className="text-gray-300">
                Rated <span className="font-bold">5.0</span> on Shopify
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                Capture
                <span className="relative ml-2">
                  Every
                  <div className="absolute w-full h-1 bg-yellow-400 bottom-2 left-0 opacity-50"></div>
                </span>
                <br />
                Festival
                <br />
                <span className="text-gray-500">Moment</span>
              </h1>
              <p className="text-gray-400 text-lg md:text-xl max-w-xl">
                Your all-in-one platform for managing, sharing, and preserving your most cherished event memories.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/login">
                <Button className="bg-yellow-400 text-black hover:bg-yellow-500 rounded-full px-8 py-6 text-lg">
                  Get Started — For Free!
                </Button>
              </Link>
              <Link to="/login">
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-gray-900 rounded-full px-8 py-6 text-lg"
                >
                  Book A Demo
                </Button>
              </Link>
            </div>
          </div>

          {/* Replace old image grid with MarqueeVerticalImages component */}
          <MarqueeVerticalImages />
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="container mx-auto px-4 md:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-900 p-8 rounded-3xl">
            <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black">
                <polygon points="23 7 16 12 23 17 23 7"></polygon>
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">Live Event Streaming</h3>
            <p className="text-gray-400">Stream your events live with high-quality video and interactive features for remote attendees.</p>
          </div>
          
          <div className="bg-gray-900 p-8 rounded-3xl">
            <div className="w-12 h-12 bg-green-400 rounded-full flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black">
                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                <line x1="4" y1="22" x2="4" y2="15"></line>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">Event Marketing</h3>
            <p className="text-gray-400">Boost event attendance with targeted marketing campaigns and analytics to track performance.</p>
          </div>
          
          <div className="bg-gray-900 p-8 rounded-3xl">
            <div className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">Attendee Management</h3>
            <p className="text-gray-400">Seamlessly manage event registration, ticketing, and check-ins with our comprehensive tools.</p>
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="container mx-auto px-4 md:px-6 py-12 border-t border-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <div className="text-sm text-gray-400">UP TO</div>
            <div className="text-5xl font-bold">288%</div>
            <div className="text-gray-400">Uplift Conversions</div>
          </div>
          <div className="space-y-2">
            <div className="text-sm text-gray-400">UP TO</div>
            <div className="text-5xl font-bold">20X</div>
            <div className="text-gray-400">Jump in product discovery</div>
          </div>
          <div className="space-y-2">
            <div className="text-sm text-gray-400">UP TO</div>
            <div className="text-5xl font-bold">392%</div>
            <div className="text-gray-400">Increase user engagement</div>
          </div>
        </div>
      </section>
    </div>
  )
} 