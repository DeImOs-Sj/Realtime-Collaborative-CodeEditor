import React, { useState } from 'react';

const Dropdown = () => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);

    // Function to toggle the dropdown
    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen);
    };

    // Close the dropdown when clicking outside of it
    const handleWindowClick = (event) => {
        if (!event.target.closest('#dropdown-button') && !event.target.closest('#dropdown-menu')) {
            setDropdownOpen(false);
        }
    };

    // Attach click event listener to the window
    // This is necessary to close the dropdown when clicking outside of it
    window.addEventListener('click', handleWindowClick);

    return (
        <div className="absolute  pt-2 pr-[9rem]  top-0 right-0  z-50">
            <button
                id="dropdown-button"
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
                onClick={toggleDropdown}
            >
                Language
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 ml-2 -mr-1" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M6.293 9.293a1 1 0 011.414 0L10 11.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </button>
            <div
                id="dropdown-menu"
                className={`origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 ${isDropdownOpen ? '' : 'hidden'}`}
            >
                <div className="py-2 p-2 cursor-pointer" role="menu" aria-orientation="vertical" aria-labelledby="dropdown-button">
                    <p>C</p>
                    <p>C++</p>
                    <p>Java</p>

                    <p>Javascript</p>




                </div>
            </div>
        </div>
    );
};

export default Dropdown;
