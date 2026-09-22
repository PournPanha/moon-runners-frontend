import React from 'react';
import { FaRunning, FaHeart, FaEnvelope, FaPhone, FaMapMarkerAlt, FaFacebook, FaTiktok, FaTelegram, FaInstagram } from 'react-icons/fa';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-black/90 border-t border-moon/20 py-12 px-4">
            <div className="container-custom">
                <div className="grid md:grid-cols-4 gap-8 mb-8">
                    {/* Brand Section */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <FaRunning className="text-moon text-2xl animate-pulse" />
                            <span className="font-orbitron font-bold text-xl text-white">
                                Moon<span className="text-moon">Runners</span>
                            </span>
                        </div>
                        <p className="text-gray-400 text-sm mb-4">
                            Run with consistency, discipline, and passion. Join the most vibrant night running community in Cambodia.
                        </p>
                        <div className="flex gap-3">
                            <a
                                href="https://www.facebook.com/share/1C2y1pDcpi/?mibextid=wwXIfr"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-moon transition-colors text-xl"
                            >
                                <FaFacebook />
                            </a>

                            <a
                                href="https://www.tiktok.com/@moon_runner.team?_r=1&_t=ZS-96ZFkS93pLw"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-moon transition-colors text-xl"
                            >
                                <FaTiktok />
                            </a>

                            <a
                                href="https://t.me/moonrunnersclub"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-moon transition-colors text-xl"
                            >
                                <FaTelegram />
                            </a>

                            <a
                                href="https://www.instagram.com/moonrunnersclub"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-moon transition-colors text-xl"
                            >
                                <FaInstagram />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-bold text-white mb-4 text-lg">Quick Links</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#home" className="text-gray-400 hover:text-moon transition-colors">Home</a></li>
                            <li><a href="#about" className="text-gray-400 hover:text-moon transition-colors">About</a></li>
                            <li><a href="#mission" className="text-gray-400 hover:text-moon transition-colors">Mission</a></li>
                            <li><a href="#social" className="text-gray-400 hover:text-moon transition-colors">Social Media</a></li>
                            <li><a href="#gallery" className="text-gray-400 hover:text-moon transition-colors">Gallery</a></li>
                            <li><a href="#sponsorship" className="text-gray-400 hover:text-moon transition-colors">Sponsorship</a></li>
                            <li><a href="#contact" className="text-gray-400 hover:text-moon transition-colors">Contact</a></li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="font-bold text-white mb-4 text-lg">Community</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="https://t.me/moonrunnersclub"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-moon transition-colors">Join Telegram (105+ members)</a>
                            </li>
                            <li><a href="https://www.tiktok.com/@moon_runner.team?_r=1&_t=ZS-96ZFkS93pLw"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-moon transition-colors">Watch on TikTok</a>
                            </li>
                            <li><a href="https://www.facebook.com/share/1C2y1pDcpi/?mibextid=wwXIfr"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-moon transition-colors">Follow on Facebook</a>
                            </li>
                            <li><a href="https://instagram.com/moonrunnersclub"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-moon transition-colors">Follow on Instagram</a>
                            </li>
                            <li><a href="#"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-moon transition-colors">Upcoming Events</a>
                            </li>
                            <li><a href="#"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-moon transition-colors">Become a Sponsor</a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="font-bold text-white mb-4 text-lg">Contact Us</h4>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start gap-3 text-gray-400">
                                <FaMapMarkerAlt className="text-moon mt-0.5" />
                                <span>Phnom Penh, Cambodia</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-400">
                                <FaEnvelope className="text-moon" />
                                <a href="mailto:moonrunners@club.com" className="hover:text-moon transition-colors">
                                    moonrunners@club.com
                                </a>
                            </li>
                            <li className="flex items-center gap-3 text-gray-400">
                                <FaPhone className="text-moon" />
                                <a href="tel:+85512345678" className="hover:text-moon transition-colors">
                                    +855 12 345 678
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div className="text-center pt-8 border-t border-gray-800">
                    <p className="text-gray-500 text-sm flex items-center justify-center gap-1">
                        Made by panha_pourn <FaHeart className="text-moon text-xs animate-pulse" /> for Moon-Runners Club
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                        © {currentYear} Moon-Runners Club. All rights reserved.
                    </p>
                    <p className="text-gray-600 text-xs mt-2">
                        Run with consistency, discipline, and passion
                    </p>
                </div>
            </div>
        </footer>
    );
}