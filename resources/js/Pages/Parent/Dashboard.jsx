import { useState } from 'react';
import ParentLayout from '@/Layouts/ParentLayout';
import { Head } from '@inertiajs/react';
import StudentCard from '@/Components/StudentCard';

export default function Dashboard({ students }) {
    const [selectedStudent, setSelectedStudent] = useState(students?.[0] || null);

    // Mock payment data - will come from backend
    const paymentInfo = {
        status: 'Partial',
        outstandingBalance: 5000,
    };

    return (
        <ParentLayout>
            <Head title="Parent Dashboard" />

            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Parent Dashboard</h1>
                    <p className="mt-1 text-sm text-gray-500">Welcome, {selectedStudent?.parent?.user?.name || 'Hassan Ahmed'}</p>
                </div>

                {/* My Children Section */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">My Children</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {students && students.map((student) => (
                            <StudentCard
                                key={student.id}
                                student={student}
                                isSelected={selectedStudent?.id === student.id}
                                onClick={() => setSelectedStudent(student)}
                            />
                        ))}
                    </div>
                </div>

                {/* Student Information and Payment Information Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Student Information */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Information</h3>

                        {selectedStudent ? (
                            <div className="space-y-3">
                                <div className="flex justify-between border-b border-gray-200 pb-2">
                                    <span className="text-sm font-medium text-gray-500">Student ID:</span>
                                    <span className="text-sm text-gray-900 font-semibold">{selectedStudent.student_id}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-200 pb-2">
                                    <span className="text-sm font-medium text-gray-500">Full Name:</span>
                                    <span className="text-sm text-gray-900">{selectedStudent.first_name} {selectedStudent.last_name}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-200 pb-2">
                                    <span className="text-sm font-medium text-gray-500">Grade:</span>
                                    <span className="text-sm text-gray-900">{selectedStudent.grade?.name || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-200 pb-2">
                                    <span className="text-sm font-medium text-gray-500">Section:</span>
                                    <span className="text-sm text-gray-900">{selectedStudent.section?.name || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium text-gray-500">Application Status:</span>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                        Incomplete
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">No student selected</p>
                        )}
                    </div>

                    {/* Payment Information */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h3>

                        <div className="space-y-3">
                            <div className="flex justify-between border-b border-gray-200 pb-2">
                                <span className="text-sm font-medium text-gray-500">Payment Status:</span>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                    {paymentInfo.status}
                                </span>
                            </div>
                            <div className="flex justify-between border-b border-gray-200 pb-2">
                                <span className="text-sm font-medium text-gray-500">Outstanding Balance:</span>
                                <span className="text-sm font-semibold text-red-600">{paymentInfo.outstandingBalance.toLocaleString()} Birr</span>
                            </div>
                        </div>

                        <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-md p-3">
                            <p className="text-sm text-yellow-800">
                                Please visit the school registrar to make a payment.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Reports Card */}
                {selectedStudent && (
                    <div className="bg-white shadow rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Reports</h3>

                        {selectedStudent.reports && selectedStudent.reports.length > 0 ? (
                            <div className="space-y-3">
                                {selectedStudent.reports.map((report) => {
                                    // Determine badge color based on severity and type
                                    const getBadgeColor = (severity, type) => {
                                        if (severity === 'high') return 'bg-red-100 text-red-800';
                                        if (severity === 'medium') return 'bg-yellow-100 text-yellow-800';
                                        if (type === 'general') return 'bg-green-100 text-green-800';
                                        return 'bg-blue-100 text-blue-800';
                                    };

                                    const formatDate = (dateString) => {
                                        const date = new Date(dateString);
                                        return date.toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        });
                                    };

                                    return (
                                        <div key={report.id} className="border-l-4 border-indigo-500 bg-gray-50 p-3 rounded-r">
                                            <div className="flex items-start justify-between mb-2">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeColor(report.severity, report.report_type)}`}>
                                                    {report.report_type.charAt(0).toUpperCase() + report.report_type.slice(1)}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {formatDate(report.reported_at)}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-800 mb-1">
                                                {report.message}
                                            </p>
                                            {report.reported_by && (
                                                <p className="text-xs text-gray-500">
                                                    — {report.reported_by}
                                                </p>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <p className="mt-2 text-sm text-gray-500">No reports available</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </ParentLayout>
    );
}
