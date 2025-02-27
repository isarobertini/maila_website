import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { createClient } from "contentful";
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

// Fetching credentials from the environment variables
const client = createClient({
  space: import.meta.env.VITE_SPACE_ID, // Fetch space ID from .env
  accessToken: import.meta.env.VITE_ACCESS_TOKEN, // Fetch access token from .env
});

export default function App() {
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    async function fetchNavigationItems() {
      try {
        const response = await client.getEntries({
          content_type: "navigationMenu", // Matches Contentful model ID
          order: "fields.order", // Sort by order field
        });

        // Map entries to usable menu items
        const items = response.items.map((item) => ({
          id: item.sys.id,
          title: item.fields.title || "Untitled",
          slug: item.fields.slug || "/new-page",
          content: item.fields.content || "This is a default page.",
          order: item.fields.order || 999, // Default to 999 if missing
          imageContent: item.fields.imageContent || [], // Handle the imageContent field
        }));

        setMenuItems(items);
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
    }

    fetchNavigationItems();
  }, []);

  return (
    <Router>
      <nav>
        <ul>
          {menuItems.map((item) => (
            <li key={item.id}>
              <Link to={item.slug}>{item.title}</Link>
            </li>
          ))}
        </ul>
      </nav>

      <Routes>
        {menuItems.map((item) => (
          <Route
            key={item.id}
            path={item.slug}
            element={<Page title={item.title} content={item.content} imageContent={item.imageContent} />}
          />
        ))}
        {/* Default homepage */}
        <Route path="/" element={<Page title="Home" content="Welcome to the homepage!" />} />
      </Routes>
    </Router>
  );
}

// Page component to render content dynamically
function Page({ title, content, imageContent }) {
  // Function to render rich text content
  const renderContent = (content) => {
    if (content && content.nodeType) {
      // Render rich text using documentToReactComponents
      return documentToReactComponents(content);
    }
    return content; // If it's not rich text, just return it as is
  };

  return (
    <div>
      <h1>{title}</h1>
      <div>{renderContent(content)}</div>

      {/* Handle image content for image gallery */}
      <div>
        {imageContent && imageContent.length > 0 ? (
          <div className="image-gallery">
            {imageContent.map((image, index) => (
              <img
                key={index}
                src={image.fields.file.url} // URL of the image
                alt={image.fields.title || "Image"} // Alt text for accessibility
                style={{ maxWidth: "100%", height: "auto", margin: "10px" }}
              />
            ))}
          </div>
        ) : (
          <p>No images available</p>
        )}
      </div>
    </div>
  );
}
