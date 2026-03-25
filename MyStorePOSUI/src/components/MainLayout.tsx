import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';

const MainLayout = () => {
  // Desktop: open by default (true). Mobile: closed by default (false).
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar Component */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        {/* Top Navbar */}
        <header className="bg-white shadow-sm h-16 flex items-center px-4 z-20 shrink-0">
          <button 
            onClick={toggleSidebar}
            className="p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none transition-colors"
          >
            <Menu size={24} />
          </button>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          <main className="flex-1 p-4 md:p-8">
            <Outlet />
          </main>

          {/* Professional Footer with Centered Copyright */}
          <footer className="py-4 px-8 border-t border-gray-200 bg-white/50 backdrop-blur-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 items-center text-xs text-gray-500 font-medium tracking-wide">
              
              {/* Left Spacer (Hidden on mobile to keep things centered) */}
              <div className="hidden md:block"></div>

              {/* Centered Copyright */}
              <div className="text-center">
                <p>© 2026 Star Link Trading. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;