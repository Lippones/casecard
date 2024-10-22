'use client'
import { useEffect } from 'react'
import confetti from 'canvas-confetti'

export function Confetti() {
  const fireConfetti = (direction: 'left' | 'right') => {
    const angle = direction === 'left' ? 45 : 145
    confetti({
      angle,
      spread: 45,
      origin: {
        x: direction === 'left' ? 0 : 1,
        y: 0.7,
      },
      particleCount: 50,
      startVelocity: 80,
      decay: 0.9,
      scalar: 0.75,
    })
  }

  useEffect(() => {
    const duration = 2000
    const intervalTime = 200

    const interval = setInterval(() => {
      fireConfetti('left')
      fireConfetti('right')
    }, intervalTime)

    setTimeout(() => clearInterval(interval), duration)

    return () => clearInterval(interval)
  }, [])

  return null
}
