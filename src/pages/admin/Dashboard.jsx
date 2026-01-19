import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

export default function AdminDashboard() {
  const [tab, setTab] = useState('leads')
  const [leads, setLeads] = useState([])
  const [news, setNews] = useState([])
  const [form, setForm] = useState({ title: '', summary: '', content: '', cover_image_url: '', publish_date: '' })
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      navigate('/admin/login')
      return
    }
    
    if (tab === 'leads') {
      fetch('/api/admin/leads', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(setLeads)
    } else if (tab === 'news') {
      fetch('/api/admin/news', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(setNews)
    }
  }, [tab, navigate])

  const handleCreateNews = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('admin_token')
    
    const res = await fetch('/api/admin/news', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(form)
    })
    
    if (res.ok) {
      alert('新闻创建成功')
      setForm({ title: '', summary: '', content: '', cover_image_url: '', publish_date: '' })
      setTab('news')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-primary-900 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">管理后台</h1>
          <button onClick={() => {
            localStorage.removeItem('admin_token')
            navigate('/admin/login')
          }} className="text-sm hover:text-gold-400">
            退出登录
          </button>
        </div>
      </header>

      <div className="container mx-auto p-4">
        <div className="flex gap-4 mb-6">
          <button onClick={() => setTab('leads')} className={`px-6 py-2 rounded ${tab === 'leads' ? 'bg-primary-700 text-white' : 'bg-white'}`}>
            咨询列表
          </button>
          <button onClick={() => setTab('news')} className={`px-6 py-2 rounded ${tab === 'news' ? 'bg-primary-700 text-white' : 'bg-white'}`}>
            新闻管理
          </button>
          <button onClick={() => setTab('create')} className={`px-6 py-2 rounded ${tab === 'create' ? 'bg-primary-700 text-white' : 'bg-white'}`}>
            创建新闻
          </button>
        </div>

        {tab === 'leads' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">咨询列表</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">姓名</th>
                    <th className="text-left p-2">电话</th>
                    <th className="text-left p-2">公司</th>
                    <th className="text-left p-2">留言</th>
                    <th className="text-left p-2">时间</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map(lead => (
                    <tr key={lead.id} className="border-b">
                      <td className="p-2">{lead.name}</td>
                      <td className="p-2">{lead.phone}</td>
                      <td className="p-2">{lead.company}</td>
                      <td className="p-2">{lead.message}</td>
                      <td className="p-2">{new Date(lead.created_at * 1000).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'news' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">新闻列表</h2>
            <div className="space-y-4">
              {news.map(item => (
                <div key={item.id} className="border p-4 rounded">
                  <h3 className="font-bold">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.summary}</p>
                  <p className="text-xs text-gray-400 mt-2">{item.publish_date}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'create' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">创建新闻</h2>
            <form onSubmit={handleCreateNews} className="space-y-4">
              <div>
                <label className="block font-semibold mb-2">标题</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={e => setForm({...form, title: e.target.value})}
                  className="w-full px-4 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">摘要</label>
                <textarea
                  value={form.summary}
                  onChange={e => setForm({...form, summary: e.target.value})}
                  className="w-full px-4 py-2 border rounded"
                  rows="2"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">封面图片URL</label>
                <input
                  type="text"
                  value={form.cover_image_url}
                  onChange={e => setForm({...form, cover_image_url: e.target.value})}
                  className="w-full px-4 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">发布日期</label>
                <input
                  type="date"
                  value={form.publish_date}
                  onChange={e => setForm({...form, publish_date: e.target.value})}
                  className="w-full px-4 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">内容</label>
                <ReactQuill
                  value={form.content}
                  onChange={content => setForm({...form, content})}
                  className="bg-white"
                />
              </div>
              <button type="submit" className="btn-primary">
                发布新闻
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
