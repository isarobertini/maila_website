import React, { useState } from 'react';

export const ImagePopUp = ({ src, alt, className, style, ...rest }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleImageClick = (event) => {
        // Prevent dropdown from closing when the image is clicked
        event.stopPropagation();  // Stop click event from propagating to the parent
        setIsModalOpen(true); // Open the modal
    };

    const handleCloseModal = () => {
        setIsModalOpen(false); // Close the modal
    };

    return (
        <>
            {/* Image element */}
            <img
                src={src}
                alt={alt}
                className={`z-10 cursor-pointer ${className}`} // Lower z-index for the image itself
                style={style}
                onClick={handleImageClick} // Open modal on click
                {...rest}
            />

            {/* Modal for enlarged image */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50"> {/* Full-screen modal backdrop */}
                    <div className="relative p-4">
                        <button
                            onClick={handleCloseModal}
                            className="cursor-pointer absolute top-3 right-7 text-black text-2xl z-60" // Close button
                        >
                            &times; {/* Close button */}
                        </button>
                        <img
                            src={src}
                            alt={alt}
                            className="max-w-screen max-h-screen object-contain" // Ensure the image fits within the screen
                        />
                    </div>
                </div>
            )}
        </>
    );
};