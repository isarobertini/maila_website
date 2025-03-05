import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createClient } from 'contentful';
import { Page } from './pages/Page.jsx';

// Fetching credentials from the environment variables
const client = createClient({
  space: import.meta.env.VITE_SPACE_ID,
  accessToken: import.meta.env.VITE_ACCESS_TOKEN,
});

export const App = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [homePageContent, setHomePageContent] = useState(null);

  const backgrounds = [
    { image: "/assets/bg1.webp", textColor: "text-purple-300" },
    { image: "/assets/bg2.webp", textColor: "text-black" },
    { image: "/assets/bg3.webp", textColor: "text-yellow-300" }
  ];

  const randomBg = backgrounds[Math.floor(Math.random() * backgrounds.length)];

  useEffect(() => {
    async function fetchNavigationItems() {
      try {
        const response = await client.getEntries({
          content_type: 'navigationMenu',
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
          externalMediaLink: item.fields.externalMediaLink || null
        }));

        setMenuItems(items);

        // Find home page content (assuming it has a slug of '/')
        const home = items.find((item) => item.slug === '/');
        setHomePageContent(home || null);

        console.log("Home Page Content:", home);
        console.log("Home Page Images:", home?.imageContent || []);
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    }

    fetchNavigationItems();
  }, []);

  // Select the correct image and title based on the background selection
  const selectedBackgroundIndex = backgrounds.indexOf(randomBg);
  const selectedImageContent = homePageContent?.imageContent?.[selectedBackgroundIndex] || null;
  const selectedImageUrl = selectedImageContent?.fields?.file?.url || null;
  const selectedImageTitle = selectedImageContent?.fields?.title || 'Default Title';

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
                imageContent={homePageContent.imageContent} // Pass home page image content directly
                menuItems={menuItems}
                isHomePage={true}
                background={randomBg}
                selectedImage={selectedImageUrl} // Pass the selected image URL
                // Pass the selected image title
                externalExhibitionLink={homePageContent.externalExhibitionLink}
                externalTextLink={homePageContent.externalTextLink}
                externalMediaLink={homePageContent.externalMediaLink}
              />
            }
          />
        )}

        {menuItems
          .filter((item) => item.slug !== '/')
          .map((item) => (
            <Route
              key={item.id}
              path={item.slug}
              element={
                <Page
                  title={item.title}
                  content={item.content}
                  imageContent={item.imageContent} // Pass image content directly for each page
                  menuItems={menuItems}
                  isHomePage={false}
                  externalExhibitionLink={item.externalExhibitionLink}
                  externalTextLink={item.externalTextLink}
                  externalMediaLink={item.externalMediaLink}
                />
              }
            />
          ))}
      </Routes>
    </Router>
  );
};
