import React from 'react';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { useLocation } from 'react-router-dom';
import { NavBar } from '../common/NavBar.jsx'; // Import NavBar here
import { ImagePopUp } from '../reusable components/imagePopUp.jsx';

export const Page = ({ title, content, imageContent, menuItems }) => {
    const location = useLocation(); // Get the current URL path
    const isHomePage = location.pathname === '/'; // Check if it's the homepage

    return (
        <div
            className={`${isHomePage ? 'bg-cover bg-center' : 'bg-none'} relative min-h-screen`}
            style={{
                backgroundImage: isHomePage ? 'url("")' : 'none',
            }}
        >
            {/* Render NavBar inside Page */}
            <div className='py-16 md:py-6'>
                <NavBar menuItems={menuItems} />
            </div>
            <div className="lg:pt-20 px-4 md:px-8"> {/* Added padding for proper spacing */}
                {/* Flex container for images and text */}
                <div className="max-w-4xl mx-auto"> {/* Center content within the max-width */}
                    {/* Image Gallery */}
                    <div className="grid grid-cols-1 gap-4">
                        {imageContent && imageContent.length > 0 ? (
                            imageContent.map((image, index) => (
                                <ImagePopUp
                                    key={index}
                                    src={image.fields.file.url}
                                    alt={image.fields.title || 'Image'}
                                    className="w-full h-auto mx-auto" // Center images and make them responsive
                                />
                            ))
                        ) : (
                            ""
                        )}
                        <div className="font-serif py-6"> {/* Added padding on mobile */}
                            {content && content.nodeType ? documentToReactComponents(content) : content}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};
