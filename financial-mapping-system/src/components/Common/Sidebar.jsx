import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PieChart, List, BarChart3, LogOut, Download, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const { logout, user } = useAuth();

  // All navigation items and the icon component each should use
  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: PieChart },
    { path: '/transactions', label: 'Transactions', icon: List },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/excel-download', label: 'Excel Download', icon: Download },
  ];

  // Helper to check which menu item is active
  const isActive = (path) => location.pathname === path;

  return (
    <div>
      {/* Dark backdrop overlay for mobile, closes sidebar on click */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <div
        className={`
          fixed top-0 left-0 z-50 bg-white border-r border-gray-200
          h-screen w-80 flex flex-col
          transform transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} /* Slide in on mobile */
          lg:translate-x-0 /* Always visible on large screens */
        `}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 lg:justify-start">
          <h2 className="text-xl font-bold text-gray-900">Financial Mapping</h2>

          {/* Mobile close button */}
          <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X size={22} />
          </button>
        </div>

        {/* Navigation menu */}
        <nav className="flex-1 py-4 space-y-1">
          {menuItems.map((item) => {
            // Assign icon for lint correctness
            const IconComp = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)} // Auto-close on mobile
                className={`group flex items-center gap-3 px-6 py-3 mx-2 rounded-lg relative overflow-hidden
                  transition-all duration-300
                  ${isActive(item.path) ? 'text-white font-semibold' : 'text-gray-600 hover:text-gray-800'}
                `}
              >
                {/* Animated highlight background */}
                <span
                  className={`
                    absolute inset-0 rounded-lg transition-all duration-300
                    ${isActive(item.path)
                      ? 'bg-blue-600 scale-100' // Active state
                      : 'bg-blue-600 scale-0 group-hover:scale-100 opacity-20'} // Hover animation
                  `}
                ></span>

                {/* Icon + hover animation */}
                <IconComp
                  size={20}
                  className="relative z-10 transition-transform duration-200 group-hover:scale-110"
                />

                {/* Label text */}
                <span className="relative z-10">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3 mb-4">
            {/* User initial bubble */}
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>

            <div className="min-w-0">
              <div className="font-semibold text-gray-900 truncate">{user?.name || 'User'}</div>
              <div className="text-xs text-gray-500 truncate">{user?.email || ''}</div>
            </div>
          </div>

          {/* Logout button */}
          <button
            onClick={logout}
            className="flex items-center gap-2 w-full px-4 py-2 rounded-lg bg-white border 
              hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
