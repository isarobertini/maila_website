import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createClient } from 'contentful';
import { Page } from './pages/Page.jsx';

const client = createClient({
  space: import.meta.env.VITE_SPACE_ID,
  accessToken: import.meta.env.VITE_ACCESS_TOKEN,
});

export const App = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [homePageContent, setHomePageContent] = useState(null);
  const [bgLoaded, setBgLoaded] = useState(false); // To track if background is loaded

  const backgrounds = [
    { image: "/assets/bg1.webp", textColor: "#c4bed0" },
    { image: "/assets/bg2.webp", textColor: "#172212" },
    { image: "/assets/bg3.webp", textColor: "#fde047" }
  ];

  const randomBg = backgrounds[Math.floor(Math.random() * backgrounds.length)];

  // Preload background images
  useEffect(() => {
    const preloadImage = new Image();
    preloadImage.src = randomBg.image;  // Preload the background image
    preloadImage.onload = () => {
      console.log("Image preloaded successfully.");
      setBgLoaded(true); // Set bgLoaded to true once the background image is loaded
    };
    preloadImage.onerror = () => {
      console.error("Error loading background image.");
      setBgLoaded(true); // You can still proceed if there's an error loading the background
    };
  }, [randomBg.image]);

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

        const home = items.find((item) => item.slug === '/');
        setHomePageContent(home || null);
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    }

    fetchNavigationItems();
  }, []);

  const selectedBackgroundIndex = backgrounds.indexOf(randomBg);
  const selectedImageContent = homePageContent?.imageContent?.[selectedBackgroundIndex] || null;
  const selectedImageUrl = selectedImageContent?.fields?.file?.url || null;
  const selectedImageTitle = selectedImageContent?.fields?.title || 'Default Title';

  return (
    <Router>
      <Routes>
        {homePageContent && bgLoaded && (  // Only render when background is loaded
          <Route
            path="/"
            element={
              <Page
                title={homePageContent.title}
                content={homePageContent.content}
                imageContent={homePageContent.imageContent}
                menuItems={menuItems}
                isHomePage={true}
                background={randomBg}
                selectedImage={selectedImageUrl}
                externalExhibitionLink={homePageContent.externalExhibitionLink}
                externalTextLink={homePageContent.externalTextLink}
                externalMediaLink={homePageContent.externalMediaLink}
                textColor={randomBg.textColor}
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
