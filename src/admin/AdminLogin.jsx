import React, { useState } from 'react';
import { FaEnvelope, FaLock, FaRunning } from 'react-icons/fa';

export default function AdminLogin({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('adminToken', data.token);
                localStorage.setItem('adminUser', JSON.stringify(data.user));
                onLogin(data.user);
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-night to-deep">
            <div className="bg-black/50 backdrop-blur-sm p-8 rounded-2xl border border-moon/20 w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-moon to-yellow-600 rounded-full flex items-center justify-center mb-4">
                        <FaRunning className="text-black text-3xl" />
                    </div>
                    <h2 className="text-3xl font-orbitron font-bold text-white">Admin Login</h2>
                    <p className="text-gray-400 mt-2">Moon-Runners Dashboard</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-gray-300 mb-2">Email</label>
                        <div className="relative">
                            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full pl-10 pr-4 py-3 bg-deep border border-gray-700 rounded-lg text-white focus:border-moon focus:outline-none"
                                placeholder="admin@moonrunners.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-300 mb-2">Password</label>
                        <div className="relative">
                            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full pl-10 pr-4 py-3 bg-deep border border-gray-700 rounded-lg text-white focus:border-moon focus:outline-none"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-500/20 border border-red-500 rounded-lg p-3 text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary justify-center py-3"
                    >
                        {loading ? 'Logging in...' : 'Login to Dashboard'}
                    </button>
                </form>

                <div className="mt-6 text-center text-gray-500 text-sm">
                    <p>Demo Credentials:</p>
                    <p>Email: admin@moonrunners.com</p>
                    <p>Password: Admin123456</p>
                </div>
            </div>
        </div>
    );
}