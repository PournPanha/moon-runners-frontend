import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaTachometerAlt,
    FaCalendarAlt,
    FaUsers,
    FaImages,
    FaCalendarWeek,
    FaDollarSign,
    FaSignOutAlt,
    FaBars,
    FaBell,
    FaEnvelope,
    FaChevronDown,
    FaChevronRight,
    FaChevronLeft,
    FaTimes,
    FaSearch,
    FaMoon,
    FaRunning,
    FaCog,
    FaUser,
    FaExternalLinkAlt,
    FaCheck,
    FaClock,
    FaFire,
    FaStar,
    FaEye
} from 'react-icons/fa';
import AdminDashboard from './AdminDashboard';
import AdminEvents from './AdminEvents';
import AdminMembers from './AdminMembers';
import AdminGallery from './AdminGallery';
import AdminSchedule from './AdminSchedule';
import AdminSponsors from './AdminSponsors';
import AdminMessages from './AdminMessages';

// Menu items with sections
const MENU_SECTIONS = [
    {
        title: 'Overview',
        items: [
            { id: 'dashboard', label: 'Dashboard', icon: <FaTachometerAlt /> },
        ]
    },
    {
        title: 'Management',
        items: [
            { id: 'events', label: 'Events', icon: <FaCalendarAlt /> },
            { id: 'members', label: 'Members', icon: <FaUsers /> },
            { id: 'schedule', label: 'Schedule', icon: <FaCalendarWeek /> },
        ]
    },
    {
        title: 'Content',
        items: [
            { id: 'gallery', label: 'Gallery', icon: <FaImages /> },
        ]
    },
    {
        title: 'Business',
        items: [
            { id: 'sponsors', label: 'Sponsors', icon: <FaDollarSign /> },
            { id: 'messages', label: 'Messages', icon: <FaEnvelope />, badge: true },
        ]
    },
];

