import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminNavbar from '../components/Admin/AdminNavbar';
import AdminSidebar from '../components/Admin/AdminSidebar';

const AdminLayout: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
    const location = useLocation();

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    useEffect(() => {
        if (window.innerWidth < 768) {
            setIsSidebarOpen(false);
        }
    }, [location]);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsSidebarOpen(false);
            } else {
                setIsSidebarOpen(true);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="flex min-h-screen bg-slate-50">
            <AdminSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <div 
                className={`flex-1 flex flex-col transition-all duration-300 ease-in-out
                            ${isSidebarOpen ? 'md:pl-64' : 'md:pl-0'} pl-0`}
            >
                <AdminNavbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
                <main className="p-4 sm:p-6 lg:p-8 flex-grow">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;