import React, { createContext, useContext, useState, useEffect } from 'react';

const SiteContentContext = createContext();

export function useSiteContent() {
  return useContext(SiteContentContext);
}

export function SiteContentProvider({ children }) {
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContent() {
      try {
        const response = await fetch('/api/content');
        if (!response.ok) {
          throw new Error('Failed to fetch site content');
        }
        const data = await response.json();
        setContent(data);
      } catch (error) {
        console.error(error);
        // In a real app, you might want to set some default content or show an error state
      } finally {
        setLoading(false);
      }
    }

    fetchContent();
  }, []);

  const value = { content, loading };

  return (
    <SiteContentContext.Provider value={value}>
      {children}
    </SiteContentContext.Provider>
  );
}
