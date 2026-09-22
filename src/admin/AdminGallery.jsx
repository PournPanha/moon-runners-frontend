import React, { useState, useEffect, useMemo } from 'react';
import {
    FaTrash,
    FaPlus,
    FaTimes,
    FaUpload,
    FaImage,
    FaSpinner,
    FaEdit,
    FaEye,
    FaSave,
    FaSearch,
    FaFilter,
    FaThLarge,
    FaList,
    FaCalendarAlt,
    FaMapMarkerAlt,
    FaTag,
    FaHeart,
    FaSort,
    FaSortUp,
    FaSortDown,
    FaChevronLeft,
    FaChevronRight,
    FaInfoCircle,
    FaCheck,
    FaExclamationTriangle,
    FaDownload
} from 'react-icons/fa';

const CATEGORIES = [
    { value: 'all', label: 'All Categories', icon: '📁' },
    { value: 'running', label: 'Running', icon: '🏃' },
    { value: 'group', label: 'Group', icon: '👥' },
    { value: 'event', label: 'Event', icon: '🎪' },
    { value: 'training', label: 'Training', icon: '💪' },
];

const SORT_OPTIONS = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'title-asc', label: 'Title (A-Z)' },
    { value: 'title-desc', label: 'Title (Z-A)' },
    { value: 'likes', label: 'Most Liked' },
];

