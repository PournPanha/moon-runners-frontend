import React, { useState, useEffect, useMemo } from 'react';
import {
    FaEdit,
    FaTrash,
    FaPlus,
    FaSave,
    FaTimes,
    FaSearch,
    FaThLarge,
    FaList,
    FaChevronLeft,
    FaChevronRight,
    FaEye,
    FaCalendarAlt,
    FaMapMarkerAlt,
    FaRoute,
    FaClock,
    FaUsers,
    FaCheck,
    FaExclamationTriangle,
    FaFire,
    FaFlagCheckered,
    FaHourglassHalf,
    FaTrophy,
    FaRunning,
    FaSpinner
} from 'react-icons/fa';

const STATUS_OPTIONS = [
    { value: 'upcoming', label: 'Upcoming', color: 'bg-green-500/20 text-green-400 border-green-500', icon: '🟢' },
    { value: 'ongoing', label: 'Ongoing', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500', icon: '🟡' },
    { value: 'completed', label: 'Completed', color: 'bg-gray-500/20 text-gray-400 border-gray-500', icon: '⚪' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-500/20 text-red-400 border-red-500', icon: '🔴' },
];

const VIBE_OPTIONS = [
    'Energetic', 'Peaceful', 'Competitive', 'Scenic', 'Fast-paced', 'Meaningful', 'Social', 'Intense'
];

const SORT_OPTIONS = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'title-asc', label: 'Title (A-Z)' },
    { value: 'date-asc', label: 'Date (Soonest)' },
    { value: 'participants', label: 'Most Participants' },
];

