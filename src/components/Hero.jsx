import React from 'react';
import { motion } from 'framer-motion';
import { FaRunning, FaArrowDown, FaMoon } from 'react-icons/fa';

export default function Hero() {
    const scrollToContact = () => {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-night via-deep to-night"></div>

            {/* Animated Stars */}
            <div className="absolute inset-0">
                {[...Array(150)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute bg-white rounded-full"
                        style={{
                            width: Math.random() * 3 + 'px',
                            height: Math.random() * 3 + 'px',
                            top: Math.random() * 100 + '%',
                            left: Math.random() * 100 + '%',
                        }}
                        animate={{
                            opacity: [0.2, 1, 0.2],
                            scale: [1, 1.5, 1],
                        }}
                        transition={{
                            duration: Math.random() * 3 + 2,
                            repeat: Infinity,
                            delay: Math.random() * 5,
                        }}
                    />
                ))}
            </div>

            {/* Floating Elements */}
            <motion.div
                animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-20 right-10 md:top-32 md:right-32 opacity-20"
            >
                <FaMoon className="text-8xl md:text-9xl text-moon" />
            </motion.div>

            <div className="absolute top-40 left-20 w-64 h-64 bg-moon/5 rounded-full blur-3xl animate-pulse-slow"></div>
            <div className="absolute bottom-40 right-20 w-96 h-96 bg-moon/5 rounded-full blur-3xl animate-pulse-slow"></div>

            <div className="relative z-10 text-center px-4">
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, type: 'spring' }}
                    className="mb-8"
                >
                    <div className="relative inline-block">
                        <div className="w-36 h-36 md:w-48 md:h-48 mx-auto rounded-full overflow-hidden shadow-2xl ring-4 ring-moon/30 bg-gradient-to-br from-moon to-yellow-600 flex items-center justify-center">
                            <img
                                src="/logo.jpg"
                                alt="Moon-Runners Club Logo"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/200x200?text=MR';
                                }}
                            />
                        </div>
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="absolute -inset-3 rounded-full border-2 border-moon/50"
                        />
                        <motion.div
                            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute inset-0 rounded-full bg-moon/20 blur-xl -z-10"
                        />
                    </div>
                </motion.div>

                <motion.h1
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="text-5xl md:text-7xl lg:text-8xl font-orbitron font-bold mb-4"
                >
                    MOON-<span className="text-gradient">RUNNERS</span>
                </motion.h1>

                <motion.p
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
                >
                    Run with consistency, discipline, and passion. Join the most vibrant night running community.
                </motion.p>

                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.6 }}
                    className="flex gap-4 justify-center flex-wrap"
                >
                    <button
                        onClick={scrollToContact}
                        className="btn-primary text-lg px-8 py-3"
                    >
                        <FaRunning /> Get Started
                    </button>
                    <button
                        onClick={scrollToContact}
                        className="btn-secondary text-lg px-8 py-3"
                    >
                        Learn More
                    </button>
                </motion.div>

                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
                    onClick={scrollToContact}
                >
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-sm text-gray-400">Scroll Down</span>
                        <FaArrowDown className="text-moon text-xl animate-bounce" />
                    </div>
                </motion.div>
            </div>
        </section>
    );
}