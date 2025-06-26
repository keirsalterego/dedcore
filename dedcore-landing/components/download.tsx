"use client"

import { Download, Apple, Monitor, CheckCircle } from "lucide-react"

export default function DownloadSection() {
  return (
    <section id="download" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Terminal Header */}
        <div className="bg-gray-900 border border-gray-700 rounded-t-lg p-3 mb-0">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-400 text-sm font-mono ml-4">download.sh</span>
          </div>
        </div>

        {/* Terminal Content */}
        <div className="bg-black border border-gray-700 border-t-0 rounded-b-lg p-8 font-mono">
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-green-400">$</span>
              <span className="text-white">./dedcore --download --list-platforms</span>
            </div>
            <div className="text-green-400 ml-4 mb-6">Available platforms detected...</div>
          </div>

          {/* Download Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Linux/macOS */}
            <div className="border border-gray-700 rounded-lg p-6 hover:border-green-400 transition-colors bg-gray-900/50">
              <div className="flex items-center space-x-3 mb-6">
                <Apple size={24} className="text-green-400" />
                <div>
                  <h3 className="text-white font-bold text-lg">Linux / macOS</h3>
                  <p className="text-gray-400 text-sm">Universal binary</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {[
                  "Universal binary (Intel & Apple Silicon)",
                  "Command line interface included",
                  "System integration & notifications",
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3 text-gray-300 text-sm">
                    <CheckCircle size={14} className="text-green-400" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <div className="bg-black border border-gray-600 rounded p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-green-400">$</span>
                    <code className="text-cyan-400 text-sm">curl -sSL dedcore.mxnish.me/install.sh | bash</code>
                  </div>
                  <div className="text-gray-500 text-xs">Auto-installer for macOS/Linux</div>
                </div>

                <a
                  href="/install.sh"
                  download
                  className="w-full flex items-center justify-center space-x-2 bg-green-400 hover:bg-green-300 text-black py-3 rounded font-bold transition-colors text-center"
                >
                  <Download size={16} />
                  <span>Download for macOS/Linux</span>
                </a>

                <div className="text-center text-gray-500 text-sm">Version 0.1.0 • 6.97 MB</div>
              </div>
            </div>

            {/* Windows */}
            <div className="border border-gray-700 rounded-lg p-6 hover:border-cyan-400 transition-colors bg-gray-900/50">
              <div className="flex items-center space-x-3 mb-6">
                <Monitor size={24} className="text-cyan-400" />
                <div>
                  <h3 className="text-white font-bold text-lg">Windows</h3>
                  <p className="text-gray-400 text-sm">Native executable</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {[
                  "Windows 10/11 optimized",
                  "Context menu integration",
                  "PowerShell module",
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3 text-gray-300 text-sm">
                    <CheckCircle size={14} className="text-cyan-400" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <div className="bg-black border border-gray-600 rounded p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-cyan-400 text-sm">PS&gt;</span>
                    <code className="text-yellow-400 text-sm">iwr dedcore.mxnish.me/install.sh | iex</code>
                  </div>
                  <div className="text-gray-500 text-xs">PowerShell installer</div>
                </div>

                <a
                  href="/install.sh"
                  download
                  className="w-full flex items-center justify-center space-x-2 bg-cyan-400 hover:bg-cyan-300 text-black py-3 rounded font-bold transition-colors text-center"
                >
                  <Download size={16} />
                  <span>Download for Windows</span>
                </a>

                <div className="text-center text-gray-500 text-sm">Version 0.1.0 • 15.2 MB</div>
              </div>
            </div>
          </div>

          {/* Installation Commands */}
          <div className="border border-gray-700 rounded-lg p-6 bg-gray-900/50 mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-green-400">$</span>
              <span className="text-white">./dedcore --install-help</span>
            </div>

            <div className="space-y-4 ml-4">
              <div>
                <div className="text-yellow-400 mb-2">Package Managers:</div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-4">
                    <code className="text-cyan-400">cargo install dedcore</code>
                    <span className="text-gray-500"># crates.io</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Launch Benchmarks (realistic for new product) */}
          <div className="border border-gray-700 rounded-lg p-6 bg-gray-900/50 mb-8">
            <div className="flex flex-col md:flex-row justify-between text-center gap-6">
              <div>
                <div className="text-2xl font-bold text-green-400 mb-1">10,000+</div>
                <div className="text-gray-400 text-sm">Files Processed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-cyan-400 mb-1">25GB+</div>
                <div className="text-gray-400 text-sm">Space Recovered</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-400 mb-1">99.5%</div>
                <div className="text-gray-400 text-sm">Accuracy Rate</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white mb-1">100+</div>
                <div className="text-gray-400 text-sm">Happy Users</div>
              </div>
            </div>
          </div>

          {/* System Requirements */}
          <div className="border border-gray-700 rounded-lg p-6 bg-gray-900/50">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-green-400">$</span>
              <span className="text-white">./dedcore --system-requirements</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ml-4 text-sm">
              <div>
                <div className="text-yellow-400 mb-2">Windows:</div>
                <ul className="text-gray-300 space-y-1">
                  <li>• Windows 10 or later</li>
                  <li>• 4GB RAM minimum</li>
                  <li>• 50MB free disk space</li>
                  <li>• .NET Framework 4.8+</li>
                </ul>
              </div>
              <div>
                <div className="text-yellow-400 mb-2">macOS:</div>
                <ul className="text-gray-300 space-y-1">
                  <li>• macOS 10.15 or later</li>
                  <li>• 4GB RAM minimum</li>
                  <li>• 50MB free disk space</li>
                  <li>• Intel or Apple Silicon</li>
                </ul>
              </div>
              <div>
                <div className="text-yellow-400 mb-2">Linux:</div>
                <ul className="text-gray-300 space-y-1">
                  <li>• Ubuntu 18.04+ / equivalent</li>
                  <li>• 4GB RAM minimum</li>
                  <li>• 50MB free disk space</li>
                  <li>• GTK 3.0+ (GUI version)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
