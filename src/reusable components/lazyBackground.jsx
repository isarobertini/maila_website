import { useEffect, useState, useRef } from 'react';
import React from 'react';

export const LazyBackground = ({ imageUrl, children }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [loading, setLoading] = useState(true); // Add a loading state
    const bgRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setIsLoaded(true);
                    setLoading(false);  // Set loading to false once the image is loaded
                    observer.disconnect();
                }
            });
        }, { threshold: 0.1 });

        if (bgRef.current) {
            observer.observe(bgRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={bgRef}
            style={{
                backgroundImage: isLoaded ? `url(${imageUrl})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '100vh',
                transition: 'background-image 1s ease',
                position: 'relative',
            }}
        >
            {/* Show loading spinner or placeholder */}
            {loading && (
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: '2rem',
                    color: '#fff',
                }}>
                    Loading...
                </div>
            )}

            {children}
        </div>
    );
};
