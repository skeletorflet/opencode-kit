'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

export function FloatingElements() {
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setMounted(true)
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Large Orbs */}
      <FloatingOrb
        size={isMobile ? 200 : 300}
        color="blue"
        x={-10}
        y={20}
        duration={25}
        delay={0}
      />
      {!isMobile && (
        <FloatingOrb
          size={250}
          color="purple"
          x={110}
          y={60}
          duration={30}
          delay={2}
        />
      )}
      <FloatingOrb
        size={isMobile ? 150 : 200}
        color="cyan"
        x={50}
        y={-10}
        duration={20}
        delay={1}
      />

      {/* Medium Particles */}
      {/* Fewer particles on mobile */}
      {mounted && [...Array(isMobile ? 6 : 15)].map((_, i) => (
        <FloatingParticle
          key={`particle-${i}`}
          size={Math.random() * (isMobile ? 4 : 6) + 2}
          x={Math.random() * 100}
          y={Math.random() * 100}
          duration={Math.random() * 20 + 15}
          delay={Math.random() * 5}
        />
      ))}

      {/* Geometric Shapes */}
      {/* Fewer shapes on mobile */}
      <FloatingShape
        type="triangle"
        size={isMobile ? 40 : 60}
        x={20}
        y={80}
        duration={35}
        delay={3}
        color="blue"
      />
      {!isMobile && (
        <>
          <FloatingShape
            type="square"
            size={40}
            x={80}
            y={20}
            duration={25}
            delay={5}
            color="purple"
          />
          <FloatingShape
            type="circle"
            size={50}
            x={60}
            y={50}
            duration={20}
            delay={1}
            color="cyan"
          />
        </>
      )}
    </div>
  )
}

interface FloatingOrbProps {
  size: number
  color: string
  x: number
  y: number
  duration: number
  delay: number
}

function FloatingOrb({ size, color, x, y, duration, delay }: FloatingOrbProps) {
  const colorMap = {
    blue: 'from-blue-400/20 to-blue-600/20',
    purple: 'from-purple-400/20 to-purple-600/20',
    cyan: 'from-cyan-400/20 to-cyan-600/20',
  }

  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: size,
        height: size,
        left: `${x}%`,
        top: `${y}%`,
        background: `radial-gradient(circle, ${color === 'blue' ? 'rgba(59, 130, 246, 0.1)' : color === 'purple' ? 'rgba(147, 51, 234, 0.1)' : 'rgba(6, 182, 212, 0.1)'} 0%, transparent 70%)`,
        filter: 'blur(30px)',
        willChange: 'transform',
        transform: 'translateZ(0)',
      }}
      animate={{
        x: [0, 100, -100, 0],
        y: [0, -50, 50, 0],
        scale: [1, 1.2, 0.8, 1],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  )
}

interface FloatingParticleProps {
  size: number
  x: number
  y: number
  duration: number
  delay: number
}

function FloatingParticle({ size, x, y, duration, delay }: FloatingParticleProps) {
  return (
    <motion.div
      className="absolute bg-white rounded-full"
      style={{
        width: size,
        height: size,
        left: `${x}%`,
        top: `${y}%`,
        opacity: 0.3,
        willChange: 'transform',
        transform: 'translateZ(0)',
      }}
      animate={{
        x: [0, Math.random() * 200 - 100],
        y: [0, Math.random() * 200 - 100],
        opacity: [0.3, 0.6, 0.3],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  )
}

interface FloatingShapeProps {
  type: 'triangle' | 'square' | 'circle'
  size: number
  x: number
  y: number
  duration: number
  delay: number
  color: string
}

function FloatingShape({ type, size, x, y, duration, delay, color }: FloatingShapeProps) {
  const colorMap = {
    blue: 'border-blue-400/20',
    purple: 'border-purple-400/20',
    cyan: 'border-cyan-400/20',
  }

  const shapeStyles = {
    triangle: {
      width: 0,
      height: 0,
      borderLeft: `${size / 2}px solid transparent`,
      borderRight: `${size / 2}px solid transparent`,
      borderBottom: `${size}px solid ${color === 'blue' ? 'rgba(59, 130, 246, 0.1)' : color === 'purple' ? 'rgba(147, 51, 234, 0.1)' : 'rgba(6, 182, 212, 0.1)'}`,
    },
    square: {
      width: size,
      height: size,
      border: `2px solid ${color === 'blue' ? 'rgba(59, 130, 246, 0.2)' : color === 'purple' ? 'rgba(147, 51, 234, 0.2)' : 'rgba(6, 182, 212, 0.2)'}`,
    },
    circle: {
      width: size,
      height: size,
      borderRadius: '50%',
      border: `2px solid ${color === 'blue' ? 'rgba(59, 130, 246, 0.2)' : color === 'purple' ? 'rgba(147, 51, 234, 0.2)' : 'rgba(6, 182, 212, 0.2)'}`,
    },
  }

  return (
    <motion.div
      className="absolute"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        ...shapeStyles[type],
        willChange: 'transform',
        transform: 'translateZ(0)',
      }}
      animate={{
        rotate: [0, 360],
        scale: [1, 1.1, 1],
        x: [0, 50, -50, 0],
        y: [0, -30, 30, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  )
}