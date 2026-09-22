import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
    FaTimes,
    FaHeart,
    FaCamera,
    FaSpinner,
    FaEye,
    FaCalendarAlt,
    FaMapMarkerAlt,
    FaChevronLeft,
    FaChevronRight,
    FaImages
} from 'react-icons/fa';

export default function Gallery() {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);
    const [filter, setFilter] = useState('all');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsPerRow, setItemsPerRow] = useState(4);
    const [totalSlides, setTotalSlides] = useState(0);
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

    useEffect(() => {
        fetchImages();
        handleResize();
        window.addEventListener('resize', handleResize);
        // Prevent body scroll when lightbox is open
        if (selectedImage) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            window.removeEventListener('resize', handleResize);
            document.body.style.overflow = 'unset';
        };
    }, [selectedImage]);

    useEffect(() => {
        const filtered = getFilteredImages();
        const rows = Math.ceil(filtered.length / itemsPerRow);
        setTotalSlides(rows);
        setCurrentIndex(0);
    }, [filter, images, itemsPerRow]);

    const fetchImages = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/gallery');
            if (response.ok) {
                const data = await response.json();
                setImages(data);
            }
        } catch (error) {
            console.error('Error fetching gallery:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleResize = () => {
        const width = window.innerWidth;
        if (width < 640) setItemsPerRow(2);
        else if (width < 1024) setItemsPerRow(3);
        else setItemsPerRow(4);
    };

    const getImageUrl = (imagePath) => {
        if (!imagePath) return null;
        if (imagePath.startsWith('http')) return imagePath;
        return `http://localhost:5000${imagePath}`;
    };

    const getFilteredImages = () => {
        return filter === 'all'
            ? images
            : images.filter(img => img.category === filter);
    };

    const filteredImages = getFilteredImages();
    const categories = ['all', 'running', 'group', 'event', 'training'];

    // Get current row of images
    const getCurrentRowImages = () => {
        const start = currentIndex * itemsPerRow;
        const end = start + itemsPerRow;
        return filteredImages.slice(start, end);
    };

    const currentRowImages = getCurrentRowImages();
    const totalRows = Math.ceil(filteredImages.length / itemsPerRow);

    const goToNext = () => {
        if (currentIndex < totalRows - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const goToPrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const getCategoryCount = (category) => {
        if (category === 'all') return images.length;
        return images.filter(img => img.category === category).length;
    };

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (selectedImage) {
                if (e.key === 'Escape') setSelectedImage(null);
                return;
            }
            if (e.key === 'ArrowRight') goToNext();
            if (e.key === 'ArrowLeft') goToPrev();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedImage, currentIndex, totalRows]);

    if (loading) {
        return (
            <section id="gallery" className="py-20 px-4 bg-gradient-to-b from-deep to-night">
                <div className="container-custom text-center">
                    <FaSpinner className="text-moon text-4xl animate-spin mx-auto mb-4" />
                    <p className="text-gray-400">Loading gallery...</p>
                </div>
            </section>
        );
    }

    return (
        <section id="gallery" className="py-20 px-4 bg-gradient-to-b from-deep to-night relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

            <div className="container-custom relative z-10" ref={ref}>
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className="section-title">
                        Photo <span className="text-gradient">Gallery</span>
                    </h2>
                    <div className="divider"></div>
                    <p className="section-subtitle">
                        We run with consistency, discipline, and passion.
                    </p>
                </motion.div>

                {/* Filter Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="flex flex-wrap justify-center gap-3 mb-6"
                >
                    {categories.map((category) => {
                        const count = getCategoryCount(category);
                        return (
                            <button
                                key={category}
                                onClick={() => {
                                    setFilter(category);
                                    setCurrentIndex(0);
                                }}
                                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${filter === category
                                        ? 'bg-moon text-black shadow-lg'
                                        : 'bg-deep text-gray-300 hover:bg-moon/20'
                                    }`}
                            >
                                {category === 'all' ? 'All' : category.charAt(0).toUpperCase() + category.slice(1)}
                                <span className={`text-xs px-2 py-0.5 rounded-full ${filter === category
                                        ? 'bg-black/20 text-black'
                                        : 'bg-moon/20 text-moon'
                                    }`}>
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </motion.div>

                {/* Image Count */}
                <div className="text-center text-gray-500 text-sm mb-4">
                    <FaImages className="inline mr-2 text-moon" />
                    {filteredImages.length} images · Row {currentIndex + 1} of {totalRows || 1}
                </div>

                {/* Carousel Container */}
                {filteredImages.length === 0 ? (
                    <div className="text-center py-12 bg-deep/30 rounded-xl">
                        <FaCamera className="text-6xl text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400">No images found in this category</p>
                    </div>
                ) : (
                    <div className="relative">
                        {/* Navigation Arrows */}
                        {totalRows > 1 && (
                            <>
                                <button
                                    onClick={goToPrev}
                                    disabled={currentIndex === 0}
                                    className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full transition-all ${currentIndex === 0
                                            ? 'bg-gray-800/30 text-gray-500 cursor-not-allowed'
                                            : 'bg-black/60 text-white hover:bg-moon hover:text-black hover:scale-110'
                                        }`}
                                    style={{ transform: 'translateY(-50%)' }}
                                >
                                    <FaChevronLeft size={20} />
                                </button>

                                <button
                                    onClick={goToNext}
                                    disabled={currentIndex === totalRows - 1}
                                    className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full transition-all ${currentIndex === totalRows - 1
                                            ? 'bg-gray-800/30 text-gray-500 cursor-not-allowed'
                                            : 'bg-black/60 text-white hover:bg-moon hover:text-black hover:scale-110'
                                        }`}
                                    style={{ transform: 'translateY(-50%)' }}
                                >
                                    <FaChevronRight size={20} />
                                </button>
                            </>
                        )}

                        {/* Image Grid - Single Row */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentIndex}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ duration: 0.4, ease: 'easeInOut' }}
                                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
                            >
                                {currentRowImages.map((image) => {
                                    const imageUrl = getImageUrl(image.image);
                                    return (
                                        <motion.div
                                            key={image._id}
                                            whileHover={{ scale: 1.05, y: -5 }}
                                            onClick={() => setSelectedImage(image)}
                                            className="group relative bg-gradient-to-br from-deep to-black rounded-xl overflow-hidden cursor-pointer border border-gray-800 hover:border-moon/50 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-moon/10"
                                        >
                                            <div className="aspect-square relative overflow-hidden">
                                                {imageUrl ? (
                                                    <img
                                                        src={imageUrl}
                                                        alt={image.title || 'Gallery image'}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                                                        loading="lazy"
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                            e.target.parentElement.innerHTML = `
                                                                <div class="flex items-center justify-center w-full h-full bg-gradient-to-br from-moon/10 to-purple-500/10">
                                                                    <FaCamera class="text-4xl text-gray-500" />
                                                                </div>
                                                            `;
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-moon/10 to-purple-500/10">
                                                        <FaCamera className="text-4xl text-gray-500" />
                                                    </div>
                                                )}

                                                {/* Hover Overlay */}
                                                <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-all duration-300 z-10 flex items-center justify-center">
                                                    <div className="text-center transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                                        <FaCamera className="text-moon text-2xl mb-1 opacity-0 group-hover:opacity-100 transition-all" />
                                                        <p className="text-white font-semibold text-sm opacity-0 group-hover:opacity-100 transition-all">View</p>
                                                    </div>
                                                </div>

                                                {/* Category Badge */}
                                                <div className="absolute top-2 left-2 z-20">
                                                    <span className="inline-block px-2 py-0.5 bg-black/60 text-moon text-[10px] rounded-full">
                                                        {image.category || 'Uncategorized'}
                                                    </span>
                                                </div>

                                                {/* Bottom Info */}
                                                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black via-black/80 to-transparent z-20">
                                                    <h3 className="text-white font-bold text-sm truncate">{image.title || 'Untitled'}</h3>
                                                    <div className="flex items-center gap-3 mt-1">
                                                        <span className="flex items-center gap-1 text-xs text-gray-300">
                                                            <FaHeart className="text-red-500 text-[10px]" /> {image.likes || 0}
                                                        </span>
                                                        <span className="flex items-center gap-1 text-xs text-gray-300">
                                                            <FaEye className="text-moon text-[10px]" />
                                                            {Math.floor((image.likes || 0) / 2)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                )}

                {/* Dot Indicators */}
                {totalRows > 1 && (
                    <div className="flex justify-center gap-2 mt-6">
                        {Array.from({ length: totalRows }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${currentIndex === index
                                        ? 'bg-moon w-8'
                                        : 'bg-gray-600 hover:bg-gray-400'
                                    }`}
                            />
                        ))}
                    </div>
                )}

                {/* Total Stats */}
                {images.length > 0 && (
                    <div className="mt-4 text-gray-500 text-sm text-center">
                        {filteredImages.length} images total
                        {filter !== 'all' && ` · Filtered by "${filter}"`}
                    </div>
                )}

                {/* Lightbox */}
                <AnimatePresence>
                    {selectedImage && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedImage(null)}
                            className="fixed inset-0 bg-black/95 z-[999] flex items-center justify-center p-4 backdrop-blur-lg"
                        >
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="absolute top-4 right-4 text-white hover:text-moon transition-colors z-20 p-2 hover:bg-white/10 rounded-full"
                            >
                                <FaTimes size={30} />
                            </button>

                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                transition={{ type: 'spring', damping: 25 }}
                                onClick={(e) => e.stopPropagation()}
                                className="max-w-5xl w-full bg-gradient-to-br from-deep to-black rounded-2xl overflow-hidden shadow-2xl"
                            >
                                <div className="relative">
                                    <div className="aspect-video bg-gradient-to-br from-moon/5 to-purple-500/5 relative flex items-center justify-center">
                                        {getImageUrl(selectedImage.image) ? (
                                            <img
                                                src={getImageUrl(selectedImage.image)}
                                                alt={selectedImage.title}
                                                className="w-full h-full object-contain max-h-[70vh]"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.parentElement.innerHTML = `
                                                        <div class="flex items-center justify-center w-full h-full p-12">
                                                            <FaCamera class="text-6xl text-gray-500" />
                                                        </div>
                                                    `;
                                                }}
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center w-full h-full p-12">
                                                <FaCamera className="text-6xl text-gray-500" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-6 bg-deep/90">
                                        <h3 className="text-2xl font-bold text-white mb-2">{selectedImage.title || 'Untitled'}</h3>
                                        <div className="flex flex-wrap gap-4 text-sm">
                                            <p className="text-gray-400 flex items-center gap-2">
                                                <FaMapMarkerAlt className="text-moon" />
                                                {selectedImage.location || 'No location'}
                                            </p>
                                            <p className="text-gray-400 flex items-center gap-2">
                                                <FaCalendarAlt className="text-moon" />
                                                {new Date(selectedImage.date).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                            <span className="inline-block px-2 py-1 bg-moon/20 text-moon text-xs rounded-full">
                                                {selectedImage.category || 'Uncategorized'}
                                            </span>
                                        </div>
                                        <div className="flex gap-6 mt-4 pt-4 border-t border-gray-800">
                                            <span className="flex items-center gap-2 text-gray-300">
                                                <FaHeart className="text-red-500" /> {selectedImage.likes || 0} likes
                                            </span>
                                            <span className="flex items-center gap-2 text-gray-300">
                                                <FaEye className="text-moon" />
                                                {Math.floor((selectedImage.likes || 0) / 2)} views
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}