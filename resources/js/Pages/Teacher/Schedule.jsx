import React from 'react';
import TeacherLayout from '@/Layouts/TeacherLayout';
import { Head, router, Link } from '@inertiajs/react';
import {
    CalendarIcon,
    ArrowLeftIcon,
} from '@heroicons/react/24/outline';

export default function Schedule({ sections, selectedSectionId, schedule }) {
    const selectedSection = sections.find(s => s.id == selectedSectionId);

    const handleSectionChange = (e) => {
        router.get(route('teacher.schedule'), { section_id: e.target.value }, { preserveState: true });
    };

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    return (
        <TeacherLayout>
            <Head title="Class Schedule" />

            <div className="py-8 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header Card */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-100 rounded-full">
                                    <CalendarIcon className="w-8 h-8 text-blue-600" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-800">CLASS SCHEDULE</h1>
                                    <p className="text-gray-600">
                                        {selectedSection
                                            ? `${selectedSection.grade?.name} - ${selectedSection.name}`
                                            : "Select a section to view its schedule"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <select
                                    value={selectedSectionId || ''}
                                    onChange={handleSectionChange}
                                    className="block w-full md:w-64 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm font-semibold"
                                >
                                    <option value="">Select a Class...</option>
                                    {sections.map(section => (
                                        <option key={section.id} value={section.id}>
                                            {section.grade?.name} - {section.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {selectedSectionId ? (
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="overflow-x-auto p-6">
                                <table className="w-full border-collapse border-2 border-gray-600">
                                    <thead>
                                        <tr className="bg-gray-200">
                                            <th className="border-2 border-gray-600 px-6 py-4 text-center font-bold text-gray-700 text-lg">
                                                TIME
                                            </th>
                                            {days.map(day => (
                                                <th key={day} className="border-2 border-gray-600 px-6 py-4 text-center font-bold text-gray-700 text-lg">
                                                    {day}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(() => {
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

                                            allSlots.sort((a, b) => a.start.localeCompare(b.start));

                                            if (allSlots.length === 0) {
                                                return (
                                                    <tr>
                                                        <td colSpan="6" className="border-2 border-gray-600 px-4 py-8 text-center text-gray-500 italic">
                                                            No schedule entries found for this class.
                                                        </td>
                                                    </tr>
                                                );
                                            }

                                            return allSlots.map((slot, idx) => (
                                                <tr key={idx}>
                                                    <td className="border-2 border-gray-600 px-4 py-4 text-center font-semibold bg-gray-100 text-gray-700">
                                                        {slot.start} - {slot.end}
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
                                                            <td key={day} className="border-2 border-gray-600 px-4 py-4 text-center min-h-[60px]">
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
                    ) : (
                        <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
                            <h3 className="text-xl font-bold text-gray-400">Please Select a Section to View Schedule</h3>
                        </div>
                    )}

                    {/* Footer Info */}
                    <div className="mt-8 flex justify-between items-center">
                        <Link
                            href={route('teacher.dashboard')}
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
        </TeacherLayout>
    );
}
