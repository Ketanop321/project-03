"use client"

import { useRef, useEffect } from "react"
import gsap from "gsap"

interface PixelExplodeTransitionProps {
  isActive: boolean
  sourceElement: HTMLElement | null
  targetElement: HTMLElement | null
  onTransitionComplete?: () => void
  config?: {
    pixelSize?: number
    maxDistance?: number
    maxRotation?: number
    duration?: number
    staggerAmount?: number
    ease?: string
  }
}

const PixelExplodeTransition = ({
  isActive,
  sourceElement,
  targetElement,
  onTransitionComplete,
  config = {},
}: PixelExplodeTransitionProps) => {
  const pixelsRef = useRef<HTMLElement[]>([])
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const containerRef = useRef<HTMLElement | null>(null)

  // Default configuration
  const {
    pixelSize = 10,
    maxDistance = 200,
    maxRotation = 360,
    duration = 1.2,
    staggerAmount = 0.001,
    ease = "power3.out",
  } = config

  // Clean up any existing pixels
  const cleanupPixels = () => {
    if (timelineRef.current) {
      timelineRef.current.kill()
      timelineRef.current = null
    }

    pixelsRef.current.forEach((pixel) => {
      if (pixel.parentNode) {
        pixel.parentNode.removeChild(pixel)
      }
    })
    pixelsRef.current = []

    if (containerRef.current && containerRef.current.parentNode) {
      containerRef.current.parentNode.removeChild(containerRef.current)
      containerRef.current = null
    }
  }

  // Create and animate the transition
  const createTransition = () => {
    if (!sourceElement) return

    // Clean up any existing pixels first
    cleanupPixels()

    const sourceRect = sourceElement.getBoundingClientRect()

    // Create a container for all pixels
    const container = document.createElement("div")
    container.className = "transition-container"
    container.style.position = "fixed"
    container.style.left = "0"
    container.style.top = "0"
    container.style.width = "100%"
    container.style.height = "100%"
    container.style.zIndex = "2000"
    container.style.pointerEvents = "none"
    document.body.appendChild(container)
    containerRef.current = container

    // Get background image from source element
    const computedStyle = window.getComputedStyle(sourceElement)
    const backgroundImage = computedStyle.backgroundImage

    // Calculate number of pixels
    const columns = Math.ceil(sourceRect.width / pixelSize)
    const rows = Math.ceil(sourceRect.height / pixelSize)

    // Calculate center point for radial stagger
    const centerX = sourceRect.left + sourceRect.width / 2
    const centerY = sourceRect.top + sourceRect.height / 2

    // Create timeline for coordinating animations
    const timeline = gsap.timeline({
      onComplete: () => {
        if (onTransitionComplete) onTransitionComplete()
        // Don't clean up immediately to allow for panel reveal
        setTimeout(cleanupPixels, 500)
      },
    })
    timelineRef.current = timeline

    // Create pixels
    const pixelElements = []

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        // Create pixel element
        const pixel = document.createElement("div")
        pixel.className = "transition-pixel"
        pixelsRef.current.push(pixel)

        // Calculate position within the source image
        const x = col * pixelSize
        const y = row * pixelSize

        // Set initial styles
        gsap.set(pixel, {
          position: "fixed",
          left: sourceRect.left + x + "px",
          top: sourceRect.top + y + "px",
          width: pixelSize + "px",
          height: pixelSize + "px",
          backgroundImage: backgroundImage,
          backgroundSize: `${sourceRect.width}px ${sourceRect.height}px`,
          backgroundPosition: `${-x}px ${-y}px`,
          zIndex: 2000,
          opacity: 1,
        })

        // Add to container
        container.appendChild(pixel)

        // Calculate distance from center for radial stagger
        const pixelCenterX = sourceRect.left + x + pixelSize / 2
        const pixelCenterY = sourceRect.top + y + pixelSize / 2
        const distanceFromCenter = Math.sqrt(Math.pow(pixelCenterX - centerX, 2) + Math.pow(pixelCenterY - centerY, 2))

        // Store pixel with its distance for sorting
        pixelElements.push({
          element: pixel,
          distance: distanceFromCenter,
        })
      }
    }

    // Sort pixels by distance from center
    pixelElements.sort((a, b) => a.distance - b.distance)

    // Animate pixels from center outward
    pixelElements.forEach((item, index) => {
      const pixel = item.element

      // Calculate random direction for explosion
      const angle = Math.random() * Math.PI * 2
      const distance = maxDistance * Math.random()
      const translateX = Math.cos(angle) * distance
      const translateY = Math.sin(angle) * distance

      // Animate pixel
      timeline.to(
        pixel,
        {
          x: translateX,
          y: translateY,
          rotation: gsap.utils.random(-maxRotation, maxRotation),
          scale: gsap.utils.random(0.5, 1.5),
          opacity: 0,
          duration: duration,
          ease: ease,
        },
        index * staggerAmount, // Stagger based on sorted index
      )
    })
  }

  // Run transition when isActive changes
  useEffect(() => {
    if (isActive && sourceElement) {
      createTransition()
    } else {
      cleanupPixels()
    }

    return () => {
      cleanupPixels()
    }
  }, [isActive, sourceElement])

  // This component doesn't render anything visible
  return null
}

export default PixelExplodeTransition
