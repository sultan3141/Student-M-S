import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function StudentProfile({ student }) {
    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <Head title={`${student.user?.name} - Profile`} />

            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-indigo-600 p-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-white">{student.user?.name}</h1>
                        <Link href={route('parent.dashboard')} className="text-indigo-200 hover:text-white">
                            &larr; Back to Dashboard
                        </Link>
                    </div>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-gray-500 text-sm uppercase tracking-wider font-semibold mb-2">Personal Info</h3>
                        <p><strong>Student ID:</strong> {student.student_id}</p>
                        <p><strong>DOB:</strong> {student.dob}</p>
                        <p><strong>Gender:</strong> {student.gender}</p>
                    </div>
                    <div>
                        <h3 className="text-gray-500 text-sm uppercase tracking-wider font-semibold mb-2">Academic Info</h3>
                        <p><strong>Grade:</strong> {student.grade?.name}</p>
                        <p><strong>Section:</strong> {student.section?.name}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
