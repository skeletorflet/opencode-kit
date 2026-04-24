'use client'

import { ClaimForm } from '@/components/ClaimForm'
import { Footer } from '@/components/Footer'
import { motion } from 'framer-motion'
import { FloatingElements } from '@/components/FloatingElements'

export default function Home() {
  return (
    <>
      <FloatingElements />
      <div className="relative z-10 min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <main className="min-h-screen pb-0">
          <div className="container mx-auto px-2 md:px-4 py-2 md:py-4 max-w-5xl">
            <ClaimForm />
          </div>
        </main>
        <Footer />
      </div>
    </>
  )
}