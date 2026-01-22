import React from 'react';
import RegistrarLayout from '@/Layouts/RegistrarLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ students, stats }) {

    // Helper for progress bar color
    const getProgressColor = (percent) => {
        if (percent >= 100) return 'bg-[#059669]'; // Success
        if (percent >= 50) return 'bg-[#D97706]';   // Warning
        return 'bg-[#DC2626]';                       // Error
    };

    return (
        <RegistrarLayout user={null}>
            <Head title="Application Completion Monitor" />

            <div className="space-y-6">
                {/* Header & Stats */}
                <div className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] overflow-hidden">
                    <div className="bg-[#228B22] px-6 py-4 border-b border-[#D4AF37]">
                        <h2 className="text-xl font-bold text-white flex items-center">
                            <span className="mr-2">📄</span> APPLICATION COMPLETION MONITOR
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
                        <div className="p-4 text-center">
                            <span className="text-gray-500 text-xs font-bold uppercase">Average Completion</span>
                            <div className="text-2xl font-bold text-[#1E40AF]">{stats.avg_completion}%</div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2 max-w-[100px] mx-auto">
                                <div className="bg-[#1E40AF] h-1.5 rounded-full" style={{ width: `${stats.avg_completion}%` }}></div>
                            </div>
                        </div>
                        <div className="p-4 text-center">
                            <span className="text-gray-500 text-xs font-bold uppercase">Missing Docs</span>
                            <div className="text-2xl font-bold text-[#D97706]">{stats.missing_docs} Students</div>
                        </div>
                        <div className="p-4 text-center">
                            <span className="text-gray-500 text-xs font-bold uppercase">Total Monitored</span>
                            <div className="text-2xl font-bold text-[#228B22]">{stats.total}</div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Filter Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] p-4">
                            <h3 className="font-bold text-[#1F2937] mb-4">🔍 Filter Students</h3>
                            <div className="space-y-2">
                                <button className="w-full text-left px-3 py-2 rounded bg-blue-50 text-blue-800 font-bold text-sm border border-blue-100">
                                    All Students
                                </button>
                                <button className="w-full text-left px-3 py-2 rounded hover:bg-gray-50 text-gray-600 text-sm">
                                    Incomplete Profiles (&lt; 100%)
                                </button>
                                <button className="w-full text-left px-3 py-2 rounded hover:bg-gray-50 text-gray-600 text-sm">
                                    Missing Documents
                                </button>
                                <button className="w-full text-left px-3 py-2 rounded hover:bg-gray-50 text-gray-600 text-sm">
                                    No Guardian Linked
                                </button>
                            </div>

                            <hr className="my-4" />

                            <div className="bg-yellow-50 p-4 rounded border border-yellow-100">
                                <h4 className="font-bold text-yellow-800 text-xs uppercase mb-2">Automated Actions</h4>
                                <button className="w-full bg-[#D4AF37] hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded text-xs shadow mb-2">
                                    ✉️ Email Reminders (Bulk)
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Student List */}
                    <div className="lg:col-span-2 space-y-4">
                        {students.data.map((student) => (
                            <div key={student.id} className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] p-4 hover:border-[#228B22] transition-colors relative">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-bold text-[#1F2937]">{student.name}</h3>
                                        <p className="text-xs text-gray-500">ID: {student.student_id} | Class: {student.grade || 'N/A'}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className={`px-2 py-1 rounded text-xs font-bold text-white ${getProgressColor(student.completion)}`}>
                                            {student.completion}% Complete
                                        </span>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                                    <div
                                        className={`h-2.5 rounded-full ${getProgressColor(student.completion)}`}
                                        style={{ width: `${student.completion}%` }}
                                    ></div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                                    <div className={`p-1 rounded text-center border ${student.completion > 25 ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                                        Personal Info
                                    </div>
                                    <div className={`p-1 rounded text-center border ${student.completion > 50 ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                                        Guardian
                                    </div>
                                    <div className={`p-1 rounded text-center border ${student.completion > 75 ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                                        Contact
                                    </div>
                                    <div className={`p-1 rounded text-center border ${student.completion === 100 ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-100 border-gray-200 text-gray-500'}`}>
                                        Documents
                                    </div>
                                </div>

                                <div className="mt-3 flex justify-end space-x-2">
                                    <button className="text-xs text-[#1E40AF] hover:underline font-bold">View Profile</button>
                                    <button className="text-xs text-[#D97706] hover:underline font-bold">Send Reminder</button>
                                </div>
                            </div>
                        ))}

                        {/* Pagination Links */}
                        <div className="flex justify-center mt-4">
                            {students.links.map((link, i) => (
                                <Link
                                    key={i}
                                    href={link.url || '#'}
                                    className={`px-3 py-1 mx-1 rounded border text-sm ${link.active ? 'bg-[#228B22] text-white border-[#228B22]' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </RegistrarLayout>
    );
}
