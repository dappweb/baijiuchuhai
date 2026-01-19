import { useState } from 'react'

export default function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', company: '', message: '' })
  const [status, setStatus] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('提交中...')
    
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      
      if (res.ok) {
        setStatus('提交成功！我们会尽快联系您')
        setForm({ name: '', phone: '', company: '', message: '' })
      } else {
        setStatus('提交失败，请重试')
      }
    } catch {
      setStatus('提交失败，请重试')
    }
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">联系我们</h1>
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2">姓名 *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">电话 *</label>
              <input
                type="tel"
                required
                value={form.phone}
                onChange={e => setForm({...form, phone: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">公司名称</label>
              <input
                type="text"
                value={form.company}
                onChange={e => setForm({...form, company: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">留言</label>
              <textarea
                rows="4"
                value={form.message}
                onChange={e => setForm({...form, message: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <button type="submit" className="btn-primary w-full">
              提交咨询
            </button>
            {status && (
              <p className="text-center text-sm font-semibold">{status}</p>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
