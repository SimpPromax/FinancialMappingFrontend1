// src/components/Sidebar.jsx
import React, { useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PieChart, List, BarChart3, LogOut, Download, X, FileText, Eye } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const { logout, user } = useAuth();
  const [templateExpanded, setTemplateExpanded] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipTimeoutRef = useRef(null);

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: PieChart },
    { path: '/transactions', label: 'Transactions', icon: List },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/excel-download', label: 'Excel Download', icon: Download },
  ];

  const isActive = (path) => location.pathname === path;

  const isActiveSubPath = () =>
    location.pathname === '/excellinitialiser' || location.pathname === '/viewsaveddata';

  const handleMouseMove = (e) => {
    if (!showTooltip) return;
    
    // Position tooltip with offset from cursor
    setTooltipPosition({
      x: e.clientX + 15,
      y: e.clientY + 15
    });
  };

  const handleMouseEnter = (e) => {
    // Clear any existing timeout
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
    }
    
    // Show tooltip immediately
    setShowTooltip(true);
    setTooltipPosition({
      x: e.clientX + 15,
      y: e.clientY + 15
    });
    
    // Only expand the menu on hover, don't force it
    if (!isActiveSubPath()) {
      setTemplateExpanded(true);
    }
  };

  const handleMouseLeave = () => {
    // Hide tooltip with slight delay to prevent flickering
    tooltipTimeoutRef.current = setTimeout(() => {
      setShowTooltip(false);
    }, 100);
    
    // Only collapse if not on active subpath
    if (!isActiveSubPath()) {
      setTemplateExpanded(false);
    }
  };

  const handleButtonClick = () => {
    setTemplateExpanded(!templateExpanded);
    // Hide tooltip on click since user is interacting with the menu
    setShowTooltip(false);
  };

  return (
    <div>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Tooltip - Higher z-index to appear above sidebar */}
      {showTooltip && (
        <div
          className="fixed z-100 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg shadow-lg border border-gray-700 whitespace-nowrap pointer-events-none transition-opacity duration-200"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
          }}
        >
          Sets up a clean template with the required column structure
          {/* Tooltip arrow */}
          <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
        </div>
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 z-50 bg-white border-r border-gray-200
          h-screen w-80 flex flex-col
          transform transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 lg:justify-start">
          <h2 className="text-xl font-bold text-gray-900">Financial Mapping</h2>
          <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X size={22} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 space-y-1">
          {/* Main Menu Items */}
          {menuItems.map((item) => {
            const IconComp = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`group flex items-center gap-3 px-6 py-3 mx-2 rounded-lg relative overflow-hidden transition-all duration-300 ${
                  isActive(item.path)
                    ? 'text-white font-semibold'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <span
                  className={`absolute inset-y-0 left-2 right-2 rounded-lg transition-all duration-300 ${
                    isActive(item.path)
                      ? 'bg-blue-600 scale-100'
                      : 'bg-blue-600 scale-0 group-hover:scale-100 opacity-20'
                  }`}
                />
                <IconComp
                  size={20}
                  className="relative z-10 transition-transform duration-200 group-hover:scale-110"
                />
                <span className="relative z-10">{item.label}</span>
              </Link>
            );
          })}

          {/* Prepare Template - Expandable Item */}
          <div 
            className="relative" 
            onMouseLeave={handleMouseLeave}
          >
            <button
              onClick={handleButtonClick}
              onMouseEnter={handleMouseEnter}
              onMouseMove={handleMouseMove}
              className={`group flex items-center justify-between w-full px-6 py-3 mx-2 rounded-lg relative overflow-hidden transition-all duration-300 ${
                isActiveSubPath()
                  ? 'text-white font-semibold'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              aria-expanded={templateExpanded}
            >
              <span className="flex items-center gap-3 flex-1">
                <span
                  className={`absolute inset-y-0 left-2 right-2 rounded-lg transition-all duration-300 ${
                    isActiveSubPath()
                      ? 'bg-blue-600 scale-100'
                      : 'bg-blue-600 scale-0 group-hover:scale-100 opacity-20'
                  }`}
                />
                <FileText
                  size={20}
                  className="relative z-10 transition-transform duration-200 group-hover:scale-110"
                />
                <span className="relative z-10">Prepare Template</span>
              </span>

              {/* Arrow / Close Icon */}
              <span className="relative z-10">
                {templateExpanded ? (
                  <X size={16} className="text-gray-500" />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-500 transition-transform duration-200"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                )}
              </span>
            </button>

            {/* Submenu */}
            {templateExpanded && (
              <div className="ml-6 mt-1 space-y-1 border-l border-gray-200 pl-3">
                <Link
                  to="/excellinitialiser"
                  onClick={() => {
                    setSidebarOpen(false);
                    setTemplateExpanded(false);
                  }}
                  className={`block px-4 py-2 rounded hover:bg-gray-100 ${
                    isActive('/excellinitialiser') ? 'font-semibold text-blue-600' : 'text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <FileText size={16} />
                    <span>Set Up New Data</span>
                  </div>
                </Link>
                <Link
                  to="/viewsaveddata"
                  onClick={() => {
                    setSidebarOpen(false);
                    setTemplateExpanded(false);
                  }}
                  className={`block px-4 py-2 rounded hover:bg-gray-100 ${
                    isActive('/viewsaveddata') ? 'font-semibold text-blue-600' : 'text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Eye size={16} />
                    <span>View Saved Data</span>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* User Section */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="min-w-0">
              <div className="font-semibold text-gray-900 truncate">{user?.name || 'User'}</div>
              <div className="text-xs text-gray-500 truncate">{user?.email || ''}</div>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 w-full px-4 py-2 rounded-lg bg-white border hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition"
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