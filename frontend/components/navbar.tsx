import { Brain } from 'lucide-react'
import React from 'react'
import Link from 'next/link'
import { Button } from './ui/button'


const Navbar = () => {
  return (
    <header className="border-b border-border sticky top-0 inset-x-0 h-16 bg-background/50 backdrop-blur-md z-[999]">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Brain className="w-6 h-6 text-purple-600" />
          <span className="text-xl font-semibold">
            <Link href="/">
              Cipher
            </Link>
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/candidates">
            <Button variant="outline">
              Candidates
            </Button>
          </Link>
          <Link href="/upload">
            <Button>
              Upload
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
};

export default Navbar