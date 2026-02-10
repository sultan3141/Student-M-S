import React from 'react';
import StudentLayout from '@/Layouts/StudentLayout';
import { Head, Link } from '@inertiajs/react';
import {
    CalendarIcon,
    ArrowLeftIcon,
} from '@heroicons/react/24/outline';

export default function Schedule({ student, schedule }) {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    return (
        <StudentLayout>
            <Head title="Class Schedule" />

            <div className="py-8 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header Card */}
                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-lg p-8 mb-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-500/20 rounded-xl">
                                <CalendarIcon className="w-10 h-10 text-blue-300" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white tracking-wide">CLASS SCHEDULE</h1>
                                <p className="text-blue-200 text-sm mt-1">
                                    {student.grade?.name} - {student.section?.name}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Schedule Table */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 border-b-2 border-gray-300">
                                        <th className="border-r border-gray-300 px-4 py-3 text-center font-bold text-gray-700 text-sm uppercase tracking-wider w-32">
                                            TIME
                                        </th>
                                        {days.map(day => (
                                            <th key={day} className="border-r border-gray-300 last:border-r-0 px-4 py-3 text-center font-bold text-gray-700 text-sm uppercase tracking-wider">
                                                {day.substring(0, 3)}
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
                                                    <td colSpan="6" className="px-4 py-12 text-center text-gray-400 italic">
                                                        No schedule entries found for your class.
                                                    </td>
                                                </tr>
                                            );
                                        }

                                        return allSlots.map((slot, idx) => (
                                            <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                                                <td className="border-r border-gray-300 px-4 py-4 text-center font-semibold bg-gray-50 text-gray-700 text-sm">
                                                    <div className="flex flex-col gap-0.5">
                                                        <span>{slot.start}</span>
                                                        <span className="text-gray-400 text-xs">{slot.end}</span>
                                                    </div>
                                                </td>
                                                {days.map(day => {
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
                                                            className="border-r border-gray-200 last:border-r-0 px-4 py-4 text-center"
                                                        >
                                                            {item ? (
                                                                <div className="flex flex-col items-center gap-1">
                                                                    <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-bold uppercase">
                                                                        CLASS
                                                                    </span>
                                                                    <span className="font-semibold text-gray-900 text-sm">
                                                                        {item.activity}
                                                                    </span>
                                                                </div>
                                                            ) : (
                                                                <span className="text-gray-300 text-lg">-</span>
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
                    <div className="mt-8 flex justify-between items-center">
                        <Link
                            href={route('student.dashboard')}
                            className="flex items-center gap-2 text-blue-600 font-bold hover:underline"
                        >
                            <ArrowLeftIcon className="w-4 h-4" />
                            Return to Dashboard
                        </Link>
                        <div className="bg-blue-50 border border-blue-100 rounded-lg px-6 py-3">
                            <p className="text-sm text-blue-800 italic">
                                📅 Official weekly timetable as assigned by the school registry.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
}
