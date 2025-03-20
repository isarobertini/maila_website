import React, { useState, useEffect } from "react";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS, INLINES, MARKS } from "@contentful/rich-text-types";
import { NavBar } from "../common/NavBar.jsx";
import { ImagePopUp } from "../reusable components/imagePopUp.jsx";

// Function to check the file extension to determine if it's an image or video
const isImage = (url) => {
    return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(url?.split('.').pop().toLowerCase());
}

const isVideo = (url) => {
    return ['mov', 'mp4', 'webm'].includes(url?.split('.').pop().toLowerCase());
}

export const Page = ({
    title,
    content,
    imageContent,
    menuItems,
    isHomePage,
    selectedImage,
    selectedImageTitle,
    externalExhibitionLink,
    externalTextLink,
    externalMediaLink,
    textColor,
}) => {

    const options = {
        renderMark: {
            [MARKS.BOLD]: (text) => <strong>{text}</strong>,
            [MARKS.ITALIC]: (text) => <em>{text}</em>,
        },
        renderNode: {
            [BLOCKS.HEADING_1]: (node, children) => <h1 className="text-4xl font-bold mb-4">{children}</h1>,
            [BLOCKS.HEADING_2]: (node, children) => <h2 className="text-3xl font-semibold mb-4">{children}</h2>,
            [BLOCKS.HEADING_3]: (node, children) => <h3 className="text-2xl font-medium mb-4">{children}</h3>,
            [BLOCKS.HEADING_4]: (node, children) => <h4 className="text-xl font-semibold mb-4">{children}</h4>,
            [BLOCKS.HEADING_5]: (node, children) => <h5 className="text-lg font-medium mb-4">{children}</h5>,
            [BLOCKS.PARAGRAPH]: (node, children) => <p className="text-base leading-relaxed mb-6">{children}</p>,
            [INLINES.HYPERLINK]: (node, children) => (
                <a href={node.data.uri} className="text-blue-500 underline" target="_blank" rel="noopener noreferrer">
                    {children}
                </a>
            ),
        },
    };

    return (
        <div
            className="relative min-h-screen bg-white"
            style={{
                color: textColor || "black",
            }}
        >
            <div className="py-16">
                <NavBar menuItems={menuItems} textColor={textColor || "black"} />
            </div>

            <div className="pt-20 px-4 md:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="grid grid-cols-1 gap-4 font-serif">

                        {/* For the Homepage: Loop through all images */}
                        {isHomePage && imageContent?.length > 0 && (
                            <div className="my-4">
                                {imageContent.map((media, index) => {
                                    const mediaUrl = media.fields?.file?.url;
                                    const title = media.fields?.title;

                                    return (
                                        <div key={index} className="my-4">
                                            {/* Check if it's an image */}
                                            {isImage(mediaUrl) ? (
                                                <ImagePopUp
                                                    src={mediaUrl}
                                                    alt={title || "Page Image"}
                                                    className="w-full h-auto mx-auto"
                                                />
                                            ) : isVideo(mediaUrl) ? (
                                                <div className="relative">
                                                    <video controls className="w-full h-auto mx-auto">
                                                        <source src={mediaUrl} type="video/mp4" />
                                                        Your browser does not support the video tag.
                                                    </video>
                                                </div>
                                            ) : null}

                                            {/* Check if title is not "empty", then display it */}
                                            {title && title !== 'empty123' && (
                                                <h3 style={{ color: textColor || 'black' }} className="text-sm">
                                                    {title}
                                                </h3>
                                            )}

                                            {media.fields?.description && (
                                                <p style={{ color: textColor || 'black' }} className="text-xs">
                                                    {media.fields.description}
                                                </p>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* For other pages, display the images and videos as before */}
                        {!isHomePage && imageContent?.length > 0 && (
                            imageContent.map((media, index) => {
                                const mediaUrl = media.fields?.file?.url;
                                const title = media.fields?.title;

                                return (
                                    <div key={index} className="my-4">
                                        {/* Check if it's an image */}
                                        {isImage(mediaUrl) ? (
                                            <ImagePopUp
                                                src={mediaUrl}
                                                alt={title || "Page Image"}
                                                className="w-full h-auto mx-auto"
                                            />
                                        ) : isVideo(mediaUrl) ? (
                                            <div className="relative">
                                                <video controls className="w-full h-auto mx-auto">
                                                    <source src={mediaUrl} type="video/mp4" />
                                                    Your browser does not support the video tag.
                                                </video>
                                            </div>
                                        ) : null}

                                        {/* Check if title is not "empty", then display it */}
                                        {title && title !== 'empty' && (
                                            <h3 style={{ color: textColor || 'black' }} className="text-sm">
                                                {title}
                                            </h3>
                                        )}

                                        {media.fields?.description && (
                                            <p style={{ color: textColor || 'black' }} className="text-xs">
                                                {media.fields.description}
                                            </p>
                                        )}
                                    </div>
                                );
                            })
                        )}

                        {/* Page Content */}
                        <div className="font-serif py-6" style={{ color: textColor || "black" }}>
                            {content && content.nodeType ? documentToReactComponents(content, options) : content}
                        </div>

                        {/* External Links */}
                        {(externalExhibitionLink || externalTextLink || externalMediaLink) && (
                            <div className="py-6 text-sm">
                                <p className="">External Links:</p>

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
