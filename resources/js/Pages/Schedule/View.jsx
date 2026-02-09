import React from 'react';
import { Head } from '@inertiajs/react';

export default function ScheduleView({ section, schedules }) {
    return (
        <>
            <Head title={`Schedule - ${section.grade.name} ${section.name}`} />
            
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
                            CLASS SCHEDULE
                        </h1>
                        <p className="text-center text-xl text-gray-600">
                            {section.grade.name} - {section.name}
                        </p>
                    </div>

                    {/* Schedule Table */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse border-2 border-gray-600">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="border-2 border-gray-600 px-6 py-4 text-center font-bold text-gray-700 text-lg">
                                            TIME
                                        </th>
                                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
                                            <th key={day} className="border-2 border-gray-600 px-6 py-4 text-center font-bold text-gray-700 text-lg">
                                                {day}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Fixed time slots */}
                                    {[
                                        { start: '07:30', end: '08:30' },
                                        { start: '08:30', end: '09:30' },
                                        { start: '09:30', end: '10:30' },
                                        { start: '10:30', end: '11:30' },
                                        { start: '11:30', end: '12:30' },
                                        { start: '12:30', end: '13:30' },
                                        { start: '13:30', end: '14:30' },
                                        { start: '14:30', end: '15:30' },
                                        { start: '15:30', end: '16:30' },
                                    ].map((slot, idx) => (
                                        <tr key={idx}>
                                            <td className="border-2 border-gray-600 px-4 py-4 text-center font-semibold bg-gray-100 text-gray-700">
                                                {slot.start} - {slot.end}
                                            </td>
                                            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => {
                                                const daySchedule = schedules[day] || [];
                                                const item = Array.isArray(daySchedule) 
                                                    ? daySchedule.find(i => 
                                                        i.start_time?.substring(0, 5) === slot.start && 
                                                        i.end_time?.substring(0, 5) === slot.end
                                                      )
                                                    : null;

                                                return (
                                                    <td 
                                                        key={day} 
                                                        className="border-2 border-gray-600 px-4 py-4 text-center min-h-[60px]"
                                                    >
                                                        {item ? (
                                                            <div className="font-semibold text-gray-900 text-base">
                                                                {item.activity}
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-300">-</span>
                                                        )}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Footer Info */}
                    <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-800 text-center">
                            📅 This is your class schedule. Please arrive on time for each period.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
