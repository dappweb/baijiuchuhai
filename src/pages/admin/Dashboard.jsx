
import { Link } from 'wouter';
import Leads from './Leads'; // Assuming you have this component
import News from './News'; // Assuming you have this component
import Content from './Content'; // Import the new Content component
import { useState } from 'react';

export default function Dashboard() {
  // Simple state to switch between views. 
  // A router library would be better for a real-world app.
  const [activeTab, setActiveTab] = useState('leads');

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'news':
        return <News />;
      case 'content':
        return <Content />;
      case 'leads':
      default:
        return <Leads />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white p-5">
        <h1 className="text-2xl font-bold mb-10">管理后台</h1>
        <nav>
          <ul>
            <li className="mb-4">
              <a href="#" onClick={() => setActiveTab('leads')} 
                 className={`block p-2 rounded ${activeTab === 'leads' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
                询盘管理
              </a>
            </li>
            <li className="mb-4">
              <a href="#" onClick={() => setActiveTab('news')} 
                 className={`block p-2 rounded ${activeTab === 'news' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
                新闻管理
              </a>
            </li>
            <li className="mb-4">
              <a href="#" onClick={() => setActiveTab('content')} 
                 className={`block p-2 rounded ${activeTab === 'content' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
                内容管理
              </a>
            </li>
            {/* Add more links as needed */}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10 overflow-y-auto">
        {renderActiveTab()}
      </div>
    </div>
  );
}
