import Link from "next/link"
import { usePathname } from "next/navigation"

const sections = [
  { name: "Introduction", href: "/docs" },
  { name: "Installation", href: "/docs/installation" },
  { name: "Data Types", href: "/docs/data-types" },
  { name: "Quick Start", href: "/docs/quick-start" },
  { name: "Features", href: "/docs/features" },
  { name: "Advanced Usage", href: "/docs/advanced-usage" },
  { name: "FAQ", href: "/docs/faq" },
  { name: "Changelog", href: "/docs/changelog" },
  { name: "Contributing", href: "/docs/contributing" },
  { name: "Contact/Support", href: "/docs/contact" },
]

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-gray-100 flex font-mono">
      <aside className="w-64 bg-gray-900 border-r border-gray-800 p-6 hidden md:block">
        <div className="text-green-400 font-bold text-xl mb-8">DedCore Docs</div>
        <nav className="space-y-3">
          {sections.map(section => (
            <SidebarLink key={section.href} href={section.href}>
              {section.name}
            </SidebarLink>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-6 max-w-3xl mx-auto">{children}</main>
    </div>
  )
}

function SidebarLink({ href, children }: { href: string; children: React.ReactNode }) {
  let isActive = false;
  if (typeof window !== "undefined") {
    isActive = window.location.pathname === href;
  }
  return (
    <Link
      href={href}
      className={`block px-3 py-2 rounded transition-colors text-gray-200 hover:text-green-400 hover:bg-gray-800 ${isActive ? "bg-gray-800 text-green-400 font-bold" : ""}`}
    >
      {children}
    </Link>
  );
} 