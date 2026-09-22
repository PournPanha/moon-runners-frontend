import React, { useState, useEffect, useMemo } from 'react';
import {
    FaEnvelope,
    FaReply,
    FaTrash,
    FaCheck,
    FaEye,
    FaClock,
    FaEnvelopeOpen,
    FaArchive,
    FaSpinner,
    FaSearch,
    FaThLarge,
    FaList,
    FaChevronLeft,
    FaChevronRight,
    FaTimes,
    FaCheckCircle,
    FaExclamationTriangle,
    FaUser,
    FaPhone,
    FaEnvelope as FaEnvelopeIcon,
    FaCalendarAlt,
    FaPaperPlane,
    FaInbox,
    FaStar,
    FaFilter,
    FaSort,
    FaInfoCircle
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const STATUS_OPTIONS = [
    { value: 'new', label: 'New', color: 'bg-red-500/20 text-red-400 border-red-500', icon: <FaClock className="animate-pulse" />, priority: 1 },
    { value: 'read', label: 'Read', color: 'bg-blue-500/20 text-blue-400 border-blue-500', icon: <FaEye />, priority: 2 },
    { value: 'replied', label: 'Replied', color: 'bg-green-500/20 text-green-400 border-green-500', icon: <FaCheck />, priority: 3 },
    { value: 'archived', label: 'Archived', color: 'bg-gray-500/20 text-gray-400 border-gray-500', icon: <FaArchive />, priority: 4 },
];

const SORT_OPTIONS = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'name-asc', label: 'Name (A-Z)' },
    { value: 'status-priority', label: 'By Priority' },
];

