import React, { useState, useEffect, useMemo } from 'react';
import {
    FaEdit,
    FaTrash,
    FaPlus,
    FaSave,
    FaTimes,
    FaRunning,
    FaSearch,
    FaThLarge,
    FaList,
    FaChevronLeft,
    FaChevronRight,
    FaEye,
    FaTrophy,
    FaMedal,
    FaCalendarAlt,
    FaUser,
    FaQuoteLeft,
    FaCheck,
    FaExclamationTriangle,
    FaSort,
    FaStar,
    FaFire,
    FaChartLine
} from 'react-icons/fa';

const BADGES = [
    { value: 'Elite', label: 'Elite', color: 'bg-yellow-500/20 text-yellow-500 border-yellow-500' },
    { value: 'Advanced', label: 'Advanced', color: 'bg-blue-500/20 text-blue-500 border-blue-500' },
    { value: 'Intermediate', label: 'Intermediate', color: 'bg-green-500/20 text-green-500 border-green-500' },
    { value: 'Beginner', label: 'Beginner', color: 'bg-gray-500/20 text-gray-400 border-gray-500' },
];

const SORT_OPTIONS = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'name-asc', label: 'Name (A-Z)' },
    { value: 'name-desc', label: 'Name (Z-A)' },
    { value: 'miles-high', label: 'Most Miles' },
    { value: 'miles-low', label: 'Least Miles' },
    { value: 'runs-high', label: 'Most Runs' },
];

