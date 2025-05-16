"use client"

import { useRef, useEffect } from "react"
import gsap from "gsap"

interface DiagonalSlideTransitionProps {
  isActive: boolean
  sourceElement: HTMLElement | null
  targetElement: HTMLElement | null
  onTransitionComplete?: () => void
  config?: {
    rows?: number
    columns?: number
    staggerAmount?: number
    slideDistance?: number
    duration?: number
    ease?: string
    fadeOut?: boolean
    blur?: boolean
  }
}

const DiagonalSlideTransition = ({
  isActive,
  sourceElement,
  targetElement,
  onTransitionComplete,
  config = {},
}: DiagonalSlideTransitionProps) => {
  const tilesRef = useRef<HTMLElement[]>([])
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const containerRef = useRef<HTMLElement | null>(null)

  // Default configuration
  const {
    rows = 6,
    columns = 6,
    staggerAmount = 0.02,
    slideDistance = 100,
    duration = 0.8,
    ease = "power2.inOut",
    fadeOut = true,
    blur = true,
  } = config

  // Clean up any existing tiles
  const cleanupTiles = () => {
    if (timelineRef.current) {
      timelineRef.current.kill()
      timelineRef.current = null
    }

    tilesRef.current.forEach((tile) => {
      if (tile.parentNode) {
        tile.parentNode.removeChild(tile)
      }
    })
    tilesRef.current = []

    if (containerRef.current && containerRef.current.parentNode) {
      containerRef.current.parentNode.removeChild(containerRef.current)
      containerRef.current = null
    }
  }

  // Create and animate the transition
  const createTransition = () => {
    if (!sourceElement) return

    // Clean up any existing tiles first
    cleanupTiles()

    const sourceRect = sourceElement.getBoundingClientRect()

    // Create a container for all tiles
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

    // Calculate tile dimensions
    const tileWidth = sourceRect.width / columns
    const tileHeight = sourceRect.height / rows

    // Create timeline for coordinating animations
    const timeline = gsap.timeline({
      onComplete: () => {
        if (onTransitionComplete) onTransitionComplete()
        // Don't clean up immediately to allow for panel reveal
        setTimeout(cleanupTiles, 500)
      },
    })
    timelineRef.current = timeline

    // Create tiles
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        // Create tile element
        const tile = document.createElement("div")
        tile.className = "transition-tile"
        tilesRef.current.push(tile)

        // Calculate position within the source image
        const x = col * tileWidth
        const y = row * tileHeight

        // Set initial styles
        gsap.set(tile, {
          position: "fixed",
          left: sourceRect.left + x + "px",
          top: sourceRect.top + y + "px",
          width: tileWidth + "px",
          height: tileHeight + "px",
          backgroundImage: backgroundImage,
          backgroundSize: `${sourceRect.width}px ${sourceRect.height}px`,
          backgroundPosition: `${-x}px ${-y}px`,
          zIndex: 2000,
          opacity: 1,
        })

        // Add to container
        container.appendChild(tile)

        // Calculate stagger index (diagonal pattern from top-left to bottom-right)
        const staggerIndex = row + col

        // Animate tile
        timeline.to(
          tile,
          {
            x: slideDistance,
            y: slideDistance,
            opacity: fadeOut ? 0 : 1,
            filter: blur ? "blur(8px)" : "none",
            duration: duration,
            ease: ease,
          },
          staggerIndex * staggerAmount,
        )
      }
    }
  }

  // Run transition when isActive changes
  useEffect(() => {
    if (isActive && sourceElement) {
      createTransition()
    } else {
      cleanupTiles()
    }

    return () => {
      cleanupTiles()
    }
  }, [isActive, sourceElement])

  // This component doesn't render anything visible
  return null
}

export default DiagonalSlideTransition
