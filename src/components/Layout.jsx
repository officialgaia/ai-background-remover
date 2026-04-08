import Header from './Header.jsx'
import Footer from './Footer.jsx'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-950">
      <Header />
      <AdPlaceholder variant="banner" className="bg-gray-900/30 border-b border-gray-800" />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}
