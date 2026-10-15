"use client"

import Link from "next/link"
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
} from "lucide-react"

export default function Footer() {
  const categories = [
    { name: "Concerts", href: "/categories/concerts" },
    { name: "Conferences", href: "/categories/conferences" },
    { name: "Workshops", href: "/categories/workshops" },
    { name: "Sports", href: "/categories/sports" },
    { name: "Exhibitions", href: "/categories/exhibitions" },
    { name: "Parties", href: "/categories/parties" },
    { name: "Alumni Summit", href: "/categories/alumni" },
    { name: "Festivals", href: "/categories/festivals" },
  ]

  const links = [
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ]

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8 relative z-10">
      <div className="container mx-auto px-4">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center mb-4">
              <span className="font-satisfy text-3xl text-primary">
                EventHub
              </span>
            </Link>

            <p className="text-gray-400 mb-4">
              Host. Join. Celebrate. Your one-stop solution for all event
              management needs.
            </p>

            {/* Social Icons */}
            <div className="flex space-x-4">

              <button
                type="button"
                className="text-gray-400 hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </button>

              <button
                type="button"
                className="text-gray-400 hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </button>

              <button
                type="button"
                className="text-gray-400 hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </button>

              <button
                type="button"
                className="text-gray-400 hover:text-primary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </button>

            </div>
          </div>

          {/* Event Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Event Categories
            </h3>

            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.name}>
                  <Link
                    href={`/events?category=${category.name.toLowerCase()}`}
                    className="text-gray-400 hover:text-primary transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Quick Links
            </h3>

            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Contact Us
            </h3>

            <div className="space-y-3">

              {/* Email */}
              <div className="flex items-center space-x-3">
                <Mail
                  size={16}
                  className="text-primary flex-shrink-0"
                />

                <a
                  href="mailto:eventhub67@gmail.com"
                  className="text-gray-400 hover:text-primary transition-colors break-all"
                >
                  eventhub67@gmail.com
                </a>
              </div>

              {/* Location */}
              <div className="flex items-center space-x-3">
                <MapPin
                  size={16}
                  className="text-primary flex-shrink-0"
                />

                <span className="text-gray-400">
                  Vadodara, Gujarat, India
                </span>
              </div>

            </div>
          </div>

        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} EventHub. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  )
}