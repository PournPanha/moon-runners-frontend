import React, { useState, useEffect } from 'react';
import {
    FaSave,
    FaEdit,
    FaSpinner,
    FaTimes,
    FaClock,
    FaMapMarkerAlt,
    FaRunning,
    FaHeartbeat,
    FaBolt,
    FaCloudSun,
    FaMoon,
    FaDumbbell,
    FaPray,
    FaStar,
    FaUndo,
    FaTrash
} from 'react-icons/fa';

const iconMap = {
    FaCloudSun: <FaCloudSun />,
    FaBolt: <FaBolt />,
    FaHeartbeat: <FaHeartbeat />,
    FaRunning: <FaRunning />,
    FaMoon: <FaMoon />,
    FaDumbbell: <FaDumbbell />,
    FaPray: <FaPray />,
};

const iconOptions = ['FaCloudSun', 'FaBolt', 'FaHeartbeat', 'FaRunning', 'FaMoon', 'FaDumbbell', 'FaPray'];

const intensityOptions = ['Low', 'Low-Medium', 'Medium', 'Medium-High', 'High', 'None'];
const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function AdminSchedule() {
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingDay, setEditingDay] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        fetchSchedule();
    }, []);

    const fetchSchedule = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch('http://localhost:5000/api/schedule', {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (response.ok) {
                const data = await response.json();
                setSchedule(Array.isArray(data) ? data : []);
            } else {
                console.error('Failed to fetch schedule');
            }
        } catch (error) {
            console.error('Error fetching schedule:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (day) => {
        const dayData = schedule.find(d => d.day === day);
        setEditingDay(day);
        setEditForm(dayData || {});
    };

    const handleSave = async (day) => {
        const token = localStorage.getItem('adminToken');
        try {
            const response = await fetch(`http://localhost:5000/api/schedule/${day}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(editForm),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage(`✅ ${day} schedule updated successfully`);
                setTimeout(() => setSuccessMessage(''), 3000);
                fetchSchedule();
                setEditingDay(null);
            } else {
                setErrorMessage(data.message || 'Failed to update schedule');
                setTimeout(() => setErrorMessage(''), 3000);
            }
        } catch (error) {
            console.error('Error saving schedule:', error);
            setErrorMessage('Network error. Please try again.');
            setTimeout(() => setErrorMessage(''), 3000);
        }
    };

    const handleReset = async () => {
        if (!window.confirm('Are you sure you want to reset all schedule to default?')) return;

        const token = localStorage.getItem('adminToken');
        try {
            const response = await fetch('http://localhost:5000/api/schedule/reset', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                setSuccessMessage('✅ Schedule reset to default');
                setTimeout(() => setSuccessMessage(''), 3000);
                fetchSchedule();
            }
        } catch (error) {
            console.error('Error resetting schedule:', error);
            setErrorMessage('Failed to reset schedule');
            setTimeout(() => setErrorMessage(''), 3000);
        }
    };

    const handleCancel = () => {
        setEditingDay(null);
        setEditForm({});
    };

    const getIntensityBadge = (intensity) => {
        const colors = {
            'Low': 'bg-green-500/20 text-green-400',
            'Low-Medium': 'bg-blue-500/20 text-blue-400',
            'Medium': 'bg-yellow-500/20 text-yellow-400',
            'Medium-High': 'bg-orange-500/20 text-orange-400',
            'High': 'bg-red-500/20 text-red-400',
            'None': 'bg-gray-500/20 text-gray-400',
        };
        return colors[intensity] || colors['Medium'];
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <FaSpinner className="text-moon text-4xl animate-spin mx-auto mb-4" />
                    <p className="text-gray-400">Loading schedule...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-orbitron font-bold text-white">Training Schedule</h1>
                    <p className="text-gray-400 mt-2">Manage weekly training schedule</p>
                </div>
                <button
                    onClick={handleReset}
                    className="btn-secondary flex items-center gap-2"
                >
                    <FaUndo /> Reset to Default
                </button>
            </div>

            {/* Success/Error Messages */}
            {successMessage && (
                <div className="mb-4 p-3 bg-green-500/20 border border-green-500 rounded-lg text-green-400">
                    {successMessage}
                </div>
            )}
            {errorMessage && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-400">
                    {errorMessage}
                </div>
            )}

            <div className="space-y-4">
                {schedule.length === 0 ? (
                    <div className="text-center py-12 bg-deep/30 rounded-xl">
                        <p className="text-gray-400">No schedule found. Click "Reset to Default" to create one.</p>
                    </div>
                ) : (
                    schedule.map((dayData) => {
                        const day = dayData.day;
                        const isEditing = editingDay === day;

                        if (isEditing) {
                            return (
                                <div key={day} className="bg-deep/50 rounded-xl border border-moon/20 p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-xl font-bold text-white">Editing {day}</h3>
                                        <button onClick={handleCancel} className="text-gray-400 hover:text-white">
                                            <FaTimes />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            value={editForm.type || ''}
                                            onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                                            placeholder="Training Type (e.g., Easy Run)"
                                            className="px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-moon focus:outline-none"
                                        />

                                        <select
                                            value={editForm.icon || 'FaRunning'}
                                            onChange={(e) => setEditForm({ ...editForm, icon: e.target.value })}
                                            className="px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-moon focus:outline-none"
                                        >
                                            {iconOptions.map(icon => (
                                                <option key={icon} value={icon}>
                                                    {icon.replace('Fa', '')}
                                                </option>
                                            ))}
                                        </select>

                                        <input
                                            type="text"
                                            value={editForm.time || ''}
                                            onChange={(e) => setEditForm({ ...editForm, time: e.target.value })}
                                            placeholder="Time (e.g., 6:00 PM - 7:30 PM)"
                                            className="px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-moon focus:outline-none"
                                        />

                                        <input
                                            type="text"
                                            value={editForm.location || ''}
                                            onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                                            placeholder="Location"
                                            className="px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-moon focus:outline-none"
                                        />

                                        <input
                                            type="text"
                                            value={editForm.distance || ''}
                                            onChange={(e) => setEditForm({ ...editForm, distance: e.target.value })}
                                            placeholder="Distance (e.g., 5KM)"
                                            className="px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-moon focus:outline-none"
                                        />

                                        <input
                                            type="text"
                                            value={editForm.pace || ''}
                                            onChange={(e) => setEditForm({ ...editForm, pace: e.target.value })}
                                            placeholder="Pace (e.g., 7-8 min/km)"
                                            className="px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-moon focus:outline-none"
                                        />

                                        <input
                                            type="text"
                                            value={editForm.focus || ''}
                                            onChange={(e) => setEditForm({ ...editForm, focus: e.target.value })}
                                            placeholder="Focus (e.g., Speed & Power)"
                                            className="px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-moon focus:outline-none"
                                        />

                                        <input
                                            type="text"
                                            value={editForm.calories || ''}
                                            onChange={(e) => setEditForm({ ...editForm, calories: e.target.value })}
                                            placeholder="Calories (e.g., 300-400)"
                                            className="px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-moon focus:outline-none"
                                        />

                                        <textarea
                                            value={editForm.description || ''}
                                            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                            placeholder="Description"
                                            rows="2"
                                            className="px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-moon focus:outline-none"
                                        />

                                        <select
                                            value={editForm.intensity || 'Medium'}
                                            onChange={(e) => setEditForm({ ...editForm, intensity: e.target.value })}
                                            className="px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-moon focus:outline-none"
                                        >
                                            {intensityOptions.map(option => (
                                                <option key={option} value={option}>{option}</option>
                                            ))}
                                        </select>

                                        <label className="flex items-center gap-2 text-gray-300">
                                            <input
                                                type="checkbox"
                                                checked={editForm.isRestDay || false}
                                                onChange={(e) => setEditForm({ ...editForm, isRestDay: e.target.checked })}
                                                className="w-4 h-4 accent-moon"
                                            />
                                            Rest Day
                                        </label>
                                    </div>

                                    <div className="flex gap-3 mt-6">
                                        <button onClick={() => handleSave(day)} className="btn-primary">
                                            <FaSave /> Save Changes
                                        </button>
                                        <button onClick={handleCancel} className="btn-secondary">
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            );
                        }

                        // Display view
                        return (
                            <div
                                key={day}
                                className={`bg-deep/50 rounded-xl border p-6 transition-all ${dayData.isRestDay
                                        ? 'border-moon/40 bg-gradient-to-br from-moon/10 to-transparent'
                                        : 'border-moon/10 hover:border-moon/30'
                                    }`}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-4">
                                        <div className={`text-2xl ${dayData.isRestDay ? 'animate-pulse text-moon' : 'text-moon'}`}>
                                            {iconMap[dayData.icon] || <FaRunning />}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white">{day}</h3>
                                            <p className="text-moon font-semibold">{dayData.type}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {dayData.isRestDay && (
                                            <span className="flex items-center gap-1 text-moon text-sm">
                                                <FaStar /> Rest Day
                                            </span>
                                        )}
                                        <button
                                            onClick={() => handleEdit(day)}
                                            className="text-blue-400 hover:text-blue-300 transition"
                                        >
                                            <FaEdit />
                                        </button>
                                    </div>
                                </div>

                                {!dayData.isRestDay && (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                                        <div>
                                            <p className="text-gray-500 flex items-center gap-1">
                                                <FaClock className="text-moon" /> Time
                                            </p>
                                            <p className="text-white">{dayData.time}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 flex items-center gap-1">
                                                <FaMapMarkerAlt className="text-moon" /> Location
                                            </p>
                                            <p className="text-white">{dayData.location}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 flex items-center gap-1">
                                                <FaRunning className="text-moon" /> Distance
                                            </p>
                                            <p className="text-white">{dayData.distance}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Intensity</p>
                                            <p className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${getIntensityBadge(dayData.intensity)}`}>
                                                {dayData.intensity}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {dayData.isRestDay && (
                                    <div className="mt-4 text-gray-400 text-sm">
                                        <p>{dayData.description}</p>
                                        <p className="text-moon mt-1">🧘 Focus: {dayData.focus}</p>
                                    </div>
                                )}

                                {!dayData.isRestDay && dayData.description && (
                                    <div className="mt-3 pt-3 border-t border-gray-800 text-gray-400 text-sm">
                                        {dayData.description}
                                        {dayData.pace && (
                                            <span className="ml-4 text-gray-500">Pace: {dayData.pace}</span>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}