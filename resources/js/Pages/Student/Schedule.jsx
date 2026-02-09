import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Schedule({ student, schedule }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    My Class Schedule
                </h2>
            }
        >
            <Head title="My Schedule" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
                            CLASS SCHEDULE
                        </h1>
                        <p className="text-center text-xl text-gray-600">
                            {student.grade?.name} - {student.section?.name}
                        </p>
                    </div>

                    {/* Schedule Table */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="overflow-x-auto p-6">
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
                                    {(() => {
                                        // Get all unique time slots across all days
                                        const allSlots = [];
                                        Object.values(schedule).forEach(daySchedule => {
                                            if (Array.isArray(daySchedule)) {
                                                daySchedule.forEach(item => {
                                                    const timeKey = `${item.start_time?.substring(0, 5)}-${item.end_time?.substring(0, 5)}`;
                                                    if (!allSlots.find(s => s.timeKey === timeKey)) {
                                                        allSlots.push({
                                                            timeKey,
                                                            start: item.start_time?.substring(0, 5),
                                                            end: item.end_time?.substring(0, 5)
                                                        });
                                                    }
                                                });
                                            }
                                        });

                                        // Sort by start time
                                        allSlots.sort((a, b) => a.start.localeCompare(b.start));

                                        if (allSlots.length === 0) {
                                            return (
                                                <tr>
                                                    <td colSpan="6" className="border-2 border-gray-600 px-4 py-8 text-center text-gray-500 italic">
                                                        No schedule entries found for your class.
                                                    </td>
                                                </tr>
                                            );
                                        }

                                        return allSlots.map((slot, idx) => (
                                            <tr key={idx}>
                                                <td className="border-2 border-gray-600 px-4 py-4 text-center font-semibold bg-gray-100 text-gray-700">
                                                    {slot.start} - {slot.end}
                                                </td>
                                                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => {
                                                    const daySchedule = schedule[day] || [];
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
                                        ));
                                    })()}
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
        </AuthenticatedLayout>
    );
}
