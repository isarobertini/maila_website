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
    { image: "/assets/bg1.webp", textColor: "text-purple-500" },
    { image: "/assets/bg2.webp", textColor: "text-black" },
    { image: "/assets/bg3.webp", textColor: "text-yellow-500" }
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

  // Select only one image based on the random background
  const selectedImage = homePageContent?.imageContent?.length
    ? homePageContent.imageContent[backgrounds.indexOf(randomBg)]?.fields?.file?.url || null
    : null;

  console.log("Selected Background:", randomBg);
  console.log("Selected Image for Home:", selectedImage);

  return (
    <Router>
      <Routes>
        {/* Home page - use the homePageContent directly here */}
        {homePageContent && (
          <Route
            path="/"
            element={
              <Page
                title={homePageContent.title}
                content={homePageContent.content}
                imageContent={homePageContent.imageContent.map(img => img?.fields?.file?.url).filter(Boolean)} // Pass home page image content
                menuItems={menuItems}
                isHomePage={true}
                background={randomBg}
                externalExhibitionLink={homePageContent.externalExhibitionLink} // Pass externalLink for home page
                externalTextLink={homePageContent.externalTextLink} // Pass externalTextLink for home page
                externalMediaLink={homePageContent.externalMediaLink} // Pass externalMediaLink for home page
              />
            }
          />
        )}

        {/* Other pages */}
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
                  imageContent={item.imageContent.map(img => img?.fields?.file?.url).filter(Boolean)} // Pass all images for other pages
                  menuItems={menuItems}
                  isHomePage={false}
                  externalExhibitionLink={item.externalExhibitionLink} // Pass externalExhibitionLink for other pages
                  externalTextLink={item.externalTextLink} // Pass externalTextLink for other pages
                  externalMediaLink={item.externalMediaLink} // Pass externalMediaLink for other pages
                />
              }
            />
          ))}
      </Routes>
    </Router>
  );
};
