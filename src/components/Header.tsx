'use client';
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

const Header = () => {
  const pathname = usePathname();
  const { data: session } = useSession();

  const navLinks = [
    { href: "/", label: "Home", hoverColor: "hover:text-pink-500" },
    { href: "/about", label: "About", hoverColor: "hover:text-yellow-500" },
    { href: "/services", label: "Services", hoverColor: "hover:text-green-500" },
    { href: "/contact", label: "Contact", hoverColor: "hover:text-purple-500" },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50" role="banner">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <div
            className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl hover:animate-spin"
            aria-hidden="true"
          >
            GC
          </div>
          <span className="ml-3 text-xl font-bold text-gray-800 glow-text">
            Grace Community
          </span>
        </div>
        <nav
          className="hidden md:flex space-x-8 items-center"
          aria-label="Main navigation"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition ${
                pathname === link.href
                  ? "text-indigo-700 font-medium"
                  : "text-gray-600"
              } ${link.hoverColor}`}
              aria-current={pathname === link.href ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
          {session ? (
            <Link
              href="/dashboard"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-rainbow-bg transition"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/signup"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-rainbow-bg transition"
            >
              Become a Member
            </Link>
          )}
        </nav>
        <button
          className="md:hidden text-gray-600 hover:rotate-180 transition"
          aria-label="Toggle mobile menu"
          aria-expanded="false"
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
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
