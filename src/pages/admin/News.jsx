import React, { useState, useEffect, useRef } from 'react';

export default function News() {
  const [news, setNews] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    summary: '',
    content: '',
    cover_image_url: '',
    publish_date: ''
  });
  const fileInputRef = useRef(null);
  const contentFileInputRef = useRef(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/admin/news', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (response.ok) {
      const data = await response.json();
      setNews(data);
    }
  };

  const handleUpload = async (file, callback) => {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      if (data.success) {
        callback(data.url);
      }
    } catch (error) {
      alert('上传失败');
    }
    setUploading(false);
  };

  const handleCoverUpload = (e) => {
    const file = e.target.files[0];
    handleUpload(file, (url) => {
      setForm({ ...form, cover_image_url: url });
    });
  };

  const insertMediaToContent = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    handleUpload(file, (url) => {
      const isVideo = file.type.startsWith('video/');
      const mediaTag = isVideo 
        ? `<video src="${url}" controls class="max-w-full my-4"></video>`
        : `<img src="${url}" alt="" class="max-w-full my-4" />`;
      setForm({ ...form, content: form.content + '\n' + mediaTag });
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const method = editingId ? 'PUT' : 'POST';
    const body = editingId ? { ...form, id: editingId } : form;
    
    const response = await fetch('/api/admin/news', {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });
    
    if (response.ok) {
      setShowForm(false);
      setEditingId(null);
      setForm({ title: '', summary: '', content: '', cover_image_url: '', publish_date: '' });
      fetchNews();
    }
  };

  const handleEdit = (item) => {
    setForm({
      title: item.title,
      summary: item.summary || '',
      content: item.content || '',
      cover_image_url: item.cover_image_url || '',
      publish_date: item.publish_date || ''
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('确定删除？')) return;
    const token = localStorage.getItem('token');
    await fetch(`/api/admin/news?id=${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    fetchNews();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">新闻管理</h2>
        <button 
          onClick={() => { setShowForm(true); setEditingId(null); setForm({ title: '', summary: '', content: '', cover_image_url: '', publish_date: '' }); }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          添加新闻
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">{editingId ? '编辑新闻' : '添加新闻'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">标题</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">摘要</label>
                <textarea
                  value={form.summary}
                  onChange={(e) => setForm({ ...form, summary: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  rows="2"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">封面图片</label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleCoverUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                    disabled={uploading}
                  >
                    {uploading ? '上传中...' : '上传图片'}
                  </button>
                  {form.cover_image_url && (
                    <img src={form.cover_image_url} alt="封面" className="h-16 object-cover rounded" />
                  )}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">内容 (支持HTML)</label>
                <div className="mb-2">
                  <input
                    type="file"
                    ref={contentFileInputRef}
                    onChange={insertMediaToContent}
                    accept="image/*,video/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => contentFileInputRef.current.click()}
                    className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                    disabled={uploading}
                  >
                    插入图片/视频
                  </button>
                </div>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="w-full border rounded px-3 py-2 font-mono text-sm"
                  rows="10"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">发布日期</label>
                <input
                  type="date"
                  value={form.publish_date}
                  onChange={(e) => setForm({ ...form, publish_date: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div className="flex gap-4">
                <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
                  保存
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowForm(false)}
                  className="bg-gray-300 px-6 py-2 rounded hover:bg-gray-400"
                >
                  取消
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white shadow-md rounded my-6">
        <table className="min-w-max w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">ID</th>
              <th className="py-3 px-6 text-left">封面</th>
              <th className="py-3 px-6 text-left">标题</th>
              <th className="py-3 px-6 text-center">发布日期</th>
              <th className="py-3 px-6 text-center">操作</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {news.map(item => (
              <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left whitespace-nowrap">{item.id}</td>
                <td className="py-3 px-6 text-left">
                  {item.cover_image_url && (
                    <img src={item.cover_image_url} alt="" className="h-12 w-16 object-cover rounded" />
                  )}
                </td>
                <td className="py-3 px-6 text-left">{item.title}</td>
                <td className="py-3 px-6 text-center">{item.publish_date}</td>
                <td className="py-3 px-6 text-center">
                  <button 
                    onClick={() => handleEdit(item)}
                    className="text-blue-500 hover:text-blue-700 mr-3"
                  >
                    编辑
                  </button>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    删除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
