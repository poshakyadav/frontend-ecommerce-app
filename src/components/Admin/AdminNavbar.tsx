import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { HiOutlineMenuAlt1, HiOutlineLogout, HiOutlineUserCircle, HiOutlineCog } from "react-icons/hi";

interface AdminNavbarProps {
    toggleSidebar: () => void;
    isSidebarOpen: boolean;
}

const AdminNavbar: React.FC<AdminNavbarProps> = ({ toggleSidebar, isSidebarOpen }) => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileMenuRef = useRef<HTMLDivElement>(null);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="sticky top-0 bg-white shadow-sm z-20">
            <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
                {!isSidebarOpen && (
                    <button 
                        onClick={toggleSidebar} 
                        className="text-slate-600 hover:text-indigo-600"
                        title="Toggle Menu"
                    >
                        <HiOutlineMenuAlt1 size={24} />
                    </button>
                )}
                <div className="flex-1"></div>
                <div className="relative" ref={profileMenuRef}>
                    <button 
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center gap-2 text-left rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <span className="hidden sm:inline-block font-medium text-slate-700 text-sm">
                            {user?.username || 'Admin'}
                        </span>
                        <HiOutlineUserCircle className="w-9 h-9 text-slate-600" />
                    </button>
                    {isProfileOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 origin-top-right transition-transform transform-gpu duration-200 ease-out">
                            <div className="px-4 py-2 text-sm text-slate-700 border-b">
                                <p className="font-semibold">Signed in as</p>
                                <p className="truncate">{user?.email}</p>
                            </div>
                            <Link to="/admin/profile" className="flex items-center w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">
                                <HiOutlineCog className="mr-3 h-5 w-5" />
                                Your Profile
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                                <HiOutlineLogout className="mr-3 h-5 w-5" />
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default AdminNavbar;