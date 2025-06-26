"use client"

import { useState, useEffect } from "react"
import { Menu, X, Download, Github, Mail } from "lucide-react"
import Link from "next/link"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showSignup, setShowSignup] = useState(false)
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would send the email to your backend or a service like Mailchimp
    setSubmitted(true)
    setTimeout(() => {
      setShowSignup(false)
      setSubmitted(false)
      setEmail("")
    }, 2000)
  }

  return (
    <>
      <nav
        className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${
          scrolled ? "backdrop-blur-xl bg-white/10" : "backdrop-blur-md bg-white/5"
        } border border-white/20 rounded-2xl px-6 py-3 shadow-2xl`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="font-mono text-white font-bold text-lg">DEDCORE</div>

            <div className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-white/80 hover:text-white transition-colors text-sm font-medium">
                Features
              </a>
              <a href="#download" className="text-white/80 hover:text-white transition-colors text-sm font-medium">
                Download
              </a>
              <Link href="/docs" className="text-white/80 hover:text-white transition-colors text-sm font-medium">
                Docs
              </Link>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <button className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors">
              <Github size={16} />
              <span className="text-sm">GitHub</span>
            </button>
            <button
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-colors text-sm font-medium"
              onClick={() => setShowSignup(true)}
            >
              <Mail size={16} />
              <span>Sign Up</span>
            </button>
          </div>

          <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-white/20">
            <div className="flex flex-col space-y-3">
              <a href="#features" className="text-white/80 hover:text-white transition-colors text-sm">
                Features
              </a>
              <a href="#download" className="text-white/80 hover:text-white transition-colors text-sm">
                Download
              </a>
              <Link href="/docs" className="text-white/80 hover:text-white transition-colors text-sm">
                Docs
              </Link>
              <div className="flex items-center space-x-4 pt-2">
                <button className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors text-sm">
                  <Github size={16} />
                  <span>GitHub</span>
                </button>
                <button
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors text-sm"
                  onClick={() => setShowSignup(true)}
                >
                  <Mail size={16} />
                  <span>Sign Up</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
      {/* Signup Modal - now outside nav for full-page overlay */}
      {showSignup && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md"
          onClick={e => {
            if (e.target === e.currentTarget) setShowSignup(false)
          }}
        >
          <div
            className="bg-gray-900/90 border border-cyan-700 rounded-2xl p-8 shadow-2xl max-w-xs w-full relative text-white animate-fade-in-scale"
            style={{ animation: 'fadeInScale 0.3s cubic-bezier(.4,2,.6,1)' }}
          >
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-cyan-400"
              onClick={() => setShowSignup(false)}
            >
              <X size={20} />
            </button>
            <h2 className="text-lg font-bold mb-2 text-cyan-300">Sign up for updates</h2>
            <form onSubmit={handleSignup} className="flex flex-col gap-3">
              <input
                type="email"
                required
                placeholder="Your email"
                className="border border-cyan-700 bg-gray-800 text-white rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-gray-400"
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={submitted}
              />
              <button
                type="submit"
                className="bg-cyan-600 hover:bg-cyan-400 text-white font-bold py-2 rounded transition-colors"
                disabled={submitted}
              >
                {submitted ? "Subscribed!" : "Subscribe"}
              </button>
            </form>
            <p className="text-xs text-gray-400 mt-2">Get the latest updates and releases for DedCore.</p>
          </div>
          <style jsx global>{`
            @keyframes fadeInScale {
              0% { opacity: 0; transform: scale(0.92); }
              100% { opacity: 1; transform: scale(1); }
            }
            .animate-fade-in-scale {
              animation: fadeInScale 0.3s cubic-bezier(.4,2,.6,1);
            }
          `}</style>
        </div>
      )}
    </>
  )
}
