import React from "react";
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

    return (
        <div className="relative min-h-screen bg-white" style={{ color: textColor || "black" }}>
            <div className="py-16">
                <NavBar menuItems={menuItems} textColor={textColor || "black"} />
            </div>

            <div className="pt-20 px-4 md:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="grid grid-cols-1 gap-4 font-serif">
                        {/* Render images/videos */}
                        {imageContent?.map((media, index) => {
                            const mediaUrl = media.fields?.file?.url;
                            const title = media.fields?.title;
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
                        })}

                        {/* Render Page Content */}
                        <div className="space-y-4 font-serif py-6">
                            {content && documentToReactComponents(content, options)}
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
