import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaUsers, FaHeart, FaRunning, FaTrophy, FaClock, FaShieldAlt } from 'react-icons/fa';

export default function About() {
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

    const features = [
        { icon: <FaUsers className="text-4xl" />, title: '187+ Active Members', description: 'Growing community of passionate runners', stat: '49 online daily' },
        { icon: <FaRunning className="text-4xl" />, title: 'Regular Runs', description: 'Consistent training sessions every week', stat: '100% commitment' },
        { icon: <FaHeart className="text-4xl" />, title: 'Positive Energy', description: 'Building discipline and healthy connections', stat: 'Inspiring community' },
        { icon: <FaTrophy className="text-4xl" />, title: 'Viral Content', description: '10K-100K+ views on social media', stat: 'Growing influence' },
    ];

    return (
        <section id="about" className="py-20 px-4 bg-gradient-to-b from-night via-deep to-night relative overflow-hidden">
            <div className="bg-grid-pattern absolute inset-0 opacity-20"></div>

            <div className="container-custom relative z-10" ref={ref}>
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="section-title">
                        Welcome To Our <span className="text-gradient">Club</span>
                    </h2>
                    <div className="divider"></div>
                    <p className="section-subtitle">
                        We are a community of passionate runners who believe running builds discipline, health,
                        and positive connections. Our team gathers people from different backgrounds to promote
                        an active lifestyle and inspire the community.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            whileHover={{ y: -5 }}
                            className="card p-6 text-center"
                        >
                            <div className="text-moon mb-4 flex justify-center transform group-hover:scale-110 transition-transform">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                            <p className="text-gray-400 text-sm mb-2">{feature.description}</p>
                            <p className="text-moon text-xs font-semibold">{feature.stat}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Community Stats */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="mt-16 p-8 bg-gradient-to-r from-moon/10 to-transparent rounded-2xl border border-moon/20 text-center"
                >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div>
                            <div className="text-3xl font-bold text-moon">105+</div>
                            <div className="text-gray-400 text-sm">Members</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-moon">49</div>
                            <div className="text-gray-400 text-sm">Online Daily</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-moon">100K+</div>
                            <div className="text-gray-400 text-sm">Video Views</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-moon">24/7</div>
                            <div className="text-gray-400 text-sm">Active Community</div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}