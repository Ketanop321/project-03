"use client"

import { useRef, useEffect } from "react"
import gsap from "gsap"

interface TileFlipTransitionProps {
  isActive: boolean
  sourceElement: HTMLElement | null
  targetElement: HTMLElement | null
  onTransitionComplete?: () => void
  config?: {
    rows?: number
    columns?: number
    staggerAmount?: number
    duration?: number
    ease?: string
    backColor?: string
    perspective?: number
    staggerPattern?: "random" | "sequential" | "radial"
  }
}

const TileFlipTransition = ({
  isActive,
  sourceElement,
  targetElement,
  onTransitionComplete,
  config = {},
}: TileFlipTransitionProps) => {
  const tilesRef = useRef<HTMLElement[]>([])
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const containerRef = useRef<HTMLElement | null>(null)

  // Default configuration
  const {
    rows = 5,
    columns = 5,
    staggerAmount = 0.03,
    duration = 1,
    ease = "power2.inOut",
    backColor = "rgba(0,0,0,0.8)",
    perspective = 1000,
    staggerPattern = "sequential",
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

    // Create container for 3D perspective
    const container = document.createElement("div")
    container.className = "transition-container"
    container.style.position = "fixed"
    container.style.left = sourceRect.left + "px"
    container.style.top = sourceRect.top + "px"
    container.style.width = sourceRect.width + "px"
    container.style.height = sourceRect.height + "px"
    container.style.perspective = `${perspective}px`
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

    // Calculate center for radial pattern
    const centerX = Math.floor(columns / 2)
    const centerY = Math.floor(rows / 2)

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
    const tileIndices = []
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        // Create tile wrapper for 3D transform
        const tileWrapper = document.createElement("div")
        tileWrapper.className = "tile-wrapper"
        tileWrapper.style.position = "absolute"
        tileWrapper.style.left = col * tileWidth + "px"
        tileWrapper.style.top = row * tileHeight + "px"
        tileWrapper.style.width = tileWidth + "px"
        tileWrapper.style.height = tileHeight + "px"
        tileWrapper.style.transformStyle = "preserve-3d"
        container.appendChild(tileWrapper)
        tilesRef.current.push(tileWrapper)

        // Create front face (image)
        const frontFace = document.createElement("div")
        frontFace.className = "tile-front"
        frontFace.style.position = "absolute"
        frontFace.style.width = "100%"
        frontFace.style.height = "100%"
        frontFace.style.backfaceVisibility = "hidden"
        frontFace.style.backgroundImage = backgroundImage
        frontFace.style.backgroundSize = `${sourceRect.width}px ${sourceRect.height}px`
        frontFace.style.backgroundPosition = `${-col * tileWidth}px ${-row * tileHeight}px`
        tileWrapper.appendChild(frontFace)

        // Create back face (solid color)
        const backFace = document.createElement("div")
        backFace.className = "tile-back"
        backFace.style.position = "absolute"
        backFace.style.width = "100%"
        backFace.style.height = "100%"
        backFace.style.backfaceVisibility = "hidden"
        backFace.style.backgroundColor = backColor
        backFace.style.transform = "rotateY(180deg)"
        tileWrapper.appendChild(backFace)

        // Calculate stagger index based on pattern
        let staggerIndex
        if (staggerPattern === "random") {
          staggerIndex = Math.random() * rows * columns
        } else if (staggerPattern === "radial") {
          // Distance from center for radial pattern
          staggerIndex = Math.abs(col - centerX) + Math.abs(row - centerY)
        } else {
          // sequential
          staggerIndex = row * columns + col
        }

        tileIndices.push({ wrapper: tileWrapper, index: staggerIndex })
      }
    }

    // Sort tiles by stagger index if needed
    if (staggerPattern === "random") {
      tileIndices.sort((a, b) => a.index - b.index)
    }

    // Animate tiles
    tileIndices.forEach((tile, i) => {
      timeline.to(
        tile.wrapper,
        {
          rotationY: 180,
          duration: duration,
          ease: ease,
        },
        i * staggerAmount,
      )
    })
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

export default TileFlipTransition
