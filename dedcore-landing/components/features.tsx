"use client"

import { Search, Trash2, BarChart3, Settings, FileText, HardDrive } from "lucide-react"

const features = [
  {
    icon: Search,
    title: "Deep Scan Technology",
    description:
      "Advanced algorithms scan your entire system, comparing file contents byte-by-byte for perfect accuracy.",
    command: "./dedcore --scan --deep",
  },
  {
    icon: Trash2,
    title: "Safe Deletion",
    description: "Smart deletion with backup options and undo functionality. Never lose important files again.",
    command: "./dedcore --delete --safe",
  },
  {
    icon: BarChart3,
    title: "Detailed Analytics",
    description: "Comprehensive reports showing space saved, duplicate patterns, and system optimization insights.",
    command: "./dedcore --report --verbose",
  },
  {
    icon: Settings,
    title: "Customizable Rules",
    description: "Set custom filters, exclusions, and preferences to match your workflow perfectly.",
    command: "./dedcore --config --rules",
  },
  {
    icon: FileText,
    title: "Multiple Formats",
    description: "Supports all file types including images, videos, documents, archives, and more.",
    command: "./dedcore --formats --all",
  },
  {
    icon: HardDrive,
    title: "Cross-Platform",
    description: "Works seamlessly on Windows, macOS, and Linux with native performance optimization.",
    command: "./dedcore --platform --native",
  },
]

export default function Features() {
  return (
    <section id="features" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Terminal Header */}
        <div className="bg-gray-900 border border-gray-700 rounded-t-lg p-3 mb-0">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-400 text-sm font-mono ml-4">features.sh</span>
          </div>
        </div>

        {/* Terminal Content */}
        <div className="bg-black border border-gray-700 border-t-0 rounded-b-lg p-8 font-mono">
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-green-400">$</span>
              <span className="text-white">./dedcore --list-features</span>
            </div>
            <div className="text-green-400 ml-4 mb-6">Listing all available features...</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="border border-gray-700 rounded-lg p-6 hover:border-green-400 transition-colors bg-gray-900/50"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <feature.icon size={20} className="text-green-400" />
                  <h3 className="text-white font-bold">{feature.title}</h3>
                </div>

                <p className="text-gray-300 text-sm mb-4 leading-relaxed">{feature.description}</p>

                <div className="bg-black border border-gray-600 rounded p-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-green-400 text-xs">$</span>
                    <code className="text-cyan-400 text-xs">{feature.command}</code>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Performance Stats */}
          <div className="mt-12 border border-gray-700 rounded-lg p-6 bg-gray-900/50">
            <div className="flex items-center space-x-2 mb-6">
              <span className="text-green-400">$</span>
              <span className="text-white">./dedcore --benchmark</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-green-400 mb-1">10T+</div>
                <div className="text-gray-400 text-sm">Files Processed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-cyan-400 mb-1">25GB</div>
                <div className="text-gray-400 text-sm">Space Recovered</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-400 mb-1">99.9%</div>
                <div className="text-gray-400 text-sm">Accuracy Rate</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white mb-1">100+</div>
                <div className="text-gray-400 text-sm">Happy Users</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
