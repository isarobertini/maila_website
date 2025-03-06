import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const NavBar = ({ menuItems, textColor }) => {
    const location = useLocation();

    return (
        <nav className={`font-mono absolute top-0 left-0 w-full z-50 py-8 ${textColor}`}>
            <ul className="flex justify-center space-x-6 flex-wrap px-4">
                {menuItems.map((item) => (
                    <li key={item.id}>
                        <Link
                            to={item.slug}
                            className={`font-semibold hover:underline transition ${location.pathname === item.slug ? 'underline' : ''}`}
                        >
                            — {item.title}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
};
