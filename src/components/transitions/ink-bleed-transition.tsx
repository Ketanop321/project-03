"use client"

import { useRef, useEffect } from "react"
import gsap from "gsap"

interface InkBleedTransitionProps {
  isActive: boolean
  sourceElement: HTMLElement | null
  targetElement: HTMLElement | null
  onTransitionComplete?: () => void
  config?: {
    duration?: number
    ease?: string
    color?: string
    maxScale?: number
    blurAmount?: number
    numBlobs?: number
  }
}

const InkBleedTransition = ({
  isActive,
  sourceElement,
  targetElement,
  onTransitionComplete,
  config = {},
}: InkBleedTransitionProps) => {
  const elementsRef = useRef<HTMLElement[]>([])
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const containerRef = useRef<HTMLElement | null>(null)

  // Default configuration
  const { duration = 1.5, ease = "sine.out", color = "black", maxScale = 15, blurAmount = 20, numBlobs = 5 } = config

  // Clean up any existing elements
  const cleanupElements = () => {
    if (timelineRef.current) {
      timelineRef.current.kill()
      timelineRef.current = null
    }

    elementsRef.current.forEach((el) => {
      if (el.parentNode) {
        el.parentNode.removeChild(el)
      }
    })
    elementsRef.current = []

    if (containerRef.current && containerRef.current.parentNode) {
      containerRef.current.parentNode.removeChild(containerRef.current)
      containerRef.current = null
    }
  }

  // Create SVG blob path
  const createBlobPath = () => {
    const numPoints = 8
    const radius = 50
    const points = []

    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * Math.PI * 2
      const variance = Math.random() * 20 - 10
      const x = Math.cos(angle) * (radius + variance)
      const y = Math.sin(angle) * (radius + variance)
      points.push(`${x},${y}`)
    }

    return `M${points.join(" L")} Z`
  }

  // Create and animate the transition
  const createTransition = () => {
    if (!sourceElement) return

    // Clean up any existing elements first
    cleanupElements()

    const sourceRect = sourceElement.getBoundingClientRect()

    // Create container
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
    elementsRef.current.push(container)

    // Create image clone
    const imageClone = document.createElement("div")
    imageClone.style.position = "absolute"
    imageClone.style.left = sourceRect.left + "px"
    imageClone.style.top = sourceRect.top + "px"
    imageClone.style.width = sourceRect.width + "px"
    imageClone.style.height = sourceRect.height + "px"
    imageClone.style.backgroundImage = window.getComputedStyle(sourceElement).backgroundImage
    imageClone.style.backgroundSize = "cover"
    imageClone.style.backgroundPosition = "center"
    container.appendChild(imageClone)
    elementsRef.current.push(imageClone)

    // Create SVG for ink blobs
    const svgNS = "http://www.w3.org/2000/svg"
    const svg = document.createElementNS(svgNS, "svg")
    svg.setAttribute("width", "100%")
    svg.setAttribute("height", "100%")
    svg.style.position = "absolute"
    svg.style.left = "0"
    svg.style.top = "0"
    container.appendChild(svg)
    elementsRef.current.push(svg as unknown as HTMLElement)

    // Create unique mask ID that won't conflict
    const maskId = `ink-mask-${Date.now()}-${Math.floor(Math.random() * 1000)}`

    // Create mask
    const mask = document.createElementNS(svgNS, "mask")
    mask.setAttribute("id", maskId)
    svg.appendChild(mask)

    // Create blobs for the mask
    const blobs = []
    for (let i = 0; i < numBlobs; i++) {
      const blob = document.createElementNS(svgNS, "path")
      blob.setAttribute("d", createBlobPath())
      blob.setAttribute("fill", "white")
      blob.setAttribute(
        "transform",
        `translate(${sourceRect.left + sourceRect.width / 2}, ${sourceRect.top + sourceRect.height / 2}) scale(0.01)`,
      )
      mask.appendChild(blob)
      blobs.push(blob)
    }

    // Create rectangle that will be masked
    const rect = document.createElementNS(svgNS, "rect")
    rect.setAttribute("width", "100%")
    rect.setAttribute("height", "100%")
    rect.setAttribute("fill", color)
    rect.setAttribute("mask", `url(#${maskId})`)
    svg.appendChild(rect)

    // Apply mask to image clone using CSS
    imageClone.style.webkitMaskImage = `url(#${maskId})`
    imageClone.style.maskImage = `url(#${maskId})`

    // Create timeline for animation
    const timeline = gsap.timeline({
      onComplete: () => {
        if (onTransitionComplete) onTransitionComplete()
        // Don't clean up immediately to allow for panel reveal
        setTimeout(cleanupElements, 500)
      },
    })
    timelineRef.current = timeline

    // Animate each blob
    blobs.forEach((blob, index) => {
      const delay = index * 0.1
      const scale = maxScale * (0.7 + Math.random() * 0.6)
      const rotation = Math.random() * 360

      // First morph the blob shape
      timeline.to(
        blob,
        {
          attr: {
            d: createBlobPath(), // Morph to a different blob shape
          },
          duration: duration * 0.5,
          ease: "sine.inOut",
          delay: delay,
        },
        0,
      )

      // Then scale and rotate it
      timeline.to(
        blob,
        {
          attr: {
            transform: `translate(${sourceRect.left + sourceRect.width / 2}, ${
              sourceRect.top + sourceRect.height / 2
            }) scale(${scale}) rotate(${rotation})`,
          },
          duration: duration,
          ease: ease,
          delay: delay,
        },
        0,
      )
    })

    // Animate the image clone
    timeline.to(
      imageClone,
      {
        filter: `blur(${blurAmount}px)`,
        duration: duration * 0.7,
        ease: "power2.in",
      },
      0,
    )
  }

  // Run transition when isActive changes
  useEffect(() => {
    if (isActive && sourceElement) {
      createTransition()
    } else {
      cleanupElements()
    }

    return () => {
      cleanupElements()
    }
  }, [isActive, sourceElement])

  // This component doesn't render anything visible
  return null
}

export default InkBleedTransition
