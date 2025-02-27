// YourOtherPage.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const SPACE_ID = "xci2wmmpcz5n"; // Your Contentful Space ID
const ACCESS_TOKEN = "afcEwS502C4mU6KotfYmYe6stBCKnx5U0dLUYQldBXM"; // Your Contentful Access Token

export const YourOtherPage = ({ slug, title }) => {
    const [content, setContent] = useState(null);

    // Fetch the content for a specific page based on its slug
    useEffect(() => {
        const fetchPageContent = async () => {
            try {
                const response = await axios.get(
                    `https://cdn.contentful.com/spaces/${SPACE_ID}/entries?content_type=page&fields.slug=${slug}`,
                    {
                        headers: {
                            Authorization: `Bearer ${ACCESS_TOKEN}`,
                        },
                    }
                );

                const pageContent = response.data.items[0]?.fields.content; // Assuming content is stored in 'content' field
                setContent(pageContent);
            } catch (error) {
                console.error("Error fetching page content", error);
            }
        };

        fetchPageContent();
    }, [slug]);

    if (!content) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{title}</h1>
            <div>{content}</div> {/* Render the page content here */}
        </div>
    );
};


