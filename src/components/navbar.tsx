'use client'

import { useState } from 'react'

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="flex justify-between items-center">
        <div>Logo</div>
        <div className="hidden md:flex items-center gap-6">
          <a
            href="#"
            title="Home"
            className="hover:text-red-500 hover:bg-gray-700 transition px-4 py-2 rounded"
          >
            Home
          </a>
          <a
            href="#"
            title="Marketplace"
            className="hover:text-red-500 hover:bg-gray-700 transition px-4 py-2 rounded"
          >
            Marketplace
          </a>
          <a
            href="#"
            title="About"
            className="hover:text-red-500 hover:bg-gray-700 transition px-4 py-2 rounded"
          >
            About
          </a>
          <a
            href="#"
            title="Pricing"
            className="hover:text-red-500 hover:bg-gray-700 transition px-4 py-2 rounded"
          >
            Pricing
          </a>
          <a
            href="#"
            title="Contact"
            className="hover:text-red-500 hover:bg-gray-700 transition px-4 py-2 rounded"
          >
            Contact
          </a>
          {!loggedIn ? (
            <>
              <button
                onClick={() => setLoggedIn(true)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              >
                Sign in
              </button>
              <button className="border border-red-500 text-red-500 px-4 py-2 rounded hover:bg-red-500 hover:text-white transition">
                Sign up
              </button>
            </>
          ) : (
            <>
              <button className="border border-red-500 text-red-500 px-4 py-2 rounded hover:bg-red-500 hover:text-white transition">
                Profile
              </button>
              <button
                onClick={() => setLoggedIn(false)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
        <button
          className="block md:hidden"
          onClick={() => {
            setMobileMenuOpen((prev) => !prev)
          }}
        >
          {mobileMenuOpen ? '✕' : '☰'}
          {/* can be replaced with an icon from a library like FontAwesome or Material Icons */}
        </button>
      </div>

      <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:hidden mt-4`}>
        <ul className="flex flex-col gap-3">
          <li>
            <a
              href="#"
              title="Home"
              className="hover:text-red-500 hover:bg-gray-700 transition px-4 py-2 rounded"
            >
              Home
            </a>
          </li>
          <li>
            <a
              href="#"
              title="Marketplace"
              className="hover:text-red-500 hover:bg-gray-700 transition px-4 py-2 rounded"
            >
              Marketplace
            </a>
          </li>
          <li>
            <a
              href="#"
              title="About"
              className="hover:text-red-500 hover:bg-gray-700 transition px-4 py-2 rounded"
            >
              About
            </a>
          </li>
          <li>
            <a
              href="#"
              title="Pricing"
              className="hover:text-red-500 hover:bg-gray-700 transition px-4 py-2 rounded"
            >
              Pricing
            </a>
          </li>
          <li>
            <a
              href="#"
              title="Contact"
              className="hover:text-red-500 hover:bg-gray-700 transition px-4 py-2 rounded"
            >
              Contact
            </a>
          </li>
        </ul>
        <div className="flex flex-col gap-2 mt-4 items-start">
          {!loggedIn ? (
            <>
              <button
                onClick={() => setLoggedIn(true)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              >
                Sign in
              </button>
              <button className="border border-red-500 text-red-500 px-4 py-2 rounded hover:bg-red-500 hover:text-white transition">
                Sign up
              </button>
            </>
          ) : (
            <>
              <button className="border border-red-500 text-red-500 px-4 py-2 rounded hover:bg-red-500 hover:text-white transition">
                Profile
              </button>
              <button
                onClick={() => setLoggedIn(false)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
