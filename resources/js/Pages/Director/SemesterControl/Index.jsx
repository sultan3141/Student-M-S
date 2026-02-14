import DirectorLayout from '@/Layouts/DirectorLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { LockClosedIcon, LockOpenIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

export default function Index({ academicYear, matrix, error }) {
    const { post, processing } = useForm({});

    // Local state to handle optimistic UI or just messaging
    const [updating, setUpdating] = useState(null); // { gradeId, semester }

    if (error) {
        return (
            <DirectorLayout>
                <div className="p-8 text-center text-red-600 font-semibold bg-red-50 rounded-lg">
                    {error}
                </div>
            </DirectorLayout>
        );
    }

    const toggleStatus = (gradeId, semester, currentStatus) => {
        const newStatus = currentStatus === 'open' ? 'closed' : 'open';

        setUpdating(`${gradeId}-${semester}`);

        post(route('director.semesters.update'), {
            data: {
                grade_id: gradeId,
                semester: semester,
                status: newStatus
            },
            preserveScroll: true,
            onFinish: () => setUpdating(null),
        });
    };

    return (
        <DirectorLayout>
            <Head title="Semester Control" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Semester Status Control</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Academic Year: <span className="font-semibold text-blue-600">{academicYear.name}</span>
                    </p>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* OPEN Status Info */}
                        <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-400 rounded-xl shadow-md">
                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <LockOpenIcon className="h-6 w-6 text-green-600" />
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-bold text-green-900">OPEN ACCESS</h3>
                                    <p className="mt-1 text-xs text-green-700">
                                        Teachers can create and edit assessments. Students cannot view results yet.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* CLOSED Status Info */}
                        <div className="p-4 bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-400 rounded-xl shadow-md">
                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <LockClosedIcon className="h-6 w-6 text-red-600" />
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-bold text-red-900">CLOSED</h3>
                                    <p className="mt-1 text-xs text-red-700">
                                        All assessments locked. Teachers can only view. Students can view their results.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Control Table */}
                <div className="bg-white shadow-xl ring-1 ring-gray-900/5 rounded-xl overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="py-4 pl-6 pr-3 text-left text-sm font-bold text-gray-900">
                                    Grade
                                </th>
                                <th scope="col" className="px-3 py-4 text-center text-sm font-bold text-gray-900">
                                    Semester 1
                                </th>
                                <th scope="col" className="px-3 py-4 text-center text-sm font-bold text-gray-900">
                                    Semester 2
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {matrix.map((row) => (
                                <tr key={row.grade.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="whitespace-nowrap py-5 pl-6 pr-3 text-sm font-semibold text-gray-900">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                                                <span className="text-white font-bold">{row.grade.level}</span>
                                            </div>
                                            <div className="ml-4">
                                                <div className="font-medium text-gray-900">{row.grade.name}</div>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Semester 1 */}
                                    <td className="px-3 py-5">
                                        <SemesterCell
                                            status={row.semester_1.status}
                                            stats={row.semester_1.stats}
                                            isUpdating={updating === `${row.grade.id}-1`}
                                            onToggle={() => toggleStatus(row.grade.id, 1, row.semester_1.status)}
                                        />
                                    </td>

                                    {/* Semester 2 */}
                                    <td className="px-3 py-5">
                                        <SemesterCell
                                            status={row.semester_2.status}
                                            stats={row.semester_2.stats}
                                            isUpdating={updating === `${row.grade.id}-2`}
                                            onToggle={() => toggleStatus(row.grade.id, 2, row.semester_2.status)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </DirectorLayout>
    );
}

function SemesterCell({ status, stats, isUpdating, onToggle }) {
    const isOpen = status === 'open';

    return (
        <div className="flex flex-col items-center space-y-3">
            {/* Status Badge with Enhanced Visual Differentiation */}
            <div className={`
                w-full max-w-xs rounded-xl p-4 transition-all duration-300 shadow-lg
                ${isOpen 
                    ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-400 ring-2 ring-green-200' 
                    : 'bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-400 ring-2 ring-red-200'
                }
            `}>
                {/* Status Toggle Button */}
                <div className="flex items-center justify-center mb-3">
                    <button
                        onClick={onToggle}
                        disabled={isUpdating}
                        className={`
                            group relative inline-flex items-center px-6 py-3 rounded-xl font-bold text-sm transition-all duration-200 shadow-md
                            ${isOpen
                                ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white'
                                : 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white'
                            }
                            ${isUpdating ? 'opacity-50 cursor-wait' : 'cursor-pointer hover:shadow-xl hover:scale-105 transform'}
                        `}
                    >
                        {isOpen ? (
                            <>
                                <LockOpenIcon className="w-5 h-5 mr-2 animate-pulse" />
                                <span className="tracking-wide">OPEN ACCESS</span>
                            </>
                        ) : (
                            <>
                                <LockClosedIcon className="w-5 h-5 mr-2" />
                                <span className="tracking-wide">CLOSED</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Status Description */}
                <div className={`
                    text-center text-xs font-semibold mb-3 px-2 py-1 rounded-lg
                    ${isOpen 
                        ? 'text-green-800 bg-green-100' 
                        : 'text-red-800 bg-red-100'
                    }
                `}>
                    {isOpen ? (
                        <span>✓ Teachers can create & edit assessments</span>
                    ) : (
                        <span>🔒 All assessments locked - View only</span>
                    )}
                </div>

                {/* Statistics */}
                {stats && (
                    <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex items-center space-x-1">
                                <span className="text-gray-500">Students:</span>
                                <span className="font-semibold text-gray-900">{stats.students}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <span className="text-gray-500">Assessments:</span>
                                <span className="font-semibold text-gray-900">{stats.assessments}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <span className="text-gray-500">Marks:</span>
                                <span className="font-semibold text-gray-900">{stats.marks_entered}/{stats.total_possible}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <span className="text-gray-500">Complete:</span>
                                <span className={`font-bold ${stats.completion_rate >= 80 ? 'text-green-600' : stats.completion_rate >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                                    {stats.completion_rate}%
                                </span>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-2">
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                    className={`h-2.5 rounded-full transition-all duration-500 ${
                                        stats.completion_rate >= 80 ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
                                        stats.completion_rate >= 50 ? 'bg-gradient-to-r from-yellow-500 to-amber-600' :
                                        'bg-gradient-to-r from-red-500 to-rose-600'
                                    }`}
                                    style={{ width: `${stats.completion_rate}%` }}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
