import React from 'react';
import { ClockIcon, CalendarIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

export default function SchoolSchedule() {
    const [overview, setOverview] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        axios.get(route('director.schedule.overview'))
            .then(res => {
                setOverview(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load schedule overview", err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading schedule overview...</div>;
    }

    if (!overview) return null;

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    return (
        <div className="executive-card overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                    <CalendarIcon className="h-6 w-6 text-blue-600" />
                    <h3 className="text-lg font-bold text-navy-900" style={{ color: '#0F172A' }}>
                        School Program Overview
                    </h3>
                </div>
                <div className="text-sm text-gray-500">
                    Total Classes: <span className="font-bold text-blue-600">{overview.total_classes}</span> |
                    Active Sections: <span className="font-bold text-blue-600">{overview.active_sections}</span>
                </div>
            </div>

            {/* Weekly Overview */}
            <div className="mb-8">
                <h4 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">Weekly Load</h4>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                    {days.map((day, idx) => (
                        <div
                            key={day}
                            className={`bg-gradient-to-br text-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow`}
                            style={{
                                backgroundImage: `linear-gradient(to bottom right, ${['#3b82f6', '#a855f7', '#ec4899', '#10b981', '#f59e0b'][idx]}, ${['#1e40af', '#7c3aed', '#be185d', '#059669', '#d97706'][idx]})`
                            }}
                        >
                            <div className="flex justify-between items-start">
                                <div className="font-bold text-lg">{day}</div>
                                {day === overview.today && <span className="bg-white/20 px-2 py-0.5 rounded text-xs">Today</span>}
                            </div>
                            <div className="text-2xl font-bold mt-2">{overview.classes_per_day[day] || 0}</div>
                            <div className="text-sm opacity-90">Classes</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Today's Stats */}
            <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">Today's Schedule ({overview.today})</h4>
                    <div className="overflow-x-auto bg-white border border-gray-100 rounded-lg">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Time</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Class</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Activity</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {overview.today_schedule.length > 0 ? (
                                    overview.today_schedule.map((slot, index) => (
                                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                                <div className="flex items-center space-x-2">
                                                    <ClockIcon className="h-4 w-4 text-blue-500" />
                                                    <span>{slot.start_time.substring(0, 5)}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-700">
                                                {slot.grade?.name} - {slot.section?.name}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600">{slot.activity}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="px-4 py-8 text-center text-gray-500 italic">
                                            No classes scheduled for today yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Important Notes / Stats */}
                <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">Day at a Glance</h4>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-blue-800 font-medium">Earliest Class:</span>
                            <span className="font-bold text-blue-900">{overview.earliest_start}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-blue-800 font-medium">Latest Class:</span>
                            <span className="font-bold text-blue-900">{overview.latest_end}</span>
                        </div>
                    </div>

                    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                        <h5 className="font-bold text-indigo-900 mb-2">📌 System Note</h5>
                        <p className="text-sm text-indigo-800">
                            This overview aggregates all active schedules across all {overview.active_sections} sections.
                            Use the dropdown filters above to view and manage specific class schedules.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
