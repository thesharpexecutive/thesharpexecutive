import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between mx-auto px-4 max-w-7xl">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="The Sharp Executive"
            width={600}  // 240 * 2.5
            height={150} // 60 * 2.5
            className="h-[150px] w-auto"
            priority
          />
        </Link>
        <nav className="hidden gap-8 md:flex">
          <Link
            href="/about"
            className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            About
          </Link>
          <Link
            href="/blog"
            className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Blog
          </Link>
          <Link
            href="/contact"
            className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Contact
          </Link>
        </nav>
      </div>
    </header>
  )
}
