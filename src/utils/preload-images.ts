// Preloads images specified by the CSS selector
export const preloadImages = (selector = "img") => {
  return new Promise<void>((resolve) => {
    // Check if we're in a browser environment
    if (typeof window === "undefined") {
      resolve()
      return
    }

    // Dynamically import imagesLoaded
    import("imagesloaded")
      .then((imagesLoadedModule) => {
        const imagesLoaded = imagesLoadedModule.default

        // Handle case where elements might not be in DOM yet
        setTimeout(() => {
          const elements = document.querySelectorAll(selector)
          if (elements.length === 0) {
            console.warn(`No elements found for selector: ${selector}`)
            resolve()
            return
          }

          const imgLoad = imagesLoaded(elements, { background: true })
          imgLoad.on("done", () => resolve())
          imgLoad.on("fail", () => {
            console.warn("Some images failed to load")
            resolve()
          })
        }, 100)
      })
      .catch((err) => {
        console.error("Failed to load imagesloaded library:", err)
        resolve() // Resolve anyway to prevent blocking
      })
  })
}
