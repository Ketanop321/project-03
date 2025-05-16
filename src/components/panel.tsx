"use client"

import type React from "react"

import { useRef, useEffect } from "react"
import gsap from "gsap"

interface PanelProps {
  isOpen: boolean
  content: {
    imgURL: string
    title: string
    desc: string
    position: string
  }
  onClose: () => void
}

const Panel: React.FC<PanelProps> = ({ isOpen, content, onClose }) => {
  const panelRef = useRef<HTMLElement>(null)
  const imgRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const prevOpenState = useRef(isOpen)

  // Handle panel animation when open state changes
  useEffect(() => {
    if (!panelRef.current || !imgRef.current || !contentRef.current) return

    // Only run animation if the state actually changed
    if (isOpen !== prevOpenState.current) {
      if (isOpen) {
        // Panel is opening - animate content
        gsap.set(panelRef.current, { opacity: 1, pointerEvents: "auto" })
        gsap.fromTo(
          contentRef.current,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 1, ease: "expo", delay: 0.5 },
        )
      } else {
        // Panel is closing
        gsap.to(panelRef.current, { 
          opacity: 0, 
          duration: 0.5, 
          ease: "expo",
          onComplete: () => {
            if (panelRef.current) {
              panelRef.current.style.pointerEvents = 'none';
            }
          }
        })

        // Fade in frame elements
        gsap.to([".frame", ".heading"], {
          opacity: 1,
          duration: 0.5,
          ease: "sine.inOut",
          pointerEvents: "auto",
          delay: 0.3,
        })

        // Fade in grid items
        gsap.to(".grid__item", {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: "power1.out",
          stagger: 0.02,
          delay: 0.3,
        })
      }
      prevOpenState.current = isOpen
    }
  }, [isOpen])

  // Set panel position class based on content position
  const panelClass = `panel ${content.position === "right" ? "panel--right" : ""}`

  return (
    <figure
      ref={panelRef as React.RefObject<HTMLElement>}
      className={panelClass}
      role="img"
      aria-labelledby="panel-caption"
      style={{ 
        opacity: 0, 
        pointerEvents: "none",
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1000
      }}
    >
      <div ref={imgRef} className="panel__img" style={{ backgroundImage: `url(${content.imgURL})` }} />
      <figcaption ref={contentRef} className="panel__content" id="panel-caption">
        <h3>{content.title}</h3>
        <p>{content.desc}</p>
        <button type="button" className="panel__close" aria-label="Close preview" onClick={onClose}>
          Close
        </button>
      </figcaption>
    </figure>
  )
}

export default Panel
