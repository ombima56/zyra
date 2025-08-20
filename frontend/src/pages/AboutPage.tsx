"use client";
import {
  MessageSquare,
  Globe,
  Shield,
  Zap,
  Users,
  Target,
  Heart,
  CheckCircle,
  TrendingUp,
  Smartphone,
  DollarSign,
  ArrowRight,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-gray-100 mt-10">
      {/* Main Content Container */}
      <div className="container mx-auto px-4 py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12 sm:mb-16">
            <h1 className="text-3xl md:text-5xl font-bold text-foreground">
              About Zyra
            </h1>
            <p className="mt-4 text-lg md:text-xl text-muted-foreground">
              Bridging Africa's financial divide through the power of WhatsApp
              and blockchain technology
            </p>
          </div>

          {/* Mission Statement */}
          <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-3xl p-8 sm:p-12 mb-12 sm:mb-16">
            <div className="text-center mb-8">
              <Target className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Our Mission
              </h2>
            </div>
            <p className="text-lg sm:text-xl text-gray-200 leading-relaxed text-center max-w-4xl mx-auto">
              To democratize financial access across Africa by transforming
              WhatsApp into a powerful payment platform. We're making
              cross-border transactions as simple, secure, and social as sending
              a message to a friend.
            </p>
          </div>

          {/* Problem & Solution */}
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 mb-12 sm:mb-16">
            {/* Problem */}
            <div className="bg-red-500/5 border border-red-500/20 rounded-3xl p-6 sm:p-8">
              <div className="mb-6">
                <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-red-400">
                  The Problem
                </h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <DollarSign className="w-6 h-6 text-red-400 mt-1 flex-shrink-0" />
                  <p className="text-gray-300">
                    <span className="font-semibold text-red-300">
                      8.37% average fees
                    </span>{" "}
                    for remittances in Sub-Saharan Africa - the world's most
                    expensive
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-6 h-6 text-red-400 mt-1 flex-shrink-0" />
                  <p className="text-gray-300">
                    <span className="font-semibold text-red-300">
                      $300+ billion
                    </span>{" "}
                    in cross-border payments needed across Africa in 2025
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Smartphone className="w-6 h-6 text-red-400 mt-1 flex-shrink-0" />
                  <p className="text-gray-300">
                    Despite{" "}
                    <span className="font-semibold text-red-300">
                      72% smartphone penetration
                    </span>{" "}
                    in Kenya, only{" "}
                    <span className="font-semibold text-red-300">2.23%</span>{" "}
                    use cryptocurrency
                  </p>
                </div>
              </div>
            </div>

            {/* Solution */}
            <div className="bg-green-500/5 border border-green-500/20 rounded-3xl p-6 sm:p-8">
              <div className="mb-6">
                <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-green-400">
                  Our Solution
                </h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MessageSquare className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
                  <p className="text-gray-300">
                    <span className="font-semibold text-green-300">
                      97% WhatsApp adoption
                    </span>{" "}
                    among Kenya's internet users - the perfect bridge
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Zap className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
                  <p className="text-gray-300">
                    Built on{" "}
                    <span className="font-semibold text-green-300">
                      Stellar blockchain
                    </span>{" "}
                    for fast, low-cost transactions
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
                  <p className="text-gray-300">
                    <span className="font-semibold text-green-300">
                      No new apps to download
                    </span>{" "}
                    - works within familiar WhatsApp interface
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Core Values */}
          <div className="mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-12">
              Our Values
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-card/80 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-6 text-center group hover:scale-105 transition-all duration-300">
                <div className="bg-blue-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-500/30 transition-colors">
                  <Globe className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Accessibility</h3>
                <p className="text-gray-300 text-sm">
                  Financial services should be available to everyone,
                  everywhere, regardless of technical expertise or
                  infrastructure.
                </p>
              </div>

              <div className="bg-card/80 backdrop-blur-sm border border-green-500/20 rounded-2xl p-6 text-center group hover:scale-105 transition-all duration-300">
                <div className="bg-green-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-500/30 transition-colors">
                  <Shield className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Security</h3>
                <p className="text-gray-300 text-sm">
                  Blockchain-powered security meets user-friendly design,
                  protecting every transaction without complexity.
                </p>
              </div>

              <div className="bg-card/80 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 text-center group hover:scale-105 transition-all duration-300">
                <div className="bg-purple-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-500/30 transition-colors">
                  <Heart className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Community</h3>
                <p className="text-gray-300 text-sm">
                  Building stronger connections across borders, enabling
                  families and businesses to thrive together.
                </p>
              </div>
            </div>
          </div>

          {/* What We Do */}
          <div className="mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-12">
              What We Do
            </h2>
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="bg-green-500/20 p-3 rounded-xl">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Seamless WhatsApp Integration
                    </h3>
                    <p className="text-gray-300">
                      Send money as easily as sending a message. No new apps, no
                      complex setups - just the WhatsApp you already know and
                      love.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="bg-blue-500/20 p-3 rounded-xl">
                    <CheckCircle className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Cross-Border Payments
                    </h3>
                    <p className="text-gray-300">
                      Support family, pay freelancers, or split bills across
                      African borders without the traditional high fees and
                      delays.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="bg-purple-500/20 p-3 rounded-xl">
                    <CheckCircle className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Social Finance
                    </h3>
                    <p className="text-gray-300">
                      Combine conversations and transactions in one place,
                      making financial interactions as natural as chatting with
                      friends.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-3xl p-8 flex items-center">
                <div className="text-center">
                  <MessageSquare className="w-20 h-20 text-green-400 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold mb-4">
                    The Future is Social Finance
                  </h3>
                  <p className="text-gray-300 text-lg">
                    Where conversations and transactions happen seamlessly,
                    creating stronger communities across Africa.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center bg-gradient-to-r from-green-600/20 to-blue-600/20 border border-green-500/30 rounded-3xl p-8 sm:p-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Join the Revolution
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Ready to be part of Africa's financial transformation? Let's build
              the future of cross-border payments together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
                Get Started Today
                <ArrowRight className="w-5 h-5" />
              </button>
              <span className="text-gray-400">or</span>
              <a
                href="/contact"
                className="text-green-400 hover:text-green-300 font-semibold border border-green-400/30 hover:border-green-300/50 py-4 px-8 rounded-xl transition-all duration-300"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
