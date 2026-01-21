import React from 'react';
import DirectorLayout from '@/Layouts/DirectorLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ auth, student, academic_history, payment_history }) {
    return (
        <DirectorLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Student Profile</h2>}
        >
            <Head title={`Student: ${student.user?.name}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header Card */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6 bg-white border-b border-gray-200 flex justify-between items-center">
                            <div className="flex items-center">
                                <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-500">
                                    {student.user?.name?.charAt(0)}
                                </div>
                                <div className="ml-6">
                                    <h3 className="text-2xl font-bold text-gray-900">{student.user?.name}</h3>
                                    <p className="text-gray-600">ID: {student.student_id}</p>
                                    <div className="mt-2 flex gap-2">
                                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
                                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">{student.grade?.name} - {student.section?.name}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Link
                                    href={route('director.students.index')}
                                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200"
                                >
                                    Back to Directory
                                </Link>
                                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                                    Generate Transcript
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Personal Info */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                                <h4 className="font-bold text-gray-700">Personal Information</h4>
                            </div>
                            <div className="p-6">
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-xs text-gray-500 uppercase">Email</label>
                                        <p className="text-gray-900">{student.user?.email}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 uppercase">Date of Birth</label>
                                        <p className="text-gray-900">{student.dob || '-'}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 uppercase">Gender</label>
                                        <p className="text-gray-900">{student.gender || '-'}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 uppercase">Address</label>
                                        <p className="text-gray-900 text-sm">{student.address || '-'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Guardian Info */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                                <h4 className="font-bold text-gray-700">Guardian Information</h4>
                            </div>
                            <div className="p-6">
                                {student.parent ? (
                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-xs text-gray-500 uppercase">Name</label>
                                            <p className="text-gray-900">{student.parent.user?.name}</p>
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500 uppercase">Phone</label>
                                            <p className="text-gray-900">{student.parent.phone || '-'}</p>
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500 uppercase">Relationship</label>
                                            <p className="text-gray-900">{student.parent.relationship || 'Parent'}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-gray-500 italic">No parent info linked.</p>
                                )}
                            </div>
                        </div>

                        {/* Academic Stats */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                                <h4 className="font-bold text-gray-700">Academic Summary</h4>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-2 gap-4 text-center">
                                    <div className="p-3 bg-blue-50 rounded">
                                        <div className="text-2xl font-bold text-blue-700">92%</div>
                                        <div className="text-xs text-blue-600">Attendance</div>
                                    </div>
                                    <div className="p-3 bg-green-50 rounded">
                                        <div className="text-2xl font-bold text-green-700">B+</div>
                                        <div className="text-xs text-green-600">Avg Grade</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Academic History Table */}
                    <div className="mt-6 bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                            <h4 className="font-bold text-gray-700">Academic History</h4>
                        </div>
                        <div className="p-6">
                            {academic_history && academic_history.length > 0 ? (
                                <table className="min-w-full">
                                    {/* Table implementation */}
                                </table>
                            ) : (
                                <p className="text-gray-500 italic">No academic records found.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </DirectorLayout>
    );
}
