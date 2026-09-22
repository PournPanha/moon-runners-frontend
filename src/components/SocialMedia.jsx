import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaTiktok, FaFacebook, FaInstagram, FaTelegram, FaChartLine, FaVideo, FaUsers, FaHeart } from 'react-icons/fa';

export default function SocialMedia() {
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

    const platforms = [
        {
            name: 'TikTok',
            icon: <FaTiktok className="text-4xl" />,
            stats: ['10K-100K+ views per video', 'Active followers', 'Viral content regularly'],
            color: 'from-black to-gray-800',
            bgColor: 'bg-black/50',
        },
        {
            name: 'Facebook',
            icon: <FaFacebook className="text-4xl" />,
            stats: ['Organic engagement growing', 'Increasing followers daily', 'Videos go viral'],
            color: 'from-blue-600 to-blue-800',
            bgColor: 'bg-blue-900/20',
        },
        {
            name: 'Telegram',
            icon: <FaTelegram className="text-4xl" />,
            stats: ['105 members', '49 online active', '24/7 community chat'],
            color: 'from-blue-500 to-cyan-500',
            bgColor: 'bg-blue-500/10',
        },
    ];

    return (
        <section id="social" className="py-20 px-4 bg-gradient-to-b from-night to-deep relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

            <div className="container-custom relative z-10" ref={ref}>
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="section-title">
                        Social Media <span className="text-gradient">Presence</span>
                    </h2>
                    <div className="divider"></div>
                    <p className="section-subtitle">
                        Our content reaches thousands of viewers. Join our growing community online!
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8 mb-12">
                    {platforms.map((platform, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            whileHover={{ y: -5 }}
                            className={`card p-6 text-center ${platform.bgColor}`}
                        >
                            <div className={`text-moon mb-4 flex justify-center`}>
                                {platform.icon}
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">{platform.name}</h3>
                            <ul className="space-y-2 text-left">
                                {platform.stats.map((stat, idx) => (
                                    <li key={idx} className="flex items-center gap-2 text-gray-300 text-sm">
                                        <FaHeart className="text-moon text-xs" />
                                        {stat}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>

                {/* Performance Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="grid md:grid-cols-3 gap-6"
                >
                    <div className="card p-6 text-center">
                        <FaChartLine className="text-moon text-3xl mx-auto mb-3" />
                        <div className="text-2xl font-bold text-white">10K-100K+</div>
                        <p className="text-gray-400 text-sm">Views per video</p>
                    </div>
                    <div className="card p-6 text-center">
                        <FaVideo className="text-moon text-3xl mx-auto mb-3" />
                        <div className="text-2xl font-bold text-white">10+</div>
                        <p className="text-gray-400 text-sm">Videos published monthly</p>
                    </div>
                    <div className="card p-6 text-center">
                        <FaUsers className="text-moon text-3xl mx-auto mb-3" />
                        <div className="text-2xl font-bold text-white">105+</div>
                        <p className="text-gray-400 text-sm">Active Telegram members</p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}