export default function AdminLayout({ user, onLogout }) {
    // ============ STATE ============
    const [activeTab, setActiveTab] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showProfile, setShowProfile] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showMobileSidebar, setShowMobileSidebar] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const profileRef = useRef(null);
    const notificationsRef = useRef(null);

    // ============ EFFECTS ============
    useEffect(() => {
        fetchNotifications();

        // Check for mobile
        const checkMobile = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);
            if (mobile) {
                setSidebarOpen(false);
            } else {
                setSidebarOpen(true);
            }
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);

        // Click outside to close dropdowns
        const handleClickOutside = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setShowProfile(false);
            }
            if (notificationsRef.current && !notificationsRef.current.contains(e.target)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        // Keyboard shortcuts
        const handleKeyDown = (e) => {
            // Ctrl/Cmd + K for search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setShowSearch(true);
            }
            // Escape to close overlays
            if (e.key === 'Escape') {
                setShowProfile(false);
                setShowNotifications(false);
                setShowSearch(false);
                setShowMobileSidebar(false);
            }
            // Ctrl/Cmd + B to toggle sidebar
            if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
                e.preventDefault();
                setSidebarOpen(prev => !prev);
            }
        };
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('resize', checkMobile);
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    // ============ API CALLS ============
    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch('http://localhost:5000/api/contact/stats/summary', {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            const data = await response.json();
            if (data.success) {
                const newCount = data.data.new || 0;
                setUnreadCount(newCount);

                const notifs = [];
                if (newCount > 0) {
                    notifs.push({
                        id: 'new-messages',
                        type: 'message',
                        title: 'New Messages',
                        message: `You have ${newCount} unread message${newCount !== 1 ? 's' : ''}`,
                        time: 'Just now',
                        icon: <FaEnvelope />,
                        color: 'text-red-400',
                        bgColor: 'bg-red-500/10',
                        action: 'messages',
                    });
                }

                // Add some example notifications if empty
                if (notifs.length === 0) {
                    notifs.push({
                        id: 'welcome',
                        type: 'system',
                        title: 'Welcome to Moon-Admin',
                        message: 'Your dashboard is ready to use',
                        time: 'Just now',
                        icon: <FaStar />,
                        color: 'text-moon',
                        bgColor: 'bg-moon/10',
                    });
                }

                setNotifications(notifs);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    // ============ HANDLERS ============
    const handleNavigate = (tabId) => {
        setActiveTab(tabId);
        if (isMobile) {
            setShowMobileSidebar(false);
        }
        setShowProfile(false);
        setShowNotifications(false);
        setSearchQuery('');
        setShowSearch(false);
    };

    const handleNotificationClick = (notif) => {
        if (notif.action) {
            handleNavigate(notif.action);
        }
        setShowNotifications(false);
    };

    const getActiveLabel = () => {
        for (const section of MENU_SECTIONS) {
            const item = section.items.find(i => i.id === activeTab);
            if (item) return item.label;
        }
        return 'Dashboard';
    };

    // Search results
    const searchResults = searchQuery.trim()
        ? MENU_SECTIONS.flatMap(s => s.items).filter(item =>
            item.label.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : [];

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <AdminDashboard onNavigate={handleNavigate} />;
            case 'events':
                return <AdminEvents />;
            case 'members':
                return <AdminMembers />;
            case 'gallery':
                return <AdminGallery />;
            case 'schedule':
                return <AdminSchedule />;
            case 'sponsors':
                return <AdminSponsors />;
            case 'messages':
                return <AdminMessages />;
            default:
                return <AdminDashboard onNavigate={handleNavigate} />;
        }
    };

    // ============ SIDEBAR ============
    const SidebarContent = () => (
        <>
            {/* Sidebar Header */}
            <div className="h-[72px] px-4 border-b border-moon/20 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-moon to-yellow-600 flex items-center justify-center flex-shrink-0">
                        <FaRunning className="text-black text-xl" />
                    </div>
                    <AnimatePresence>
                        {sidebarOpen && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="whitespace-nowrap"
                            >
                                <div className="font-orbitron font-bold text-white text-sm">
                                    Moon<span className="text-moon">Admin</span>
                                </div>
                                <div className="text-[10px] text-gray-500">v1.0.0</div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                {!isMobile && (
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="text-moon hover:text-yellow-400 transition p-1 flex-shrink-0"
                        title={sidebarOpen ? 'Collapse (Ctrl+B)' : 'Expand (Ctrl+B)'}
                    >
                        {sidebarOpen ? <FaChevronLeft size={12} /> : <FaChevronRight size={12} />}
                    </button>
                )}
            </div>

            {/* Navigation */}
            <nav className="p-4 flex-1 overflow-y-auto custom-scrollbar">
                {MENU_SECTIONS.map((section, sIdx) => (
                    <div key={sIdx} className="mb-6">
                        <AnimatePresence>
                            {sidebarOpen && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-[10px] font-bold text-gray-500 uppercase tracking-wider px-3 mb-2"
                                >
                                    {section.title}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {section.items.map((item) => {
                            const isActive = activeTab === item.id;
                            const badge = item.badge && unreadCount > 0 ? unreadCount : null;

                            return (
                                <button
                                    key={item.id}
                                    onClick={() => handleNavigate(item.id)}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-all group relative ${isActive
                                            ? 'bg-moon/20 text-moon'
                                            : 'text-gray-400 hover:bg-moon/10 hover:text-moon'
                                        }`}
                                    title={!sidebarOpen ? item.label : undefined}
                                >
                                    {/* Active indicator */}
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeIndicator"
                                            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-moon rounded-r-full"
                                        />
                                    )}

                                    <span className={`text-lg flex-shrink-0 ${isActive ? 'text-moon' : ''}`}>
                                        {item.icon}
                                    </span>

                                    <AnimatePresence>
                                        {sidebarOpen && (
                                            <motion.span
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="flex-1 text-left text-sm font-medium whitespace-nowrap"
                                            >
                                                {item.label}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>

                                    {/* Badge */}
                                    {badge && (
                                        <span className={`flex-shrink-0 ${sidebarOpen
                                                ? 'bg-red-500 text-white text-xs px-2 py-0.5 rounded-full'
                                                : 'absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center'
                                            }`}>
                                            {badge}
                                        </span>
                                    )}

                                    {/* Tooltip when collapsed */}
                                    {!sidebarOpen && (
                                        <div className="absolute left-full ml-2 px-3 py-1.5 bg-black border border-moon/30 rounded-lg text-white text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                                            {item.label}
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                ))}
            </nav>

            {/* Sidebar Footer */}
            <div className="p-4 border-t border-moon/20 flex-shrink-0">
                <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-all group relative"
                    title={!sidebarOpen ? 'Logout' : undefined}
                >
                    <FaSignOutAlt className="text-lg flex-shrink-0" />
                    <AnimatePresence>
                        {sidebarOpen && (
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-sm font-medium"
                            >
                                Logout
                            </motion.span>
                        )}
                    </AnimatePresence>

                    {!sidebarOpen && (
                        <div className="absolute left-full ml-2 px-3 py-1.5 bg-black border border-red-500/30 rounded-lg text-red-400 text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                            Logout
                        </div>
                    )}
                </button>
            </div>
        </>
    );

    return (
        <div className="flex h-screen bg-night overflow-hidden">
            {/* ============ DESKTOP SIDEBAR ============ */}
            <motion.div
                initial={false}
                animate={{ width: sidebarOpen ? 256 : 72 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="hidden lg:flex flex-col bg-deep/90 border-r border-moon/20 flex-shrink-0"
            >
                <SidebarContent />
            </motion.div>

            {/* ============ MOBILE SIDEBAR ============ */}
            <AnimatePresence>
                {showMobileSidebar && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowMobileSidebar(false)}
                            className="fixed inset-0 bg-black/80 z-40 lg:hidden"
                        />
                        <motion.div
                            initial={{ x: -280 }}
                            animate={{ x: 0 }}
                            exit={{ x: -280 }}
                            transition={{ type: 'spring', damping: 25 }}
                            className="fixed left-0 top-0 bottom-0 w-64 bg-deep/95 backdrop-blur-md border-r border-moon/20 z-50 flex flex-col lg:hidden"
                        >
                            <SidebarContent />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* ============ MAIN CONTENT ============ */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* ============ HEADER ============ */}
                <header className="h-[72px] bg-deep/90 backdrop-blur-md border-b border-moon/20 px-4 md:px-6 flex items-center justify-between flex-shrink-0">
                    {/* Left Side */}
                    <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setShowMobileSidebar(true)}
                            className="lg:hidden text-moon hover:text-yellow-400 transition p-2"
                        >
                            <FaBars size={20} />
                        </button>

                        {/* Breadcrumb */}
                        <div className="hidden md:flex items-center gap-2 text-sm min-w-0">
                            <span className="text-gray-500 flex items-center gap-1">
                                <FaMoon className="text-moon/50" />
                                Admin
                            </span>
                            <FaChevronRight className="text-gray-600 text-xs" />
                            <span className="text-white font-semibold truncate">{getActiveLabel()}</span>
                        </div>

                        {/* Mobile Title */}
                        <div className="md:hidden">
                            <h1 className="text-lg font-bold text-white truncate">{getActiveLabel()}</h1>
                        </div>
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center gap-2 md:gap-3">
                        {/* Search Button */}
                        <button
                            onClick={() => setShowSearch(true)}
                            className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-black/30 border border-gray-700 rounded-lg text-gray-400 hover:text-white hover:border-moon/50 transition text-sm"
                            title="Search (Ctrl+K)"
                        >
                            <FaSearch size={12} />
                            <span>Search...</span>
                            <kbd className="px-1.5 py-0.5 bg-black/50 border border-gray-600 rounded text-[10px] font-mono">
                                ⌘K
                            </kbd>
                        </button>

                        {/* Search Icon Mobile */}
                        <button
                            onClick={() => setShowSearch(true)}
                            className="md:hidden text-gray-400 hover:text-moon transition p-2"
                        >
                            <FaSearch />
                        </button>

                        {/* Notifications */}
                        <div className="relative" ref={notificationsRef}>
                            <button
                                onClick={() => {
                                    setShowNotifications(!showNotifications);
                                    setShowProfile(false);
                                }}
                                className="text-gray-400 hover:text-moon transition p-2 relative"
                                title="Notifications"
                            >
                                <FaBell />
                                {unreadCount > 0 && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute top-1 right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold"
                                    >
                                        {unreadCount}
                                    </motion.span>
                                )}
                            </button>

                            {/* Notifications Dropdown */}
                            <AnimatePresence>
                                {showNotifications && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute right-0 mt-2 w-80 bg-deep border border-moon/20 rounded-xl shadow-2xl z-50 overflow-hidden"
                                    >
                                        <div className="px-4 py-3 border-b border-gray-800 flex justify-between items-center">
                                            <h3 className="text-white font-semibold">Notifications</h3>
                                            {unreadCount > 0 && (
                                                <span className="text-xs px-2 py-0.5 bg-red-500/20 text-red-400 rounded-full">
                                                    {unreadCount} new
                                                </span>
                                            )}
                                        </div>
                                        <div className="max-h-96 overflow-y-auto">
                                            {notifications.length === 0 ? (
                                                <div className="p-6 text-center">
                                                    <FaBell className="text-3xl text-gray-600 mx-auto mb-2" />
                                                    <p className="text-gray-400 text-sm">No notifications</p>
                                                </div>
                                            ) : (
                                                notifications.map((notif) => (
                                                    <button
                                                        key={notif.id}
                                                        onClick={() => handleNotificationClick(notif)}
                                                        className={`w-full text-left px-4 py-3 hover:bg-black/30 transition flex gap-3 ${notif.bgColor}`}
                                                    >
                                                        <div className={`p-2 rounded-lg bg-black/30 h-fit ${notif.color}`}>
                                                            {notif.icon}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-white text-sm font-semibold">
                                                                {notif.title}
                                                            </p>
                                                            <p className="text-gray-400 text-xs mt-0.5">
                                                                {notif.message}
                                                            </p>
                                                            <p className="text-gray-500 text-[10px] mt-1">
                                                                {notif.time}
                                                            </p>
                                                        </div>
                                                        <FaChevronRight className="text-gray-600 text-xs self-center" />
                                                    </button>
                                                ))
                                            )}
                                        </div>
                                        {notifications.length > 0 && (
                                            <div className="px-4 py-2 border-t border-gray-800 text-center">
                                                <button
                                                    onClick={() => handleNavigate('messages')}
                                                    className="text-moon hover:text-yellow-400 text-xs font-semibold"
                                                >
                                                    View All Messages
                                                </button>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Quick View Site */}
                        <a
                            href="/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hidden md:flex text-gray-400 hover:text-moon transition p-2"
                            title="View Live Site"
                        >
                            <FaExternalLinkAlt />
                        </a>

                        {/* Profile */}
                        <div className="relative" ref={profileRef}>
                            <button
                                onClick={() => {
                                    setShowProfile(!showProfile);
                                    setShowNotifications(false);
                                }}
                                className="flex items-center gap-2 md:gap-3 pl-2 md:pl-3 md:border-l border-gray-700 hover:opacity-80 transition"
                            >
                                <div className="w-9 h-9 bg-gradient-to-br from-moon to-yellow-600 rounded-full flex items-center justify-center ring-2 ring-moon/30">
                                    <span className="text-black font-bold text-sm">
                                        {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                                    </span>
                                </div>
                                <div className="hidden md:block text-left">
                                    <div className="text-sm font-semibold text-white truncate max-w-[120px]">
                                        {user?.name || 'Admin'}
                                    </div>
                                    <div className="text-[10px] text-gray-500 capitalize">
                                        {user?.role || 'Administrator'}
                                    </div>
                                </div>
                                <FaChevronDown className={`text-xs text-gray-400 transition-transform hidden md:block ${showProfile ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Profile Dropdown */}
                            <AnimatePresence>
                                {showProfile && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute right-0 mt-2 w-64 bg-deep border border-moon/20 rounded-xl shadow-2xl z-50 overflow-hidden"
                                    >
                                        {/* Profile Header */}
                                        <div className="px-4 py-4 border-b border-gray-800 bg-gradient-to-br from-moon/5 to-transparent">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-gradient-to-br from-moon to-yellow-600 rounded-full flex items-center justify-center ring-2 ring-moon/30">
                                                    <span className="text-black font-bold text-lg">
                                                        {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                                                    </span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-white font-semibold truncate">
                                                        {user?.name || 'Admin'}
                                                    </p>
                                                    <p className="text-gray-400 text-xs truncate">
                                                        {user?.email || 'admin@moonrunners.com'}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="inline-block mt-3 px-2.5 py-0.5 bg-moon/20 text-moon text-[10px] rounded-full font-semibold uppercase tracking-wide">
                                                {user?.role || 'Admin'}
                                            </span>
                                        </div>

                                        {/* Menu Items */}
                                        <div className="py-2">
                                            <button className="w-full text-left px-4 py-2.5 text-gray-300 hover:bg-moon/10 hover:text-moon transition flex items-center gap-3 text-sm">
                                                <FaUser className="text-sm" />
                                                My Profile
                                            </button>
                                            <button className="w-full text-left px-4 py-2.5 text-gray-300 hover:bg-moon/10 hover:text-moon transition flex items-center gap-3 text-sm">
                                                <FaCog className="text-sm" />
                                                Settings
                                            </button>
                                            <a
                                                href="/"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-full text-left px-4 py-2.5 text-gray-300 hover:bg-moon/10 hover:text-moon transition flex items-center gap-3 text-sm"
                                            >
                                                <FaExternalLinkAlt className="text-sm" />
                                                View Live Site
                                            </a>
                                        </div>

                                        {/* Logout */}
                                        <div className="border-t border-gray-800 py-2">
                                            <button
                                                onClick={onLogout}
                                                className="w-full text-left px-4 py-2.5 text-red-400 hover:bg-red-500/10 transition flex items-center gap-3 text-sm"
                                            >
                                                <FaSignOutAlt className="text-sm" />
                                                Logout
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </header>

                {/* ============ SEARCH MODAL ============ */}
                <AnimatePresence>
                    {showSearch && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/80 z-[100] flex items-start justify-center pt-24 p-4 backdrop-blur-sm"
                            onClick={() => setShowSearch(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0, y: -20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.95, opacity: 0, y: -20 }}
                                className="max-w-xl w-full bg-deep border border-moon/20 rounded-2xl shadow-2xl overflow-hidden"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-800">
                                    <FaSearch className="text-moon" />
                                    <input
                                        type="text"
                                        placeholder="Search pages and features..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none"
                                        autoFocus
                                    />
                                    <kbd className="px-2 py-1 bg-black/50 border border-gray-700 rounded text-[10px] text-gray-500 font-mono">
                                        ESC
                                    </kbd>
                                </div>

                                <div className="max-h-80 overflow-y-auto p-2">
                                    {searchQuery.trim() === '' ? (
                                        <div className="p-4 text-center text-gray-500 text-sm">
                                            Type to search pages...
                                        </div>
                                    ) : searchResults.length === 0 ? (
                                        <div className="p-4 text-center text-gray-500 text-sm">
                                            No results found for "{searchQuery}"
                                        </div>
                                    ) : (
                                        searchResults.map(item => (
                                            <button
                                                key={item.id}
                                                onClick={() => handleNavigate(item.id)}
                                                className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-moon/10 transition flex items-center gap-3"
                                            >
                                                <span className="text-moon">{item.icon}</span>
                                                <span className="text-white text-sm">{item.label}</span>
                                                <FaChevronRight className="text-gray-600 text-xs ml-auto" />
                                            </button>
                                        ))
                                    )}
                                </div>

                                <div className="px-4 py-2 border-t border-gray-800 flex items-center gap-4 text-[10px] text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <kbd className="px-1.5 py-0.5 bg-black/50 border border-gray-700 rounded font-mono">↵</kbd>
                                        Select
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <kbd className="px-1.5 py-0.5 bg-black/50 border border-gray-700 rounded font-mono">ESC</kbd>
                                        Close
                                    </span>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ============ CONTENT AREA ============ */}
                <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8 custom-scrollbar">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.2 }}
                        >
                            {renderContent()}
                        </motion.div>
                    </AnimatePresence>
                </main>

                {/* ============ FOOTER ============ */}
                <footer className="h-10 bg-deep/90 border-t border-moon/20 px-4 md:px-6 flex items-center justify-between text-[10px] text-gray-500 flex-shrink-0">
                    <div className="flex items-center gap-2">
                        <FaMoon className="text-moon/50" />
                        <span>Moon-Runners Club Admin</span>
                    </div>
                    <div className="hidden md:flex items-center gap-4">
                        <span className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                            System Online
                        </span>
                        <span>v1.0.0</span>
                    </div>
                </footer>
            </div>
        </div>
    );
}