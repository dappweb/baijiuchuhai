import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import DOMPurify from 'dompurify'

export default function NewsDetail() {
  const { id } = useParams()
  const [news, setNews] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/news/${id}`)
      .then(res => res.json())
      .then(data => {
        setNews(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  if (loading) {
    return <div className="container mx-auto px-4 py-16 text-center">加载中...</div>
  }

  if (!news) {
    return <div className="container mx-auto px-4 py-16 text-center">新闻不存在</div>
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <article className="bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-4xl font-bold mb-4 text-primary-900">{news.title}</h1>
        <div className="text-gray-500 mb-8">{news.publish_date}</div>
        {news.cover_image_url && (
          <img src={news.cover_image_url} alt={news.title} className="w-full rounded-lg mb-8" />
        )}
        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(news.content) }}
        />
      </article>
    </div>
  )
}
