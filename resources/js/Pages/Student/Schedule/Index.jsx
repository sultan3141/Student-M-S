import React from 'react';
import { Head } from '@inertiajs/react';
import StudentLayout from '@/Layouts/StudentLayout';
import { CalendarDaysIcon, ClockIcon, MapPinIcon } from '@heroicons/react/24/outline';

export default function ScheduleIndex({ student, scheduleByDay, daysOfWeek, today }) {
    const getDayColor = (day) => {
        if (day === today) {
            return 'bg-blue-50 border-blue-300';
        }
        return 'bg-white border-gray-200';
    };

    const getActivityColor = (activity) => {
        if (activity.toLowerCase().includes('break')) {
            return 'bg-amber-50 border-l-4 border-amber-400';
        }
        if (activity.toLowerCase().includes('lunch')) {
            return 'bg-green-50 border-l-4 border-green-400';
        }
        return 'bg-blue-50 border-l-4 border-blue-400';
    };

    return (
        <StudentLayout>
            <Head title="My Schedule" />

            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-navy-900" style={{ color: '#0F172A' }}>
                    📅 My Weekly Schedule
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                    {student.grade?.name} - Section {student.section?.name}
                </p>
            </div>

            {/* Today's Highlight */}
            {scheduleByDay[today] && scheduleByDay[today].length > 0 && (
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 mb-6 text-white">
                    <div className="flex items-center space-x-3 mb-4">
                        <CalendarDaysIcon className="h-8 w-8" />
                        <div>
                            <h2 className="text-xl font-bold">Today's Schedule</h2>
                            <p className="text-blue-100">{today}</p>
                        </div>
                    </div>
                    <div className="space-y-2">
                        {scheduleByDay[today].map((item, index) => (
                            <div key={index} className="bg-white bg-opacity-20 rounded-lg p-3 backdrop-blur-sm">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <ClockIcon className="h-5 w-5" />
                                        <span className="font-medium">{item.start_time} - {item.end_time}</span>
                                    </div>
                                    <span className="font-semibold">{item.activity}</span>
                                </div>
                                {item.location && (
                                    <div className="flex items-center space-x-2 mt-2 text-sm text-blue-100">
                                        <MapPinIcon className="h-4 w-4" />
                                        <span>{item.location}</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Weekly Schedule */}
            <div className="space-y-4">
                {daysOfWeek.map((day) => {
                    const daySchedule = scheduleByDay[day] || [];
                    
                    if (daySchedule.length === 0) {
                        return null;
                    }

                    return (
                        <div key={day} className={`border rounded-lg overflow-hidden ${getDayColor(day)}`}>
                            <div className={`px-6 py-4 border-b ${day === today ? 'bg-blue-100 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-bold text-gray-900">{day}</h3>
                                    {day === today && (
                                        <span className="px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full">
                                            Today
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="p-4 space-y-3">
                                {daySchedule.map((item, index) => (
                                    <div key={index} className={`rounded-lg p-4 ${getActivityColor(item.activity)}`}>
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-3 mb-2">
                                                    <ClockIcon className="h-5 w-5 text-gray-600" />
                                                    <span className="font-semibold text-gray-900">
                                                        {item.start_time} - {item.end_time}
                                                    </span>
                                                </div>
                                                <h4 className="text-lg font-bold text-gray-900 mb-1">
                                                    {item.activity}
                                                </h4>
                                                {item.location && (
                                                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                        <MapPinIcon className="h-4 w-4" />
                                                        <span>{item.location}</span>
                                                    </div>
                                                )}
                                                {item.description && (
                                                    <p className="text-sm text-gray-600 mt-2">{item.description}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Empty State */}
            {Object.keys(scheduleByDay).length === 0 && (
                <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
                    <CalendarDaysIcon className="h-16 w-16 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">No schedule available</p>
                    <p className="text-sm text-gray-400 mt-1">
                        Your weekly schedule will appear here once it's been set up
                    </p>
                </div>
            )}
        </StudentLayout>
    );
}
