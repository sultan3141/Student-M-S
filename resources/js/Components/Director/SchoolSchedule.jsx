import React from 'react';
import { ClockIcon, CalendarIcon } from '@heroicons/react/24/outline';

export default function SchoolSchedule() {
    return (
        <div className="executive-card overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                    <CalendarIcon className="h-6 w-6 text-blue-600" />
                    <h3 className="text-lg font-bold text-navy-900" style={{ color: '#0F172A' }}>
                        📅 School Program Schedule (5-Day Week)
                    </h3>
                </div>
            </div>

            {/* Weekly Overview */}
            <div className="mb-8">
                <h4 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">Weekly Overview</h4>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day, idx) => (
                        <div
                            key={day}
                            className={`bg-gradient-to-br text-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer`}
                            style={{
                                backgroundImage: `linear-gradient(to bottom right, ${['#3b82f6', '#a855f7', '#ec4899', '#10b981', '#f59e0b'][idx]}, ${['#1e40af', '#7c3aed', '#be185d', '#059669', '#d97706'][idx]})`
                            }}
                        >
                            <div className="text-2xl mb-2">📅</div>
                            <div className="font-bold text-lg">{day}</div>
                            <div className="text-sm opacity-90 mt-2">Regular Classes</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Daily Schedule */}
            <div className="mb-8">
                <h4 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">Daily Time Schedule</h4>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Time</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Activity</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Duration</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Location</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {[
                                { time: '08:00 AM', activity: 'Assembly & Morning Meeting', duration: '30 min', location: 'Main Hall' },
                                { time: '08:30 AM', activity: 'Period 1', duration: '60 min', location: 'Classrooms' },
                                { time: '09:30 AM', activity: 'Period 2', duration: '60 min', location: 'Classrooms' },
                                { time: '10:30 AM', activity: 'Break', duration: '15 min', location: 'Playground' },
                                { time: '10:45 AM', activity: 'Period 3', duration: '60 min', location: 'Classrooms' },
                                { time: '11:45 AM', activity: 'Period 4', duration: '60 min', location: 'Classrooms' },
                                { time: '12:45 PM', activity: 'Lunch Break', duration: '45 min', location: 'Cafeteria' },
                                { time: '01:30 PM', activity: 'Period 5', duration: '60 min', location: 'Classrooms' },
                                { time: '02:30 PM', activity: 'Period 6', duration: '60 min', location: 'Classrooms' },
                                { time: '03:30 PM', activity: 'Dismissal', duration: '30 min', location: 'Main Gate' },
                            ].map((slot, index) => (
                                <tr key={index} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                        <div className="flex items-center space-x-2">
                                            <ClockIcon className="h-4 w-4 text-blue-500" />
                                            <span>{slot.time}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-700">{slot.activity}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{slot.duration}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{slot.location}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Grade-wise Schedule */}
            <div className="mb-8">
                <h4 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">Grade-wise Schedule Variations</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        { grade: 'Grade 9-10', start: '8:00 AM', end: '3:30 PM', lunch: '12:45 PM - 1:30 PM', periods: 6 },
                        { grade: 'Grade 11-12', start: '8:00 AM', end: '3:30 PM', lunch: '12:45 PM - 1:30 PM', periods: 6 },
                        { grade: 'Special Programs', start: 'Varies', end: 'Varies', lunch: 'As scheduled', periods: 'N/A' },
                    ].map((item, idx) => (
                        <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-center space-x-2 mb-3">
                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                <h5 className="font-bold text-gray-900">{item.grade}</h5>
                            </div>
                            <ul className="space-y-2 text-sm text-gray-700">
                                <li>• Start: {item.start}</li>
                                <li>• End: {item.end}</li>
                                <li>• Lunch: {item.lunch}</li>
                                <li>• Periods: {item.periods}</li>
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Important Notes */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h5 className="font-bold text-blue-900 mb-2">📌 Important Notes</h5>
                <ul className="space-y-1 text-sm text-blue-800">
                    <li>• School operates Monday to Friday (5-day week)</li>
                    <li>• Saturday and Sunday are holidays</li>
                    <li>• Assembly is mandatory every Monday morning</li>
                    <li>• Special events may alter the regular schedule</li>
                    <li>• Parents are notified of any schedule changes via email</li>
                </ul>
            </div>
        </div>
    );
}
