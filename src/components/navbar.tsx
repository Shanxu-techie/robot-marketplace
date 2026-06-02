'use client'

import { useState } from 'react'
import { Button } from './ui/button'

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border p-4">
      <div className="flex justify-between items-center">
        <div>Logo</div>
        <div className="hidden md:flex items-center gap-2">
          <a
            href="#"
            title="Home"
            className="hover:text-primary hover:bg-muted transition px-4 py-2 rounded"
          >
            Home
          </a>
          <a
            href="#"
            title="Marketplace"
            className="hover:text-primary hover:bg-muted transition px-4 py-2 rounded"
          >
            Marketplace
          </a>
          <a
            href="#"
            title="About"
            className="hover:text-primary hover:bg-muted transition px-4 py-2 rounded"
          >
            About
          </a>
          <a
            href="#"
            title="Pricing"
            className="hover:text-primary hover:bg-muted transition px-4 py-2 rounded"
          >
            Pricing
          </a>
          <a
            href="#"
            title="Contact"
            className="hover:text-primary hover:bg-muted transition px-4 py-2 rounded"
          >
            Contact
          </a>
          {!loggedIn ? (
            <>
              <Button onClick={() => setLoggedIn(true)}>Sign in</Button>
              <Button variant="outline">Sign up</Button>
            </>
          ) : (
            <>
              <Button variant="outline">Profile</Button>
              <Button onClick={() => setLoggedIn(false)}>Logout</Button>
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
        <ul className="flex flex-col gap-2">
          <li>
            <a
              href="#"
              title="Home"
              className="hover:text-primary hover:bg-muted transition px-4 py-2 rounded"
            >
              Home
            </a>
          </li>
          <li>
            <a
              href="#"
              title="Marketplace"
              className="hover:text-primary hover:bg-muted transition px-4 py-2 rounded"
            >
              Marketplace
            </a>
          </li>
          <li>
            <a
              href="#"
              title="About"
              className="hover:text-primary hover:bg-muted transition px-4 py-2 rounded"
            >
              About
            </a>
          </li>
          <li>
            <a
              href="#"
              title="Pricing"
              className="hover:text-primary hover:bg-muted transition px-4 py-2 rounded"
            >
              Pricing
            </a>
          </li>
          <li>
            <a
              href="#"
              title="Contact"
              className="hover:text-primary hover:bg-muted transition px-4 py-2 rounded"
            >
              Contact
            </a>
          </li>
        </ul>
        <div className="flex flex-col gap-2 mt-4 items-start">
          {!loggedIn ? (
            <>
              <Button onClick={() => setLoggedIn(true)}>Sign in</Button>
              <Button variant="outline">Sign up</Button>
            </>
          ) : (
            <>
              <Button variant="outline">Profile</Button>
              <Button onClick={() => setLoggedIn(false)}>Logout</Button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
