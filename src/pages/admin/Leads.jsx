import React, { useState, useEffect } from 'react';

export default function Leads() {
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    const response = await fetch('/api/admin/leads');
    const data = await response.json();
    setLeads(data);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">询盘管理</h2>
      <div className="bg-white shadow-md rounded my-6">
        <table className="min-w-max w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">ID</th>
              <th className="py-3 px-6 text-left">姓名</th>
              <th className="py-3 px-6 text-center">电话</th>
              <th className="py-3 px-6 text-center">公司</th>
              <th className="py-3 px-6 text-center">消息</th>
              <th className="py-3 px-6 text-center">状态</th>
              <th className="py-3 px-6 text-center">创建时间</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {leads.map(lead => (
              <tr key={lead.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left whitespace-nowrap">{lead.id}</td>
                <td className="py-3 px-6 text-left">{lead.name}</td>
                <td className="py-3 px-6 text-center">{lead.phone}</td>
                <td className="py-3 px-6 text-center">{lead.company}</td>
                <td className="py-3 px-6 text-center">{lead.message}</td>
                <td className="py-3 px-6 text-center">{lead.status}</td>
                <td className="py-3 px-6 text-center">{new Date(lead.created_at * 1000).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
