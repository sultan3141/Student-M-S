import React from 'react';
import DirectorLayout from '@/Layouts/DirectorLayout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeftIcon, PhoneIcon, EnvelopeIcon, MapPinIcon, UserGroupIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

export default function Show({ parent, studentStats, recentMarks }) {
    return (
        <DirectorLayout>
            <Head title={`${parent.user?.name} - Parent Details`} />

            <div className="max-w-6xl mx-auto">
                {/* Back Button */}
                <Link
                    href={route('director.parents.index')}
                    className="text-sm text-gray-500 hover:text-blue-600 flex items-center mb-6 transition-colors"
                >
                    <ArrowLeftIcon className="h-4 w-4 mr-1" />
                    Back to Parents
                </Link>

                {/* Header Card */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 mb-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                {parent.user?.name}
                            </h1>
                            <p className="text-gray-600">Parent/Guardian Profile</p>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-bold text-blue-600 mb-1">
                                {studentStats.total}
                            </div>
                            <p className="text-sm text-gray-600">Student(s) Linked</p>
                        </div>
                    </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    {/* Phone */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center mb-3">
                            <PhoneIcon className="h-5 w-5 text-blue-600 mr-2" />
                            <h3 className="font-semibold text-gray-900">Phone</h3>
                        </div>
                        <p className="text-gray-600">
                            {parent.phone || 'Not provided'}
                        </p>
                    </div>

                    {/* Email */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center mb-3">
                            <EnvelopeIcon className="h-5 w-5 text-emerald-600 mr-2" />
                            <h3 className="font-semibold text-gray-900">Email</h3>
                        </div>
                        <p className="text-gray-600 break-all">
                            {parent.user?.email || 'Not provided'}
                        </p>
                    </div>

                    {/* Address */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center mb-3">
                            <MapPinIcon className="h-5 w-5 text-amber-600 mr-2" />
                            <h3 className="font-semibold text-gray-900">Address</h3>
                        </div>
                        <p className="text-gray-600">
                            {parent.address || 'Not provided'}
                        </p>
                    </div>
                </div>

                {/* Linked Students */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
                    <div className="flex items-center mb-6">
                        <UserGroupIcon className="h-6 w-6 text-blue-600 mr-2" />
                        <h2 className="text-xl font-bold text-gray-900">
                            Linked Students ({studentStats.total})
                        </h2>
                    </div>

                    {parent.students && parent.students.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-y border-gray-100">
                                    <tr>
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Student Name</th>
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Student ID</th>
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Grade</th>
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Section</th>
                                        <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {parent.students.map((student) => (
                                        <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="py-4 px-4 font-medium text-gray-900">
                                                {student.user?.name}
                                            </td>
                                            <td className="py-4 px-4 text-sm text-gray-600 font-mono">
                                                {student.student_id}
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    {student.grade?.name}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 text-sm text-gray-600">
                                                {student.section?.name}
                                            </td>
                                            <td className="py-4 px-4 text-right">
                                                <Link
                                                    href={route('director.students.show', student.id)}
                                                    className="text-blue-600 hover:text-blue-900 font-medium text-sm"
                                                >
                                                    View
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-8">No students linked to this parent</p>
                    )}
                </div>

                {/* Recent Marks */}
                {Object.keys(recentMarks).length > 0 && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center mb-6">
                            <AcademicCapIcon className="h-6 w-6 text-emerald-600 mr-2" />
                            <h2 className="text-xl font-bold text-gray-900">
                                Recent Academic Performance
                            </h2>
                        </div>

                        <div className="space-y-6">
                            {parent.students.map((student) => (
                                recentMarks[student.id] && recentMarks[student.id].length > 0 && (
                                    <div key={student.id} className="border-b border-gray-100 pb-6 last:border-b-0">
                                        <h3 className="font-semibold text-gray-900 mb-3">
                                            {student.user?.name}
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                            {recentMarks[student.id].map((mark) => (
                                                <div key={mark.id} className="bg-gray-50 p-3 rounded-lg">
                                                    <p className="text-xs text-gray-600 mb-1">
                                                        {mark.assessment?.subject?.name}
                                                    </p>
                                                    <p className="text-lg font-bold text-gray-900">
                                                        {mark.score}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </DirectorLayout>
    );
}