export default function AdminMembers() {
    // ============ STATE ============
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingMember, setEditingMember] = useState(null);
    const [selectedMember, setSelectedMember] = useState(null);
    const [showDetail, setShowDetail] = useState(false);

    // Filter & Search State
    const [searchQuery, setSearchQuery] = useState('');
    const [badgeFilter, setBadgeFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [viewMode, setViewMode] = useState('grid');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(12);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        badge: 'Beginner',
        miles: 0,
        runs: 0,
        achievements: 0,
        quote: '',
        status: 'active',
    });

    // Messages
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // ============ EFFECTS ============
    useEffect(() => {
        fetchMembers();
    }, []);

    // ============ API CALLS ============
    const fetchMembers = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch('http://localhost:5000/api/members', {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            const data = await response.json();
            setMembers(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching members:', error);
            setMembers([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('adminToken');
        const method = editingMember ? 'PUT' : 'POST';
        const url = editingMember
            ? `http://localhost:5000/api/members/${editingMember._id}`
            : 'http://localhost:5000/api/members';

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
                fetchMembers();
                setSuccessMessage(editingMember ? 'Member updated successfully!' : 'Member added successfully!');
                setTimeout(() => setSuccessMessage(''), 3000);
                setShowForm(false);
                setEditingMember(null);
                resetForm();
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.message || 'Operation failed');
            }
        } catch (error) {
            console.error('Error saving member:', error);
            setErrorMessage('Network error. Please try again.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this member?')) {
            const token = localStorage.getItem('adminToken');
            try {
                const response = await fetch(`http://localhost:5000/api/members/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                if (response.ok) {
                    fetchMembers();
                    setSuccessMessage('Member deleted successfully!');
                    setTimeout(() => setSuccessMessage(''), 3000);
                    if (selectedMember?._id === id) {
                        setShowDetail(false);
                        setSelectedMember(null);
                    }
                }
            } catch (error) {
                console.error('Error deleting member:', error);
                setErrorMessage('Delete failed. Please try again.');
            }
        }
    };

    // ============ HANDLERS ============
    const resetForm = () => {
        setFormData({
            name: '',
            role: '',
            badge: 'Beginner',
            miles: 0,
            runs: 0,
            achievements: 0,
            quote: '',
            status: 'active',
        });
        setErrorMessage('');
    };

    const handleEditClick = (member) => {
        setEditingMember(member);
        setFormData({
            name: member.name || '',
            role: member.role || '',
            badge: member.badge || 'Beginner',
            miles: member.miles || 0,
            runs: member.runs || 0,
            achievements: member.achievements || 0,
            quote: member.quote || '',
            status: member.status || 'active',
        });
        setShowForm(true);
    };

    const handleViewDetail = (member) => {
        setSelectedMember(member);
        setShowDetail(true);
        document.body.style.overflow = 'hidden';
    };

    const closeDetail = () => {
        setShowDetail(false);
        setSelectedMember(null);
        document.body.style.overflow = 'unset';
    };

    const getBadgeStyle = (badge) => {
        return BADGES.find(b => b.value === badge)?.color || BADGES[3].color;
    };

    // ============ FILTERED & SORTED DATA ============
    const filteredAndSortedMembers = useMemo(() => {
        let result = [...members];

        // Apply badge filter
        if (badgeFilter !== 'all') {
            result = result.filter(m => m.badge === badgeFilter);
        }

        // Apply status filter
        if (statusFilter !== 'all') {
            result = result.filter(m => m.status === statusFilter);
        }

        // Apply search
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(m =>
                (m.name?.toLowerCase().includes(query)) ||
                (m.role?.toLowerCase().includes(query)) ||
                (m.quote?.toLowerCase().includes(query))
            );
        }

        // Apply sorting
        switch (sortBy) {
            case 'newest':
                result.sort((a, b) => new Date(b.joinDate || 0) - new Date(a.joinDate || 0));
                break;
            case 'oldest':
                result.sort((a, b) => new Date(a.joinDate || 0) - new Date(b.joinDate || 0));
                break;
            case 'name-asc':
                result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
                break;
            case 'name-desc':
                result.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
                break;
            case 'miles-high':
                result.sort((a, b) => (b.miles || 0) - (a.miles || 0));
                break;
            case 'miles-low':
                result.sort((a, b) => (a.miles || 0) - (b.miles || 0));
                break;
            case 'runs-high':
                result.sort((a, b) => (b.runs || 0) - (a.runs || 0));
                break;
            default:
                break;
        }

        return result;
    }, [members, badgeFilter, statusFilter, searchQuery, sortBy]);

    // Pagination
    const totalPages = Math.ceil(filteredAndSortedMembers.length / itemsPerPage);
    const paginatedMembers = filteredAndSortedMembers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, badgeFilter, statusFilter, sortBy]);

    // Statistics
    const stats = useMemo(() => {
        const totalMiles = members.reduce((sum, m) => sum + (m.miles || 0), 0);
        const totalRuns = members.reduce((sum, m) => sum + (m.runs || 0), 0);
        return {
            total: members.length,
            active: members.filter(m => m.status === 'active').length,
            elite: members.filter(m => m.badge === 'Elite').length,
            advanced: members.filter(m => m.badge === 'Advanced').length,
            intermediate: members.filter(m => m.badge === 'Intermediate').length,
            beginner: members.filter(m => m.badge === 'Beginner').length,
            totalMiles: totalMiles.toLocaleString(),
            totalRuns: totalRuns,
            avgMiles: members.length > 0 ? Math.round(totalMiles / members.length) : 0,
        };
    }, [members]);

    // ============ LOADING STATE ============
    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-moon/20 border-t-moon rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading members...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* ============ HEADER ============ */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-orbitron font-bold text-white">Members</h1>
                    <p className="text-gray-400 mt-1">Manage your club members and track their progress</p>
                </div>
                <button
                    onClick={() => { setShowForm(true); resetForm(); setEditingMember(null); }}
                    className="btn-primary"
                >
                    <FaPlus /> Add Member
                </button>
            </div>

            {/* ============ STATS CARDS ============ */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                <div className="bg-gradient-to-br from-blue-500/20 to-transparent rounded-xl p-4 border border-blue-500/20">
                    <div className="flex items-center gap-2 mb-1">
                        <FaUser className="text-blue-400" />
                        <div className="text-2xl font-bold text-white">{stats.total}</div>
                    </div>
                    <div className="text-xs text-gray-400">Total Members</div>
                </div>
                <div className="bg-gradient-to-br from-green-500/20 to-transparent rounded-xl p-4 border border-green-500/20">
                    <div className="flex items-center gap-2 mb-1">
                        <FaCheck className="text-green-400" />
                        <div className="text-2xl font-bold text-white">{stats.active}</div>
                    </div>
                    <div className="text-xs text-gray-400">Active</div>
                </div>
                <div className="bg-gradient-to-br from-yellow-500/20 to-transparent rounded-xl p-4 border border-yellow-500/20">
                    <div className="flex items-center gap-2 mb-1">
                        <FaStar className="text-yellow-400" />
                        <div className="text-2xl font-bold text-white">{stats.elite}</div>
                    </div>
                    <div className="text-xs text-gray-400">Elite</div>
                </div>
                <div className="bg-gradient-to-br from-purple-500/20 to-transparent rounded-xl p-4 border border-purple-500/20">
                    <div className="flex items-center gap-2 mb-1">
                        <FaTrophy className="text-purple-400" />
                        <div className="text-2xl font-bold text-white">{stats.advanced}</div>
                    </div>
                    <div className="text-xs text-gray-400">Advanced</div>
                </div>
                <div className="bg-gradient-to-br from-orange-500/20 to-transparent rounded-xl p-4 border border-orange-500/20">
                    <div className="flex items-center gap-2 mb-1">
                        <FaChartLine className="text-orange-400" />
                        <div className="text-lg font-bold text-white">{stats.totalMiles}</div>
                    </div>
                    <div className="text-xs text-gray-400">Total Miles</div>
                </div>
                <div className="bg-gradient-to-br from-red-500/20 to-transparent rounded-xl p-4 border border-red-500/20">
                    <div className="flex items-center gap-2 mb-1">
                        <FaFire className="text-red-400" />
                        <div className="text-lg font-bold text-white">{stats.totalRuns}</div>
                    </div>
                    <div className="text-xs text-gray-400">Total Runs</div>
                </div>
                <div className="bg-gradient-to-br from-cyan-500/20 to-transparent rounded-xl p-4 border border-cyan-500/20">
                    <div className="flex items-center gap-2 mb-1">
                        <FaMedal className="text-cyan-400" />
                        <div className="text-lg font-bold text-white">{stats.avgMiles}</div>
                    </div>
                    <div className="text-xs text-gray-400">Avg Miles</div>
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
                            placeholder="Search by name, role, or quote..."
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

                    {/* Badge Filter */}
                    <select
                        value={badgeFilter}
                        onChange={(e) => setBadgeFilter(e.target.value)}
                        className="px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-moon focus:outline-none"
                    >
                        <option value="all">All Badges</option>
                        {BADGES.map(badge => (
                            <option key={badge.value} value={badge.value}>{badge.label}</option>
                        ))}
                    </select>

                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-moon focus:outline-none"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
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
                        {filteredAndSortedMembers.length} member{filteredAndSortedMembers.length !== 1 ? 's' : ''}
                        {searchQuery && ` for "${searchQuery}"`}
                    </span>
                    {totalPages > 1 && (
                        <span className="text-gray-400">Page {currentPage} of {totalPages}</span>
                    )}
                </div>
            </div>

            {/* ============ MEMBERS CONTENT ============ */}
            {paginatedMembers.length === 0 ? (
                <div className="text-center py-16 bg-deep/30 rounded-xl border border-moon/10">
                    <FaRunning className="text-6xl text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">
                        {searchQuery || badgeFilter !== 'all' || statusFilter !== 'all'
                            ? 'No members match your filters'
                            : 'No members yet. Click "Add Member" to create one.'}
                    </p>
                    {(searchQuery || badgeFilter !== 'all' || statusFilter !== 'all') && (
                        <button
                            onClick={() => { setSearchQuery(''); setBadgeFilter('all'); setStatusFilter('all'); }}
                            className="mt-4 text-moon hover:text-yellow-400 text-sm"
                        >
                            Clear filters
                        </button>
                    )}
                </div>
            ) : viewMode === 'grid' ? (
                /* ============ GRID VIEW ============ */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {paginatedMembers.map((member) => (
                        <div
                            key={member._id}
                            className="bg-deep/50 rounded-xl border border-moon/10 overflow-hidden hover:border-moon/50 transition group"
                        >
                            {/* Header with Avatar */}
                            <div className="relative p-6 bg-gradient-to-br from-moon/5 to-purple-500/5">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-moon to-yellow-600 flex items-center justify-center shadow-lg">
                                            <span className="text-black font-bold text-xl">
                                                {member.name?.charAt(0)?.toUpperCase() || 'M'}
                                            </span>
                                        </div>
                                        {member.status === 'active' && (
                                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-deep"></div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-bold text-white truncate">
                                            {member.name}
                                        </h3>
                                        <p className="text-gray-400 text-sm truncate">{member.role}</p>
                                        <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getBadgeStyle(member.badge)}`}>
                                            {member.badge}
                                        </span>
                                    </div>
                                </div>

                                {/* Hover Actions */}
                                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                                    <button
                                        onClick={() => handleViewDetail(member)}
                                        className="bg-moon/80 p-2 rounded-full hover:bg-moon transition"
                                        title="View Details"
                                    >
                                        <FaEye className="text-black text-xs" />
                                    </button>
                                    <button
                                        onClick={() => handleEditClick(member)}
                                        className="bg-blue-500/80 p-2 rounded-full hover:bg-blue-600 transition"
                                        title="Edit"
                                    >
                                        <FaEdit className="text-white text-xs" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(member._id)}
                                        className="bg-red-500/80 p-2 rounded-full hover:bg-red-600 transition"
                                        title="Delete"
                                    >
                                        <FaTrash className="text-white text-xs" />
                                    </button>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="p-4 space-y-3">
                                <div className="grid grid-cols-3 gap-2 text-center">
                                    <div className="bg-black/30 rounded-lg p-2">
                                        <div className="text-lg font-bold text-moon">{member.miles || 0}</div>
                                        <div className="text-[10px] text-gray-500">Miles</div>
                                    </div>
                                    <div className="bg-black/30 rounded-lg p-2">
                                        <div className="text-lg font-bold text-moon">{member.runs || 0}</div>
                                        <div className="text-[10px] text-gray-500">Runs</div>
                                    </div>
                                    <div className="bg-black/30 rounded-lg p-2">
                                        <div className="text-lg font-bold text-moon">{member.achievements || 0}</div>
                                        <div className="text-[10px] text-gray-500">Awards</div>
                                    </div>
                                </div>

                                {member.quote && (
                                    <p className="text-gray-400 text-xs italic line-clamp-2 border-l-2 border-moon/30 pl-2">
                                        "{member.quote}"
                                    </p>
                                )}
                            </div>
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
                                    <th className="text-left py-3 px-4 text-gray-300 text-sm font-semibold">Member</th>
                                    <th className="text-left py-3 px-4 text-gray-300 text-sm font-semibold">Role</th>
                                    <th className="text-left py-3 px-4 text-gray-300 text-sm font-semibold">Badge</th>
                                    <th className="text-left py-3 px-4 text-gray-300 text-sm font-semibold">Miles</th>
                                    <th className="text-left py-3 px-4 text-gray-300 text-sm font-semibold">Runs</th>
                                    <th className="text-left py-3 px-4 text-gray-300 text-sm font-semibold">Awards</th>
                                    <th className="text-left py-3 px-4 text-gray-300 text-sm font-semibold">Status</th>
                                    <th className="text-right py-3 px-4 text-gray-300 text-sm font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedMembers.map((member) => (
                                    <tr key={member._id} className="border-b border-gray-800 hover:bg-moon/5 transition">
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-moon to-yellow-600 flex items-center justify-center flex-shrink-0">
                                                    <span className="text-black font-bold">
                                                        {member.name?.charAt(0)?.toUpperCase() || 'M'}
                                                    </span>
                                                </div>
                                                <span className="text-white font-medium">{member.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-gray-400 text-sm">{member.role || '-'}</td>
                                        <td className="py-3 px-4">
                                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold border ${getBadgeStyle(member.badge)}`}>
                                                {member.badge}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-moon font-semibold">{member.miles || 0}</td>
                                        <td className="py-3 px-4 text-gray-300">{member.runs || 0}</td>
                                        <td className="py-3 px-4 text-gray-300">{member.achievements || 0}</td>
                                        <td className="py-3 px-4">
                                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${member.status === 'active'
                                                    ? 'bg-green-500/20 text-green-400'
                                                    : 'bg-gray-500/20 text-gray-400'
                                                }`}>
                                                {member.status || 'active'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleViewDetail(member)}
                                                    className="text-moon hover:text-yellow-400 transition"
                                                    title="View"
                                                >
                                                    <FaEye />
                                                </button>
                                                <button
                                                    onClick={() => handleEditClick(member)}
                                                    className="text-blue-400 hover:text-blue-300 transition"
                                                    title="Edit"
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(member._id)}
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
                    <div className="bg-deep rounded-xl max-w-md w-full my-8 p-6 border border-moon/20">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-white">
                                {editingMember ? 'Edit Member' : 'Add Member'}
                            </h2>
                            <button onClick={() => { setShowForm(false); resetForm(); }} className="text-gray-400 hover:text-white">
                                <FaTimes />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-gray-400 text-xs mb-1">Full Name *</label>
                                <input
                                    type="text"
                                    placeholder="Enter full name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-moon focus:outline-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-400 text-xs mb-1">Role *</label>
                                <input
                                    type="text"
                                    placeholder="e.g., Runner, Captain, Founder"
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-moon focus:outline-none"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-400 text-xs mb-1">Badge Level</label>
                                    <select
                                        value={formData.badge}
                                        onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                                        className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-moon focus:outline-none"
                                    >
                                        {BADGES.map(badge => (
                                            <option key={badge.value} value={badge.value}>{badge.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-xs mb-1">Status</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-moon focus:outline-none"
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-gray-400 text-xs mb-1">Miles</label>
                                    <input
                                        type="number"
                                        value={formData.miles}
                                        onChange={(e) => setFormData({ ...formData, miles: parseInt(e.target.value) || 0 })}
                                        className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-moon focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-xs mb-1">Runs</label>
                                    <input
                                        type="number"
                                        value={formData.runs}
                                        onChange={(e) => setFormData({ ...formData, runs: parseInt(e.target.value) || 0 })}
                                        className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-moon focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-xs mb-1">Awards</label>
                                    <input
                                        type="number"
                                        value={formData.achievements}
                                        onChange={(e) => setFormData({ ...formData, achievements: parseInt(e.target.value) || 0 })}
                                        className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-moon focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-400 text-xs mb-1">Quote</label>
                                <textarea
                                    placeholder="Personal motto or quote"
                                    value={formData.quote}
                                    onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                                    className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-moon focus:outline-none"
                                    rows="2"
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button type="submit" className="flex-1 btn-primary justify-center">
                                    <FaSave /> {editingMember ? 'Update' : 'Create'}
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
            {showDetail && selectedMember && (
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
                        className="max-w-2xl w-full bg-gradient-to-br from-deep to-black rounded-2xl overflow-hidden shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="p-8 bg-gradient-to-br from-moon/10 to-purple-500/10 text-center">
                            <div className="relative inline-block mb-4">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-moon to-yellow-600 flex items-center justify-center shadow-2xl">
                                    <span className="text-black font-bold text-3xl">
                                        {selectedMember.name?.charAt(0)?.toUpperCase() || 'M'}
                                    </span>
                                </div>
                                {selectedMember.status === 'active' && (
                                    <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-4 border-deep"></div>
                                )}
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-1">{selectedMember.name}</h2>
                            <p className="text-gray-400 mb-3">{selectedMember.role}</p>
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${getBadgeStyle(selectedMember.badge)}`}>
                                {selectedMember.badge} Runner
                            </span>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 divide-x divide-gray-800 border-y border-gray-800">
                            <div className="p-6 text-center">
                                <FaTrophy className="text-moon text-2xl mx-auto mb-2" />
                                <div className="text-2xl font-bold text-white">{selectedMember.miles || 0}</div>
                                <div className="text-xs text-gray-500 uppercase tracking-wide">Total Miles</div>
                            </div>
                            <div className="p-6 text-center">
                                <FaRunning className="text-moon text-2xl mx-auto mb-2" />
                                <div className="text-2xl font-bold text-white">{selectedMember.runs || 0}</div>
                                <div className="text-xs text-gray-500 uppercase tracking-wide">Total Runs</div>
                            </div>
                            <div className="p-6 text-center">
                                <FaMedal className="text-moon text-2xl mx-auto mb-2" />
                                <div className="text-2xl font-bold text-white">{selectedMember.achievements || 0}</div>
                                <div className="text-xs text-gray-500 uppercase tracking-wide">Awards</div>
                            </div>
                        </div>

                        {/* Quote */}
                        {selectedMember.quote && (
                            <div className="p-6 border-b border-gray-800">
                                <FaQuoteLeft className="text-moon/50 text-2xl mb-3" />
                                <p className="text-gray-300 italic text-lg">"{selectedMember.quote}"</p>
                            </div>
                        )}

                        {/* Meta Info */}
                        <div className="p-6 space-y-3">
                            <div className="flex items-center gap-3 text-gray-400 text-sm">
                                <FaCalendarAlt className="text-moon" />
                                <span>
                                    Joined: {selectedMember.joinDate
                                        ? new Date(selectedMember.joinDate).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })
                                        : 'N/A'}
                                </span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-400 text-sm">
                                <FaUser className="text-moon" />
                                <span>Status: {selectedMember.status || 'Active'}</span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="p-6 pt-0 flex gap-3">
                            <button
                                onClick={() => {
                                    closeDetail();
                                    handleEditClick(selectedMember);
                                }}
                                className="flex-1 btn-primary justify-center"
                            >
                                <FaEdit /> Edit Member
                            </button>
                            <button
                                onClick={() => {
                                    handleDelete(selectedMember._id);
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