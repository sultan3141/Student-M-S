import ParentLayout from '@/Layouts/ParentLayout';
import { Head } from '@inertiajs/react';
import {
    ArrowUpIcon,
    ArrowDownIcon,
    MinusIcon,
    ArrowPathIcon
} from '@heroicons/react/20/solid';

export default function MarksTable({ student, marks = [], academicYears, filters }) {

    // Group marks by Semester -> Subject
    // Data structure transformation logic
    const groupedMarks = marks.reduce((acc, mark) => {
        const semester = mark.semester || 'Unknown';
        if (!acc[semester]) acc[semester] = [];
        acc[semester].push(mark);
        return acc;
    }, {});

    const getTrendIcon = (trend) => {
        if (trend === 'up') return <ArrowUpIcon className="h-4 w-4 text-growth-green inline" />;
        if (trend === 'down') return <ArrowDownIcon className="h-4 w-4 text-red-500 inline" />;
        return <MinusIcon className="h-4 w-4 text-gray-400 inline" />;
    };

    return (
        <ParentLayout>
            <Head title="Subject Marks" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Subject Marks</h1>
                    <p className="mt-1 text-sm text-gray-500">Detailed breakdown of {student.first_name}'s academic performance.</p>
                </div>

                {/* Filters (Simplified for MVP) */}
                <div className="bg-white p-4 rounded-lg shadow flex gap-4">
                    <div className="w-1/3">
                        <label className="block text-xs font-medium text-gray-700">Academic Year</label>
                        <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-trust-blue focus:border-trust-blue sm:text-sm rounded-md">
                            <option>2025-2026</option>
                        </select>
                    </div>
                </div>

                {/* Marks Tables per Semester */}
                {Object.keys(groupedMarks).sort().map((semester) => (
                    <div key={semester} className="bg-white shadow overflow-hidden sm:rounded-lg">
                        <div className="px-4 py-5 sm:px-6 flex justify-between items-center bg-gray-50">
                            <h3 className="text-lg leading-6 font-medium text-trust-blue">
                                Semester {semester}
                            </h3>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                Completed
                            </span>
                        </div>
                        <div className="border-t border-gray-200">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assessment</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comments</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {groupedMarks[semester].map((mark) => (
                                        <tr key={mark.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {mark.subject?.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {mark.assessment_type?.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">
                                                {mark.score} / 100
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {/* Logic for status should be prop based or computed */}
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${mark.score >= 80 ? 'bg-green-100 text-green-800' :
                                                        mark.score >= 60 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {mark.score >= 80 ? 'Excellent' : mark.score >= 60 ? 'Average' : 'Needs Work'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                                                {mark.comment || '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}
            </div>
        </ParentLayout>
    );
}
