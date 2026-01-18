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
            </div>
        </ParentLayout>
    );
}
