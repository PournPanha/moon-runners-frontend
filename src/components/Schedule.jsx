import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
    FaCalendarAlt,
    FaRunning,
    FaHeartbeat,
    FaClock,
    FaMapMarkerAlt,
    FaSun,
    FaMoon,
    FaCloudSun,
    FaBolt,
    FaDumbbell,
    FaPray,
    FaStar,
    FaSpinner
} from 'react-icons/fa';

const iconMap = {
    FaCloudSun: <FaCloudSun className="text-2xl" />,
    FaBolt: <FaBolt className="text-2xl" />,
    FaHeartbeat: <FaHeartbeat className="text-2xl" />,
    FaRunning: <FaRunning className="text-2xl" />,
    FaMoon: <FaMoon className="text-2xl" />,
    FaDumbbell: <FaDumbbell className="text-2xl" />,
    FaPray: <FaPray className="text-2xl" />,
};

export default function Schedule() {
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

    useEffect(() => {
        fetchSchedule();
    }, []);

    const fetchSchedule = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/schedule');
            if (response.ok) {
                const data = await response.json();
                setSchedule(data);
            } else {
                setError('Failed to load schedule');
            }
        } catch (error) {
            console.error('Error fetching schedule:', error);
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const getIntensityBadge = (intensity) => {
        const colors = {
            'Low': 'bg-green-500/20 text-green-400 border-green-500',
            'Low-Medium': 'bg-blue-500/20 text-blue-400 border-blue-500',
            'Medium': 'bg-yellow-500/20 text-yellow-400 border-yellow-500',
            'Medium-High': 'bg-orange-500/20 text-orange-400 border-orange-500',
            'High': 'bg-red-500/20 text-red-400 border-red-500',
            'None': 'bg-gray-500/20 text-gray-400 border-gray-500',
        };
        return colors[intensity] || colors['Medium'];
    };

    if (loading) {
        return (
            <section id="schedule" className="py-20 px-4 bg-gradient-to-b from-night to-deep">
                <div className="container-custom text-center">
                    <FaSpinner className="text-moon text-4xl animate-spin mx-auto mb-4" />
                    <p className="text-gray-400">Loading schedule...</p>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section id="schedule" className="py-20 px-4 bg-gradient-to-b from-night to-deep">
                <div className="container-custom text-center">
                    <p className="text-red-400">{error}</p>
                </div>
            </section>
        );
    }

    return (
        <section id="schedule" className="py-20 px-4 bg-gradient-to-b from-night to-deep relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

            <div className="container-custom relative z-10" ref={ref}>
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="section-title">
                        Weekly <span className="text-gradient">Training Schedule</span>
                    </h2>
                    <div className="divider"></div>
                    <p className="section-subtitle">
                        Monday to Saturday - Train with purpose | Sunday - Holy Day for Rest & Recovery
                    </p>
                </motion.div>

                {/* Schedule Cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {schedule.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: index * 0.05, duration: 0.5 }}
                            whileHover={!item.isRestDay ? { y: -5 } : {}}
                            className={`card p-6 ${item.isRestDay ? 'border-moon/40 bg-gradient-to-br from-moon/10 to-transparent' : `bg-gradient-to-br ${item.color || 'from-moon/5'} to-transparent`}`}
                        >
                            {/* Day Header */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`text-moon ${item.isRestDay ? 'animate-pulse' : ''}`}>
                                        {iconMap[item.icon] || <FaRunning className="text-2xl" />}
                                    </div>
                                    <h3 className="text-2xl font-orbitron font-bold text-white">
                                        {item.day}
                                    </h3>
                                </div>
                                {item.isRestDay && (
                                    <div className="bg-moon/20 px-2 py-1 rounded-full">
                                        <FaStar className="text-moon text-sm" />
                                    </div>
                                )}
                            </div>

                            {/* Training Type */}
                            <div className="mb-4">
                                <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${getIntensityBadge(item.intensity)}`}>
                                    {item.type}
                                </div>
                                {!item.isRestDay && item.intensity !== 'None' && (
                                    <div className="inline-block ml-2 px-3 py-1 rounded-full text-xs font-semibold bg-moon/20 text-moon border border-moon/30">
                                        {item.intensity} Intensity
                                    </div>
                                )}
                            </div>

                            {/* Details */}
                            {!item.isRestDay ? (
                                <>
                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center gap-2 text-gray-300">
                                            <FaClock className="text-moon text-sm" />
                                            <span className="text-sm">{item.time}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-300">
                                            <FaMapMarkerAlt className="text-moon text-sm" />
                                            <span className="text-sm">{item.location}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-300">
                                            <FaRunning className="text-moon text-sm" />
                                            <span className="text-sm font-semibold">{item.distance}</span>
                                        </div>
                                    </div>

                                    <div className="pt-3 border-t border-gray-800">
                                        <p className="text-sm text-gray-400 mb-1">{item.description}</p>
                                        <div className="flex justify-between items-center mt-2">
                                            {item.pace && (
                                                <span className="text-xs text-gray-500">Pace: {item.pace}</span>
                                            )}
                                            {item.calories && (
                                                <span className="text-xs text-moon">🔥 {item.calories} cal</span>
                                            )}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-4">
                                    <p className="text-gray-300 mb-2">{item.description}</p>
                                    <p className="text-sm text-moon">🧘‍♂️ Focus on: {item.focus}</p>
                                    <div className="mt-3 flex justify-center gap-3">
                                        <span className="text-xs text-gray-400">🧘 Stretching</span>
                                        <span className="text-xs text-gray-400">💆 Massage</span>
                                        <span className="text-xs text-gray-400">🧠 Meditation</span>
                                    </div>
                                </div>
                            )}

                            {/* Focus Area */}
                            <div className="mt-3 pt-2 text-center">
                                <p className="text-xs text-gray-500">
                                    🎯 Focus: <span className="text-moon">{item.focus}</span>
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Weekly Summary */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="grid md:grid-cols-2 gap-6 mt-8"
                >
                    <div className="card p-6">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <FaStar className="text-moon" /> Training Tips
                        </h3>
                        <ul className="space-y-2">
                            <li className="flex items-start gap-2 text-gray-300 text-sm">
                                <span className="text-moon">•</span>
                                Arrive 15 minutes early for warm-up
                            </li>
                            <li className="flex items-start gap-2 text-gray-300 text-sm">
                                <span className="text-moon">•</span>
                                Bring water and light snacks
                            </li>
                            <li className="flex items-start gap-2 text-gray-300 text-sm">
                                <span className="text-moon">•</span>
                                Wear bright/reflective clothing for night runs
                            </li>
                            <li className="flex items-start gap-2 text-gray-300 text-sm">
                                <span className="text-moon">•</span>
                                Listen to your body - rest when needed
                            </li>
                        </ul>
                    </div>

                    <div className="card p-6">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <FaRunning className="text-moon" /> Essential Gear
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center gap-2 text-gray-300 text-sm">
                                <span className="text-moon">✓</span> Running Shoes
                            </div>
                            <div className="flex items-center gap-2 text-gray-300 text-sm">
                                <span className="text-moon">✓</span> Water Bottle
                            </div>
                            <div className="flex items-center gap-2 text-gray-300 text-sm">
                                <span className="text-moon">✓</span> Reflective Vest
                            </div>
                            <div className="flex items-center gap-2 text-gray-300 text-sm">
                                <span className="text-moon">✓</span> Headlamp
                            </div>
                            <div className="flex items-center gap-2 text-gray-300 text-sm">
                                <span className="text-moon">✓</span> Phone
                            </div>
                            <div className="flex items-center gap-2 text-gray-300 text-sm">
                                <span className="text-moon">✓</span> Small Towel
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="mt-8 text-center"
                >
                    <p className="text-gray-400 italic">
                        "Consistency over intensity. Show up every day and trust the process."
                    </p>
                    <p className="text-moon text-sm mt-2">- Moon-Runners Training Philosophy</p>
                </motion.div>
            </div>
        </section>
    );
}