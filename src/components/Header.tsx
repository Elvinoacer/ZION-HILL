"use client";
import Link from "next/link";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home", hoverColor: "hover:text-pink-400" },
    { href: "/about", label: "About", hoverColor: "hover:text-yellow-400" },
    {
      href: "/services",
      label: "Services",
      hoverColor: "hover:text-green-400",
    },
    { href: "/contact", label: "Contact", hoverColor: "hover:text-purple-400" },
    { href: "/media", label: "Media", hoverColor: "hover:text-cyan-400" },
    {
      href: "/ministries",
      label: "Ministries",
      hoverColor: "hover:text-orange-400",
    },
    { href: "/projects", label: "Projects", hoverColor: "hover:text-teal-400" },
    {
      href: "/partnerships",
      label: "Partnerships",
      hoverColor: "hover:text-lime-400",
      responsiveClass: "hidden lg:block", // Hide on md, show on lg and up
    },
    {
      href: "/newsletter-subscriptions",
      label: "Newsletter",
      hoverColor: "hover:text-rose-400",
      responsiveClass: "hidden lg:block", // Hide on md, show on lg and up
    },
  ];

  const mobileVisibleLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header
      className="bg-gray-900/90 backdrop-blur-lg shadow-xl sticky top-0 z-50"
      role="banner"
    >
      <div className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center gap-x-4">
        <Link
          href="/"
          className="flex items-center flex-shrink-0 space-x-2"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-400 to-blue-500 via-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base shadow-lg transform transition-all duration-300 hover:scale-110 hover:shadow-xl"
            aria-hidden="true"
          >
            <span className="transform group-hover:rotate-12 transition-transform duration-300">
              K.A.G
            </span>
          </div>
          <span className="text-white font-semibold text-base md:text-lg">
            Kenya Assemblies of God
          </span>
        </Link>

        {/* Mobile Visible Links */}
        <nav className="hidden sm:flex md:hidden items-center space-x-4 sm:space-x-6 ml-auto pr-2">
          {mobileVisibleLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm sm:text-base font-medium transition-colors duration-300 ${
                pathname === link.href
                  ? "text-blue-400"
                  : "text-gray-200 hover:text-blue-300"
              }`}
              aria-current={pathname === link.href ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Navigation */}
        <nav
          className="hidden md:flex md:space-x-3 lg:space-x-4 xl:space-x-6 items-center"
          aria-label="Main navigation"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-colors duration-300 md:text-sm lg:text-base font-medium ${
                pathname === link.href ? "text-blue-400" : "text-gray-200"
              } ${link.hoverColor} ${link.responsiveClass || ""}`}
              aria-current={pathname === link.href ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
          {session ? (
            <Link
              href="/member/dashboard"
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-md hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-md md:text-sm lg:text-base font-medium"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/signup"
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-md hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-md md:text-sm lg:text-base font-medium"
            >
              Become a Member
            </Link>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white hover:scale-110 transition-transform duration-300"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
          onClick={toggleMobileMenu}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={
                isMobileMenuOpen
                  ? "M6 18L18 6M6 6l12 12"
                  : "M4 6h16M4 12h16M4 18h16"
              }
            />
          </svg>
        </button>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden fixed inset-0 bg-black/70 backdrop-blur-md z-40"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Menu Panel */}
            <motion.nav
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 25,
                duration: 0.3,
              }}
              className="md:hidden fixed top-[64px] left-0 w-full h-[calc(100vh-64px)] bg-gray-900/95 backdrop-blur-lg shadow-2xl z-50 flex flex-col items-center pb-12 space-y-4 overflow-y-auto custom-scrollbar"
              role="dialog"
              aria-modal="true"
              aria-labelledby="mobile-menu-title"
              id="mobile-menu"
            >
              <button
                className="absolute top-4 right-4 text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xl font-bold py-2.5 px-6 w-3/4 text-center transition-colors duration-300 ${
                    pathname === link.href
                      ? "text-white border-b-2 border-blue-400"
                      : "text-gray-300 hover:text-blue-400 hover:bg-gray-700/50 rounded-lg"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {session ? (
                <Link
                  href="/member/dashboard"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg text-xl font-bold mt-6 w-3/4 text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  href="/signup"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg text-xl font-bold mt-6 w-3/4 text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Become a Member
                </Link>
              )}
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
