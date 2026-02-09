/**
 * Global Footer Component
 * Displays copyright and system version information.
 */
import React from 'react';

/**
 * Functional component for the global application footer.
 * @returns {JSX.Element} The rendered footer component.
 */
export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white border-t border-gray-200 py-4 px-6 mt-auto relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-center text-[13px]">
                <div className="hidden md:block flex-1"></div>
                <div className="flex-1 text-center whitespace-nowrap">
                    <span className="font-bold text-gray-900">Copyright © {currentYear}</span>{' '}
                    <a href="#" className="text-[#3c8dbc] font-bold hover:text-[#23527c]">Darul-Ulum School</a>
                    <span className="text-gray-900"> . All rights reserved.</span>
                </div>
                <div className="flex-1 text-right text-gray-900">
                    <span className="font-bold">Version</span> <span className="text-gray-600">1.0</span>
                </div>
            </div>
        </footer>
    );
}
