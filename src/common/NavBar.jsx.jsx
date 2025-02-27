import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const NavBar = ({ menuItems }) => {
    const location = useLocation(); // Get the current location

    return (
        <nav className="font-mono absolute top-0 left-0 w-full bg-transparent text-black z-10 py-4">
            <ul className="flex justify-center space-x-6 flex-wrap px-4">
                {menuItems.map((item) => (
                    <li key={item.id}>
                        <Link
                            to={item.slug}
                            className={`font-medium hover:underline transition ${location.pathname === item.slug ? 'underline' : ''
                                }`}
                        >
                            {item.title}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
};
