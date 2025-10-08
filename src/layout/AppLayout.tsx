// AppLayout.tsx
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Header/Navbar';
import Footer from '../components/Footer/Footer';
import MobileSearchBar from '../components/Search/MobileSearchBar';

function AppLayout() {
  const location = useLocation();
  const isSearchPage = location.pathname === '/search';

  return (
    <div className="flex flex-col min-h-screen">
      {/* Conditionally render Navbar: hide on SearchPage for small screens */}
      <Navbar className={isSearchPage ? 'hidden lg:block' : ''} />
      {/* Show MobileSearchBar only on small screens and not on SearchPage */}
      {!isSearchPage && <MobileSearchBar />}
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default AppLayout;