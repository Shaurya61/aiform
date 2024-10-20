"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Use usePathname for the app directory
import { motion } from "framer-motion";
import Cookies from "js-cookie";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname(); // Get the current path

  useEffect(() => {
    const checkAuthStatus = () => {
      const token = Cookies.get("token");
      setIsLoggedIn(!!token);
    };
    checkAuthStatus();
  }, []);

  const handleLogout = () => {
    Cookies.remove("token");
    setIsLoggedIn(false);
    window.location.href = "/auth/login"; // Router redirect replacement
  };

  return (
    <header className="bg-white shadow-md">
      <div className="mx-auto p-4 flex justify-between items-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-bold text-blue-600"
        >
          <Link href="/">AI Forms</Link>
        </motion.div>

        {/* Navigation Links */}
        <nav className="hidden md:flex space-x-6">
          <NavLink href="/" label="About" pathname={pathname} />
          <NavLink href="/create-form" label="Create Form" pathname={pathname} />
        </nav>

        {/* Login / Logout Button */}
        <div>
          {isLoggedIn ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-red-500 text-white px-4 py-2 rounded-full font-medium hover:bg-red-600 transition-colors"
              onClick={handleLogout}
            >
              Logout
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-500 text-white px-4 py-2 rounded-full font-medium hover:bg-blue-600 transition-colors"
              onClick={() => (window.location.href = "/auth/login")}
            >
              Login
            </motion.button>
          )}
        </div>
      </div>

      {/* Mobile View */}
      <nav className="md:hidden flex justify-center mt-4 space-x-4">
        <NavLink href="/" label="About" pathname={pathname} />
        <NavLink href="/create-form" label="Create Form" pathname={pathname} />
      </nav>
    </header>
  );
};

// NavLink component to highlight the active page with better UX
const NavLink = ({
  href,
  label,
  pathname,
}: {
  href: string;
  label: string;
  pathname: string;
}) => {
  // Normalize the pathname and href by removing any trailing slashes
  const normalizePath = (path: string) => path.replace(/\/$/, "") || "/";

  // Check if the current pathname starts with the href (handles nested routes)
  const isActive = normalizePath(pathname) === normalizePath(href);

  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="relative"
    >
      <Link
        href={href}
        className={`font-medium transition-colors px-1 ${
          isActive
            ? "text-blue-600 font-semibold" // Active state with blue and bold
            : "text-gray-700 hover:text-blue-500" // Default state
        }`}
      >
        {label}
        {isActive && (
          <motion.div
            className="absolute -bottom-1 left-0 w-full h-1 bg-blue-600"
            layoutId="underline"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 0.3 }}
          />
        )}
      </Link>
    </motion.div>
  );
};



export default Header;
