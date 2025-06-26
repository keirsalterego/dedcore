"use client"

import { Github, Twitter, Mail, Heart } from "lucide-react"

export default function Footer() {
  return (
    <footer className="py-16 px-4 border-t border-gray-700">
      <div className="max-w-6xl mx-auto">
        {/* Terminal Footer */}
        <div className="bg-gray-900 border border-gray-700 rounded-t-lg p-3 mb-0">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-400 text-sm font-mono ml-4">footer.sh</span>
          </div>
        </div>

        <div className="bg-black border border-gray-700 border-t-0 rounded-b-lg p-8 font-mono">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-green-400">$</span>
                <span className="text-white">./dedcore --about</span>
              </div>
              <div className="ml-4 space-y-2">
                <div className="text-green-400 font-bold text-xl">DEDCORE</div>
                <p className="text-gray-300 text-sm max-w-md">
                  Advanced file deduplication tool that helps you reclaim storage space and organize your digital life.
                </p>
                <div className="flex space-x-4 mt-4">
                  <button className="text-gray-400 hover:text-green-400 transition-colors">
                    <Github size={16} />
                  </button>
                  <button className="text-gray-400 hover:text-cyan-400 transition-colors">
                    <Twitter size={16} />
                  </button>
                  <button className="text-gray-400 hover:text-yellow-400 transition-colors">
                    <Mail size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Links */}
            <div>
              <div className="text-yellow-400 font-bold mb-3">Product</div>
              <ul className="space-y-2 text-sm">
                {["Features", "Download", "Documentation", "Changelog"].map((item, index) => (
                  <li key={index}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="text-cyan-400 font-bold mb-3">Support</div>
              <ul className="space-y-2 text-sm">
                {["Community", "Bug Reports", "Contact", "FAQ"].map((item, index) => (
                  <li key={index}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-500 text-sm mb-4 md:mb-0">© 2024 DEDCORE. All rights reserved.</div>
            <div className="flex items-center space-x-2 text-gray-500 text-sm">
              <span>Made with</span>
              <Heart size={12} className="text-red-400" />
              <span>for a cleaner digital world</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
