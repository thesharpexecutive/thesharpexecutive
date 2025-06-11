import Link from "next/link"
import { TwitterIcon, FacebookIcon, InstagramIcon, LinkedinIcon } from "@/components/icons"

const footerLinks = [
  {
    title: "Navigation",
    items: [
      { name: "Home", href: "/" },
      { name: "About", href: "/about" },
      { name: "Blog", href: "/blog" },
      { name: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    items: [
      { name: "Privacy Policy", href: "/legal/privacy" },
      { name: "Terms of Service", href: "/legal/terms" },
      { name: "Cookie Policy", href: "/legal/cookies" },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="text-center md:text-left">
              <div className="flex justify-center md:justify-start">
                <span className="text-xl font-bold text-blue-600">
                  THE <span className="text-foreground">SHARP EXECUTIVE</span>
                </span>
              </div>
              <p className="mt-4 mx-auto max-w-xs text-sm text-muted-foreground md:mx-0">
                Empowering businesses with strategic solutions and expert guidance to drive growth and success.
              </p>
              <div className="mt-6 flex justify-center space-x-4 md:justify-start">
                <a href="#" className="text-muted-foreground transition-colors hover:text-foreground" aria-label="Twitter">
                  <TwitterIcon className="h-5 w-5" />
                </a>
                <a href="#" className="text-muted-foreground transition-colors hover:text-foreground" aria-label="LinkedIn">
                  <LinkedinIcon className="h-5 w-5" />
                </a>
                <a href="#" className="text-muted-foreground transition-colors hover:text-foreground" aria-label="Facebook">
                  <FacebookIcon className="h-5 w-5" />
                </a>
                <a href="#" className="text-muted-foreground transition-colors hover:text-foreground" aria-label="Instagram">
                  <InstagramIcon className="h-5 w-5" />
                </a>
              </div>
            </div>
            {footerLinks.map((section) => (
              <div key={section.title} className="text-center md:text-left">
                <h3 className="text-sm font-medium">{section.title}</h3>
                <ul className="mt-4 space-y-2">
                  {section.items.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-12 border-t pt-8">
            <p className="text-center text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} The Sharp Executive. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
