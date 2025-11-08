import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/Common/Sidebar';
import Header from '../../components/Common/Header';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content wrapper shifts right ONLY on desktop */}
      <div className="flex-1 flex flex-col lg:pl-80 transition-all duration-300">
        <Header setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
