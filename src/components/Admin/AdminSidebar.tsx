import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
    HiOutlineCube, 
    HiOutlineTag, 
    HiOutlineStar, 
    HiOutlineDocumentText, 
    HiOutlineChevronDoubleLeft,
    HiOutlineChevronDoubleRight,
    HiOutlineViewGrid
} from "react-icons/hi";
import { GiSparkles } from "react-icons/gi";

interface AdminSidebarProps {
    isOpen: boolean;
    toggleSidebar: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, toggleSidebar }) => {
    const location = useLocation();

    const isActive = (path: string) => {
        return location.pathname.startsWith(path);
    };

    const sidebarNavLinks = [
        { to: "/admin/products", icon: HiOutlineCube, text: "Products" },
        { to: "/admin/categories", icon: HiOutlineTag, text: "Categories" },
        { to: "/admin/reviews", icon: HiOutlineStar, text: "Reviews" },
        { to: "/admin/content", icon: HiOutlineDocumentText, text: "Content" },
    ];

    return (
        <>
            {/* Overlay for mobile */}
            <div 
                className={`fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={toggleSidebar}
            ></div>

            <aside 
                className={`fixed top-0 left-0 h-screen bg-slate-800 text-slate-200 flex flex-col z-40 transition-all duration-300 ease-in-out
                            ${isOpen ? 'w-64 transform translate-x-0' : 'w-64 transform -translate-x-full md:w-20 md:transform-none'} 
                            max-h-screen overflow-y-auto`}
            >
                {/* Logo and Brand */}
                <div className="flex items-center justify-center h-20 border-b border-slate-700">
                    <Link to="/" className="flex items-center gap-2">
                        <GiSparkles className={`text-3xl text-indigo-400 transition-transform duration-500 ${isOpen ? 'rotate-[360deg]' : ''}`} />
                        {isOpen && <span className="text-2xl font-bold text-white whitespace-nowrap">MyApp Admin</span>}
                    </Link>
                </div>

                {/* Navigation Links */}
                <nav className="flex-grow mt-6 space-y-2">
                    {sidebarNavLinks.map(link => {
                        const Icon = link.icon;
                        return (
                            <Link
                                key={link.text}
                                to={link.to}
                                className={`flex items-center py-3 mx-3 rounded-lg transition-colors duration-200 
                                            ${isActive(link.to) 
                                                ? 'bg-indigo-600 text-white shadow-lg' 
                                                : 'text-slate-300 hover:bg-slate-700 hover:text-white'}
                                            ${isOpen ? 'px-4' : 'px-0 justify-center'}`}
                                title={isOpen ? '' : link.text}
                            >
                                <Icon className={`text-2xl ${isOpen ? 'mr-4' : ''}`} />
                                {isOpen && <span className="font-medium">{link.text}</span>}
                            </Link>
                        );
                    })}
                </nav>
                
                {/* Collapse Toggle */}
                <div className="p-4 border-t border-slate-700">
                    <button 
                        onClick={toggleSidebar} 
                        className="flex items-center justify-center w-full py-3 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white"
                        title={isOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
                    >
                        {isOpen 
                            ? <HiOutlineChevronDoubleLeft className="text-2xl" /> 
                            : <HiOutlineChevronDoubleRight className="text-2xl" />
                        }
                    </button>
                </div>
            </aside>
        </>
    );
};

export default AdminSidebar;