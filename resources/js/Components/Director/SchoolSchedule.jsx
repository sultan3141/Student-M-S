import React, { useState } from 'react';
import { ClockIcon, CalendarIcon } from '@heroicons/react/24/outline';

export default function SchoolSchedule() {
    const [selectedGrade, setSelectedGrade] = useState('all');

    // School schedule for 5-day week
    const schedule = {
        monday: { day: 'Monday', color: 'from-blue-500 to-blue-600', icon: '📅' },
        tuesday: { day: 'Tuesday', color: 'from-purple-500 to-purple-600', icon: '📅' },
        wednesday: { day: 'Wednesday', color: 'from-pink-500 to-pink-600', icon: '📅' },
        thursday: { day: 'Thursday', color: 'from-green-500 to-green-600', icon: '📅' },
        friday: { day: 'Friday', color: 'from-amber-500 to-amber-600', icon: '📅' },
    };

    // Time slots
    const timeSlots = [
        { time: '08:00 AM', label: 'Assembly & Morning Meeting' },
        { time: '08:30 AM', label: 'Period 1' },
        { time: '09:30 AM', label: 'Period 2' },
        { time: '10:30 AM', label: 'Break' },
        { time: '10:45 AM', label: 'Period 3' },
        { time: '11:45 AM', label: 'Period 4' },
        { time: '12:45 PM', label: 'Lunch Break' },
        { time: '01:30 PM', label: 'Period 5' },
        { time: '02:30 PM', label: 'Period 6' },
        { time: '03:30 PM', label: 'Dismissal' },
    ];

    // Sample activities for each day
    const dayActivities = {
        monday: ['Assembly', 'Classes', 'Sports Practice'],
        tuesday: ['Classes', 'Lab Sessions', 'Club Activities'],
        wednesday: ['Classes', 'Workshops', 'Counseling'],
        thursday: ['Classes', 'Competitions', 'Meetings'],
        friday: ['Classes', 'Cultural Activities', 'Wrap-up'],
    };

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
                    {Object.entries(schedule).map(([key, day]) => (
                        <div
                            key={key}
                            className={`bg-gradient-to-br ${day.color} text-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer`}
                        >
                            <div className="text-2xl mb-2">{day.icon}</div>
                            <div className="font-bold text-lg">{day.day}</div>
                            <div className="text-sm opacity-90 mt-2">
                                {dayActivities[key]?.join(', ') || 'Regular Classes'}
                            </div>
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
                            {timeSlots.map((slot, index) => (
                                <tr key={index} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                        <div className="flex items-center space-x-2">
                                            <ClockIcon className="h-4 w-4 text-blue-500" />
                                            <span>{slot.time}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-700">{slot.label}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">
                                        {index === 0 || index === 9 ? '30 min' : index === 4 || index === 6 ? '45 min' : '60 min'}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600">
                                        {index === 0 ? 'Main Hall' : index === 4 || index === 6 ? 'Cafeteria' : 'Classrooms'}
                                    </td>
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
                    {/* Grade 9-10 */}
                    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center space-x-2 mb-3">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <h5 className="font-bold text-gray-900">Grade 9-10</h5>
                        </div>
                        <ul className="space-y-2 text-sm text-gray-700">
                            <li>• Start: 8:00 AM</li>
                            <li>• End: 3:30 PM</li>
                            <li>• Lunch: 12:45 PM - 1:30 PM</li>
                            <li>• 6 Periods + Assembly</li>
                        </ul>
                    </div>

                    {/* Grade 11-12 */}
                    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center space-x-2 mb-3">
                            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                            <h5 className="font-bold text-gray-900">Grade 11-12</h5>
                        </div>
                        <ul className="space-y-2 text-sm text-gray-700">
                            <li>• Start: 8:00 AM</li>
                            <li>• End: 3:30 PM</li>
                            <li>• Lunch: 12:45 PM - 1:30 PM</li>
                            <li>• 6 Periods + Assembly</li>
                        </ul>
                    </div>

                    {/* Special Programs */}
                    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center space-x-2 mb-3">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <h5 className="font-bold text-gray-900">Special Programs</h5>
                        </div>
                        <ul className="space-y-2 text-sm text-gray-700">
                            <li>• Sports: Mon & Thu</li>
                            <li>• Clubs: Tue & Wed</li>
                            <li>• Counseling: Wed</li>
                            <li>• Cultural: Fri</li>
                        </ul>
                    </div>
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
