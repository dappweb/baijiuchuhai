
import React, { useState, useEffect } from 'react';

export default function Content() {
  const [content, setContent] = useState([]);
  const [newContent, setNewContent] = useState({ content_key: '', content_value: '' });
  const [editing, setEditing] = useState(null); // State to hold the content being edited

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    const response = await fetch('/api/admin/content');
    const data = await response.json();
    setContent(data);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewContent({ ...newContent, [name]: value });
  };

  const handleCreate = async () => {
    await fetch('/api/admin/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newContent),
    });
    setNewContent({ content_key: '', content_value: '' });
    fetchContent();
  };
  
  const handleUpdate = async (id) => {
    await fetch(`/api/admin/content/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content_value: editing.content_value }),
    });
    setEditing(null); // Exit editing mode
    fetchContent();
  };

  const handleDelete = async (id) => {
    await fetch(`/api/admin/content/${id}`, {
      method: 'DELETE',
    });
    fetchContent();
  };

  const startEditing = (item) => {
    setEditing({ ...item }); // Make a copy of the item to edit
  };
  
  const handleEditChange = (e) => {
    setEditing({ ...editing, content_value: e.target.value });
  };


  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">内容管理</h1>

      {/* Create Form */}
      <div className="mb-8 p-4 border rounded shadow-md">
        <h2 className="text-xl font-semibold mb-2">创建新内容</h2>
        <div className="flex space-x-2">
        <input
          type="text"
          name="content_key"
          value={newContent.content_key}
          onChange={handleInputChange}
          placeholder="Key"
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          name="content_value"
          value={newContent.content_value}
          onChange={handleInputChange}
          placeholder="Value"
          className="border p-2 rounded w-full"
        />
        </div>
        <button onClick={handleCreate} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
          创建
        </button>
      </div>

      {/* Content Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {content.map((item) => (
          <div key={item.id} className="border p-4 rounded shadow-md bg-white">
            <h3 className="font-bold text-lg break-all">{item.content_key}</h3>

            {editing && editing.id === item.id ? (
              // Editing state
              <div className="mt-2">
                <textarea
                  value={editing.content_value}
                  onChange={handleEditChange}
                  className="border p-2 rounded w-full"
                  rows="3"
                ></textarea>
                <div className="flex justify-end space-x-2 mt-2">
                  <button onClick={() => handleUpdate(item.id)} className="bg-green-500 text-white px-3 py-1 rounded text-sm">
                    保存
                  </button>
                  <button onClick={() => setEditing(null)} className="bg-gray-500 text-white px-3 py-1 rounded text-sm">
                    取消
                  </button>
                </div>
              </div>
            ) : (
              // Viewing state
              <div>
                <p className="text-gray-700 mt-1 break-all">{item.content_value}</p>
                <div className="flex justify-end space-x-2 mt-3">
                  <button onClick={() => startEditing(item)} className="bg-yellow-500 text-white px-3 py-1 rounded text-sm">
                    编辑
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="bg-red-500 text-white px-3 py-1 rounded text-sm">
                    删除
                  </button>
                </div>
              </div>
            )}
             <p className="text-xs text-gray-400 mt-2">
              最后更新: {new Date(item.last_updated * 1000).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