export default function AdminGallery() {
    // ============ STATE ============
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingImage, setEditingImage] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [showDetail, setShowDetail] = useState(false);

    // Filter & Search State
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(12);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        location: '',
        category: 'running',
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    // Messages
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // ============ EFFECTS ============
    useEffect(() => {
        fetchImages();
    }, []);

    // ============ API CALLS ============
    const fetchImages = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch('http://localhost:5000/api/gallery', {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            const data = await response.json();
            setImages(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching images:', error);
            setImages([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);
        setErrorMessage('');
        setSuccessMessage('');

        const token = localStorage.getItem('adminToken');

        try {
            let response;

            if (editingImage) {
                if (selectedFile) {
                    const formDataObj = new FormData();
                    formDataObj.append('image', selectedFile);
                    formDataObj.append('title', formData.title);
                    formDataObj.append('location', formData.location);
                    formDataObj.append('category', formData.category);

                    response = await fetch(`http://localhost:5000/api/gallery/${editingImage._id}/image`, {
                        method: 'PUT',
                        headers: { 'Authorization': `Bearer ${token}` },
                        body: formDataObj,
                    });
                } else {
                    response = await fetch(`http://localhost:5000/api/gallery/${editingImage._id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            title: formData.title,
                            location: formData.location,
                            category: formData.category,
                        }),
                    });
                }
            } else {
                if (!selectedFile) {
                    setErrorMessage('Please select an image to upload');
                    setUploading(false);
                    return;
                }

                const formDataObj = new FormData();
                formDataObj.append('image', selectedFile);
                formDataObj.append('title', formData.title);
                formDataObj.append('location', formData.location);
                formDataObj.append('category', formData.category);

                response = await fetch('http://localhost:5000/api/gallery', {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: formDataObj,
                });
            }

            if (response.ok) {
                await fetchImages();
                setSuccessMessage(editingImage ? 'Image updated successfully!' : 'Image uploaded successfully!');
                setTimeout(() => setSuccessMessage(''), 3000);
                setShowForm(false);
                resetForm();
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.message || 'Operation failed');
            }
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage('Network error. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this image?')) {
            const token = localStorage.getItem('adminToken');
            try {
                const response = await fetch(`http://localhost:5000/api/gallery/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                if (response.ok) {
                    await fetchImages();
                    setSuccessMessage('Image deleted successfully!');
                    setTimeout(() => setSuccessMessage(''), 3000);
                    if (selectedImage?._id === id) {
                        setShowDetail(false);
                        setSelectedImage(null);
                    }
                }
            } catch (error) {
                console.error('Error deleting image:', error);
                setErrorMessage('Delete failed. Please try again.');
            }
        }
    };

    // ============ HANDLERS ============
    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setPreviewUrl(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const resetForm = () => {
        setFormData({ title: '', location: '', category: 'running' });
        setSelectedFile(null);
        setPreviewUrl(null);
        setEditingImage(null);
        setErrorMessage('');
    };

    const handleEditClick = (image) => {
        setEditingImage(image);
        setFormData({
            title: image.title || '',
            location: image.location || '',
            category: image.category || 'running',
        });
        const imageUrl = getImageUrl(image.image);
        if (imageUrl) setPreviewUrl(imageUrl);
        setSelectedFile(null);
        setShowForm(true);
    };

    const handleViewDetail = (image) => {
        setSelectedImage(image);
        setShowDetail(true);
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    };

    const closeDetail = () => {
        setShowDetail(false);
        setSelectedImage(null);
        document.body.style.overflow = 'unset';
    };

    const getImageUrl = (imagePath) => {
        if (!imagePath) return null;
        if (imagePath.startsWith('http')) return imagePath;
        return `http://localhost:5000${imagePath}`;
    };

    // ============ FILTERED & SORTED DATA ============
    const filteredAndSortedImages = useMemo(() => {
        let result = [...images];

        // Apply category filter
        if (categoryFilter !== 'all') {
            result = result.filter(img => img.category === categoryFilter);
        }

        // Apply search
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(img =>
                (img.title?.toLowerCase().includes(query)) ||
                (img.location?.toLowerCase().includes(query)) ||
                (img.category?.toLowerCase().includes(query))
            );
        }

        // Apply sorting
        switch (sortBy) {
            case 'newest':
                result.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'oldest':
                result.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            case 'title-asc':
                result.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
                break;
            case 'title-desc':
                result.sort((a, b) => (b.title || '').localeCompare(a.title || ''));
                break;
            case 'likes':
                result.sort((a, b) => (b.likes || 0) - (a.likes || 0));
                break;
            default:
                break;
        }

        return result;
    }, [images, categoryFilter, searchQuery, sortBy]);

    // Pagination
    const totalPages = Math.ceil(filteredAndSortedImages.length / itemsPerPage);
    const paginatedImages = filteredAndSortedImages.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, categoryFilter, sortBy]);

    // Statistics
    const stats = useMemo(() => ({
        total: images.length,
        running: images.filter(i => i.category === 'running').length,
        group: images.filter(i => i.category === 'group').length,
        event: images.filter(i => i.category === 'event').length,
        training: images.filter(i => i.category === 'training').length,
        totalLikes: images.reduce((sum, i) => sum + (i.likes || 0), 0),
    }), [images]);

    // ============ LOADING STATE ============
    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <FaSpinner className="text-moon text-4xl animate-spin mx-auto mb-4" />
                    <p className="text-gray-400">Loading gallery...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* ============ HEADER ============ */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-orbitron font-bold text-white">Gallery</h1>
                    <p className="text-gray-400 mt-1">Manage your photo gallery collection</p>
                </div>
                <button
                    onClick={() => { setShowForm(true); resetForm(); }}
                    className="btn-primary"
                >
                    <FaPlus /> Upload Photo
                </button>
            </div>

            {/* ============ STATS CARDS ============ */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="bg-gradient-to-br from-blue-500/20 to-transparent rounded-xl p-4 border border-blue-500/20">
                    <div className="text-2xl font-bold text-white">{stats.total}</div>
                    <div className="text-xs text-gray-400">Total Images</div>
                </div>
                <div className="bg-gradient-to-br from-green-500/20 to-transparent rounded-xl p-4 border border-green-500/20">
                    <div className="text-2xl font-bold text-white">{stats.running}</div>
                    <div className="text-xs text-gray-400">Running</div>
                </div>
                <div className="bg-gradient-to-br from-purple-500/20 to-transparent rounded-xl p-4 border border-purple-500/20">
                    <div className="text-2xl font-bold text-white">{stats.group}</div>
                    <div className="text-xs text-gray-400">Group</div>
                </div>
                <div className="bg-gradient-to-br from-pink-500/20 to-transparent rounded-xl p-4 border border-pink-500/20">
                    <div className="text-2xl font-bold text-white">{stats.event}</div>
                    <div className="text-xs text-gray-400">Events</div>
                </div>
                <div className="bg-gradient-to-br from-orange-500/20 to-transparent rounded-xl p-4 border border-orange-500/20">
                    <div className="text-2xl font-bold text-white">{stats.training}</div>
                    <div className="text-xs text-gray-400">Training</div>
                </div>
                <div className="bg-gradient-to-br from-red-500/20 to-transparent rounded-xl p-4 border border-red-500/20">
                    <div className="text-2xl font-bold text-white">{stats.totalLikes}</div>
                    <div className="text-xs text-gray-400">Total Likes</div>
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
                            placeholder="Search by title, location, or category..."
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

                    {/* Category Filter */}
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-moon focus:outline-none"
                    >
                        {CATEGORIES.map(cat => (
                            <option key={cat.value} value={cat.value}>
                                {cat.icon} {cat.label}
                            </option>
                        ))}
                    </select>

                    {/* Sort */}
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-moon focus:outline-none"
                    >
                        {SORT_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>

                    {/* View Toggle */}
                    <div className="flex gap-1 bg-black/50 rounded-lg p-1 border border-gray-700">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded transition ${viewMode === 'grid'
                                    ? 'bg-moon text-black'
                                    : 'text-gray-400 hover:text-white'
                                }`}
                            title="Grid View"
                        >
                            <FaThLarge />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded transition ${viewMode === 'list'
                                    ? 'bg-moon text-black'
                                    : 'text-gray-400 hover:text-white'
                                }`}
                            title="List View"
                        >
                            <FaList />
                        </button>
                    </div>
                </div>

                {/* Results info */}
                <div className="mt-3 flex justify-between items-center text-sm">
                    <span className="text-gray-400">
                        {filteredAndSortedImages.length} result{filteredAndSortedImages.length !== 1 ? 's' : ''}
                        {searchQuery && ` for "${searchQuery}"`}
                        {categoryFilter !== 'all' && ` in ${categoryFilter}`}
                    </span>
                    {totalPages > 1 && (
                        <span className="text-gray-400">
                            Page {currentPage} of {totalPages}
                        </span>
                    )}
                </div>
            </div>

            {/* ============ GALLERY CONTENT ============ */}
            {paginatedImages.length === 0 ? (
                <div className="text-center py-16 bg-deep/30 rounded-xl border border-moon/10">
                    <FaImage className="text-6xl text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">
                        {searchQuery || categoryFilter !== 'all'
                            ? 'No images match your filters'
                            : 'No images yet. Click "Upload Photo" to add some.'}
                    </p>
                    {(searchQuery || categoryFilter !== 'all') && (
                        <button
                            onClick={() => { setSearchQuery(''); setCategoryFilter('all'); }}
                            className="mt-4 text-moon hover:text-yellow-400 text-sm"
                        >
                            Clear filters
                        </button>
                    )}
                </div>
            ) : viewMode === 'grid' ? (
                /* ============ GRID VIEW ============ */
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {paginatedImages.map((image) => {
                        const imageUrl = getImageUrl(image.image);
                        return (
                            <div
                                key={image._id}
                                className="bg-deep/50 rounded-xl border border-moon/10 overflow-hidden hover:border-moon/50 transition group"
                            >
                                <div className="aspect-square relative bg-gradient-to-br from-moon/5 to-purple-500/5 overflow-hidden">
                                    {imageUrl ? (
                                        <img
                                            src={imageUrl}
                                            alt={image.title || 'Gallery image'}
                                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                            loading="lazy"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.parentElement.innerHTML = `
                                                    <div class="flex items-center justify-center w-full h-full">
                                                        <FaImage class="text-6xl text-gray-500" />
                                                    </div>
                                                `;
                                            }}
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center w-full h-full">
                                            <FaImage className="text-6xl text-gray-500" />
                                        </div>
                                    )}

                                    {/* Overlay Actions */}
                                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                                        <button
                                            onClick={() => handleViewDetail(image)}
                                            className="bg-moon/80 p-2 rounded-full hover:bg-moon transition"
                                            title="View Details"
                                        >
                                            <FaEye className="text-black text-sm" />
                                        </button>
                                        <button
                                            onClick={() => handleEditClick(image)}
                                            className="bg-blue-500/80 p-2 rounded-full hover:bg-blue-600 transition"
                                            title="Edit"
                                        >
                                            <FaEdit className="text-white text-sm" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(image._id)}
                                            className="bg-red-500/80 p-2 rounded-full hover:bg-red-600 transition"
                                            title="Delete"
                                        >
                                            <FaTrash className="text-white text-sm" />
                                        </button>
                                    </div>
                                </div>
                                <div className="p-3">
                                    <h3 className="text-white font-semibold text-sm truncate">
                                        {image.title || 'Untitled'}
                                    </h3>
                                    <p className="text-gray-500 text-xs truncate">
                                        {image.location || 'No location'}
                                    </p>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="inline-block px-2 py-0.5 bg-moon/20 text-moon text-[10px] rounded-full">
                                            {image.category || 'Uncategorized'}
                                        </span>
                                        <span className="text-gray-500 text-[10px]">
                                            {new Date(image.date).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                /* ============ LIST VIEW ============ */
                <div className="bg-deep/50 rounded-xl border border-moon/10 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-black/50 border-b border-moon/20">
                                <tr>
                                    <th className="text-left py-3 px-4 text-gray-300 text-sm font-semibold">Image</th>
                                    <th className="text-left py-3 px-4 text-gray-300 text-sm font-semibold">Title</th>
                                    <th className="text-left py-3 px-4 text-gray-300 text-sm font-semibold">Location</th>
                                    <th className="text-left py-3 px-4 text-gray-300 text-sm font-semibold">Category</th>
                                    <th className="text-left py-3 px-4 text-gray-300 text-sm font-semibold">Likes</th>
                                    <th className="text-left py-3 px-4 text-gray-300 text-sm font-semibold">Date</th>
                                    <th className="text-right py-3 px-4 text-gray-300 text-sm font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedImages.map((image) => {
                                    const imageUrl = getImageUrl(image.image);
                                    return (
                                        <tr
                                            key={image._id}
                                            className="border-b border-gray-800 hover:bg-moon/5 transition"
                                        >
                                            <td className="py-3 px-4">
                                                <div className="w-12 h-12 rounded-lg overflow-hidden bg-deep">
                                                    {imageUrl ? (
                                                        <img
                                                            src={imageUrl}
                                                            alt={image.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex items-center justify-center w-full h-full">
                                                            <FaImage className="text-gray-500" />
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-white font-medium">
                                                {image.title || 'Untitled'}
                                            </td>
                                            <td className="py-3 px-4 text-gray-400 text-sm">
                                                {image.location || '-'}
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="inline-block px-2 py-1 bg-moon/20 text-moon text-xs rounded-full">
                                                    {image.category || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-gray-400 text-sm">
                                                <span className="flex items-center gap-1">
                                                    <FaHeart className="text-red-500 text-xs" />
                                                    {image.likes || 0}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-gray-400 text-sm">
                                                {new Date(image.date).toLocaleDateString()}
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleViewDetail(image)}
                                                        className="text-moon hover:text-yellow-400 transition"
                                                        title="View"
                                                    >
                                                        <FaEye />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEditClick(image)}
                                                        className="text-blue-400 hover:text-blue-300 transition"
                                                        title="Edit"
                                                    >
                                                        <FaEdit />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(image._id)}
                                                        className="text-red-400 hover:text-red-300 transition"
                                                        title="Delete"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
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
                        if (totalPages <= 5) {
                            pageNum = i + 1;
                        } else if (currentPage <= 3) {
                            pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                        } else {
                            pageNum = currentPage - 2 + i;
                        }

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

            {/* ============ UPLOAD/EDIT FORM MODAL ============ */}
            {showForm && (
                <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4">
                    <div className="bg-deep rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6 border border-moon/20">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-white">
                                {editingImage ? 'Edit Photo' : 'Upload Photo'}
                            </h2>
                            <button onClick={() => { setShowForm(false); resetForm(); }} className="text-gray-400 hover:text-white">
                                <FaTimes />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className={`border-2 border-dashed ${previewUrl ? 'border-moon/50' : 'border-gray-600'} rounded-lg p-4 text-center hover:border-moon/50 transition`}>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                    id="file-upload"
                                />
                                <label htmlFor="file-upload" className="cursor-pointer block">
                                    {previewUrl ? (
                                        <div className="relative">
                                            <img
                                                src={previewUrl}
                                                alt="Preview"
                                                className="max-h-48 mx-auto rounded-lg object-contain"
                                            />
                                            <p className="text-gray-300 mt-2 text-sm">
                                                {selectedFile ? selectedFile.name : editingImage ? 'Current image' : ''}
                                            </p>
                                            {!editingImage && (
                                                <button
                                                    type="button"
                                                    onClick={(e) => { e.stopPropagation(); setSelectedFile(null); setPreviewUrl(null); }}
                                                    className="absolute top-1 right-1 bg-red-500/80 p-1 rounded-full hover:bg-red-600"
                                                >
                                                    <FaTimes className="text-white text-xs" />
                                                </button>
                                            )}
                                        </div>
                                    ) : (
                                        <div>
                                            <FaUpload className="text-4xl text-gray-500 mx-auto mb-2" />
                                            <p className="text-gray-400">
                                                {editingImage ? 'Click to change image (optional)' : 'Click to select image'}
                                            </p>
                                            <p className="text-gray-500 text-sm mt-1">JPG, PNG, WebP (Max 10MB)</p>
                                        </div>
                                    )}
                                </label>
                            </div>

                            <input
                                type="text"
                                placeholder="Title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-moon focus:outline-none"
                                required
                            />

                            <input
                                type="text"
                                placeholder="Location"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-moon focus:outline-none"
                            />

                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-moon focus:outline-none"
                            >
                                <option value="running">🏃 Running</option>
                                <option value="group">👥 Group</option>
                                <option value="event">🎪 Event</option>
                                <option value="training">💪 Training</option>
                            </select>

                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    disabled={uploading || (!editingImage && !selectedFile)}
                                    className="flex-1 btn-primary justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {uploading ? (
                                        <><FaSpinner className="animate-spin" /> Saving...</>
                                    ) : (
                                        <>{editingImage ? <FaSave /> : <FaUpload />} {editingImage ? 'Update' : 'Upload'}</>
                                    )}
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
            {showDetail && selectedImage && (
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
                        className="max-w-4xl w-full bg-gradient-to-br from-deep to-black rounded-2xl overflow-hidden shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="grid md:grid-cols-2 gap-0">
                            {/* Image Side */}
                            <div className="aspect-square bg-black/50 flex items-center justify-center">
                                {getImageUrl(selectedImage.image) ? (
                                    <img
                                        src={getImageUrl(selectedImage.image)}
                                        alt={selectedImage.title}
                                        className="w-full h-full object-contain"
                                    />
                                ) : (
                                    <FaImage className="text-6xl text-gray-500" />
                                )}
                            </div>

                            {/* Details Side */}
                            <div className="p-6 flex flex-col">
                                <div className="flex-1">
                                    <h2 className="text-2xl font-bold text-white mb-4">
                                        {selectedImage.title || 'Untitled'}
                                    </h2>

                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 text-gray-300">
                                            <FaMapMarkerAlt className="text-moon" />
                                            <span>{selectedImage.location || 'No location'}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-gray-300">
                                            <FaTag className="text-moon" />
                                            <span className="capitalize">{selectedImage.category || 'Uncategorized'}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-gray-300">
                                            <FaCalendarAlt className="text-moon" />
                                            <span>
                                                {new Date(selectedImage.date).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 text-gray-300">
                                            <FaHeart className="text-red-500" />
                                            <span>{selectedImage.likes || 0} likes</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-6 pt-6 border-t border-gray-800">
                                    <button
                                        onClick={() => {
                                            closeDetail();
                                            handleEditClick(selectedImage);
                                        }}
                                        className="flex-1 btn-primary justify-center"
                                    >
                                        <FaEdit /> Edit
                                    </button>
                                    <button
                                        onClick={() => {
                                            handleDelete(selectedImage._id);
                                            closeDetail();
                                        }}
                                        className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}