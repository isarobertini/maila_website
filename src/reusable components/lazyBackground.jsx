import { useEffect, useState, useRef } from 'react';
import React from 'react';
export const LazyBackground = ({ imageUrl, children }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const bgRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setIsLoaded(true);
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
                height: '100vh', // Set the height as needed
                transition: 'background-image 1s ease',
            }}
        >
            {children}
        </div>
    );
};


