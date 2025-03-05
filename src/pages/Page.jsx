import React from 'react';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { NavBar } from '../common/NavBar.jsx';
import { ImagePopUp } from '../reusable components/imagePopUp.jsx';

export const Page = ({ title, content, imageContent, menuItems, isHomePage, background, externalExhibitionLink, externalTextLink, externalMediaLink }) => {
    console.log("Page Content:", content);
    console.log("External Exhibition Link:", externalExhibitionLink);
    console.log("External Text Link:", externalTextLink);
    console.log("External Media Link:", externalMediaLink);

    return (
        <div
            className={`relative min-h-screen ${isHomePage ? "bg-cover bg-center" : "bg-white"}`}
            style={isHomePage ? { backgroundImage: `url("${background.image}")` } : {}}
        >
            <div className='py-16'>
                <NavBar menuItems={menuItems} textColor={isHomePage ? background.textColor : "text-black"} />
            </div>
            <div className="pt-20 px-4 md:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="grid grid-cols-1 gap-4">
                        {/* Display only one image on the homepage */}
                        {imageContent?.length > 0 && isHomePage ? (
                            <ImagePopUp
                                key={0}
                                src={imageContent[0]} // Display only the first image
                                alt="Home Page Image"
                                className="w-full h-auto mx-auto"
                                onError={(e) => e.target.style.display = 'none'} // Hide broken images
                            />
                        ) : null}

                        {/* Display all images on other pages */}
                        {!isHomePage && imageContent?.length > 0 ? (
                            imageContent.map((image, index) => (
                                <ImagePopUp
                                    key={index}
                                    src={image}
                                    alt="Page Image"
                                    className="w-full h-auto mx-auto"
                                    onError={(e) => e.target.style.display = 'none'}
                                />
                            ))
                        ) : null}

                        {/* Display content */}
                        <div className="font-serif py-6">
                            {content && content.nodeType
                                ? documentToReactComponents(content) // Render rich text
                                : content // If not rich text, display as is
                            }
                        </div>

                        {/* Display the external link if available (underneath the content) */}
                        {(externalExhibitionLink || externalTextLink || externalMediaLink) && (
                            <div className="py-6">
                                <p className="font-semibold">External Links:</p>

                                {/* Display external exhibition link */}
                                {externalExhibitionLink && (
                                    <div className="py-2">
                                        <a
                                            href={externalExhibitionLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 hover:underline"
                                        >
                                            {externalExhibitionLink}
                                        </a>
                                    </div>
                                )}

                                {/* Display external text link */}
                                {externalTextLink && (
                                    <div className="py-2">
                                        <a
                                            href={externalTextLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 hover:underline"
                                        >
                                            {externalTextLink}
                                        </a>
                                    </div>
                                )}

                                {/* Display external media link */}
                                {externalMediaLink && (
                                    <div className="py-2">
                                        <a
                                            href={externalMediaLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 hover:underline"
                                        >
                                            {externalMediaLink}
                                        </a>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
