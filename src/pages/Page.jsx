import React, { useState, useEffect } from "react";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS, INLINES, MARKS } from "@contentful/rich-text-types";
import { NavBar } from "../common/NavBar.jsx";
import { ImagePopUp } from "../reusable components/imagePopUp.jsx"; // Removed Loader import

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
    background,
    selectedImage,
    selectedImageTitle,
    externalExhibitionLink,
    externalTextLink,
    externalMediaLink,
    textColor,
}) => {
    const [imagesLoaded, setImagesLoaded] = useState(0);
    const totalImages = imageContent?.length + (selectedImage ? 1 : 0); // Count the selected image for homepage

    // Function to handle image loading completion
    const handleImageLoad = (imageSrc) => {
        console.log("Image Loaded:", imageSrc); // Log the image source to verify the loading
        setImagesLoaded((prev) => prev + 1);
    };

    // Effect to check if all images have loaded
    useEffect(() => {
        console.log("Images Loaded:", imagesLoaded); // Debugging the images loaded state
        console.log("Total Images:", totalImages); // Debugging the total image count

        // If the number of loaded images matches the total number of images
        if (imagesLoaded === totalImages) {
            console.log("All images are loaded!");
        }
    }, [imagesLoaded, totalImages]);

    // Preload images before rendering
    useEffect(() => {
        const preloadImages = () => {
            const imagesToPreload = [
                selectedImage,
                ...imageContent.map(image => image.fields?.file?.url),
            ];
            imagesToPreload.forEach((src) => {
                const img = new Image();
                img.src = src;
                img.onload = () => handleImageLoad(src); // Trigger the image load handler
                img.onerror = (e) => console.error("Image Error:", e.target.src);
            });
        };

        preloadImages();
    }, [imageContent, selectedImage]); // Trigger when images or selected image change

    const options = {
        renderMark: {
            [MARKS.BOLD]: (text) => <strong>{text}</strong>,
            [MARKS.ITALIC]: (text) => <em>{text}</em>,
        },
        renderNode: {
            [BLOCKS.HEADING_1]: (node, children) => <h1 className="text-4xl font-bold mb-4">{children}</h1>,
            [BLOCKS.HEADING_2]: (node, children) => <h2 className="text-3xl font-semibold mb-4">{children}</h2>,
            [BLOCKS.HEADING_3]: (node, children) => <h3 className="text-2xl font-medium mb-4">{children}</h3>,
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
            className={`relative min-h-screen ${isHomePage ? "bg-cover bg-center" : "bg-white"}`}
            style={{
                backgroundImage: isHomePage ? `url("${background.image}")` : "none",
                color: textColor || "black",
            }}
        >
            <div className="py-16">
                <NavBar menuItems={menuItems} textColor={textColor || "black"} />
            </div>

            <div className="pt-20 px-4 md:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="grid grid-cols-1 gap-4 font-serif">

                        {/* Homepage Selected Image */}
                        {selectedImage && isHomePage && (
                            <div className="relative">
                                <h2 style={{ color: textColor || "black" }} className="text-base">
                                    {selectedImageTitle}
                                </h2>

                                {/* Check if it's an image or video */}
                                {isImage(selectedImage) ? (
                                    <ImagePopUp
                                        src={selectedImage}
                                        alt={selectedImageTitle}
                                        className="w-full h-auto mx-auto"
                                        onLoad={() => handleImageLoad(selectedImage)} // Increment the loaded images counter when the image loads
                                        onError={(e) => (e.target.style.display = "none")}
                                    />
                                ) : isVideo(selectedImage) ? (
                                    <div className="relative">
                                        <h3 style={{ color: textColor || "black" }} className="text-base">
                                            {selectedImageTitle}
                                        </h3>
                                        <video controls className="w-full h-auto mx-auto">
                                            <source src={selectedImage} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                    </div>
                                ) : null}
                            </div>
                        )}

                        {/* Image or Video Gallery */}
                        {!isHomePage &&
                            imageContent?.length > 0 &&
                            imageContent.map((media, index) => {
                                const mediaUrl = media.fields?.file?.url;
                                return (
                                    <div key={index} className="my-4">
                                        {/* Check if it's an image or video */}
                                        {isImage(mediaUrl) ? (
                                            <ImagePopUp
                                                src={mediaUrl}
                                                alt={media.fields?.title || "Page Image"}
                                                className="w-full h-auto mx-auto"
                                                onLoad={() => handleImageLoad(mediaUrl)} // Increment the loaded images counter when the image loads
                                                onError={(e) => (e.target.style.display = "none")}
                                            />
                                        ) : isVideo(mediaUrl) ? (
                                            <div className="relative">

                                                <video controls className="w-full h-auto mx-auto">
                                                    <source src={mediaUrl} type="video/mp4" />
                                                    Your browser does not support the video tag.
                                                </video>
                                            </div>
                                        ) : null}

                                        {media.fields?.title && (
                                            <h3 style={{ color: textColor || "black" }} className="text-base italic">
                                                {media.fields.title}
                                            </h3>
                                        )}

                                        {media.fields?.description && (
                                            <p style={{ color: textColor || "black" }} className="text-sm">{media.fields.description}</p>
                                        )}
                                    </div>
                                );
                            })}

                        {/* Page Content */}
                        <div className="font-serif py-6" style={{ color: textColor || "black" }}>
                            {content && content.nodeType ? documentToReactComponents(content, options) : content}
                        </div>

                        {/* External Links */}
                        {(externalExhibitionLink || externalTextLink || externalMediaLink) && (
                            <div className="py-6">
                                <p className="font-semibold">External Links:</p>

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
