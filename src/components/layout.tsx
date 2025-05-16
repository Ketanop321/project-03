import type React from "react"
import Header from "./header"
import Footer from "./footer"

interface LayoutProps {
  children: React.ReactNode
  className?: string
}

const Layout: React.FC<LayoutProps> = ({ children, className = "" }) => {
  return (
    <main className={className}>
      <Header />
      {children}
      <Footer />
    </main>
  )
}

export default Layout
