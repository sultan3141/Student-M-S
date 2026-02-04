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
                    <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3 flex-1">
                                <p className="text-sm text-blue-700">
                                    <span className="font-semibold">OPEN:</span> Teachers can enter and edit marks. Students cannot view results.
                                    <br />
                                    <span className="font-semibold">CLOSED:</span> Marks are locked. Teachers can only view. Students can view their results.
                                </p>
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
            {/* Status Toggle */}
            <div className="flex items-center space-x-3">
                <button
                    onClick={onToggle}
                    disabled={isUpdating}
                    className={`
                        group relative inline-flex items-center px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 shadow-sm
                        ${isOpen
                            ? 'bg-green-500 hover:bg-green-600 text-white'
                            : 'bg-red-500 hover:bg-red-600 text-white'
                        }
                        ${isUpdating ? 'opacity-50 cursor-wait' : 'cursor-pointer hover:shadow-md'}
                    `}
                >
                    {isOpen ? (
                        <>
                            <LockOpenIcon className="w-4 h-4 mr-2" />
                            OPEN
                        </>
                    ) : (
                        <>
                            <LockClosedIcon className="w-4 h-4 mr-2" />
                            CLOSED
                        </>
                    )}
                </button>
            </div>

            {/* Statistics */}
            {stats && (
                <div className="w-full max-w-xs">
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
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
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className={`h-2 rounded-full transition-all ${stats.completion_rate >= 80 ? 'bg-green-500' :
                                        stats.completion_rate >= 50 ? 'bg-yellow-500' :
                                            'bg-red-500'
                                        }`}
                                    style={{ width: `${stats.completion_rate}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
