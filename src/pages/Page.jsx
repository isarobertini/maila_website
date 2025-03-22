import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS, INLINES, MARKS } from "@contentful/rich-text-types";
import { NavBar } from "../common/NavBar.jsx";
import { ImagePopUp } from "../reusable components/imagePopUp.jsx";

// Function to check if a file is an image or video
const isImage = (url) => ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(url?.split('.').pop().toLowerCase());
const isVideo = (url) => ['mov', 'mp4', 'webm'].includes(url?.split('.').pop().toLowerCase());

export const Page = ({
    title,
    content,
    imageContent,
    menuItems,
    isHomePage,
    externalExhibitionLink,
    externalTextLink,
    externalMediaLink,
    textColor,
}) => {
    // Error state to handle any rendering or content issues
    const [error, setError] = useState(null);

    // Define custom rendering options for Contentful rich text
    const options = {
        renderNode: {
            [BLOCKS.PARAGRAPH]: (node, children) => {
                // If Contentful sends an empty paragraph (new line), render a break tag
                if (!children || children.length === 0 || children[0] === "") {
                    return <br />;
                }
                return <p className="whitespace-pre-wrap leading-relaxed my-4">{children}</p>;
            },
            [BLOCKS.HEADING_1]: (node, children) => <h1 className="text-4xl font-bold my-6">{children}</h1>,
            [BLOCKS.HEADING_2]: (node, children) => <h2 className="text-3xl font-semibold my-5">{children}</h2>,
            [BLOCKS.HEADING_3]: (node, children) => <h3 className="text-2xl font-medium my-4">{children}</h3>,
            [BLOCKS.HEADING_4]: (node, children) => <h4 className="text-xl font-semibold my-3">{children}</h4>,
            [BLOCKS.HEADING_5]: (node, children) => <h5 className="text-lg font-medium my-2">{children}</h5>,
            [INLINES.HYPERLINK]: (node, children) => (
                <a href={node.data.uri} className="text-blue-500 underline" target="_blank" rel="noopener noreferrer">
                    {children}
                </a>
            ),
        },
    };

    // If there's an error, display an error message
    if (error) {
        return (
            <div className="error-message">
                <h1>{error}</h1>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-white" style={{ color: textColor || "black" }}>

            {/* Dynamic SEO Metadata */}
            <Helmet>
                <title>{title ? `${title} | Susanna Maila` : "Susanna Maila"}</title>
                <meta
                    name="description"
                    content={content ? content.slice(0, 150) : "Susanna Maila is a painter born in Sweden, currently working between Berlin and Vienna."}
                />
                <meta
                    name="keywords"
                    content="Susanna Maila, art, artist, exhibition, gallery, paintings, Academy of Fine Arts Vienna"
                />
                <meta name="author" content="Susanna Maila" />
                {imageContent?.[0]?.fields?.file?.url && (
                    <meta property="og:image" content={imageContent[0].fields.file.url} />
                )}
                <meta property="og:title" content={title} />
                <meta
                    property="og:description"
                    content={content ? content.slice(0, 150) : "Susanna Maila is a painter born in Sweden, currently working between Berlin and Vienna."}
                />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={window.location.href} />
                <meta property="og:site_name" content="Susanna Maila" />
                <meta property="og:locale" content="en_US" />
            </Helmet>

            <div className="py-16">
                <NavBar menuItems={menuItems} textColor={textColor || "black"} />
            </div>

            <div className="pt-20 px-4 md:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="grid grid-cols-1 gap-4 font-serif">
                        {/* Render images/videos */}
                        {imageContent?.map((media, index) => {
                            try {
                                const mediaUrl = media.fields?.file?.url;
                                const title = media.fields?.title;

                                if (!mediaUrl) throw new Error('Media URL is missing');

                                return (
                                    <div key={index} className="my-4">
                                        {isImage(mediaUrl) ? (
                                            <ImagePopUp src={mediaUrl} alt={title || "Page Image"} className="w-full h-auto mx-auto" />
                                        ) : isVideo(mediaUrl) ? (
                                            <video controls className="w-full h-auto mx-auto">
                                                <source src={mediaUrl} type="video/mp4" />
                                                Your browser does not support the video tag.
                                            </video>
                                        ) : null}
                                        {title && title !== 'empty123' && <h3 className="text-sm">{title}</h3>}
                                        {media.fields?.description && <p className="text-xs">{media.fields.description}</p>}
                                    </div>
                                );
                            } catch (error) {
                                // Set error state in case media URL is missing or there's another issue
                                setError('Failed to load media content');
                                return null;
                            }
                        })}

                        {/* Render Page Content */}
                        <div className="space-y-4 font-serif py-6">
                            {content ? documentToReactComponents(content, options) : ''}
                        </div>

                        {/* External Links */}
                        {(externalExhibitionLink || externalTextLink || externalMediaLink) && (
                            <div className="py-6 text-sm">
                                <p>External Links:</p>
                                {externalExhibitionLink && (
                                    <div className="py-2">
                                        <a href={externalExhibitionLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                            {externalExhibitionLink}
                                        </a>
                                    </div>
                                )}
                                {externalTextLink && (
                                    <div className="py-2">
                                        <a href={externalTextLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                            {externalTextLink}
                                        </a>
                                    </div>
                                )}
                                {externalMediaLink && (
                                    <div className="py-2">
                                        <a href={externalMediaLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
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
