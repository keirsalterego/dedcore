"use client"

import { ArrowRight, Terminal, Zap, Shield } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Hero() {
  const [currentTime, setCurrentTime] = useState("")
  const [typedText, setTypedText] = useState("")
  const fullText = "oops no more duplicates"
  const router = useRouter()

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    let index = 0
    const typeTimer = setInterval(() => {
      if (index < fullText.length) {
        setTypedText(fullText.slice(0, index + 1))
        index++
      } else {
        clearInterval(typeTimer)
      }
    }, 100)
    return () => clearInterval(typeTimer)
  }, [])

  return (
    <section className="min-h-screen flex items-center justify-center px-4 pt-20">
      <div className="max-w-6xl mx-auto">
        {/* Terminal Header */}
        <div className="bg-gray-900 border border-gray-700 rounded-t-lg p-3 mb-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="text-gray-400 text-sm font-mono">dedcore@terminal ~ {currentTime}</div>
          </div>
        </div>

        {/* Terminal Content */}
        <div className="bg-black border border-gray-700 border-t-0 rounded-b-lg p-8 font-mono">
          {/* ASCII Art */}
          <div className="mb-8">
            <pre className="text-green-400 text-xs sm:text-sm md:text-base leading-tight">
              {`
██████╗ ███████╗██████╗  ██████╗ ██████╗ ██████╗ ███████╗
██╔══██╗██╔════╝██╔══██╗██╔════╝██╔═══██╗██╔══██╗██╔════╝
██║  ██║█████╗  ██║  ██║██║     ██║   ██║██████╔╝█████╗  
██║  ██║██╔══╝  ██║  ██║██║     ██║   ██║██╔══██╗██╔══╝  
██████╔╝███████╗██████╔╝╚██████╗╚██████╔╝██║  ██║███████╗
╚═════╝ ╚══════╝╚═════╝  ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝
              `}
            </pre>
          </div>

          {/* Terminal Commands */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center space-x-2">
              <span className="text-green-400">$</span>
              <span className="text-white">./dedcore --tagline</span>
            </div>
            <div className="text-green-400 ml-4">
              {typedText}
              <span className="animate-pulse">|</span>
            </div>

            <div className="flex items-center space-x-2 mt-6">
              <span className="text-green-400">$</span>
              <span className="text-white">./dedcore --info</span>
            </div>
            <div className="text-gray-300 ml-4 space-y-1">
              <div>Advanced file deduplication tool</div>
              <div>Lightning fast • 100% safe • AI-powered</div>
              <div>Scan millions of files in seconds</div>
            </div>

            <div className="flex items-center space-x-2 mt-6">
              <span className="text-green-400">$</span>
              <span className="text-white">./dedcore --stats</span>
            </div>
            <div className="text-cyan-400 ml-4 space-y-1">
              <div>Files processed: 10,000+</div>
              <div>Space recovered: 22.5GB</div>
              <div>Accuracy rate: 99.9%</div>
              <div>Happy users: 100+</div>
            </div>
          </div>

          {/* Terminal Buttons */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-green-400">$</span>
              <span className="text-white">Choose action:</span>
            </div>

            <div className="ml-4 space-y-3">
              <button
                className="group flex items-center space-x-3 text-black bg-green-400 hover:bg-green-300 px-6 py-3 rounded font-mono font-bold transition-colors"
                onClick={() => router.push("/#download")}
              >
                <Terminal size={20} />
                <span>[1] Download Now</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <button className="flex items-center space-x-3 text-green-400 border border-green-400 hover:bg-green-400 hover:text-black px-6 py-3 rounded font-mono transition-colors">
                <span>[2] View Documentation</span>
              </button>

              <button className="flex items-center space-x-3 text-cyan-400 border border-cyan-400 hover:bg-cyan-400 hover:text-black px-6 py-3 rounded font-mono transition-colors">
                <span>[3] GitHub Repository</span>
              </button>
            </div>
          </div>

          {/* Status Bar */}
          <div className="mt-8 pt-4 border-t border-gray-700 flex justify-between text-gray-500 text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Zap size={14} className="text-yellow-400" />
                <span>Lightning Fast</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield size={14} className="text-green-400" />
                <span>100% Safe</span>
              </div>
            </div>
            <div>Ready for input...</div>
          </div>
        </div>
      </div>
    </section>
  )
}
