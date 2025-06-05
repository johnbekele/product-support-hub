// UserNavBar.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ShieldCheckIcon,
  MoonIcon,
  SunIcon,
  UserIcon,
  WrenchIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';
import logo from '../assets/img/logo.png';
import { useThomsonReutersTheme } from '../Context/ThomsonReutersThemeContext';
import { useAuth } from '../Context/AuthContext';
import ChatBox from './ChatBox';
import DeveloperAttribution from './DeveloperAttribution';
/**
 * UserNavBar Component
 *
 * Main navigation bar with user controls, role switching, theme toggle, and chat functionality
 */
function UserNavBar() {
  // Hooks
  const { user, logout } = useAuth();
  const theme = useThomsonReutersTheme();
  const navigate = useNavigate();

  // State
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeRole, setActiveRole] = useState(
    user?.role ? Object.keys(user.role)[0] : 'User'
  );
  const [isDark, setIsDark] = useState(false);
  const [fromWhere, setFromWhere] = useState('user');
  const [chatOpen, setChatOpen] = useState(false);

  // Refs
  const dropdownRef = useRef(null);

  /**
   * Handle window resize events
   */
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  /**
   * Handle clicks outside the dropdown to close it
   */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  /**
   * Toggle dropdown visibility
   */
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  /**
   * Close the dropdown
   */
  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  /**
   * Toggle between light and dark theme
   */
  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  /**
   * Toggle chat visibility
   */
  const toggleChat = () => {
    setChatOpen(!chatOpen);
  };

  /**
   * Switch between different user roles
   * @param {string} role - The role to switch to
   */
  const handleRoleSwitch = (role) => {
    setActiveRole(role);
    closeDropdown();
    setFromWhere(role.toLowerCase());

    switch (role) {
      case 'Admin':
        navigate('/admin-dashboard');
        break;
      case 'Moderator':
        navigate('/moderator-dashboard');
        break;
      case 'User':
      default:
        navigate('/');
        break;
    }
  };

  // Theme-based styles
  const headerStyle = {
    backgroundColor: theme.components.header.backgroundColor,
    color: theme.components.header.color,
    padding: theme.spacing.md,
  };

  const dropdownMenuStyle = {
    backgroundColor: isDark ? '#1F2937' : theme.colors.white,
    color: isDark ? theme.colors.white : theme.colors.black,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    border: `1px solid ${isDark ? '#374151' : theme.colors.mediumGray}`,
  };

  const menuItemHoverStyle = {
    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
  };

  const logoutHoverStyle = {
    backgroundColor: isDark ? 'rgba(220,38,38,0.2)' : 'rgba(254,226,226,1)',
  };

  const dividerStyle = {
    backgroundColor: isDark ? '#374151' : theme.colors.mediumGray,
  };

  const badgeStyle = {
    backgroundColor: theme.components.button.primary.backgroundColor,
    color: theme.components.button.primary.color,
    fontSize: theme.typography.fontSize.small,
    fontWeight: theme.typography.fontWeight.medium,
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
  };

  const toggleTrackStyle = {
    backgroundColor: isDark
      ? theme.components.button.primary.backgroundColor
      : theme.colors.mediumGray,
    width: '2.5rem',
    height: '1.25rem',
    position: 'relative',
  };

  return (
    <>
      <header
        style={headerStyle}
        className="flex items-center justify-between z-10"
      >
        {/* Logo and Brand Section */}
        <div className="flex items-center gap-4">
          <div
            onClick={() => navigate('/')}
            className="cursor-pointer"
            aria-label="Home"
          >
            <img className="w-44" src={logo} alt="Thomson Reuters Logo" />
          </div>
          <div className="text-md font-sans text-stone-50">
            Product Support Hub
          </div>
        </div>

        {/* Navigation and Controls Section */}
        <div className="flex items-center gap-4">
          {!isMobile && (
            <div className="text-stone-50">
              {activeRole === 'Admin'
                ? 'Admin Dashboard'
                : activeRole === 'Moderator'
                ? 'Moderator Dashboard'
                : 'User Dashboard'}
            </div>
          )}

          <Link
            className="text-stone-50 hover:underline px-3 py-2 transition-all"
            to="/createpost"
            style={{
              fontFamily: theme.typography.fontFamily,
              fontSize: theme.typography.fontSize.normal,
            }}
          >
            Post
          </Link>

          {/* Chat Button */}
          <motion.button
            className="text-stone-50 flex items-center gap-1 px-3 py-2 hover:bg-opacity-20 hover:bg-white rounded-md transition-all"
            onClick={toggleChat}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              fontFamily: theme.typography.fontFamily,
              fontSize: theme.typography.fontSize.normal,
            }}
            aria-label="Toggle chat"
            aria-expanded={chatOpen}
          >
            <ChatBubbleLeftRightIcon className="w-5 h-5" />
            <span className="hidden md:inline">Chat</span>
          </motion.button>

          {/* User Profile Section */}
          <div className="user-section relative" ref={dropdownRef}>
            <motion.button
              className="avatar-button flex items-center justify-center"
              onClick={toggleDropdown}
              aria-expanded={dropdownOpen}
              aria-label="User menu"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div
                className="avatar-ring rounded-full p-1"
                style={{
                  borderWidth: '2px',
                  borderColor: theme.colors.white,
                  borderStyle: 'solid',
                }}
              >
                <div className="avatar w-8 h-8 rounded-full overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    alt="User avatar"
                    src={user?.photo || '/default-avatar.png'}
                  />
                </div>
              </div>
            </motion.button>

            {/* User Dropdown Menu */}
            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  className="dropdown-menu absolute right-0 mt-2 w-64 rounded-lg overflow-hidden z-50"
                  style={dropdownMenuStyle}
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Theme Toggle Button */}
                  <motion.div
                    className="menu-item theme-toggle p-3 flex items-center justify-between"
                    whileHover={menuItemHoverStyle}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTheme();
                      }}
                      className="theme-button w-full flex items-center justify-between"
                      style={{
                        fontFamily: theme.typography.fontFamily,
                        fontSize: theme.typography.fontSize.normal,
                      }}
                      aria-label={`Switch to ${
                        isDark ? 'light' : 'dark'
                      } theme`}
                    >
                      <div className="theme-label flex items-center">
                        {isDark ? (
                          <MoonIcon className="theme-icon w-5 h-5 mr-2" />
                        ) : (
                          <SunIcon className="theme-icon w-5 h-5 mr-2" />
                        )}
                        <span>{isDark ? 'Dark' : 'Light'}</span>
                      </div>
                      <motion.div
                        className="toggle-track rounded-full"
                        style={toggleTrackStyle}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <motion.div
                          className="toggle-thumb bg-white rounded-full absolute"
                          style={{
                            width: '1rem',
                            height: '1rem',
                            transform: isDark
                              ? 'translateX(1.5rem)'
                              : 'translateX(0.25rem)',
                            top: '0.125rem',
                          }}
                          layout
                          transition={{
                            type: 'spring',
                            stiffness: 700,
                            damping: 30,
                          }}
                        ></motion.div>
                      </motion.div>
                    </button>
                  </motion.div>

                  <div className="menu-divider h-px" style={dividerStyle}></div>

                  {/* Profile Link */}
                  <motion.div whileHover={menuItemHoverStyle}>
                    <Link
                      className="menu-item p-3 flex items-center justify-between"
                      to="/user-dashboard/profile"
                      onClick={closeDropdown}
                      style={{
                        fontFamily: theme.typography.fontFamily,
                        fontSize: theme.typography.fontSize.normal,
                        display: 'flex',
                      }}
                    >
                      <div className="menu-item-content flex items-center">
                        <UserCircleIcon className="menu-icon w-5 h-5 mr-2" />
                        <span>Profile</span>
                      </div>
                      <span
                        className="badge px-2 py-1 text-xs rounded-full"
                        style={badgeStyle}
                      >
                        New
                      </span>
                    </Link>
                  </motion.div>

                  {/* Settings Link */}
                  <motion.div whileHover={menuItemHoverStyle}>
                    <Link
                      className="menu-item p-3 flex items-center justify-between"
                      to="/settings"
                      onClick={closeDropdown}
                      style={{
                        fontFamily: theme.typography.fontFamily,
                        fontSize: theme.typography.fontSize.normal,
                        display: 'flex',
                      }}
                    >
                      <div className="menu-item-content flex items-center">
                        <Cog6ToothIcon className="menu-icon w-5 h-5 mr-2" />
                        <span>Settings</span>
                      </div>
                    </Link>
                  </motion.div>

                  {/* Role Switching Section */}
                  {user?.role && (
                    <>
                      <div
                        className="menu-divider h-px"
                        style={dividerStyle}
                      ></div>

                      {/* User Dashboard */}
                      {user?.role?.User &&
                        user.role.User >= 2001 &&
                        fromWhere !== 'user' && (
                          <motion.div whileHover={menuItemHoverStyle}>
                            <button
                              className="menu-item p-3 flex items-center w-full text-left"
                              onClick={() => handleRoleSwitch('User')}
                              style={{
                                fontFamily: theme.typography.fontFamily,
                                fontSize: theme.typography.fontSize.normal,
                              }}
                            >
                              <div className="menu-item-content flex items-center">
                                <UserIcon className="menu-icon w-5 h-5 mr-2" />
                                <span>User Dashboard</span>
                              </div>
                            </button>
                          </motion.div>
                        )}

                      {/* Admin Dashboard */}
                      {user?.role?.Admin &&
                        user.role.Admin >= 4001 &&
                        fromWhere !== 'admin' && (
                          <motion.div whileHover={menuItemHoverStyle}>
                            <button
                              className="menu-item p-3 flex items-center w-full text-left"
                              onClick={() => handleRoleSwitch('Admin')}
                              style={{
                                fontFamily: theme.typography.fontFamily,
                                fontSize: theme.typography.fontSize.normal,
                              }}
                            >
                              <div className="menu-item-content flex items-center">
                                <ShieldCheckIcon className="menu-icon w-5 h-5 mr-2" />
                                <span>Admin Dashboard</span>
                              </div>
                            </button>
                          </motion.div>
                        )}

                      {/* Moderator Dashboard */}
                      {user?.role?.Moderator &&
                        user.role.Moderator >= 3001 &&
                        fromWhere !== 'moderator' && (
                          <motion.div whileHover={menuItemHoverStyle}>
                            <button
                              className="menu-item p-3 flex items-center w-full text-left"
                              onClick={() => handleRoleSwitch('Moderator')}
                              style={{
                                fontFamily: theme.typography.fontFamily,
                                fontSize: theme.typography.fontSize.normal,
                              }}
                            >
                              <div className="menu-item-content flex items-center">
                                <WrenchIcon className="menu-icon w-5 h-5 mr-2" />
                                <span>Moderator Dashboard</span>
                              </div>
                            </button>
                          </motion.div>
                        )}
                    </>
                  )}

                  <div className="menu-divider h-px" style={dividerStyle}></div>

                  {/* Logout Button */}
                  <motion.div whileHover={logoutHoverStyle}>
                    <button
                      className="menu-item logout p-3 flex items-center w-full text-left"
                      onClick={() => {
                        logout();
                        closeDropdown();
                      }}
                      style={{
                        fontFamily: theme.typography.fontFamily,
                        fontSize: theme.typography.fontSize.normal,
                        color: '#DC2626', // Red color for logout
                      }}
                    >
                      <div className="menu-item-content flex items-center">
                        <ArrowRightOnRectangleIcon className="menu-icon w-5 h-5 mr-2" />
                        <span>Logout</span>
                      </div>
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Chat Box */}
      <ChatBox
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        theme={theme}
      />
      <DeveloperAttribution />
    </>
  );
}

export default UserNavBar;
