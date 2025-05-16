"use client"

import { useState, useEffect, useRef } from "react"
import DiagonalSlideTransition from "./transitions/diagonal-slide-transition"
import PixelExplodeTransition from "./transitions/pixel-explode-transition"
import TileFlipTransition from "./transitions/tile-flip-transition"
import InkBleedTransition from "./transitions/ink-bleed-transition"

interface TransitionControllerProps {
  isActive: boolean
  sourceElement: HTMLElement | null
  targetElement: HTMLElement | null
  onTransitionComplete?: () => void
  transitionType: string
  config?: Record<string, any>
}

const TransitionController = ({
  isActive,
  sourceElement,
  targetElement,
  onTransitionComplete,
  transitionType,
  config = {},
}: TransitionControllerProps) => {
  const [activeTransition, setActiveTransition] = useState<string | null>(null)
  const prevActiveRef = useRef(false)

  useEffect(() => {
    // Only trigger transition when isActive changes from false to true
    if (isActive && !prevActiveRef.current) {
      setActiveTransition(transitionType)
    } else if (!isActive && prevActiveRef.current) {
      // Small delay before removing transition component to ensure cleanup
      setTimeout(() => {
        setActiveTransition(null)
      }, 100)
    }
    prevActiveRef.current = isActive
  }, [isActive, transitionType])

  return (
    <>
      {activeTransition === "diagonal-slide" && (
        <DiagonalSlideTransition
          isActive={isActive}
          sourceElement={sourceElement}
          targetElement={targetElement}
          onTransitionComplete={onTransitionComplete}
          config={config}
        />
      )}

      {activeTransition === "pixel-explode" && (
        <PixelExplodeTransition
          isActive={isActive}
          sourceElement={sourceElement}
          targetElement={targetElement}
          onTransitionComplete={onTransitionComplete}
          config={config}
        />
      )}

      {activeTransition === "tile-flip" && (
        <TileFlipTransition
          isActive={isActive}
          sourceElement={sourceElement}
          targetElement={targetElement}
          onTransitionComplete={onTransitionComplete}
          config={config}
        />
      )}

      {activeTransition === "ink-bleed" && (
        <InkBleedTransition
          isActive={isActive}
          sourceElement={sourceElement}
          targetElement={targetElement}
          onTransitionComplete={onTransitionComplete}
          config={config}
        />
      )}
    </>
  )
}

export default TransitionController
