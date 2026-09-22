import React, { useState, useEffect, useMemo } from 'react';
import {
    FaEdit,
    FaTrash,
    FaPlus,
    FaSave,
    FaTimes,
    FaDollarSign,
    FaSearch,
    FaThLarge,
    FaList,
    FaChevronLeft,
    FaChevronRight,
    FaEye,
    FaBuilding,
    FaEnvelope,
    FaUserTie,
    FaCalendarAlt,
    FaCheck,
    FaExclamationTriangle,
    FaCheckCircle,
    FaHourglassHalf,
    FaTimesCircle,
    FaGift,
    FaHandshake,
    FaChartLine,
    FaGlobe,
    FaSpinner,
    FaStar
} from 'react-icons/fa';

const PACKAGE_OPTIONS = [
    { value: '3 months', label: '3 Months', amount: 750, color: 'from-blue-500/20', popular: false },
    { value: '6 months', label: '6 Months', amount: 1500, color: 'from-purple-500/20', popular: true },
    { value: '12 months', label: '12 Months', amount: 2100, color: 'from-yellow-500/20', popular: false },
];

const STATUS_OPTIONS = [
    { value: 'active', label: 'Active', color: 'bg-green-500/20 text-green-400 border-green-500', icon: <FaCheckCircle /> },
    { value: 'pending', label: 'Pending', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500', icon: <FaHourglassHalf /> },
    { value: 'expired', label: 'Expired', color: 'bg-red-500/20 text-red-400 border-red-500', icon: <FaTimesCircle /> },
];

const SORT_OPTIONS = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'name-asc', label: 'Name (A-Z)' },
    { value: 'amount-high', label: 'Highest Amount' },
    { value: 'amount-low', label: 'Lowest Amount' },
];

const BENEFIT_OPTIONS = [
    'Logo on event shirts',
    'Sponsor booth during events',
    'Brand banner at start/finish',
    'Brand name mentioned',
    'Product featured in activities',
    'TikTok & Facebook mentions',
    'Product review videos',
    'Event highlight videos',
    'Social media posts',
    'Photo shoots with hashtags',
];

