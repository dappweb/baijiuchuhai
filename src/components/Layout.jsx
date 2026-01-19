import { Outlet, Link } from 'react-router-dom'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gradient-to-r from-primary-900 to-primary-800 text-white shadow-lg sticky top-0 z-50">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold flex items-center gap-2">
              <span className="text-gold-400">百酒出海</span>
            </Link>
            <div className="hidden md:flex gap-8">
              <Link to="/" className="hover:text-gold-400 transition">首页</Link>
              <Link to="/news" className="hover:text-gold-400 transition">新闻动态</Link>
              <Link to="/contact" className="hover:text-gold-400 transition">联系我们</Link>
            </div>
          </div>
        </nav>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-gray-900 text-gray-300 py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 百酒出海. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
