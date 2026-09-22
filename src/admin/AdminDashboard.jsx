import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    FaCalendarAlt,
    FaUsers,
    FaImages,
    FaDollarSign,
    FaRunning,
    FaHeart,
    FaArrowUp,
    FaArrowDown,
    FaClock,
    FaTrophy,
    FaMedal,
    FaEnvelope,
    FaFire,
    FaChartLine,
    FaChartBar,
    FaChartPie,
    FaEye,
    FaCheckCircle,
    FaHourglassHalf,
    FaExclamationTriangle,
    FaSpinner,
    FaStar,
    FaHandshake,
    FaChevronRight,
    FaPlus,
    FaBell
} from 'react-icons/fa';

export default function AdminDashboard({ onNavigate }) {
    // ============ STATE ============
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        events: 0,
        eventsUpcoming: 0,
        members: 0,
        membersActive: 0,
        gallery: 0,
        sponsors: 0,
        sponsorsActive: 0,
        messages: 0,
        messagesNew: 0,
    });
    const [recentEvents, setRecentEvents] = useState([]);
    const [topMembers, setTopMembers] = useState([]);
    const [recentMessages, setRecentMessages] = useState([]);
    const [recentActivities, setRecentActivities] = useState([]);
    const [monthlyData, setMonthlyData] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    // ============ EFFECTS ============
    useEffect(() => {
        fetchAllData();
    }, []);

    // ============ API CALLS ============
    const fetchAllData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const headers = { 'Authorization': `Bearer ${token}` };

            // Fetch all data in parallel
            const [
                eventsRes,
                membersRes,
                galleryRes,
                sponsorsRes,
                messagesRes,
                statsRes
            ] = await Promise.all([
                fetch('http://localhost:5000/api/events', { headers }),
                fetch('http://localhost:5000/api/members', { headers }),
                fetch('http://localhost:5000/api/gallery', { headers }),
                fetch('http://localhost:5000/api/sponsors', { headers }),
                fetch('http://localhost:5000/api/contact', { headers }),
                fetch('http://localhost:5000/api/contact/stats/summary', { headers }),
            ]);

            const events = await eventsRes.json();
            const members = await membersRes.json();
            const gallery = await galleryRes.json();
            const sponsors = await sponsorsRes.json();
            const messages = await messagesRes.json();
            const messageStats = await statsRes.json();

            const eventsList = Array.isArray(events) ? events : [];
            const membersList = Array.isArray(members) ? members : [];
            const galleryList = Array.isArray(gallery) ? gallery : [];
            const sponsorsList = Array.isArray(sponsors) ? sponsors : [];
            const messagesList = messages.data || [];

            // Calculate stats
            setStats({
                events: eventsList.length,
                eventsUpcoming: eventsList.filter(e => e.status === 'upcoming').length,
                members: membersList.length,
                membersActive: membersList.filter(m => m.status === 'active').length,
                gallery: galleryList.length,
                sponsors: sponsorsList.length,
                sponsorsActive: sponsorsList.filter(s => s.status === 'active').length,
                messages: messageStats.data?.total || 0,
                messagesNew: messageStats.data?.new || 0,
            });

            // Top 5 members by miles
            setTopMembers(
                [...membersList]
                    .sort((a, b) => (b.miles || 0) - (a.miles || 0))
                    .slice(0, 5)
            );

            // Recent events (5 most recent)
            setRecentEvents(
                [...eventsList]
                    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
                    .slice(0, 5)
            );

            // Recent messages (5 most recent)
            setRecentMessages(
                [...messagesList]
                    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
                    .slice(0, 5)
            );

            // Build recent activities from all data
            const activities = [
                ...eventsList.slice(0, 3).map(e => ({
                    id: `event-${e._id}`,
                    type: 'event',
                    action: `Event: ${e.title}`,
                    time: e.createdAt,
                    icon: <FaCalendarAlt />,
                    color: 'text-blue-400',
                    bgColor: 'bg-blue-500/10',
                })),
                ...membersList.slice(0, 3).map(m => ({
                    id: `member-${m._id}`,
                    type: 'member',
                    action: `New member: ${m.name}`,
                    time: m.joinDate,
                    icon: <FaUsers />,
                    color: 'text-green-400',
                    bgColor: 'bg-green-500/10',
                })),
                ...galleryList.slice(0, 2).map(g => ({
                    id: `gallery-${g._id}`,
                    type: 'gallery',
                    action: `Photo: ${g.title || 'Untitled'}`,
                    time: g.date,
                    icon: <FaImages />,
                    color: 'text-purple-400',
                    bgColor: 'bg-purple-500/10',
                })),
                ...messagesList.slice(0, 3).map(m => ({
                    id: `message-${m._id}`,
                    type: 'message',
                    action: `Message from ${m.name}`,
                    time: m.createdAt,
                    icon: <FaEnvelope />,
                    color: 'text-red-400',
                    bgColor: 'bg-red-500/10',
                })),
            ]
                .sort((a, b) => new Date(b.time || 0) - new Date(a.time || 0))
                .slice(0, 8);

            setRecentActivities(activities);

            // Mock monthly data for chart
            const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            setMonthlyData(months.map(month => ({
                month,
                members: Math.floor(Math.random() * 20) + 10,
                events: Math.floor(Math.random() * 8) + 2,
                photos: Math.floor(Math.random() * 15) + 5,
            })));

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setErrorMessage('Failed to load some dashboard data');
        } finally {
            setLoading(false);
        }
    };

    // ============ HELPERS ============
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = (now - date) / (1000 * 60 * 60);

        if (diffInHours < 1) {
            const minutes = Math.floor(diffInHours * 60);
            return minutes <= 1 ? 'Just now' : `${minutes}m ago`;
        } else if (diffInHours < 24) {
            return `${Math.floor(diffInHours)}h ago`;
        } else if (diffInHours < 48) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
    };

    const getBadgeColor = (badge) => {
        const colors = {
            'Elite': 'bg-yellow-500/20 text-yellow-500',
            'Advanced': 'bg-blue-500/20 text-blue-500',
            'Intermediate': 'bg-green-500/20 text-green-500',
            'Beginner': 'bg-gray-500/20 text-gray-400',
        };
        return colors[badge] || colors['Beginner'];
    };

    const getStatusColor = (status) => {
        const colors = {
            'upcoming': 'bg-green-500/20 text-green-400',
            'ongoing': 'bg-yellow-500/20 text-yellow-400',
            'completed': 'bg-gray-500/20 text-gray-400',
            'new': 'bg-red-500/20 text-red-400',
            'read': 'bg-blue-500/20 text-blue-400',
            'replied': 'bg-green-500/20 text-green-400',
            'archived': 'bg-gray-500/20 text-gray-400',
        };
        return colors[status] || 'bg-gray-500/20 text-gray-400';
    };

    // ============ STAT CARDS DATA ============
    const statCards = [
        {
            title: 'Total Events',
            value: stats.events,
            subValue: `${stats.eventsUpcoming} upcoming`,
            icon: <FaCalendarAlt />,
            gradient: 'from-blue-500/20 to-blue-600/5',
            border: 'border-blue-500/30',
            iconColor: 'text-blue-400',
            trend: '+12%',
            trendUp: true,
            onClick: () => onNavigate?.('events'),
        },
        {
            title: 'Active Members',
            value: stats.members,
            subValue: `${stats.membersActive} active`,
            icon: <FaUsers />,
            gradient: 'from-green-500/20 to-green-600/5',
            border: 'border-green-500/30',
            iconColor: 'text-green-400',
            trend: '+8%',
            trendUp: true,
            onClick: () => onNavigate?.('members'),
        },
        {
            title: 'Gallery Items',
            value: stats.gallery,
            subValue: 'Photos & media',
            icon: <FaImages />,
            gradient: 'from-purple-500/20 to-purple-600/5',
            border: 'border-purple-500/30',
            iconColor: 'text-purple-400',
            trend: '+23%',
            trendUp: true,
            onClick: () => onNavigate?.('gallery'),
        },
        {
            title: 'Sponsors',
            value: stats.sponsors,
            subValue: `${stats.sponsorsActive} active`,
            icon: <FaDollarSign />,
            gradient: 'from-yellow-500/20 to-yellow-600/5',
            border: 'border-yellow-500/30',
            iconColor: 'text-yellow-400',
            trend: '+5%',
            trendUp: true,
            onClick: () => onNavigate?.('sponsors'),
        },
    ];

    // ============ QUICK ACTIONS ============
    const quickActions = [
        { label: 'Add Event', icon: <FaCalendarAlt />, color: 'from-blue-500 to-blue-600', onClick: () => onNavigate?.('events') },
        { label: 'Add Member', icon: <FaUsers />, color: 'from-green-500 to-green-600', onClick: () => onNavigate?.('members') },
        { label: 'Upload Photo', icon: <FaImages />, color: 'from-purple-500 to-purple-600', onClick: () => onNavigate?.('gallery') },
        { label: 'Add Sponsor', icon: <FaHandshake />, color: 'from-yellow-500 to-yellow-600', onClick: () => onNavigate?.('sponsors') },
    ];

    // ============ LOADING STATE ============
    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <FaSpinner className="text-moon text-5xl animate-spin mx-auto mb-4" />
                    <p className="text-gray-400">Loading dashboard...</p>
                    <p className="text-gray-500 text-sm mt-2">Fetching your data</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* ============ WELCOME HEADER ============ */}
            <div className="bg-gradient-to-r from-deep via-black to-deep rounded-2xl border border-moon/20 p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-moon/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl"></div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-moon to-yellow-600 flex items-center justify-center">
                            <FaRunning className="text-black text-2xl" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-orbitron font-bold text-white">
                                Welcome Back
                            </h1>
                            <p className="text-gray-400 text-sm">
                                Here's what's happening with Moon-Runners Club today
                            </p>
                        </div>
                    </div>

                    {/* Alert Banner for New Messages */}
                    {stats.messagesNew > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 inline-flex items-center gap-3 px-4 py-2 bg-red-500/20 border border-red-500/40 rounded-xl"
                        >
                            <FaBell className="text-red-400 animate-pulse" />
                            <span className="text-red-300 font-semibold">
                                You have {stats.messagesNew} new message{stats.messagesNew !== 1 ? 's' : ''}
                            </span>
                            <button
                                onClick={() => onNavigate?.('messages')}
                                className="text-red-400 hover:text-red-300 font-bold text-sm flex items-center gap-1"
                            >
                                View <FaChevronRight className="text-xs" />
                            </button>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* ============ ERROR MESSAGE ============ */}
            {errorMessage && (
                <div className="p-3 bg-yellow-500/20 border border-yellow-500 rounded-lg text-yellow-400 flex items-center gap-2">
                    <FaExclamationTriangle /> {errorMessage}
                </div>
            )}

            {/* ============ MAIN STATS CARDS ============ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={stat.onClick}
                        className={`bg-gradient-to-br ${stat.gradient} rounded-xl p-5 border ${stat.border} hover:scale-105 transition-all duration-300 cursor-pointer group`}
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className={`p-3 rounded-lg bg-black/30 ${stat.iconColor}`}>
                                {stat.icon}
                            </div>
                            <div className={`flex items-center gap-1 text-xs font-semibold ${stat.trendUp ? 'text-green-400' : 'text-red-400'}`}>
                                {stat.trendUp ? <FaArrowUp /> : <FaArrowDown />}
                                {stat.trend}
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                        <div className="text-gray-400 text-sm">{stat.title}</div>
                        <div className="text-gray-500 text-xs mt-1">{stat.subValue}</div>
                    </motion.div>
                ))}
            </div>

            {/* ============ SECONDARY STATS ============ */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-deep/50 rounded-xl border border-moon/20 p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <FaEnvelope className="text-red-400" />
                        <span className="text-xs text-gray-400">Messages</span>
                    </div>
                    <div className="text-2xl font-bold text-white">{stats.messages}</div>
                    <div className="text-xs text-gray-500 mt-1">
                        <span className="text-red-400 font-semibold">{stats.messagesNew} new</span>
                    </div>
                </div>
                <div className="bg-deep/50 rounded-xl border border-moon/20 p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <FaFire className="text-orange-400" />
                        <span className="text-xs text-gray-400">Total Miles</span>
                    </div>
                    <div className="text-2xl font-bold text-white">
                        {topMembers.reduce((sum, m) => sum + (m.miles || 0), 0).toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">From top members</div>
                </div>
                <div className="bg-deep/50 rounded-xl border border-moon/20 p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <FaTrophy className="text-yellow-400" />
                        <span className="text-xs text-gray-400">Top Runner</span>
                    </div>
                    <div className="text-2xl font-bold text-white truncate">
                        {topMembers[0]?.name || 'N/A'}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                        {topMembers[0]?.miles || 0} miles
                    </div>
                </div>
                <div className="bg-deep/50 rounded-xl border border-moon/20 p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <FaHeart className="text-red-400" />
                        <span className="text-xs text-gray-400">Community Rating</span>
                    </div>
                    <div className="text-2xl font-bold text-white flex items-center gap-1">
                        4.9 <FaStar className="text-yellow-400 text-lg" />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Based on feedback</div>
                </div>
            </div>

            {/* ============ MAIN CONTENT GRID ============ */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Recent Activities - Takes 2 columns */}
                <div className="lg:col-span-2 bg-deep/50 rounded-xl border border-moon/20 p-6">
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-2">
                            <FaClock className="text-moon" />
                            <h2 className="text-lg font-bold text-white">Recent Activity</h2>
                        </div>
                        <span className="text-xs text-gray-500">Last 7 days</span>
                    </div>

                    {recentActivities.length === 0 ? (
                        <div className="text-center py-8">
                            <FaClock className="text-4xl text-gray-600 mx-auto mb-3" />
                            <p className="text-gray-400 text-sm">No recent activity</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {recentActivities.map((activity, index) => (
                                <motion.div
                                    key={activity.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={`flex items-center gap-3 p-3 rounded-lg hover:bg-black/30 transition ${activity.bgColor}`}
                                >
                                    <div className={`p-2 rounded-lg bg-black/30 ${activity.color}`}>
                                        {activity.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white text-sm truncate">{activity.action}</p>
                                        <p className="text-gray-500 text-xs">{formatDate(activity.time)}</p>
                                    </div>
                                    <FaChevronRight className="text-gray-600 text-xs" />
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Top Members - 1 column */}
                <div className="bg-deep/50 rounded-xl border border-moon/20 p-6">
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-2">
                            <FaTrophy className="text-yellow-400" />
                            <h2 className="text-lg font-bold text-white">Top Runners</h2>
                        </div>
                        <button
                            onClick={() => onNavigate?.('members')}
                            className="text-xs text-moon hover:text-yellow-400"
                        >
                            View All
                        </button>
                    </div>

                    {topMembers.length === 0 ? (
                        <div className="text-center py-8">
                            <FaTrophy className="text-4xl text-gray-600 mx-auto mb-3" />
                            <p className="text-gray-400 text-sm">No members yet</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {topMembers.map((member, index) => (
                                <motion.div
                                    key={member._id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-black/30 transition"
                                >
                                    {/* Rank Badge */}
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-black' :
                                            index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-black' :
                                                index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-black' :
                                                    'bg-black/50 text-gray-400'
                                        }`}>
                                        {index + 1}
                                    </div>

                                    {/* Member Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="text-white text-sm font-semibold truncate">
                                            {member.name}
                                        </div>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${getBadgeColor(member.badge)}`}>
                                                {member.badge}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Miles */}
                                    <div className="text-right flex-shrink-0">
                                        <div className="text-moon font-bold text-sm">{member.miles || 0}</div>
                                        <div className="text-gray-500 text-[10px]">miles</div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* ============ RECENT EVENTS & MESSAGES ============ */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Recent Events */}
                <div className="bg-deep/50 rounded-xl border border-moon/20 p-6">
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-2">
                            <FaCalendarAlt className="text-blue-400" />
                            <h2 className="text-lg font-bold text-white">Recent Events</h2>
                        </div>
                        <button
                            onClick={() => onNavigate?.('events')}
                            className="text-xs text-moon hover:text-yellow-400 flex items-center gap-1"
                        >
                            View All <FaChevronRight className="text-[10px]" />
                        </button>
                    </div>

                    {recentEvents.length === 0 ? (
                        <div className="text-center py-8">
                            <FaCalendarAlt className="text-4xl text-gray-600 mx-auto mb-3" />
                            <p className="text-gray-400 text-sm">No events yet</p>
                            <button
                                onClick={() => onNavigate?.('events')}
                                className="mt-3 text-moon hover:text-yellow-400 text-xs font-semibold"
                            >
                                + Create your first event
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {recentEvents.slice(0, 4).map((event) => (
                                <div
                                    key={event._id}
                                    className="flex items-center justify-between p-3 bg-black/30 rounded-lg hover:bg-black/50 transition"
                                >
                                    <div className="flex-1 min-w-0">
                                        <div className="text-white text-sm font-semibold truncate">
                                            {event.title}
                                        </div>
                                        <div className="text-gray-500 text-xs mt-0.5">
                                            {event.location} · {event.distance}
                                        </div>
                                    </div>
                                    <span className={`text-[10px] px-2 py-1 rounded-full font-semibold ${getStatusColor(event.status)}`}>
                                        {event.status || 'upcoming'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recent Messages */}
                <div className="bg-deep/50 rounded-xl border border-moon/20 p-6">
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-2">
                            <FaEnvelope className="text-red-400" />
                            <h2 className="text-lg font-bold text-white">Recent Messages</h2>
                            {stats.messagesNew > 0 && (
                                <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                                    {stats.messagesNew}
                                </span>
                            )}
                        </div>
                        <button
                            onClick={() => onNavigate?.('messages')}
                            className="text-xs text-moon hover:text-yellow-400 flex items-center gap-1"
                        >
                            View All <FaChevronRight className="text-[10px]" />
                        </button>
                    </div>

                    {recentMessages.length === 0 ? (
                        <div className="text-center py-8">
                            <FaEnvelope className="text-4xl text-gray-600 mx-auto mb-3" />
                            <p className="text-gray-400 text-sm">No messages yet</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {recentMessages.slice(0, 4).map((message) => (
                                <div
                                    key={message._id}
                                    className={`flex items-start gap-3 p-3 rounded-lg transition ${message.status === 'new'
                                            ? 'bg-red-500/10 border border-red-500/20'
                                            : 'bg-black/30 hover:bg-black/50'
                                        }`}
                                >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${message.status === 'new'
                                            ? 'bg-gradient-to-br from-red-500 to-red-600 text-white'
                                            : 'bg-gradient-to-br from-moon to-yellow-600 text-black'
                                        }`}>
                                        {message.name?.charAt(0)?.toUpperCase() || 'U'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="text-white text-sm font-semibold truncate">
                                                {message.name}
                                            </div>
                                            <span className="text-gray-500 text-[10px] flex-shrink-0">
                                                {formatDate(message.createdAt)}
                                            </span>
                                        </div>
                                        <p className="text-gray-400 text-xs truncate mt-0.5">
                                            {message.message}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* ============ QUICK ACTIONS ============ */}
            <div className="bg-gradient-to-br from-deep to-black rounded-xl border border-moon/20 p-6">
                <div className="flex items-center gap-2 mb-5">
                    <FaPlus className="text-moon" />
                    <h2 className="text-lg font-bold text-white">Quick Actions</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {quickActions.map((action, index) => (
                        <motion.button
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={action.onClick}
                            className={`flex flex-col items-center gap-3 p-5 rounded-xl bg-gradient-to-br ${action.color} text-white font-semibold hover:shadow-xl transition-all`}
                        >
                            <div className="text-2xl">{action.icon}</div>
                            <span className="text-sm">{action.label}</span>
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* ============ SYSTEM STATUS ============ */}
            <div className="bg-deep/50 rounded-xl border border-moon/20 p-6">
                <div className="flex items-center gap-2 mb-5">
                    <FaChartLine className="text-moon" />
                    <h2 className="text-lg font-bold text-white">System Status</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-black/30 rounded-lg">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <div>
                            <div className="text-white text-sm font-semibold">API Server</div>
                            <div className="text-green-400 text-xs">Operational</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-black/30 rounded-lg">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <div>
                            <div className="text-white text-sm font-semibold">Database</div>
                            <div className="text-green-400 text-xs">Connected</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-black/30 rounded-lg">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <div>
                            <div className="text-white text-sm font-semibold">File Storage</div>
                            <div className="text-green-400 text-xs">Available</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-black/30 rounded-lg">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <div>
                            <div className="text-white text-sm font-semibold">Auth Service</div>
                            <div className="text-green-400 text-xs">Active</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}