export default function AdminSponsors() {
    // ============ STATE ============
    const [sponsors, setSponsors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingSponsor, setEditingSponsor] = useState(null);
    const [selectedSponsor, setSelectedSponsor] = useState(null);
    const [showDetail, setShowDetail] = useState(false);

    // Filter & Search State
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [packageFilter, setPackageFilter] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [viewMode, setViewMode] = useState('grid');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(9);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        package: '3 months',
        amount: 750,
        status: 'pending',
        benefits: [],
        contactPerson: '',
        contactEmail: '',
        website: '',
        logo: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
    });

    // Messages
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // ============ EFFECTS ============
    useEffect(() => {
        fetchSponsors();
    }, []);

    // ============ API CALLS ============
    const fetchSponsors = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch('http://localhost:5000/api/sponsors', {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            const data = await response.json();
            setSponsors(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching sponsors:', error);
            setSponsors([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('adminToken');
        const method = editingSponsor ? 'PUT' : 'POST';
        const url = editingSponsor
            ? `http://localhost:5000/api/sponsors/${editingSponsor._id}`
            : 'http://localhost:5000/api/sponsors';

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
                fetchSponsors();
                setSuccessMessage(editingSponsor ? 'Sponsor updated successfully!' : 'Sponsor added successfully!');
                setTimeout(() => setSuccessMessage(''), 3000);
                setShowForm(false);
                setEditingSponsor(null);
                resetForm();
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.message || 'Operation failed');
            }
        } catch (error) {
            console.error('Error saving sponsor:', error);
            setErrorMessage('Network error. Please try again.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this sponsor?')) {
            const token = localStorage.getItem('adminToken');
            try {
                const response = await fetch(`http://localhost:5000/api/sponsors/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                if (response.ok) {
                    fetchSponsors();
                    setSuccessMessage('Sponsor deleted successfully!');
                    setTimeout(() => setSuccessMessage(''), 3000);
                    if (selectedSponsor?._id === id) {
                        setShowDetail(false);
                        setSelectedSponsor(null);
                    }
                }
            } catch (error) {
                console.error('Error deleting sponsor:', error);
                setErrorMessage('Delete failed. Please try again.');
            }
        }
    };

    // ============ HANDLERS ============
    const handleEditClick = (sponsor) => {
        setEditingSponsor(sponsor);
        setFormData({
            name: sponsor.name || '',
            package: sponsor.package || '3 months',
            amount: sponsor.amount || 0,
            status: sponsor.status || 'pending',
            benefits: sponsor.benefits || [],
            contactPerson: sponsor.contactPerson || '',
            contactEmail: sponsor.contactEmail || '',
            website: sponsor.website || '',
            logo: sponsor.logo || '',
            startDate: sponsor.startDate ? new Date(sponsor.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            endDate: sponsor.endDate ? new Date(sponsor.endDate).toISOString().split('T')[0] : '',
        });
        setShowForm(true);
    };

    const handleViewDetail = (sponsor) => {
        setSelectedSponsor(sponsor);
        setShowDetail(true);
        document.body.style.overflow = 'hidden';
    };

    const closeDetail = () => {
        setShowDetail(false);
        setSelectedSponsor(null);
        document.body.style.overflow = 'unset';
    };

    const resetForm = () => {
        setFormData({
            name: '',
            package: '3 months',
            amount: 750,
            status: 'pending',
            benefits: [],
            contactPerson: '',
            contactEmail: '',
            website: '',
            logo: '',
            startDate: new Date().toISOString().split('T')[0],
            endDate: '',
        });
        setErrorMessage('');
    };

    const handlePackageChange = (pkg) => {
        const selected = PACKAGE_OPTIONS.find(p => p.value === pkg);
        setFormData(prev => ({
            ...prev,
            package: pkg,
            amount: selected?.amount || 0,
        }));
    };

    const toggleBenefit = (benefit) => {
        setFormData(prev => ({
            ...prev,
            benefits: prev.benefits.includes(benefit)
                ? prev.benefits.filter(b => b !== benefit)
                : [...prev.benefits, benefit]
        }));
    };

    const getStatusStyle = (status) => {
        return STATUS_OPTIONS.find(s => s.value === status)?.color || STATUS_OPTIONS[1].color;
    };

    const getStatusIcon = (status) => {
        return STATUS_OPTIONS.find(s => s.value === status)?.icon || <FaHourglassHalf />;
    };

    const getPackageColor = (pkg) => {
        return PACKAGE_OPTIONS.find(p => p.value === pkg)?.color || 'from-gray-500/20';
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
    const filteredAndSortedSponsors = useMemo(() => {
        let result = [...sponsors];

        // Status filter
        if (statusFilter !== 'all') {
            result = result.filter(s => s.status === statusFilter);
        }

        // Package filter
        if (packageFilter !== 'all') {
            result = result.filter(s => s.package === packageFilter);
        }

        // Search
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(s =>
                (s.name?.toLowerCase().includes(query)) ||
                (s.contactPerson?.toLowerCase().includes(query)) ||
                (s.contactEmail?.toLowerCase().includes(query)) ||
                (s.package?.toLowerCase().includes(query))
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
            case 'name-asc':
                result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
                break;
            case 'amount-high':
                result.sort((a, b) => (b.amount || 0) - (a.amount || 0));
                break;
            case 'amount-low':
                result.sort((a, b) => (a.amount || 0) - (b.amount || 0));
                break;
            default:
                break;
        }

        return result;
    }, [sponsors, statusFilter, packageFilter, searchQuery, sortBy]);

    // Pagination
    const totalPages = Math.ceil(filteredAndSortedSponsors.length / itemsPerPage);
    const paginatedSponsors = filteredAndSortedSponsors.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, statusFilter, packageFilter, sortBy]);

    // Statistics
    const stats = useMemo(() => {
        const activeSponsors = sponsors.filter(s => s.status === 'active');
        const totalRevenue = sponsors
            .filter(s => s.status === 'active')
            .reduce((sum, s) => sum + (s.amount || 0), 0);
        
        return {
            total: sponsors.length,
            active: activeSponsors.length,
            pending: sponsors.filter(s => s.status === 'pending').length,
            expired: sponsors.filter(s => s.status === 'expired').length,
            totalRevenue: totalRevenue.toLocaleString(),
            avgAmount: sponsors.length > 0 
                ? Math.round(sponsors.reduce((sum, s) => sum + (s.amount || 0), 0) / sponsors.length)
                : 0,
        };
    }, [sponsors]);

    // ============ LOADING ============
    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <FaSpinner className="text-moon text-4xl animate-spin mx-auto mb-4" />
                    <p className="text-gray-400">Loading sponsors...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* ============ HEADER ============ */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-orbitron font-bold text-white">Sponsors</h1>
                    <p className="text-gray-400 mt-1">Manage your sponsors and partnerships</p>
                </div>
                <button
                    onClick={() => { setShowForm(true); resetForm(); setEditingSponsor(null); }}
                    className="btn-primary"
                >
                    <FaPlus /> Add Sponsor
                </button>
            </div>

            {/* ============ STATS CARDS ============ */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="bg-gradient-to-br from-blue-500/20 to-transparent rounded-xl p-4 border border-blue-500/20">
                    <div className="flex items-center gap-2 mb-1">
                        <FaHandshake className="text-blue-400" />
                        <div className="text-2xl font-bold text-white">{stats.total}</div>
                    </div>
                    <div className="text-xs text-gray-400">Total Sponsors</div>
                </div>
                <div className="bg-gradient-to-br from-green-500/20 to-transparent rounded-xl p-4 border border-green-500/20">
                    <div className="flex items-center gap-2 mb-1">
                        <FaCheckCircle className="text-green-400" />
                        <div className="text-2xl font-bold text-white">{stats.active}</div>
                    </div>
                    <div className="text-xs text-gray-400">Active</div>
                </div>
                <div className="bg-gradient-to-br from-yellow-500/20 to-transparent rounded-xl p-4 border border-yellow-500/20">
                    <div className="flex items-center gap-2 mb-1">
                        <FaHourglassHalf className="text-yellow-400" />
                        <div className="text-2xl font-bold text-white">{stats.pending}</div>
                    </div>
                    <div className="text-xs text-gray-400">Pending</div>
                </div>
                <div className="bg-gradient-to-br from-red-500/20 to-transparent rounded-xl p-4 border border-red-500/20">
                    <div className="flex items-center gap-2 mb-1">
                        <FaTimesCircle className="text-red-400" />
                        <div className="text-2xl font-bold text-white">{stats.expired}</div>
                    </div>
                    <div className="text-xs text-gray-400">Expired</div>
                </div>
                <div className="bg-gradient-to-br from-moon/20 to-transparent rounded-xl p-4 border border-moon/20">
                    <div className="flex items-center gap-2 mb-1">
                        <FaDollarSign className="text-moon" />
                        <div className="text-lg font-bold text-white">${stats.totalRevenue}</div>
                    </div>
                    <div className="text-xs text-gray-400">Total Revenue</div>
                </div>
                <div className="bg-gradient-to-br from-purple-500/20 to-transparent rounded-xl p-4 border border-purple-500/20">
                    <div className="flex items-center gap-2 mb-1">
                        <FaChartLine className="text-purple-400" />
                        <div className="text-lg font-bold text-white">${stats.avgAmount}</div>
                    </div>
                    <div className="text-xs text-gray-400">Avg Amount</div>
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
                            placeholder="Search by name, contact person, or email..."
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

                    {/* Package Filter */}
                    <select
                        value={packageFilter}
                        onChange={(e) => setPackageFilter(e.target.value)}
                        className="px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-moon focus:outline-none"
                    >
                        <option value="all">All Packages</option>
                        {PACKAGE_OPTIONS.map(p => (
                            <option key={p.value} value={p.value}>{p.label}</option>
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
                            className={`p-2 rounded transition ${
                                viewMode === 'grid' ? 'bg-moon text-black' : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            <FaThLarge />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded transition ${
                                viewMode === 'list' ? 'bg-moon text-black' : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            <FaList />
                        </button>
                    </div>
                </div>

                {/* Results info */}
                <div className="mt-3 flex justify-between items-center text-sm">
                    <span className="text-gray-400">
                        {filteredAndSortedSponsors.length} sponsor{filteredAndSortedSponsors.length !== 1 ? 's' : ''}
                        {searchQuery && ` for "${searchQuery}"`}
                    </span>
                    {totalPages > 1 && (
                        <span className="text-gray-400">Page {currentPage} of {totalPages}</span>
                    )}
                </div>
            </div>

            {/* ============ SPONSORS CONTENT ============ */}
            {paginatedSponsors.length === 0 ? (
                <div className="text-center py-16 bg-deep/30 rounded-xl border border-moon/10">
                    <FaDollarSign className="text-6xl text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">
                        {searchQuery || statusFilter !== 'all' || packageFilter !== 'all'
                            ? 'No sponsors match your filters'
                            : 'No sponsors yet. Click "Add Sponsor" to create one.'}
                    </p>
                    {(searchQuery || statusFilter !== 'all' || packageFilter !== 'all') && (
                        <button
                            onClick={() => { setSearchQuery(''); setStatusFilter('all'); setPackageFilter('all'); }}
                            className="mt-4 text-moon hover:text-yellow-400 text-sm"
                        >
                            Clear filters
                        </button>
                    )}
                </div>
            ) : viewMode === 'grid' ? (
                /* ============ GRID VIEW ============ */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paginatedSponsors.map((sponsor) => (
                        <div
                            key={sponsor._id}
                            className="bg-deep/50 rounded-xl border border-moon/10 overflow-hidden hover:border-moon/50 transition group"
                        >
                            {/* Header */}
                            <div className={`relative p-5 bg-gradient-to-br ${getPackageColor(sponsor.package)} to-transparent`}>
                                <div className="flex items-start gap-3 mb-3">
                                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-moon to-yellow-600 flex items-center justify-center shadow-lg flex-shrink-0">
                                        <FaBuilding className="text-black text-2xl" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-bold text-white truncate">
                                            {sponsor.name}
                                        </h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusStyle(sponsor.status)}`}>
                                                {getStatusIcon(sponsor.status)} {sponsor.status}
                                            </span>
                                            {PACKAGE_OPTIONS.find(p => p.value === sponsor.package)?.popular && (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-moon/20 text-moon">
                                                    <FaStar /> Popular
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Hover Actions */}
                                <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                                    <button
                                        onClick={() => handleViewDetail(sponsor)}
                                        className="bg-moon/80 p-2 rounded-full hover:bg-moon transition"
                                        title="View Details"
                                    >
                                        <FaEye className="text-black text-xs" />
                                    </button>
                                    <button
                                        onClick={() => handleEditClick(sponsor)}
                                        className="bg-blue-500/80 p-2 rounded-full hover:bg-blue-600 transition"
                                        title="Edit"
                                    >
                                        <FaEdit className="text-white text-xs" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(sponsor._id)}
                                        className="bg-red-500/80 p-2 rounded-full hover:bg-red-600 transition"
                                        title="Delete"
                                    >
                                        <FaTrash className="text-white text-xs" />
                                    </button>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400 text-sm">Package</span>
                                    <span className="text-moon font-semibold">{sponsor.package}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400 text-sm">Amount</span>
                                    <span className="text-white font-bold text-lg">${(sponsor.amount || 0).toLocaleString()}</span>
                                </div>
                                {sponsor.contactPerson && (
                                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                                        <FaUserTie className="text-moon" />
                                        <span className="truncate">{sponsor.contactPerson}</span>
                                    </div>
                                )}
                                {sponsor.contactEmail && (
                                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                                        <FaEnvelope className="text-moon" />
                                        <span className="truncate">{sponsor.contactEmail}</span>
                                    </div>
                                )}
                                {sponsor.benefits && sponsor.benefits.length > 0 && (
                                    <div className="pt-2 border-t border-gray-800">
                                        <p className="text-xs text-gray-500 mb-1">Benefits:</p>
                                        <div className="flex flex-wrap gap-1">
                                            {sponsor.benefits.slice(0, 3).map((benefit, idx) => (
                                                <span key={idx} className="text-[10px] px-2 py-0.5 bg-moon/10 text-moon rounded-full">
                                                    {benefit.length > 20 ? benefit.substring(0, 20) + '...' : benefit}
                                                </span>
                                            ))}
                                            {sponsor.benefits.length > 3 && (
                                                <span className="text-[10px] px-2 py-0.5 bg-gray-500/20 text-gray-400 rounded-full">
                                                    +{sponsor.benefits.length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    </div>
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
                                    <th className="text-left py-3 px-4 text-gray-300 text-sm font-semibold">Sponsor</th>
                                    <th className="text-left py-3 px-4 text-gray-300 text-sm font-semibold">Package</th>
                                    <th className="text-left py-3 px-4 text-gray-300 text-sm font-semibold">Amount</th>
                                    <th className="text-left py-3 px-4 text-gray-300 text-sm font-semibold">Contact</th>
                                    <th className="text-left py-3 px-4 text-gray-300 text-sm font-semibold">Status</th>
                                    <th className="text-left py-3 px-4 text-gray-300 text-sm font-semibold">Benefits</th>
                                    <th className="text-right py-3 px-4 text-gray-300 text-sm font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedSponsors.map((sponsor) => (
                                    <tr key={sponsor._id} className="border-b border-gray-800 hover:bg-moon/5 transition">
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-moon to-yellow-600 flex items-center justify-center flex-shrink-0">
                                                    <FaBuilding className="text-black" />
                                                </div>
                                                <span className="text-white font-medium">{sponsor.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-moon text-sm font-semibold">{sponsor.package}</td>
                                        <td className="py-3 px-4 text-white font-bold">${(sponsor.amount || 0).toLocaleString()}</td>
                                        <td className="py-3 px-4">
                                            <div className="text-sm">
                                                <div className="text-gray-300">{sponsor.contactPerson || '-'}</div>
                                                <div className="text-gray-500 text-xs">{sponsor.contactEmail || ''}</div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${getStatusStyle(sponsor.status)}`}>
                                                {getStatusIcon(sponsor.status)} {sponsor.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="inline-block px-2 py-1 bg-moon/20 text-moon text-xs rounded-full">
                                                {sponsor.benefits?.length || 0} benefits
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleViewDetail(sponsor)}
                                                    className="text-moon hover:text-yellow-400 transition"
                                                    title="View"
                                                >
                                                    <FaEye />
                                                </button>
                                                <button
                                                    onClick={() => handleEditClick(sponsor)}
                                                    className="text-blue-400 hover:text-blue-300 transition"
                                                    title="Edit"
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(sponsor._id)}
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
                        className={`p-2 rounded-lg transition ${
                            currentPage === 1
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
                                className={`w-10 h-10 rounded-lg transition ${
                                    currentPage === pageNum
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
                        className={`p-2 rounded-lg transition ${
                            currentPage === totalPages
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
                    <div className="bg-deep rounded-xl max-w-2xl w-full my-8 p-6 border border-moon/20 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-white">
                                {editingSponsor ? 'Edit Sponsor' : 'Add Sponsor'}
                            </h2>
                            <button onClick={() => { setShowForm(false); resetForm(); }} className="text-gray-400 hover:text-white">
                                <FaTimes />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Sponsor Name */}
                            <div>
                                <label className="block text-gray-400 text-xs mb-1">Sponsor Name *</label>
                                <input
                                    type="text"
                                    placeholder="e.g., Nike, Adidas"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-moon focus:outline-none"
                                    required
                                />
                            </div>

                            {/* Package Selection */}
                            <div>
                                <label className="block text-gray-400 text-xs mb-2">Package *</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {PACKAGE_OPTIONS.map((pkg) => (
                                        <button
                                            key={pkg.value}
                                            type="button"
                                            onClick={() => handlePackageChange(pkg.value)}
                                            className={`p-3 rounded-lg border transition text-center ${
                                                formData.package === pkg.value
                                                    ? 'border-moon bg-moon/20'
                                                    : 'border-gray-700 hover:border-moon/50'
                                            }`}
                                        >
                                            <div className="text-white font-bold">{pkg.label}</div>
                                            <div className="text-moon text-sm">${pkg.amount}</div>
                                            {pkg.popular && (
                                                <div className="text-[10px] text-moon mt-1">⭐ Popular</div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-400 text-xs mb-1">Amount ($)</label>
                                    <input
                                        type="number"
                                        value={formData.amount}
                                        onChange={(e) => setFormData({ ...formData, amount: parseInt(e.target.value) || 0 })}
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
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-400 text-xs mb-1">Contact Person</label>
                                    <input
                                        type="text"
                                        placeholder="Full name"
                                        value={formData.contactPerson}
                                        onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                                        className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-moon focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-xs mb-1">Contact Email</label>
                                    <input
                                        type="email"
                                        placeholder="email@company.com"
                                        value={formData.contactEmail}
                                        onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                                        className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-moon focus:outline-none"
                                    />
                                </div>
                            </div>

                            {/* Benefits */}
                            <div>
                                <label className="block text-gray-400 text-xs mb-2">
                                    Benefits ({formData.benefits.length} selected)
                                </label>
                                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 bg-black/30 rounded-lg">
                                    {BENEFIT_OPTIONS.map(benefit => (
                                        <button
                                            key={benefit}
                                            type="button"
                                            onClick={() => toggleBenefit(benefit)}
                                            className={`text-left text-xs p-2 rounded transition flex items-center gap-2 ${
                                                formData.benefits.includes(benefit)
                                                    ? 'bg-moon/20 text-moon border border-moon/30'
                                                    : 'bg-black/30 text-gray-400 border border-transparent hover:border-moon/20'
                                            }`}
                                        >
                                            <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${
                                                formData.benefits.includes(benefit)
                                                    ? 'bg-moon border-moon'
                                                    : 'border-gray-600'
                                            }`}>
                                                {formData.benefits.includes(benefit) && (
                                                    <FaCheck className="text-black text-[8px]" />
                                                )}
                                            </div>
                                            <span className="truncate">{benefit}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button type="submit" className="flex-1 btn-primary justify-center">
                                    <FaSave /> {editingSponsor ? 'Update' : 'Create'} Sponsor
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
            {showDetail && selectedSponsor && (
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
                        <div className={`p-8 bg-gradient-to-br ${getPackageColor(selectedSponsor.package)}`}>
                            <div className="flex items-center gap-4 mb-3">
                                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-moon to-yellow-600 flex items-center justify-center shadow-2xl">
                                    <FaBuilding className="text-black text-3xl" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold text-white">{selectedSponsor.name}</h2>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusStyle(selectedSponsor.status)}`}>
                                            {getStatusIcon(selectedSponsor.status)} {selectedSponsor.status}
                                        </span>
                                        <span className="inline-block px-3 py-1 rounded-full text-xs bg-moon/20 text-moon font-semibold">
                                            {selectedSponsor.package}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Amount Highlight */}
                        <div className="p-6 bg-black/50 border-y border-gray-800 text-center">
                            <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Sponsorship Amount</div>
                            <div className="text-4xl font-bold text-moon">
                                ${(selectedSponsor.amount || 0).toLocaleString()}
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="p-6 space-y-4">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide flex items-center gap-2">
                                <FaUserTie className="text-moon" /> Contact Information
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-black/30 rounded-lg p-4">
                                    <div className="text-xs text-gray-500 mb-1">Contact Person</div>
                                    <p className="text-white font-semibold">{selectedSponsor.contactPerson || 'N/A'}</p>
                                </div>
                                <div className="bg-black/30 rounded-lg p-4">
                                    <div className="text-xs text-gray-500 mb-1">Email</div>
                                    <p className="text-white font-semibold truncate">{selectedSponsor.contactEmail || 'N/A'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Benefits */}
                        {selectedSponsor.benefits && selectedSponsor.benefits.length > 0 && (
                            <div className="p-6 border-t border-gray-800">
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide flex items-center gap-2 mb-4">
                                    <FaGift className="text-moon" /> Benefits ({selectedSponsor.benefits.length})
                                </h3>
                                <div className="space-y-2">
                                    {selectedSponsor.benefits.map((benefit, idx) => (
                                        <div key={idx} className="flex items-center gap-2 text-gray-300 text-sm">
                                            <FaCheckCircle className="text-moon flex-shrink-0" />
                                            <span>{benefit}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="p-6 border-t border-gray-800 flex gap-3">
                            <button
                                onClick={() => {
                                    closeDetail();
                                    handleEditClick(selectedSponsor);
                                }}
                                className="flex-1 btn-primary justify-center"
                            >
                                <FaEdit /> Edit Sponsor
                            </button>
                            <button
                                onClick={() => {
                                    handleDelete(selectedSponsor._id);
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