import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function News() {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/news')
      .then(res => res.json())
      .then(data => {
        setNews(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="container mx-auto px-4 py-16 text-center">加载中...</div>
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-12 text-center">新闻动态</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {news.map(item => (
          <Link key={item.id} to={`/news/${item.id}`} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition">
            {item.cover_image_url && (
              <img src={item.cover_image_url} alt={item.title} className="w-full h-48 object-cover" />
            )}
            <div className="p-6">
              <h2 className="text-xl font-bold mb-2 text-primary-800">{item.title}</h2>
              <p className="text-gray-600 mb-4">{item.summary}</p>
              <span className="text-sm text-gray-400">{item.publish_date}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
