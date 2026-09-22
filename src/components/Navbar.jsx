import React, { useState, useEffect } from 'react';
import { FaRunning, FaBars, FaTimes, FaMoon } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState('home');

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);

            const sections = ['home', 'about', 'mission', 'schedule', 'social', 'gallery', 'sponsorship', 'contact'];
            const scrollPosition = window.scrollY + 100;

            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const { offsetTop, offsetHeight } = element;
                    if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                        setActiveSection(section);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', href: '#home' },
        { name: 'About', href: '#about' },
        { name: 'Mission', href: '#mission' },
        { name: 'Schedule', href: '#schedule' },
        { name: 'Social', href: '#social' },
        { name: 'Gallery', href: '#gallery' },
        { name: 'Sponsorship', href: '#sponsorship' },
        { name: 'Contact', href: '#contact' },
    ];

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-night/95 backdrop-blur-md border-b border-moon/20 shadow-lg' : 'bg-transparent'
            }`}>
            <div className="container-custom">
                <div className="flex items-center justify-between h-16 md:h-20">
                    <motion.a
                        href="#home"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 group cursor-pointer"
                    >
                        <div className="relative">
                            <FaRunning className="text-moon text-2xl md:text-3xl group-hover:animate-pulse transition-all" />
                            <FaMoon className="text-moon/50 text-xs absolute -top-1 -right-1" />
                        </div>
                        <span className="font-orbitron font-bold text-xl md:text-2xl">
                            Moon<span className="text-moon">Runners</span>
                        </span>
                    </motion.a>

                    <div className="hidden md:flex space-x-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className={`relative text-gray-300 hover:text-moon transition-colors duration-300 font-medium group ${activeSection === link.href.substring(1) ? 'text-moon' : ''
                                    }`}
                            >
                                {link.name}
                                <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-moon to-yellow-500 transform transition-transform duration-300 ${activeSection === link.href.substring(1) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                                    }`}></span>
                            </a>
                        ))}
                    </div>

                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden text-white focus:outline-none"
                    >
                        {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                    </button>
                </div>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden bg-night/95 backdrop-blur-md border-t border-moon/20 overflow-hidden"
                        >
                            <div className="py-4">
                                {navLinks.map((link) => (
                                    <a
                                        key={link.name}
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className={`block px-4 py-3 text-gray-300 hover:text-moon hover:bg-moon/10 transition-colors ${activeSection === link.href.substring(1) ? 'text-moon bg-moon/10' : ''
                                            }`}
                                    >
                                        {link.name}
                                    </a>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </nav>
    );
}