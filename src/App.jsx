import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createClient } from 'contentful';
import { Page } from './pages/Page.jsx'; // Import Page, not NavBar here

// Fetching credentials from the environment variables
const client = createClient({
  space: import.meta.env.VITE_SPACE_ID, // Fetch space ID from .env
  accessToken: import.meta.env.VITE_ACCESS_TOKEN, // Fetch access token from .env
});

export const App = () => {
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    async function fetchNavigationItems() {
      try {
        const response = await client.getEntries({
          content_type: 'navigationMenu',
          order: 'fields.order',
        });

        // Map entries to usable menu items
        const items = response.items.map((item) => ({
          id: item.sys.id,
          title: item.fields.title || 'Untitled',
          slug: item.fields.slug || '/new-page',
          content: item.fields.content || '',
          order: item.fields.order || 999,
          imageContent: item.fields.imageContent || [],
        }));

        setMenuItems(items);
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    }

    fetchNavigationItems();
  }, []);

  return (
    <Router>
      <Routes>
        {menuItems.map((item) => (
          <Route
            key={item.id}
            path={item.slug}
            element={<Page title={item.title} content={item.content} imageContent={item.imageContent} menuItems={menuItems} />}
          />
        ))}
        <Route path="/" element={<Page title="Home" content="Welcome to the homepage!" menuItems={menuItems} />} />
      </Routes>
    </Router>
  );
};
