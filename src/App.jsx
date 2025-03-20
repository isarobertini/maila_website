import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createClient } from 'contentful';
import { Page } from './pages/Page.jsx';

const client = createClient({
  space: import.meta.env.VITE_SPACE_ID,  // Make sure to set the correct environment variables
  accessToken: import.meta.env.VITE_ACCESS_TOKEN,
});

export const App = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [homePageContent, setHomePageContent] = useState(null);

  useEffect(() => {
    // Fetch navigation menu and homepage data from Contentful
    async function fetchNavigationItems() {
      try {
        const response = await client.getEntries({
          content_type: 'navigationMenu',  // Ensure this matches your Contentful content type
          order: 'fields.order',
        });

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

        setMenuItems(items);

        // Find homepage content by slug '/'
        const home = items.find((item) => item.slug === '/');
        setHomePageContent(home || null);
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    }

    fetchNavigationItems();
  }, []);

  return (
    <Router>
      <Routes>
        {homePageContent && (
          <Route
            path="/"
            element={
              <Page
                title={homePageContent.title}
                content={homePageContent.content}
                imageContent={homePageContent.imageContent}  // Pass the entire imageContent array here
                menuItems={menuItems}
                isHomePage={true}  // Specify it's the homepage
                externalExhibitionLink={homePageContent.externalExhibitionLink}
                externalTextLink={homePageContent.externalTextLink}
                externalMediaLink={homePageContent.externalMediaLink}
                textColor="#000000"
              />
            }
          />
        )}
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
