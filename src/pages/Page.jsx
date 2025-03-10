import React from 'react';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES, MARKS } from '@contentful/rich-text-types';
import { NavBar } from '../common/NavBar.jsx';
import { ImagePopUp } from '../reusable components/imagePopUp.jsx';

export const Page = ({
    title,
    content,
    imageContent,
    menuItems,
    isHomePage,
    background,
    selectedImage,
    selectedImageTitle,
    externalExhibitionLink,
    externalTextLink,
    externalMediaLink,
    textColor, // Now accepting textColor as a prop
}) => {
    console.log("Page Content:", content);
    console.log("Selected Background:", background);
    console.log("Text Color:", textColor);
    console.log("External Exhibition Link:", externalExhibitionLink);
    console.log("External Text Link:", externalTextLink);
    console.log("External Media Link:", externalMediaLink);

    // Define rich text rendering options
    const options = {
        renderMark: {
            [MARKS.BOLD]: (text) => <strong>{text}</strong>,
            [MARKS.ITALIC]: (text) => <em>{text}</em>,
        },
        renderNode: {
            [BLOCKS.HEADING_1]: (node, children) => <h1 className="text-4xl font-bold mb-4">{children}</h1>,
            [BLOCKS.HEADING_2]: (node, children) => <h2 className="text-3xl font-semibold mb-4">{children}</h2>,
            [BLOCKS.HEADING_3]: (node, children) => <h3 className="text-2xl font-medium mb-4">{children}</h3>,
            [BLOCKS.PARAGRAPH]: (node, children) => <p className="text-base leading-relaxed mb-4">{children}</p>, // Added mb-4
            [INLINES.HYPERLINK]: (node, children) => (
                <a
                    href={node.data.uri}
                    className="text-blue-500 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {children}
                </a>
            ),
        },
    };


    return (
        <div
            className={`relative min-h-screen ${isHomePage ? "bg-cover bg-center" : "bg-white"}`}
            style={{
                backgroundImage: isHomePage ? `url("${background.image}")` : "none",
                color: textColor || "black", // Apply dynamic text color
            }}
        >
            {/* Navigation Bar */}
            <div className='py-16'>
                <NavBar menuItems={menuItems} textColor={textColor || "black"} />
            </div>

            {/* Page Content */}
            <div className="pt-20 px-4 md:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="grid grid-cols-1 gap-4 font-serif">

                        {/* Display only the selected image and title on the homepage */}
                        {selectedImage && isHomePage && (
                            <div>
                                <h2 style={{ color: textColor || "black" }} className='text-base'>{selectedImageTitle}</h2>
                                <ImagePopUp
                                    src={selectedImage}
                                    alt={selectedImageTitle}
                                    className="w-full h-auto mx-auto"
                                    onError={(e) => e.target.style.display = 'none'}
                                />
                            </div>
                        )}

                        {/* Display all images on other pages */}
                        {!isHomePage && imageContent?.length > 0 && (
                            imageContent.map((image, index) => (
                                <div key={index} className="my-4">
                                    {/* Display image */}
                                    <ImagePopUp
                                        src={image.fields?.file?.url}
                                        alt={image.fields?.title || "Page Image"}
                                        className="w-full h-auto mx-auto"
                                        onError={(e) => e.target.style.display = 'none'}
                                    />

                                    {/* Display image title */}
                                    {image.fields?.title && (
                                        <h3 style={{ color: textColor || "black" }} className="text-base italic">{image.fields.title}</h3>
                                    )}

                                    {/* Display image description */}
                                    {image.fields?.description && (
                                        <p style={{ color: textColor || "black" }} className="text-sm">{image.fields.description}</p>
                                    )}
                                </div>
                            ))
                        )}

                        {/* Display content with rich text formatting */}
                        <div className="font-serif py-6" style={{ color: textColor || "black" }}>
                            {content && content.nodeType
                                ? documentToReactComponents(content, options) // Use options here
                                : content // If not rich text, display as is
                            }
                        </div>

                        {/* Display the external links */}
                        {(externalExhibitionLink || externalTextLink || externalMediaLink) && (
                            <div className="py-6">
                                <p className="font-semibold">External Links:</p>

                                {/* External Exhibition Link */}
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

                                {/* External Text Link */}
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

                                {/* External Media Link */}
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
