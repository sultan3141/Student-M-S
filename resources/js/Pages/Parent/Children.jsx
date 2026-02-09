import React from 'react';
import ParentLayout from '@/Layouts/ParentLayout';
import { Head, router } from '@inertiajs/react';
import StudentCard from '@/Components/StudentCard';

export default function Children({ students, selectedStudentId }) {
    const handleStudentSelect = (studentId) => {
        router.post(route('parent.children.select'), {
            student_id: studentId
        }, {
            preserveScroll: true,
            onSuccess: () => {
                // Optionally redirect to dashboard or just stay here with a success message
            }
        });
    };

    return (
        <ParentLayout>
            <Head title="My Children" />

            <div className="space-y-4">
                <div className="mb-4">
                    <h1 className="text-2xl font-bold text-navy-900" style={{ color: '#0F172A' }}>
                        👨‍👩‍👧‍👦 My Children
                    </h1>
                    <p className="mt-1 text-xs text-gray-600">
                        Select a child to view their specific academic and attendance records.
                    </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    {students && students.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {students.map((student) => (
                                <StudentCard
                                    key={student.id}
                                    student={student}
                                    isSelected={selectedStudentId == student.id}
                                    onClick={() => handleStudentSelect(student.id)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-3xl text-gray-400">👤</span>
                            </div>
                            <h3 className="text-sm font-bold text-gray-900">No children linked</h3>
                            <p className="mt-1 text-xs text-gray-500 max-w-xs mx-auto">
                                We couldn't find any children linked to your account. Please contact the school Registrar if this is an error.
                            </p>
                        </div>
                    )}
                </div>

                {selectedStudentId && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-blue-900">Child Selected</p>
                                <p className="text-xs text-blue-700">You can now view their records using the sidebar navigation.</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </ParentLayout>
    );
}
