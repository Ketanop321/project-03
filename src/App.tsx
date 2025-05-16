"use client"

import { useState, useEffect, useRef } from "react"
import Layout from "./components/layout"
import ImageGrid from "./components/image-grid"
import Panel from "./components/panel"
import TransitionController from "./components/transition-controller"
import { preloadImages } from "./utils/preload-images"
import "./index.css"

function App() {
  const [loading, setLoading] = useState(true)
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [panelContent, setPanelContent] = useState({
    imgURL: "",
    title: "",
    desc: "",
    position: "right",
  })
  const [transitionConfig, setTransitionConfig] = useState({})
  const [transitionType, setTransitionType] = useState("diagonal-slide")
  const [isTransitioning, setIsTransitioning] = useState(false)

  // References to source and target elements for the transition
  const [sourceElement, setSourceElement] = useState<HTMLElement | null>(null)
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null)

  // Animation state management
  const [isAnimating, setIsAnimating] = useState(false)
  const timeoutRef = useRef<number | null>(null)

  useEffect(() => {
    // Preload images then remove loading class
    preloadImages(".grid__item-image, .panel__img").then(() => {
      setLoading(false)
    })

    // Import GSAP dynamically
    // const loadGSAP = async () => {
    //   try {
    //     await import("gsap")
    //     console.log("GSAP loaded successfully")
    //   } catch (error) {
    //     console.error("Failed to load GSAP:", error)
    //   }
    // }

    // loadGSAP()

    // Cleanup timeouts on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const handleItemClick = (content: any, itemElement: HTMLElement, config: any) => {
    if (isAnimating) return

    setIsAnimating(true)

    // Store the source element (clicked grid item image)
    const sourceImg = itemElement.querySelector(".grid__item-image") as HTMLElement
    setSourceElement(sourceImg)

    // Set panel content
    setPanelContent(content)

    // Store transition configuration and type
    setTransitionConfig(config)
    setTransitionType(config.transitionType || "diagonal-slide")

    // Start transition
    setIsTransitioning(true)

    // Show panel after a short delay to allow transition to start
    setTimeout(() => {
      setIsPanelOpen(true)

      // Get the target element (panel image)
      setTimeout(() => {
        const targetImg = document.querySelector(".panel__img") as HTMLElement
        if (targetImg) {
          setTargetElement(targetImg)
        } else {
          console.warn("Panel image element not found")
        }
      }, 50)
    }, 200)

    // Calculate appropriate timeout based on transition type
    let animationDuration = 1500 // Default

    if (config.transitionType === "diagonal-slide") {
      animationDuration = (config.duration || 0.8) * 1000 + 500
    } else if (config.transitionType === "pixel-explode") {
      animationDuration = (config.duration || 1.2) * 1000 + 500
    } else if (config.transitionType === "tile-flip") {
      animationDuration = (config.duration || 1) * 1000 + 500
    } else if (config.transitionType === "ink-bleed") {
      animationDuration = (config.duration || 1.5) * 1000 + 500
    }

    // Reset animation flag after animation completes
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = window.setTimeout(() => {
      setIsAnimating(false)
      setIsTransitioning(false)
    }, animationDuration)
  }

  const handlePanelClose = () => {
    if (isAnimating) return

    setIsAnimating(true)
    setIsPanelOpen(false)

    // Reset animation flag after animation completes
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = window.setTimeout(() => {
      setIsAnimating(false)
      // Clear source and target elements
      setSourceElement(null)
      setTargetElement(null)
    }, 1000)
  }

  return (
    <Layout className={loading ? "loading" : ""}>
      <ImageGrid onItemClick={handleItemClick} isPanelOpen={isPanelOpen} />
      <Panel isOpen={isPanelOpen} content={panelContent} onClose={handlePanelClose} />

      {/* Transition Controller Component */}
      <TransitionController
        isActive={isTransitioning}
        sourceElement={sourceElement}
        targetElement={targetElement}
        onTransitionComplete={() => setIsTransitioning(false)}
        transitionType={transitionType}
        config={transitionConfig}
      />
    </Layout>
  )
}

export default App
