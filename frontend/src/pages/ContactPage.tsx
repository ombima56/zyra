"use client";
import { Mail, MessageCircle, Phone, MapPin, Send, Clock } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-gray-100 mt-10">
      {/* Main Content Container */}
      <div className="container mx-auto px-4 py-8 sm:py-12 lg:py-16 ">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl md:text-5xl font-bold text-foreground">
              Let's Connect
            </h1>
            <p className="mt-4 text-lg md:text-xl text-muted-foreground">
              Ready to revolutionize cross-border payments in Africa? Join us in
              making financial transactions as simple as sending a WhatsApp
              message.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Contact Form */}
            <div className="bg-card/80 backdrop-blur-sm border border-green-500/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
                <h2 className="text-xl sm:text-2xl font-semibold">
                  Start a Conversation
                </h2>
              </div>

              <form className="space-y-4 sm:space-y-6">
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl bg-slate-800/50 border border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all duration-200 text-sm sm:text-base"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl bg-slate-800/50 border border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all duration-200 text-sm sm:text-base"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Subject
                  </label>
                  <select className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl bg-slate-800/50 border border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all duration-200 text-sm sm:text-base">
                    <option>General Inquiry</option>
                    <option>Partnership Opportunities</option>
                    <option>Integration Support</option>
                    <option>Investment & Funding</option>
                    <option>Media & Press</option>
                    <option>Technical Support</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl bg-slate-800/50 border border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all duration-200 resize-none text-sm sm:text-base"
                    placeholder="Tell us about your cross-border payment needs, partnership ideas, or how we can help solve your financial challenges..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4 py-2 has-[>svg]:px-3 hidden md:inline-flex"
                >
                  <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-4 sm:space-y-6">
              {/* Email Card */}
              <div className="bg-card/80 backdrop-blur-sm border border-blue-500/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl hover:shadow-2xl transition-all duration-300 group cursor-pointer">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="bg-blue-500/20 p-2 sm:p-3 rounded-lg sm:rounded-xl group-hover:bg-blue-500/30 transition-colors duration-300">
                    <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">
                      Partner with Us
                    </h3>
                    <p className="text-gray-300 mb-2 text-sm sm:text-base">
                      Join our mission to transform African payments
                    </p>
                    <a
                      href="mailto:partnerships@zyra.com"
                      className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200 text-sm sm:text-base break-all sm:break-normal"
                    >
                      partnerships@zyra.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Phone Card */}
              <div className="bg-card/80 backdrop-blur-sm border border-green-500/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl hover:shadow-2xl transition-all duration-300 group cursor-pointer">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="bg-green-500/20 p-2 sm:p-3 rounded-lg sm:rounded-xl group-hover:bg-green-500/30 transition-colors duration-300">
                    <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">
                      WhatsApp Support
                    </h3>
                    <p className="text-gray-300 mb-2 text-sm sm:text-base">
                      Get help where you're most comfortable
                    </p>
                    <a
                      href="https://wa.me/1234567890"
                      className="text-green-400 hover:text-green-300 font-medium transition-colors duration-200 text-sm sm:text-base"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Chat on WhatsApp
                    </a>
                  </div>
                </div>
              </div>

              {/* Office Card */}
              <div className="bg-card/80 backdrop-blur-sm border border-purple-500/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl hover:shadow-2xl transition-all duration-300 group cursor-pointer">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="bg-purple-500/20 p-2 sm:p-3 rounded-lg sm:rounded-xl group-hover:bg-purple-500/30 transition-colors duration-300">
                    <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">
                      Meet in Person
                    </h3>
                    <p className="text-gray-300 mb-2 text-sm sm:text-base">
                      Visit our Nairobi innovation hub
                    </p>
                    <p className="text-purple-400 text-sm sm:text-base">
                      Nairobi, Kenya
                      <br />
                      East Africa's Tech Hub
                    </p>
                  </div>
                </div>
              </div>

              {/* Developer API */}
              <div className="bg-card/80 backdrop-blur-sm border border-orange-500/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl hover:shadow-2xl transition-all duration-300 group cursor-pointer">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="bg-orange-500/20 p-2 sm:p-3 rounded-lg sm:rounded-xl group-hover:bg-orange-500/30 transition-colors duration-300">
                    <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">
                      Developer Resources
                    </h3>
                    <p className="text-gray-300 mb-2 text-sm sm:text-base">
                      Build with Zyra's payment infrastructure
                    </p>
                    <a
                      href="mailto:developers@zyra.com"
                      className="text-orange-400 hover:text-orange-300 font-medium transition-colors duration-200 text-sm sm:text-base"
                    >
                      developers@zyra.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-8 sm:mt-12">
            <p className="text-base sm:text-lg text-gray-400 px-4">
              Response time:{" "}
              <span className="text-blue-400 font-semibold">
                Within 24 hours
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
