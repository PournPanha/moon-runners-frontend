import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaTiktok, FaFacebook, FaVideo, FaTshirt, FaTag, FaHandshake, FaCalendar, FaGift } from 'react-icons/fa';

export default function Sponsorship() {
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

    const benefits = [
        {
            title: "Social Media Exposure",
            icon: <FaTiktok className="text-3xl" />,
            items: [
                "TikTok views (10K-100K+)",
                "Facebook engagement growing",
                "10 Videos per month",
                "Photo shoots with hashtags",
                "100+ active members"
            ]
        },
        {
            title: "Content Creation",
            icon: <FaVideo className="text-3xl" />,
            items: [
                "Running lifestyle videos",
                "Brand promotion videos",
                "Product photos with runners",
                "Event highlight videos",
                "Short product reviews"
            ]
        },
        {
            title: "Event Collaboration",
            icon: <FaHandshake className="text-3xl" />,
            items: [
                "Sponsor logo on event shirts",
                "Sponsor booth during events",
                "Brand banner at start/finish",
                "Brand name mentioned",
                "Product featured in activities"
            ]
        }
    ];

    const packages = [
        { months: 3, price: "$750", features: ["Basic exposure", "Social media posts", "Logo on website"] },
        { months: 6, price: "$1,500", features: ["Enhanced exposure", "Video content", "Event presence", "Product placement"] },
        { months: 12, price: "$2,100", features: ["Premium exposure", "Featured content", "Title sponsorship", "Full collaboration"] }
    ];

    return (
        <section id="sponsorship" className="py-20 px-4 bg-gradient-to-b from-night to-deep relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

            <div className="container-custom relative z-10" ref={ref}>
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="section-title">
                        Sponsor <span className="text-gradient">Benefits</span>
                    </h2>
                    <div className="divider"></div>
                    <p className="section-subtitle">
                        Partner with us and reach thousands of engaged runners and fitness enthusiasts
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    {benefits.map((benefit, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            whileHover={{ y: -5 }}
                            className="card p-6"
                        >
                            <div className="text-moon mb-4">{benefit.icon}</div>
                            <h3 className="text-xl font-bold text-white mb-4">{benefit.title}</h3>
                            <ul className="space-y-2">
                                {benefit.items.map((item, idx) => (
                                    <li key={idx} className="flex items-center gap-2 text-gray-300 text-sm">
                                        <FaTag className="text-moon text-xs" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>

                {/* Sponsorship Packages */}
                {/* <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.3, duration: 0.5 }}
                >
                    <h3 className="text-3xl font-bold text-center text-white mb-8">Sponsorship Packages</h3>
                    <div className="grid md:grid-cols-3 gap-8">
                        {packages.map((pkg, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ y: -5 }}
                                className="card p-6 text-center"
                            >
                                <div className="text-3xl font-bold text-moon mb-2">{pkg.price}</div>
                                <div className="text-gray-400 mb-4">{pkg.months} months cooperation</div>
                                <ul className="space-y-2 text-left mb-6">
                                    {pkg.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-center gap-2 text-gray-300 text-sm">
                                            <FaGift className="text-moon text-xs" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                <button className="w-full btn-secondary text-sm py-2">
                                    Partner Now
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </motion.div> */}

                {/* Requirements */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="mt-16 p-8 bg-gradient-to-r from-moon/10 to-transparent rounded-2xl border border-moon/20"
                >
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <FaHandshake className="text-moon" /> Sponsorship Requirements
                            </h3>
                            <ul className="space-y-2">
                                <li className="flex items-center gap-2 text-gray-300">• Sponsor brand banner at running events</li>
                                <li className="flex items-center gap-2 text-gray-300">• Gift vouchers for team members</li>
                                <li className="flex items-center gap-2 text-gray-300">• Product provider to team</li>
                                <li className="flex items-center gap-2 text-gray-300">• Collaboration on T-shirts with logo</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <FaTshirt className="text-moon" /> Product Support
                            </h3>
                            <ul className="space-y-2">
                                <li className="flex items-center gap-2 text-gray-300">• Running gear and apparel</li>
                                <li className="flex items-center gap-2 text-gray-300">• Hydration products</li>
                                <li className="flex items-center gap-2 text-gray-300">• Event merchandise</li>
                                <li className="flex items-center gap-2 text-gray-300">• Branded accessories</li>
                            </ul>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
