import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation

export const NavigationMenu = () => {
    const [navigationMenu, setNavigationMenu] = useState(null);

    // Contentful configuration
    const SPACE_ID = "xci2wmmpcz5n"; // Replace with your actual Space ID
    const ACCESS_TOKEN = "afcEwS502C4mU6KotfYmYe6stBCKnx5U0dLUYQldBXM"; // Replace with your actual Content Delivery API token
    const ENTRY_ID = "35A1RseZVblkDas5aGV4qx"; // Your Navigation Menu entry ID

    // Fetch data from Contentful
    const fetchNavigationMenu = async () => {
        try {
            const response = await fetch(
                `https://cdn.contentful.com/spaces/${SPACE_ID}/environments/master/entries/${ENTRY_ID}`,
                {
                    headers: {
                        "Authorization": `Bearer ${ACCESS_TOKEN}`,
                    },
                }
            );

            const data = await response.json();
            setNavigationMenu(data.fields); // Set the fetched data to state
        } catch (error) {
            console.error("Error fetching navigation menu:", error);
        }
    };

    // Fetch navigation data when the component mounts
    useEffect(() => {
        fetchNavigationMenu();
    }, []);

    if (!navigationMenu) {
        return <div>Loading...</div>; // Show loading until data is fetched
    }

    return (
        <div>
            <h1>{navigationMenu.title}</h1> {/* Display the title from Contentful */}
            <ul>
                {navigationMenu.items.map((item, index) => (
                    <li key={index}>
                        {/* Use Link to create dynamic navigation */}
                        <Link to={`${navigationMenu.slug}/${item.toLowerCase()}`}>{item}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

