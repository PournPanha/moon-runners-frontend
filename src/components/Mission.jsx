import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaBullseye, FaEye, FaStar, FaRocket } from 'react-icons/fa';

export default function Mission() {
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

    return (
        <section id="mission" className="py-20 px-4 bg-gradient-to-b from-deep to-night">
            <div className="container-custom" ref={ref}>
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="section-title">
                        Our <span className="text-gradient">Mission</span>
                    </h2>
                    <div className="divider"></div>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: 0.2, duration: 0.6 }}
                    >
                        <div className="card p-8">
                            <FaBullseye className="text-moon text-5xl mb-6" />
                            <h3 className="text-2xl font-bold text-white mb-4">Our Vision</h3>
                            <p className="text-gray-300 leading-relaxed">
                                To become one of the most influential and inspiring running communities,
                                promoting health, discipline, and positive energy to the wider public.
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="grid gap-6"
                    >
                        <div className="card p-6 flex items-start gap-4">
                            <FaStar className="text-moon text-2xl flex-shrink-0 mt-1" />
                            <div>
                                <h4 className="text-lg font-bold text-white mb-2">Inspire Others</h4>
                                <p className="text-gray-400 text-sm">Lead by example and motivate the community</p>
                            </div>
                        </div>
                        <div className="card p-6 flex items-start gap-4">
                            <FaRocket className="text-moon text-2xl flex-shrink-0 mt-1" />
                            <div>
                                <h4 className="text-lg font-bold text-white mb-2">Grow Together</h4>
                                <p className="text-gray-400 text-sm">Build lasting friendships and connections</p>
                            </div>
                        </div>
                        <div className="card p-6 flex items-start gap-4">
                            <FaEye className="text-moon text-2xl flex-shrink-0 mt-1" />
                            <div>
                                <h4 className="text-lg font-bold text-white mb-2">Positive Impact</h4>
                                <p className="text-gray-400 text-sm">Create meaningful change in our community</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}