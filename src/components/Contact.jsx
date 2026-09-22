import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaEnvelope, FaUser, FaPhone, FaPaperPlane, FaTelegram, FaFacebook, FaTiktok, FaInstagram, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
    });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await fetch('http://localhost:5000/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setSuccess('✓ Message sent! We\'ll get back to you soon. 🌙');
                setFormData({ name: '', email: '', phone: '', message: '' });
                setSubmitted(true);
                setTimeout(() => setSubmitted(false), 5000);
            } else {
                setError(data.message || 'Failed to send message. Please try again.');
            }
        } catch (err) {
            console.error('Error sending message:', err);
            setError('Network error. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear errors when user starts typing
        if (error) setError('');
    };

    return (
        <section id="contact" className="py-20 px-4 bg-gradient-to-b from-deep to-night">
            <div className="container-custom" ref={ref}>
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="section-title">
                        Get In <span className="text-gradient">Touch</span>
                    </h2>
                    <div className="divider"></div>
                    <p className="section-subtitle">
                        Ready to join or partner with us? Reach out today!
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="card p-8"
                    >
                        <h3 className="text-2xl font-bold text-white mb-6">Send us a message</h3>

                        {error && (
                            <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-400 text-sm flex items-center gap-2">
                                <FaExclamationCircle className="text-red-500" />
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="mb-4 p-3 bg-green-500/20 border border-green-500 rounded-lg text-green-400 text-sm flex items-center gap-2">
                                <FaCheckCircle className="text-green-500" />
                                {success}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-gray-300 mb-2 text-sm font-semibold">Full Name *</label>
                                <div className="relative">
                                    <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        disabled={loading}
                                        className="w-full pl-10 pr-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-moon focus:outline-none transition-colors disabled:opacity-50"
                                        placeholder="Your full name"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-300 mb-2 text-sm font-semibold">Email Address *</label>
                                <div className="relative">
                                    <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        disabled={loading}
                                        className="w-full pl-10 pr-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-moon focus:outline-none transition-colors disabled:opacity-50"
                                        placeholder="your@email.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-300 mb-2 text-sm font-semibold">Phone Number</label>
                                <div className="relative">
                                    <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        disabled={loading}
                                        className="w-full pl-10 pr-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-moon focus:outline-none transition-colors disabled:opacity-50"
                                        placeholder="Your phone number"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-300 mb-2 text-sm font-semibold">Message *</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows="4"
                                    disabled={loading}
                                    className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-moon focus:outline-none transition-colors disabled:opacity-50"
                                    placeholder="Tell us about yourself or your sponsorship interest..."
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn-primary justify-center text-lg py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <span className="animate-spin mr-2">⟳</span>
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <FaPaperPlane />
                                        Send Message
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.div>

                    {/* Contact Info & Social */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="space-y-6"
                    >
                        <div className="card p-8">
                            <h3 className="text-2xl font-bold text-white mb-6">Connect With Us</h3>

                            <div className="space-y-4">
                                <a
                                    href="https://t.me/moonrunnersclub"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-4 p-4 bg-black/30 rounded-lg hover:bg-black/50 transition-all duration-300 group border border-transparent hover:border-moon/30"
                                >
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                                        <FaTelegram className="text-white text-xl" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-white group-hover:text-moon transition-colors">Telegram Group</p>
                                        <p className="text-gray-400 text-sm">Join our community (105+ members)</p>
                                    </div>
                                </a>

                                <a
                                    href="https://www.tiktok.com/@moon_runner.team?_r=1&_t=ZS-96ZFkS93pLw"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-4 p-4 bg-black/30 rounded-lg hover:bg-black/50 transition-all duration-300 group border border-transparent hover:border-moon/30"
                                >
                                    <div className="w-12 h-12 bg-gradient-to-br from-black to-gray-800 rounded-full flex items-center justify-center shadow-lg">
                                        <FaTiktok className="text-white text-xl" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-white group-hover:text-moon transition-colors">TikTok</p>
                                        <p className="text-gray-400 text-sm">10K-100K+ views per video</p>
                                    </div>
                                </a>

                                <a
                                    href="https://www.facebook.com/share/1C2y1pDcpi/?mibextid=wwXIfr"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-4 p-4 bg-black/30 rounded-lg hover:bg-black/50 transition-all duration-300 group border border-transparent hover:border-moon/30"
                                >
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center shadow-lg">
                                        <FaFacebook className="text-white text-xl" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-white group-hover:text-moon transition-colors">Facebook Page</p>
                                        <p className="text-gray-400 text-sm">Growing engagement daily</p>
                                    </div>
                                </a>
                            </div>
                        </div>

                        <div className="card p-8 text-center">
                            <h3 className="text-2xl font-bold text-white mb-4">Quick Contact</h3>
                            <div className="space-y-3">
                                <p className="text-gray-300">📧 moonrunners@club.com</p>
                                <p className="text-gray-300">📱 +855 12 345 678</p>
                                <p className="text-gray-300">📍 Phnom Penh, Cambodia</p>
                            </div>
                            <div className="mt-6 pt-6 border-t border-gray-800">
                                <p className="text-moon font-semibold">🏃‍♂️ Run with us tonight!</p>
                                <p className="text-gray-400 text-sm mt-2">Join our next run - Everyone welcome!</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}