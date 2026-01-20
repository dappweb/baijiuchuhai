import React, { useState, useEffect } from 'react';

export default function News() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    const response = await fetch('/api/admin/news');
    const data = await response.json();
    setNews(data);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">新闻管理</h2>
      <div className="bg-white shadow-md rounded my-6">
        <table className="min-w-max w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">ID</th>
              <th className="py-3 px-6 text-left">标题</th>
              <th className="py-3 px-6 text-center">发布日期</th>
              <th className="py-3 px-6 text-center">创建时间</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {news.map(item => (
              <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left whitespace-nowrap">{item.id}</td>
                <td className="py-3 px-6 text-left">{item.title}</td>
                <td className="py-3 px-6 text-center">{item.publish_date}</td>
                <td className="py-3 px-6 text-center">{new Date(item.created_at * 1000).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