export default function AdminMessages() {
    // ============ STATE ============
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [showDetail, setShowDetail] = useState(false);
    const [showReplyModal, setShowReplyModal] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [stats, setStats] = useState({ total: 0, new: 0, read: 0, replied: 0, archived: 0 });

    // Filter & Search State
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [viewMode, setViewMode] = useState('list');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    // Messages
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // ============ EFFECTS ============
    useEffect(() => {
        fetchMessages();
        fetchStats();
    }, []);

    // ============ API CALLS ============
    const fetchMessages = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch('http://localhost:5000/api/contact', {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            const data = await response.json();
            setMessages(data.data || []);
        } catch (error) {
            console.error('Error fetching messages:', error);
            setMessages([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch('http://localhost:5000/api/contact/stats/summary', {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            const data = await response.json();
            if (data.success) {
                setStats(data.data);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`http://localhost:5000/api/contact/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ status }),
            });
            if (response.ok) {
                fetchMessages();
                fetchStats();
                setSuccessMessage(`Message marked as ${status}`);
                setTimeout(() => setSuccessMessage(''), 3000);
            }
        } catch (error) {
            console.error('Error updating status:', error);
            setErrorMessage('Failed to update status');
            setTimeout(() => setErrorMessage(''), 3000);
        }
    };

    const handleReply = async (id) => {
        if (!replyText.trim()) return;

        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`http://localhost:5000/api/contact/${id}/reply`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ replyMessage: replyText }),
            });
            if (response.ok) {
                setReplyText('');
                setShowReplyModal(false);
                setSelectedMessage(null);
                fetchMessages();
                fetchStats();
                setSuccessMessage('Reply sent successfully!');
                setTimeout(() => setSuccessMessage(''), 3000);
            }
        } catch (error) {
            console.error('Error sending reply:', error);
            setErrorMessage('Failed to send reply');
            setTimeout(() => setErrorMessage(''), 3000);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this message?')) return;

        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`http://localhost:5000/api/contact/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (response.ok) {
                fetchMessages();
                fetchStats();
                setSuccessMessage('Message deleted successfully!');
                setTimeout(() => setSuccessMessage(''), 3000);
                if (selectedMessage?._id === id) {
                    setShowDetail(false);
                    setSelectedMessage(null);
                }
            }
        } catch (error) {
            console.error('Error deleting message:', error);
            setErrorMessage('Failed to delete message');
            setTimeout(() => setErrorMessage(''), 3000);
        }
    };

    // ============ HANDLERS ============
    const handleViewDetail = (message) => {
        setSelectedMessage(message);
        setShowDetail(true);
        document.body.style.overflow = 'hidden';

        // Auto-mark as read if new
        if (message.status === 'new') {
            handleStatusUpdate(message._id, 'read');
        }
    };

    const closeDetail = () => {
        setShowDetail(false);
        setSelectedMessage(null);
        document.body.style.overflow = 'unset';
    };

    const handleReplyClick = (message) => {
        setSelectedMessage(message);
        setShowReplyModal(true);
        setReplyText('');
    };

    const getStatusStyle = (status) => {
        return STATUS_OPTIONS.find(s => s.value === status)?.color || STATUS_OPTIONS[0].color;
    };

    const getStatusIcon = (status) => {
        return STATUS_OPTIONS.find(s => s.value === status)?.icon || <FaEnvelope />;
    };

    const getStatusPriority = (status) => {
        return STATUS_OPTIONS.find(s => s.value === status)?.priority || 99;
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = (now - date) / (1000 * 60 * 60);

        if (diffInHours < 1) {
            const minutes = Math.floor(diffInHours * 60);
            return minutes <= 1 ? 'Just now' : `${minutes} min ago`;
        } else if (diffInHours < 24) {
            return `${Math.floor(diffInHours)} hours ago`;
        } else if (diffInHours < 48) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        }
    };

    const getFullDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // ============ FILTERED & SORTED DATA ============
    const filteredAndSortedMessages = useMemo(() => {
        let result = [...messages];

        // Status filter
        if (statusFilter !== 'all') {
            result = result.filter(m => m.status === statusFilter);
        }

        // Search
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(m =>
                (m.name?.toLowerCase().includes(query)) ||
                (m.email?.toLowerCase().includes(query)) ||
                (m.phone?.toLowerCase().includes(query)) ||
                (m.message?.toLowerCase().includes(query))
            );
        }

        // Sort
        switch (sortBy) {
            case 'newest':
                result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case 'oldest':
                result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                break;
            case 'name-asc':
                result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
                break;
            case 'status-priority':
                result.sort((a, b) => getStatusPriority(a.status) - getStatusPriority(b.status));
                break;
            default:
                break;
        }

        return result;
    }, [messages, statusFilter, searchQuery, sortBy]);

    // Pagination
    const totalPages = Math.ceil(filteredAndSortedMessages.length / itemsPerPage);
    const paginatedMessages = filteredAndSortedMessages.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, statusFilter, sortBy]);

    // ============ LOADING ============
    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <FaSpinner className="text-moon text-4xl animate-spin mx-auto mb-4" />
                    <p className="text-gray-400">Loading messages...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* ============ HEADER ============ */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-orbitron font-bold text-white">Messages</h1>
                    <p className="text-gray-400 mt-1">Manage contact form submissions from your visitors</p>
                </div>
                {stats.new > 0 && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-lg">
                        <FaClock className="text-red-400 animate-pulse" />
                        <span className="text-red-400 font-semibold">
                            {stats.new} new message{stats.new !== 1 ? 's' : ''}
                        </span>
                    </div>
                )}
            </div>

            {/* ============ STATS CARDS ============ */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-gradient-to-br from-blue-500/20 to-transparent rounded-xl p-4 border border-blue-500/20">
                    <div className="flex items-center gap-2 mb-1">
                        <FaInbox className="text-blue-400" />
                        <div className="text-2xl font-bold text-white">{stats.total}</div>
                    </div>
                    <div className="text-xs text-gray-400">Total Messages</div>
                </div>
                <div className="bg-gradient-to-br from-red-500/20 to-transparent rounded-xl p-4 border border-red-500/20">
                    <div className="flex items-center gap-2 mb-1">
                        <FaClock className="text-red-400 animate-pulse" />
                        <div className="text-2xl font-bold text-white">{stats.new}</div>
                    </div>
                    <div className="text-xs text-gray-400">New</div>
                </div>
                <div className="bg-gradient-to-br from-blue-400/20 to-transparent rounded-xl p-4 border border-blue-400/20">
                    <div className="flex items-center gap-2 mb-1">
                        <FaEye className="text-blue-400" />
                        <div className="text-2xl font-bold text-white">{stats.read}</div>
                    </div>
                    <div className="text-xs text-gray-400">Read</div>
                </div>
                <div className="bg-gradient-to-br from-green-500/20 to-transparent rounded-xl p-4 border border-green-500/20">
                    <div className="flex items-center gap-2 mb-1">
                        <FaCheck className="text-green-400" />
                        <div className="text-2xl font-bold text-white">{stats.replied}</div>
                    </div>
                    <div className="text-xs text-gray-400">Replied</div>
                </div>
                <div className="bg-gradient-to-br from-gray-500/20 to-transparent rounded-xl p-4 border border-gray-500/20">
                    <div className="flex items-center gap-2 mb-1">
                        <FaArchive className="text-gray-400" />
                        <div className="text-2xl font-bold text-white">{stats.archived}</div>
                    </div>
                    <div className="text-xs text-gray-400">Archived</div>
                </div>
            </div>

            {/* ============ MESSAGES ============ */}
            {successMessage && (
                <div className="p-3 bg-green-500/20 border border-green-500 rounded-lg text-green-400 flex items-center gap-2">
                    <FaCheckCircle /> {successMessage}
                </div>
            )}
            {errorMessage && (
                <div className="p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-400 flex items-center gap-2">
                    <FaExclamationTriangle /> {errorMessage}
                </div>
            )}

            {/* ============ TOOLBAR ============ */}
            <div className="bg-deep/50 rounded-xl border border-moon/20 p-4">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search by name, email, phone, or message..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-moon focus:outline-none"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                            >
                                <FaTimes size={12} />
                            </button>
                        )}
                    </div>

                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-moon focus:outline-none"
                    >
                        <option value="all">All Status</option>
                        {STATUS_OPTIONS.map(s => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                    </select>

                    {/* Sort */}
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-moon focus:outline-none"
                    >
                        {SORT_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>

                    {/* View Toggle */}
                    <div className="flex gap-1 bg-black/50 rounded-lg p-1 border border-gray-700">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded transition ${viewMode === 'list' ? 'bg-moon text-black' : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            <FaList />
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded transition ${viewMode === 'grid' ? 'bg-moon text-black' : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            <FaThLarge />
                        </button>
                    </div>
                </div>

                {/* Results info */}
                <div className="mt-3 flex justify-between items-center text-sm">
                    <span className="text-gray-400">
                        {filteredAndSortedMessages.length} message{filteredAndSortedMessages.length !== 1 ? 's' : ''}
                        {searchQuery && ` for "${searchQuery}"`}
                    </span>
                    {totalPages > 1 && (
                        <span className="text-gray-400">Page {currentPage} of {totalPages}</span>
                    )}
                </div>
            </div>

            {/* ============ MESSAGES CONTENT ============ */}
            {paginatedMessages.length === 0 ? (
                <div className="text-center py-16 bg-deep/30 rounded-xl border border-moon/10">
                    <FaEnvelope className="text-6xl text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">
                        {searchQuery || statusFilter !== 'all'
                            ? 'No messages match your filters'
                            : 'No messages yet'}
                    </p>
                    {(searchQuery || statusFilter !== 'all') && (
                        <button
                            onClick={() => { setSearchQuery(''); setStatusFilter('all'); }}
                            className="mt-4 text-moon hover:text-yellow-400 text-sm"
                        >
                            Clear filters
                        </button>
                    )}
                </div>
            ) : (
                <div className={viewMode === 'list' ? 'space-y-3' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'}>
                    <AnimatePresence>
                        {paginatedMessages.map((message) => (
                            <motion.div
                                key={message._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className={`bg-deep/50 rounded-xl border overflow-hidden transition-all ${message.status === 'new'
                                        ? 'border-red-500/30 bg-red-500/5 hover:border-red-500/50'
                                        : 'border-moon/10 hover:border-moon/30'
                                    }`}
                            >
                                {viewMode === 'list' ? (
                                    /* ============ LIST VIEW ============ */
                                    <div className="p-4 flex gap-4">
                                        {/* Avatar */}
                                        <div className="flex-shrink-0">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${message.status === 'new'
                                                    ? 'bg-gradient-to-br from-red-500 to-red-600 text-white'
                                                    : 'bg-gradient-to-br from-moon to-yellow-600 text-black'
                                                }`}>
                                                {message.name?.charAt(0)?.toUpperCase() || 'U'}
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-3 mb-1">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <h3 className={`font-bold ${message.status === 'new' ? 'text-white' : 'text-gray-200'}`}>
                                                        {message.name}
                                                    </h3>
                                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusStyle(message.status)}`}>
                                                        {getStatusIcon(message.status)}
                                                        {message.status}
                                                    </span>
                                                </div>
                                                <span className="text-gray-500 text-xs whitespace-nowrap">
                                                    {formatDate(message.createdAt)}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
                                                <span className="flex items-center gap-1">
                                                    <FaEnvelopeIcon className="text-moon" />
                                                    {message.email}
                                                </span>
                                                {message.phone && (
                                                    <span className="flex items-center gap-1">
                                                        <FaPhone className="text-moon" />
                                                        {message.phone}
                                                    </span>
                                                )}
                                            </div>

                                            <p className={`text-sm line-clamp-2 ${message.status === 'new' ? 'text-gray-200' : 'text-gray-400'
                                                }`}>
                                                {message.message}
                                            </p>

                                            {message.replyMessage && (
                                                <div className="mt-2 p-2 bg-green-500/10 border-l-2 border-green-500 rounded text-xs">
                                                    <p className="text-green-400 font-semibold mb-1">Your Reply:</p>
                                                    <p className="text-gray-300 line-clamp-1">{message.replyMessage}</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex-shrink-0 flex flex-col gap-1">
                                            <button
                                                onClick={() => handleViewDetail(message)}
                                                className="p-2 text-moon hover:bg-moon/20 rounded-lg transition"
                                                title="View Details"
                                            >
                                                <FaEye />
                                            </button>
                                            <button
                                                onClick={() => handleReplyClick(message)}
                                                className="p-2 text-green-400 hover:bg-green-500/20 rounded-lg transition"
                                                title="Reply"
                                            >
                                                <FaReply />
                                            </button>
                                            {message.status !== 'archived' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(message._id, 'archived')}
                                                    className="p-2 text-gray-400 hover:bg-gray-500/20 rounded-lg transition"
                                                    title="Archive"
                                                >
                                                    <FaArchive />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(message._id)}
                                                className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition"
                                                title="Delete"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    /* ============ GRID VIEW ============ */
                                    <div className="p-5 h-full flex flex-col">
                                        {/* Header */}
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${message.status === 'new'
                                                        ? 'bg-gradient-to-br from-red-500 to-red-600 text-white'
                                                        : 'bg-gradient-to-br from-moon to-yellow-600 text-black'
                                                    }`}>
                                                    {message.name?.charAt(0)?.toUpperCase() || 'U'}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-white text-sm">{message.name}</h3>
                                                    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold ${getStatusStyle(message.status)}`}>
                                                        {getStatusIcon(message.status)}
                                                        {message.status}
                                                    </span>
                                                </div>
                                            </div>
                                            <span className="text-gray-500 text-[10px]">
                                                {formatDate(message.createdAt)}
                                            </span>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 space-y-2 mb-3">
                                            <div className="text-xs text-gray-400 flex items-center gap-1 truncate">
                                                <FaEnvelopeIcon className="text-moon flex-shrink-0" />
                                                <span className="truncate">{message.email}</span>
                                            </div>
                                            {message.phone && (
                                                <div className="text-xs text-gray-400 flex items-center gap-1">
                                                    <FaPhone className="text-moon flex-shrink-0" />
                                                    <span>{message.phone}</span>
                                                </div>
                                            )}
                                            <p className={`text-xs line-clamp-3 ${message.status === 'new' ? 'text-gray-200' : 'text-gray-400'
                                                }`}>
                                                {message.message}
                                            </p>
                                            {message.replyMessage && (
                                                <div className="p-2 bg-green-500/10 border-l-2 border-green-500 rounded text-[10px]">
                                                    <p className="text-green-400 font-semibold">Replied</p>
                                                    <p className="text-gray-400 line-clamp-1">{message.replyMessage}</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-1 pt-3 border-t border-gray-800">
                                            <button
                                                onClick={() => handleViewDetail(message)}
                                                className="flex-1 py-1.5 text-moon hover:bg-moon/20 rounded transition text-xs flex items-center justify-center gap-1"
                                            >
                                                <FaEye /> View
                                            </button>
                                            <button
                                                onClick={() => handleReplyClick(message)}
                                                className="flex-1 py-1.5 text-green-400 hover:bg-green-500/20 rounded transition text-xs flex items-center justify-center gap-1"
                                            >
                                                <FaReply /> Reply
                                            </button>
                                            <button
                                                onClick={() => handleDelete(message._id)}
                                                className="p-1.5 text-red-400 hover:bg-red-500/20 rounded transition"
                                                title="Delete"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* ============ PAGINATION ============ */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className={`p-2 rounded-lg transition ${currentPage === 1
                                ? 'text-gray-600 cursor-not-allowed'
                                : 'text-moon hover:bg-moon/20'
                            }`}
                    >
                        <FaChevronLeft />
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) pageNum = i + 1;
                        else if (currentPage <= 3) pageNum = i + 1;
                        else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                        else pageNum = currentPage - 2 + i;
                        return (
                            <button
                                key={pageNum}
                                onClick={() => setCurrentPage(pageNum)}
                                className={`w-10 h-10 rounded-lg transition ${currentPage === pageNum
                                        ? 'bg-moon text-black font-bold'
                                        : 'text-gray-400 hover:bg-moon/20'
                                    }`}
                            >
                                {pageNum}
                            </button>
                        );
                    })}
                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className={`p-2 rounded-lg transition ${currentPage === totalPages
                                ? 'text-gray-600 cursor-not-allowed'
                                : 'text-moon hover:bg-moon/20'
                            }`}
                    >
                        <FaChevronRight />
                    </button>
                </div>
            )}

            {/* ============ DETAIL VIEW MODAL ============ */}
            <AnimatePresence>
                {showDetail && selectedMessage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4 backdrop-blur-md"
                        onClick={closeDetail}
                    >
                        <button
                            onClick={closeDetail}
                            className="absolute top-4 right-4 text-white hover:text-moon transition p-2 hover:bg-white/10 rounded-full z-10"
                        >
                            <FaTimes size={24} />
                        </button>

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="max-w-2xl w-full bg-gradient-to-br from-deep to-black rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="p-6 bg-gradient-to-br from-moon/10 to-purple-500/10">
                                <div className="flex items-center gap-4 mb-3">
                                    <div className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl ${selectedMessage.status === 'new'
                                            ? 'bg-gradient-to-br from-red-500 to-red-600 text-white'
                                            : 'bg-gradient-to-br from-moon to-yellow-600 text-black'
                                        }`}>
                                        {selectedMessage.name?.charAt(0)?.toUpperCase() || 'U'}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">{selectedMessage.name}</h2>
                                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border mt-1 ${getStatusStyle(selectedMessage.status)}`}>
                                            {getStatusIcon(selectedMessage.status)}
                                            {selectedMessage.status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className="p-6 space-y-3 border-b border-gray-800">
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-3">
                                    Contact Information
                                </h3>
                                <div className="flex items-center gap-3 text-gray-300">
                                    <FaEnvelopeIcon className="text-moon" />
                                    <span>{selectedMessage.email}</span>
                                </div>
                                {selectedMessage.phone && (
                                    <div className="flex items-center gap-3 text-gray-300">
                                        <FaPhone className="text-moon" />
                                        <span>{selectedMessage.phone}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-3 text-gray-300">
                                    <FaCalendarAlt className="text-moon" />
                                    <span className="text-sm">{getFullDate(selectedMessage.createdAt)}</span>
                                </div>
                            </div>

                            {/* Message */}
                            <div className="p-6 border-b border-gray-800">
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-3">
                                    Message
                                </h3>
                                <div className="bg-black/30 rounded-lg p-4">
                                    <p className="text-gray-200 whitespace-pre-wrap">{selectedMessage.message}</p>
                                </div>
                            </div>

                            {/* Reply */}
                            {selectedMessage.replyMessage && (
                                <div className="p-6 border-b border-gray-800">
                                    <h3 className="text-sm font-bold text-green-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                                        <FaCheckCircle /> Your Reply
                                    </h3>
                                    <div className="bg-green-500/10 border-l-4 border-green-500 rounded-lg p-4">
                                        <p className="text-gray-200 whitespace-pre-wrap">{selectedMessage.replyMessage}</p>
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="p-6 flex flex-wrap gap-3">
                                <button
                                    onClick={() => {
                                        setShowDetail(false);
                                        handleReplyClick(selectedMessage);
                                    }}
                                    className="flex-1 btn-primary justify-center"
                                >
                                    <FaReply /> {selectedMessage.replyMessage ? 'Reply Again' : 'Reply'}
                                </button>
                                {selectedMessage.status !== 'archived' && (
                                    <button
                                        onClick={() => {
                                            handleStatusUpdate(selectedMessage._id, 'archived');
                                            closeDetail();
                                        }}
                                        className="px-4 py-2 bg-gray-500/20 text-gray-400 border border-gray-500/30 rounded-lg hover:bg-gray-500/30 transition flex items-center gap-2"
                                    >
                                        <FaArchive /> Archive
                                    </button>
                                )}
                                <button
                                    onClick={() => {
                                        handleDelete(selectedMessage._id);
                                        closeDetail();
                                    }}
                                    className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition flex items-center gap-2"
                                >
                                    <FaTrash /> Delete
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ============ REPLY MODAL ============ */}
            <AnimatePresence>
                {showReplyModal && selectedMessage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4 backdrop-blur-md"
                        onClick={() => setShowReplyModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="max-w-2xl w-full bg-gradient-to-br from-deep to-black rounded-2xl overflow-hidden shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-6 border-b border-gray-800">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                        <FaReply className="text-moon" /> Reply to {selectedMessage.name}
                                    </h2>
                                    <button
                                        onClick={() => setShowReplyModal(false)}
                                        className="text-gray-400 hover:text-white transition"
                                    >
                                        <FaTimes />
                                    </button>
                                </div>
                            </div>

                            {/* Original Message */}
                            <div className="p-6 bg-black/30 border-b border-gray-800">
                                <p className="text-gray-400 text-xs uppercase tracking-wide mb-2">Original Message</p>
                                <div className="flex items-start gap-3">
                                    <FaEnvelopeIcon className="text-moon mt-1 flex-shrink-0" />
                                    <p className="text-gray-300 text-sm">{selectedMessage.message}</p>
                                </div>
                                <div className="mt-3 text-xs text-gray-500">
                                    From: {selectedMessage.name} ({selectedMessage.email})
                                </div>
                            </div>

                            {/* Reply Form */}
                            <div className="p-6">
                                <label className="block text-gray-400 text-xs uppercase tracking-wide mb-2">
                                    Your Reply
                                </label>
                                <textarea
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    placeholder="Type your reply here..."
                                    rows="6"
                                    className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-moon focus:outline-none resize-none"
                                    autoFocus
                                />

                                <div className="flex gap-3 mt-4">
                                    <button
                                        onClick={() => handleReply(selectedMessage._id)}
                                        disabled={!replyText.trim()}
                                        className="flex-1 btn-primary justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <FaPaperPlane /> Send Reply
                                    </button>
                                    <button
                                        onClick={() => setShowReplyModal(false)}
                                        className="btn-secondary"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}