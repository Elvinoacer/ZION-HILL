"use client";
import Link from "next/link";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const Header = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    {
      href: "/about",
      label: "About",
    },
    { href: "/giving", label: "Giving" },
    { href: "/projects", label: "Projects" },

    { href: "/contact", label: "Contact" },
    { href: "/media", label: "Media" },
    { href: "/ministries", label: "Ministries" },

    { href: "/partnerships", label: "Partnerships" },
    { href: "/newsletter-subscriptions", label: "Newsletter" },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header
      className="bg-gray-900/90 backdrop-blur-lg shadow-xl sticky top-0 z-50"
      role="banner"
    >
      <div className="container mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
        <Link
          href="/"
          className="flex items-center flex-shrink-0 space-x-3"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div className="relative h-12 w-12 md:h-16 md:w-16 rounded-full overflow-hidden flex-shrink-0">
            <Image
              src="/images/zion-hill.png"
              alt="The Zion Hill Logo"
              layout="fill"
              objectFit="cover"
            />
          </div>
          <span className="text-white font-semibold text-lg md:text-2xl">
            Zion Hill
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4">
          {navLinks.slice(0, 7).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-gray-300 hover:text-white transition-colors duration-300 ${
                pathname === link.href ? "text-white" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
          {session ? (
            <Link
              href="/member/dashboard"
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-md hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-md font-medium transform hover:scale-105"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/signup"
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-md hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-md font-medium transform hover:scale-105 whitespace-nowrap"
            >
              Become a Member
            </Link>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            className="text-white"
            onClick={toggleMobileMenu}
            aria-label="Open mobile menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  isMobileMenuOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16m-7 6h7"
                }
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden"
          >
            <nav className="flex flex-col items-center space-y-4 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-gray-300 hover:text-white transition-colors duration-300 ${
                    pathname === link.href ? "text-white" : ""
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {session ? (
                <Link
                  href="/member/dashboard"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-md hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-md font-medium transform hover:scale-105"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  href="/signup"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-md hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-md font-medium transform hover:scale-105 whitespace-nowrap"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Become a Member
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