export default function AdminEvents() {
    // ============ STATE ============
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showDetail, setShowDetail] = useState(false);

    // Filter & Search State
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [viewMode, setViewMode] = useState('grid');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(9);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        location: '',
        distance: '',
        time: '',
        day: '',
        vibe: '',
        participants: 0,
        description: '',
        status: 'upcoming',
        date: new Date().toISOString().split('T')[0],
    });

    // Messages
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // ============ EFFECTS ============
    useEffect(() => {
        fetchEvents();
    }, []);

    // ============ API CALLS ============
    const fetchEvents = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch('http://localhost:5000/api/events', {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            const data = await response.json();
            setEvents(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching events:', error);
            setEvents([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('adminToken');
        const method = editingEvent ? 'PUT' : 'POST';
        const url = editingEvent
            ? `http://localhost:5000/api/events/${editingEvent._id}`
            : 'http://localhost:5000/api/events';

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                fetchEvents();
                setSuccessMessage(editingEvent ? 'Event updated successfully!' : 'Event created successfully!');
                setTimeout(() => setSuccessMessage(''), 3000);
                setShowForm(false);
                setEditingEvent(null);
                resetForm();
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.message || 'Operation failed');
            }
        } catch (error) {
            console.error('Error saving event:', error);
            setErrorMessage('Network error. Please try again.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            const token = localStorage.getItem('adminToken');
            try {
                const response = await fetch(`http://localhost:5000/api/events/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                if (response.ok) {
                    fetchEvents();
                    setSuccessMessage('Event deleted successfully!');
                    setTimeout(() => setSuccessMessage(''), 3000);
                    if (selectedEvent?._id === id) {
                        setShowDetail(false);
                        setSelectedEvent(null);
                    }
                }
            } catch (error) {
                console.error('Error deleting event:', error);
                setErrorMessage('Delete failed. Please try again.');
            }
        }
    };

    // ============ HANDLERS ============
    const handleEditClick = (event) => {
        setEditingEvent(event);
        setFormData({
            title: event.title || '',
            location: event.location || '',
            distance: event.distance || '',
            time: event.time || '',
            day: event.day || '',
            vibe: event.vibe || '',
            participants: event.participants || 0,
            description: event.description || '',
            status: event.status || 'upcoming',
            date: event.date ? new Date(event.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        });
        setShowForm(true);
    };

    const handleViewDetail = (event) => {
        setSelectedEvent(event);
        setShowDetail(true);
        document.body.style.overflow = 'hidden';
    };

    const closeDetail = () => {
        setShowDetail(false);
        setSelectedEvent(null);
        document.body.style.overflow = 'unset';
    };

    const resetForm = () => {
        setFormData({
            title: '',
            location: '',
            distance: '',
            time: '',
            day: '',
            vibe: '',
            participants: 0,
            description: '',
            status: 'upcoming',
            date: new Date().toISOString().split('T')[0],
        });
        setErrorMessage('');
    };

    const getStatusStyle = (status) => {
        return STATUS_OPTIONS.find(s => s.value === status)?.color || STATUS_OPTIONS[0].color;
    };

    const getStatusIcon = (status) => {
        return STATUS_OPTIONS.find(s => s.value === status)?.icon || '🟢';
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // ============ FILTERED & SORTED DATA ============
    const filteredAndSortedEvents = useMemo(() => {
        let result = [...events];

        // Status filter
        if (statusFilter !== 'all') {
            result = result.filter(e => e.status === statusFilter);
        }

        // Search
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(e =>
                (e.title?.toLowerCase().includes(query)) ||
                (e.location?.toLowerCase().includes(query)) ||
                (e.distance?.toLowerCase().includes(query)) ||
                (e.vibe?.toLowerCase().includes(query))
            );
        }

        // Sort
        switch (sortBy) {
            case 'newest':
                result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
                break;
            case 'oldest':
                result.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
                break;
            case 'title-asc':
                result.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
                break;
            case 'date-asc':
                result.sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0));
                break;
            case 'participants':
                result.sort((a, b) => (b.participants || 0) - (a.participants || 0));
                break;
            default:
                break;
        }

        return result;
    }, [events, statusFilter, searchQuery, sortBy]);

    // Pagination
    const totalPages = Math.ceil(filteredAndSortedEvents.length / itemsPerPage);
    const paginatedEvents = filteredAndSortedEvents.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, statusFilter, sortBy]);

    // Statistics
    const stats = useMemo(() => ({
        total: events.length,
        upcoming: events.filter(e => e.status === 'upcoming').length,
        ongoing: events.filter(e => e.status === 'ongoing').length,
        completed: events.filter(e => e.status === 'completed').length,
        totalParticipants: events.reduce((sum, e) => sum + (e.participants || 0), 0),
        totalDistance: events.length,
    }), [events]);

    // ============ LOADING ============
    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <FaSpinner className="text-moon text-4xl animate-spin mx-auto mb-4" />
                    <p className="text-gray-400">Loading events...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* ============ HEADER ============ */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-orbitron font-bold text-white">Events</h1>
                    <p className="text-gray-400 mt-1">Manage your running events and activities</p>
                </div>
                <button
                    onClick={() => { setShowForm(true); resetForm(); setEditingEvent(null); }}
                    className="btn-primary"
                >
                    <FaPlus /> Add Event
                </button>
            </div>

            {/* ============ STATS CARDS ============ */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="bg-gradient-to-br from-blue-500/20 to-transparent rounded-xl p-4 border border-blue-500/20">
                    <div className="flex items-center gap-2 mb-1">
                        <FaCalendarAlt className="text-blue-400" />
                        <div className="text-2xl font-bold text-white">{stats.total}</div>
                    </div>
                    <div className="text-xs text-gray-400">Total Events</div>
                </div>
                <div className="bg-gradient-to-br from-green-500/20 to-transparent rounded-xl p-4 border border-green-500/20">
                    <div className="flex items-center gap-2 mb-1">
                        <FaHourglassHalf className="text-green-400" />
                        <div className="text-2xl font-bold text-white">{stats.upcoming}</div>
                    </div>
                    <div className="text-xs text-gray-400">Upcoming</div>
                </div>
                <div className="bg-gradient-to-br from-yellow-500/20 to-transparent rounded-xl p-4 border border-yellow-500/20">
                    <div className="flex items-center gap-2 mb-1">
                        <FaFire className="text-yellow-400" />
                        <div className="text-2xl font-bold text-white">{stats.ongoing}</div>
                    </div>
                    <div className="text-xs text-gray-400">Ongoing</div>
                </div>
                <div className="bg-gradient-to-br from-gray-500/20 to-transparent rounded-xl p-4 border border-gray-500/20">
                    <div className="flex items-center gap-2 mb-1">
                        <FaFlagCheckered className="text-gray-400" />
                        <div className="text-2xl font-bold text-white">{stats.completed}</div>
                    </div>
                    <div className="text-xs text-gray-400">Completed</div>
                </div>
                <div className="bg-gradient-to-br from-purple-500/20 to-transparent rounded-xl p-4 border border-purple-500/20">
                    <div className="flex items-center gap-2 mb-1">
                        <FaUsers className="text-purple-400" />
                        <div className="text-lg font-bold text-white">{stats.totalParticipants}</div>
                    </div>
                    <div className="text-xs text-gray-400">Participants</div>
                </div>
                <div className="bg-gradient-to-br from-pink-500/20 to-transparent rounded-xl p-4 border border-pink-500/20">
                    <div className="flex items-center gap-2 mb-1">
                        <FaTrophy className="text-pink-400" />
                        <div className="text-lg font-bold text-white">{events.filter(e => e.vibe === 'Competitive').length}</div>
                    </div>
                    <div className="text-xs text-gray-400">Competitive</div>
                </div>
            </div>

            {/* ============ MESSAGES ============ */}
            {successMessage && (
                <div className="p-3 bg-green-500/20 border border-green-500 rounded-lg text-green-400 flex items-center gap-2">
                    <FaCheck /> {successMessage}
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
                            placeholder="Search by title, location, distance..."
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
                            <option key={s.value} value={s.value}>{s.icon} {s.label}</option>
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
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded transition ${viewMode === 'grid' ? 'bg-moon text-black' : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            <FaThLarge />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded transition ${viewMode === 'list' ? 'bg-moon text-black' : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            <FaList />
                        </button>
                    </div>
                </div>

                {/* Results info */}
                <div className="mt-3 flex justify-between items-center text-sm">
                    <span className="text-gray-400">
                        {filteredAndSortedEvents.length} event{filteredAndSortedEvents.length !== 1 ? 's' : ''}
                        {searchQuery && ` for "${searchQuery}"`}
                    </span>
                    {totalPages > 1 && (
                        <span className="text-gray-400">Page {currentPage} of {totalPages}</span>
                    )}
                </div>
            </div>

            {/* ============ EVENTS CONTENT ============ */}
            {paginatedEvents.length === 0 ? (
                <div className="text-center py-16 bg-deep/30 rounded-xl border border-moon/10">
                    <FaCalendarAlt className="text-6xl text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">
                        {searchQuery || statusFilter !== 'all'
                            ? 'No events match your filters'
                            : 'No events yet. Click "Add Event" to create one.'}
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
            ) : viewMode === 'grid' ? (
                /* ============ GRID VIEW ============ */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paginatedEvents.map((event) => (
                        <div
                            key={event._id}
                            className="bg-deep/50 rounded-xl border border-moon/10 overflow-hidden hover:border-moon/50 transition group"
                        >
                            {/* Header */}
                            <div className="relative p-5 bg-gradient-to-br from-moon/5 to-purple-500/5">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-bold text-white truncate pr-2">
                                            {event.title}
                                        </h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusStyle(event.status)}`}>
                                                {getStatusIcon(event.status)} {event.status}
                                            </span>
                                            {event.vibe && (
                                                <span className="inline-block px-2 py-0.5 rounded-full text-[10px] bg-moon/20 text-moon">
                                                    {event.vibe}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Hover Actions */}
                                <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                                    <button
                                        onClick={() => handleViewDetail(event)}
                                        className="bg-moon/80 p-2 rounded-full hover:bg-moon transition"
                                        title="View Details"
                                    >
                                        <FaEye className="text-black text-xs" />
                                    </button>
                                    <button
                                        onClick={() => handleEditClick(event)}
                                        className="bg-blue-500/80 p-2 rounded-full hover:bg-blue-600 transition"
                                        title="Edit"
                                    >
                                        <FaEdit className="text-white text-xs" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(event._id)}
                                        className="bg-red-500/80 p-2 rounded-full hover:bg-red-600 transition"
                                        title="Delete"
                                    >
                                        <FaTrash className="text-white text-xs" />
                                    </button>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="p-4 space-y-2">
                                <div className="flex items-center gap-2 text-gray-400 text-sm">
                                    <FaMapMarkerAlt className="text-moon flex-shrink-0" />
                                    <span className="truncate">{event.location || 'No location'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-400 text-sm">
                                    <FaRoute className="text-moon flex-shrink-0" />
                                    <span>{event.distance || 'N/A'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-400 text-sm">
                                    <FaClock className="text-moon flex-shrink-0" />
                                    <span>{event.time || 'N/A'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-400 text-sm">
                                    <FaCalendarAlt className="text-moon flex-shrink-0" />
                                    <span>{event.day || formatDate(event.date)}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-400 text-sm">
                                    <FaUsers className="text-moon flex-shrink-0" />
                                    <span>{event.participants || 0} participants</span>
                                </div>
                            </div>

                            {event.description && (
                                <div className="px-4 pb-4">
                                    <p className="text-gray-500 text-xs line-clamp-2">{event.description}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                /* ============ LIST VIEW ============ */
                <div className="bg-deep/50 rounded-xl border border-moon/10 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-black/50 border-b border-moon/20">
                                <tr>
                                    <th className="text-left py-3 px-4 text-gray-300 text-sm font-semibold">Event</th>
                                    <th className="text-left py-3 px-4 text-gray-300 text-sm font-semibold">Location</th>
                                    <th className="text-left py-3 px-4 text-gray-300 text-sm font-semibold">Distance</th>
                                    <th className="text-left py-3 px-4 text-gray-300 text-sm font-semibold">Date</th>
                                    <th className="text-left py-3 px-4 text-gray-300 text-sm font-semibold">Status</th>
                                    <th className="text-left py-3 px-4 text-gray-300 text-sm font-semibold">Participants</th>
                                    <th className="text-right py-3 px-4 text-gray-300 text-sm font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedEvents.map((event) => (
                                    <tr key={event._id} className="border-b border-gray-800 hover:bg-moon/5 transition">
                                        <td className="py-3 px-4">
                                            <div>
                                                <div className="text-white font-medium">{event.title}</div>
                                                {event.vibe && (
                                                    <div className="text-moon text-xs">{event.vibe}</div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-gray-400 text-sm">{event.location || '-'}</td>
                                        <td className="py-3 px-4 text-gray-300 text-sm font-semibold">{event.distance || '-'}</td>
                                        <td className="py-3 px-4 text-gray-400 text-sm">
                                            {event.day || formatDate(event.date)}
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold border ${getStatusStyle(event.status)}`}>
                                                {event.status || 'upcoming'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="flex items-center gap-1 text-gray-300 text-sm">
                                                <FaUsers className="text-moon text-xs" />
                                                {event.participants || 0}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleViewDetail(event)}
                                                    className="text-moon hover:text-yellow-400 transition"
                                                    title="View"
                                                >
                                                    <FaEye />
                                                </button>
                                                <button
                                                    onClick={() => handleEditClick(event)}
                                                    className="text-blue-400 hover:text-blue-300 transition"
                                                    title="Edit"
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(event._id)}
                                                    className="text-red-400 hover:text-red-300 transition"
                                                    title="Delete"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
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

            {/* ============ FORM MODAL ============ */}
            {showForm && (
                <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-deep rounded-xl max-w-2xl w-full my-8 p-6 border border-moon/20">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-white">
                                {editingEvent ? 'Edit Event' : 'Add Event'}
                            </h2>
                            <button onClick={() => { setShowForm(false); resetForm(); }} className="text-gray-400 hover:text-white">
                                <FaTimes />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-gray-400 text-xs mb-1">Event Title *</label>
                                    <input
                                        type="text"
                                        placeholder="e.g., Riverside Night Run"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-moon focus:outline-none"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-400 text-xs mb-1">Location *</label>
                                    <input
                                        type="text"
                                        placeholder="e.g., Diamond Island"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-moon focus:outline-none"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-400 text-xs mb-1">Distance *</label>
                                    <input
                                        type="text"
                                        placeholder="e.g., 5KM / 10KM"
                                        value={formData.distance}
                                        onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                                        className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-moon focus:outline-none"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-400 text-xs mb-1">Time *</label>
                                    <input
                                        type="text"
                                        placeholder="e.g., 7:00 PM - 9:00 PM"
                                        value={formData.time}
                                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                        className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-moon focus:outline-none"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-400 text-xs mb-1">Day *</label>
                                    <input
                                        type="text"
                                        placeholder="e.g., Every Friday"
                                        value={formData.day}
                                        onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                                        className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-moon focus:outline-none"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-400 text-xs mb-1">Vibe</label>
                                    <select
                                        value={formData.vibe}
                                        onChange={(e) => setFormData({ ...formData, vibe: e.target.value })}
                                        className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-moon focus:outline-none"
                                    >
                                        <option value="">Select vibe</option>
                                        {VIBE_OPTIONS.map(vibe => (
                                            <option key={vibe} value={vibe}>{vibe}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-gray-400 text-xs mb-1">Participants</label>
                                    <input
                                        type="number"
                                        value={formData.participants}
                                        onChange={(e) => setFormData({ ...formData, participants: parseInt(e.target.value) || 0 })}
                                        className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-moon focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-400 text-xs mb-1">Status</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-moon focus:outline-none"
                                    >
                                        {STATUS_OPTIONS.map(s => (
                                            <option key={s.value} value={s.value}>{s.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-gray-400 text-xs mb-1">Date</label>
                                    <input
                                        type="date"
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-moon focus:outline-none"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-gray-400 text-xs mb-1">Description</label>
                                    <textarea
                                        placeholder="Describe the event..."
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-moon focus:outline-none"
                                        rows="3"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button type="submit" className="flex-1 btn-primary justify-center">
                                    <FaSave /> {editingEvent ? 'Update' : 'Create'} Event
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setShowForm(false); resetForm(); }}
                                    className="btn-secondary"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ============ DETAIL VIEW MODAL ============ */}
            {showDetail && selectedEvent && (
                <div
                    className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4 backdrop-blur-md"
                    onClick={closeDetail}
                >
                    <button
                        onClick={closeDetail}
                        className="absolute top-4 right-4 text-white hover:text-moon transition p-2 hover:bg-white/10 rounded-full z-10"
                    >
                        <FaTimes size={24} />
                    </button>

                    <div
                        className="max-w-2xl w-full bg-gradient-to-br from-deep to-black rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="p-8 bg-gradient-to-br from-moon/10 to-purple-500/10">
                            <div className="flex items-center gap-3 mb-3">
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getStatusStyle(selectedEvent.status)}`}>
                                    {getStatusIcon(selectedEvent.status)} {selectedEvent.status}
                                </span>
                                {selectedEvent.vibe && (
                                    <span className="inline-block px-3 py-1 rounded-full text-xs bg-moon/20 text-moon">
                                        {selectedEvent.vibe}
                                    </span>
                                )}
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-2">{selectedEvent.title}</h2>
                            <p className="text-gray-400">{selectedEvent.description || 'No description available'}</p>
                        </div>

                        {/* Details Grid */}
                        <div className="p-8 space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-black/30 rounded-lg p-4">
                                    <div className="flex items-center gap-2 text-moon mb-1">
                                        <FaMapMarkerAlt />
                                        <span className="text-xs text-gray-400">Location</span>
                                    </div>
                                    <p className="text-white font-semibold">{selectedEvent.location || 'N/A'}</p>
                                </div>
                                <div className="bg-black/30 rounded-lg p-4">
                                    <div className="flex items-center gap-2 text-moon mb-1">
                                        <FaRoute />
                                        <span className="text-xs text-gray-400">Distance</span>
                                    </div>
                                    <p className="text-white font-semibold">{selectedEvent.distance || 'N/A'}</p>
                                </div>
                                <div className="bg-black/30 rounded-lg p-4">
                                    <div className="flex items-center gap-2 text-moon mb-1">
                                        <FaClock />
                                        <span className="text-xs text-gray-400">Time</span>
                                    </div>
                                    <p className="text-white font-semibold">{selectedEvent.time || 'N/A'}</p>
                                </div>
                                <div className="bg-black/30 rounded-lg p-4">
                                    <div className="flex items-center gap-2 text-moon mb-1">
                                        <FaCalendarAlt />
                                        <span className="text-xs text-gray-400">Day / Date</span>
                                    </div>
                                    <p className="text-white font-semibold">
                                        {selectedEvent.day || formatDate(selectedEvent.date)}
                                    </p>
                                </div>
                                <div className="bg-black/30 rounded-lg p-4 col-span-2">
                                    <div className="flex items-center gap-2 text-moon mb-1">
                                        <FaUsers />
                                        <span className="text-xs text-gray-400">Participants</span>
                                    </div>
                                    <p className="text-white font-semibold text-2xl">
                                        {selectedEvent.participants || 0}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="p-6 pt-0 flex gap-3">
                            <button
                                onClick={() => {
                                    closeDetail();
                                    handleEditClick(selectedEvent);
                                }}
                                className="flex-1 btn-primary justify-center"
                            >
                                <FaEdit /> Edit Event
                            </button>
                            <button
                                onClick={() => {
                                    handleDelete(selectedEvent._id);
                                    closeDetail();
                                }}
                                className="px-6 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition flex items-center gap-2"
                            >
                                <FaTrash /> Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}