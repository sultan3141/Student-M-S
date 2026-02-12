import React from 'react';
import DirectorLayout from '@/Layouts/DirectorLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ auth, student, registrations, payment_history, marks, semester_results }) {
    return (
        <DirectorLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Student Profile</h2>}
        >
            <Head title={`Student: ${student.user?.name}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header Card */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-xl mb-6 border border-gray-100">
                        <div className="p-8 bg-white flex flex-col md:flex-row justify-between items-center gap-6">
                            <div className="flex items-center">
                                <div className="h-24 w-24 rounded-2xl bg-blue-50 flex items-center justify-center text-3xl font-bold text-blue-600 border border-blue-100 shadow-sm">
                                    {student.user?.name?.charAt(0)}
                                </div>
                                <div className="ml-6">
                                    <h3 className="text-3xl font-extrabold text-navy-900" style={{ color: '#0F172A' }}>{student.user?.name}</h3>
                                    <p className="text-gray-500 font-mono text-sm mt-1">ID: {student.student_id}</p>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200 uppercase tracking-wider">Active</span>
                                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full border border-blue-200 uppercase tracking-wider">{student.grade?.name} - {student.section?.name}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <Link
                                    href={route('director.students.index')}
                                    className="bg-white text-gray-700 px-5 py-2.5 rounded-lg hover:bg-gray-50 border border-gray-300 transition-all font-medium text-sm shadow-sm"
                                >
                                    Back to Directory
                                </Link>
                                <a
                                    href={`${route('director.reports.export.student-card')}?student_id=${student.id}`}
                                    className="bg-slate-800 text-white px-5 py-2.5 rounded-lg hover:bg-slate-900 transition-all font-bold text-sm shadow-md"
                                    style={{ backgroundColor: '#1E293B' }}
                                >
                                    Download Card
                                </a>
                                <a
                                    href={`${route('director.reports.export.transcript')}?student_id=${student.id}`}
                                    className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-all font-bold text-sm shadow-md"
                                >
                                    Generate Transcript
                                </a>
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
                                {student.parents && student.parents.length > 0 ? (
                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-xs text-gray-500 uppercase">Name</label>
                                            <p className="text-gray-900 font-bold">{student.parents[0].user?.name}</p>
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500 uppercase">Phone</label>
                                            <p className="text-gray-900">{student.parents[0].phone || '-'}</p>
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500 uppercase">Email</label>
                                            <p className="text-gray-900">{student.parents[0].user?.email || '-'}</p>
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
