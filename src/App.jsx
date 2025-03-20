import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createClient } from 'contentful';
import { Page } from './pages/Page.jsx';

// Initialize the Contentful client using environment variables for space ID and access token
const client = createClient({
  space: import.meta.env.VITE_SPACE_ID,
  accessToken: import.meta.env.VITE_ACCESS_TOKEN,
});

export const App = () => {
  // State variables to hold menu items, home page content, and error messages
  const [menuItems, setMenuItems] = useState([]);
  const [homePageContent, setHomePageContent] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Async function to fetch navigation menu and homepage data from Contentful
    async function fetchNavigationItems() {
      try {
        // Fetch navigation menu items ordered by the 'order' field
        const response = await client.getEntries({
          content_type: 'navigationMenu',
          order: 'fields.order',
        });

        // Map the response items to an array of objects containing necessary fields
        const items = response.items.map((item) => ({
          id: item.sys.id,
          title: item.fields.title || 'Untitled',
          slug: item.fields.slug || '/new-page',
          content: item.fields.content || '',
          order: item.fields.order || 999,
          imageContent: item.fields.imageContent || [],
          externalExhibitionLink: item.fields.externalExhibitionLink || null,
          externalTextLink: item.fields.externalTextLink || null,
          externalMediaLink: item.fields.externalMediaLink || null,
        }));

        // Set the menu items state
        setMenuItems(items);

        // Find the homepage content by looking for an item with the slug '/'
        const home = items.find((item) => item.slug === '/');
        setHomePageContent(home || null);
      } catch (error) {
        // Set error state if the fetch fails
        setError('Failed to load data. Please try again later.');
      }
    }

    // Fetch navigation items when the component mounts
    fetchNavigationItems();
  }, []);

  // If there's an error, display an error message
  if (error) {
    return (
      <div className="error-message">
        <h1>{error}</h1>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {homePageContent && (
          // Route for the homepage
          <Route
            path="/"
            element={
              <Page
                title={homePageContent.title}
                content={homePageContent.content}
                imageContent={homePageContent.imageContent}
                menuItems={menuItems}
                isHomePage={true}
                externalExhibitionLink={homePageContent.externalExhibitionLink}
                externalTextLink={homePageContent.externalTextLink}
                externalMediaLink={homePageContent.externalMediaLink}
                textColor="#000000"
              />
            }
          />
        )}

        {/* Routes for all other pages, excluding the homepage */}
        {menuItems.filter((item) => item.slug !== '/').map((item) => (
          <Route
            key={item.id}
            path={item.slug}
            element={
              <Page
                title={item.title}
                content={item.content}
                imageContent={item.imageContent}
                menuItems={menuItems}
                isHomePage={false}
                selectedImage={item.imageContent[0]?.fields?.file?.url}
                selectedImageTitle={item.imageContent[0]?.fields?.title}
                externalExhibitionLink={item.externalExhibitionLink}
                externalTextLink={item.externalTextLink}
                externalMediaLink={item.externalMediaLink}
                textColor="#000000"
              />
            }
          />
        ))}
      </Routes>
    </Router>
  );
};
