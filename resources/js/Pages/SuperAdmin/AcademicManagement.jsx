import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

export default function AcademicManagement() {
    const [activeTab, setActiveTab] = useState('assignments');

    const teacherAssignments = [
        { teacher: 'Teacher Aisha', subject: 'Mathematics', grade: 'Grade 9', sections: '9-A, 9-S', students: 95 },
        { teacher: 'Teacher Aisha', subject: 'Science', grade: 'Grade 7', sections: '7-A, 7-C', students: 88 },
        { teacher: 'Teacher Ahmed', subject: 'English', grade: 'Grade 10', sections: '10-A, 10-B', students: 102 },
        { teacher: 'Teacher Fatima', subject: 'Biology', grade: 'Grade 11', sections: '11-A', students: 54 },
    ];

    return (
        <SuperAdminLayout>
            <Head title="Academic Management" />

            <h2 className="text-2xl font-bold text-gray-900 mb-6">Academic Management</h2>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
                <div className="flex border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('assignments')}
                        className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${activeTab === 'assignments'
                                ? 'border-indigo-600 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Teacher Assignments
                    </button>
                    <button
                        onClick={() => setActiveTab('enrollment')}
                        className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${activeTab === 'enrollment'
                                ? 'border-indigo-600 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Student Enrollment
                    </button>
                    <button
                        onClick={() => setActiveTab('grading')}
                        className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${activeTab === 'grading'
                                ? 'border-indigo-600 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Exams & Grading
                    </button>
                </div>

                {activeTab === 'assignments' && (
                    <div className="p-8">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Teacher-Subject Assignments</h3>
                                <p className="text-sm text-gray-500 mt-1">Manage teacher assignments and student distribution</p>
                            </div>
                            <button className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors">
                                Assign Teacher
                            </button>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                                <div className="text-3xl font-bold text-blue-900 mb-1">4</div>
                                <div className="text-sm font-medium text-blue-700">Total Teachers</div>
                            </div>
                            <div className="bg-green-50 p-6 rounded-xl border border-green-100">
                                <div className="text-3xl font-bold text-green-900 mb-1">4</div>
                                <div className="text-sm font-medium text-green-700">Assignments</div>
                            </div>
                            <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
                                <div className="text-3xl font-bold text-purple-900 mb-1">4</div>
                                <div className="text-sm font-medium text-purple-700">Subjects</div>
                            </div>
                            <div className="bg-amber-50 p-6 rounded-xl border border-amber-100">
                                <div className="text-3xl font-bold text-amber-900 mb-1">361</div>
                                <div className="text-sm font-medium text-amber-700">Total Students</div>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Teacher</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Subject</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Grade</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Sections</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Students</th>
                                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {teacherAssignments.map((assignment, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium text-gray-900">{assignment.teacher}</td>
                                            <td className="px-6 py-4">
                                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                                    {assignment.subject}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-700">{assignment.grade}</td>
                                            <td className="px-6 py-4 text-gray-700">{assignment.sections}</td>
                                            <td className="px-6 py-4 font-medium text-gray-900">{assignment.students}</td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="text-indigo-600 hover:text-indigo-800 font-medium text-sm">
                                                    Edit
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'enrollment' && (
                    <div className="p-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Student Enrollment Management</h3>
                        <p className="text-gray-500">Student enrollment functionality will be implemented here.</p>
                    </div>
                )}

                {activeTab === 'grading' && (
                    <div className="p-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Exams & Grading</h3>
                        <p className="text-gray-500">Exam and grading management will be implemented here.</p>
                    </div>
                )}
            </div>
        </SuperAdminLayout>
    );
}
