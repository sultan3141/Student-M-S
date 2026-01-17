import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import { useState, useEffect } from 'react';

export default function AttendanceCreate({ auth, section, date, students }) {
    // Initialize status for all students. Use existing attendance or default to 'Present'.
    const initialAttendances = {};
    students.forEach(student => {
        // Find existing attendance for this date (if any passed, but we query it in controller)
        // Controller returns students with 'attendances' array filtered by date.
        // If array has item, use its status. Else 'Present'.
        const existing = student.attendances && student.attendances.length > 0 ? student.attendances[0].status : 'Present';
        initialAttendances[student.id] = existing;
    });

    const { data, setData, post, processing, errors } = useForm({
        section_id: section.id,
        date: date,
        attendances: initialAttendances,
    });

    const handleStatusChange = (studentId, status) => {
        setData('attendances', {
            ...data.attendances,
            [studentId]: status,
        });
    };

    const markAll = (status) => {
        const newStatuses = {};
        students.forEach(s => newStatuses[s.id] = status);
        setData('attendances', newStatuses);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('teacher.attendance.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Mark Attendance: {date} ({section.grade.name} - {section.name})</h2>}
        >
            <Head title="Mark Attendance" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">

                            {/* Bulk Actions */}
                            <div className="mb-4 flex space-x-2">
                                <button type="button" onClick={() => markAll('Present')} className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200">Mark All Present</button>
                                <button type="button" onClick={() => markAll('Absent')} className="text-xs px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200">Mark All Absent</button>
                            </div>

                            <form onSubmit={submit}>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">ID</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {students.map((student) => (
                                                <tr key={student.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {student.student_id}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {student.user.name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        <div className="flex space-x-4">
                                                            {['Present', 'Absent', 'Late', 'Excused'].map(status => (
                                                                <label key={status} className="inline-flex items-center cursor-pointer">
                                                                    <input
                                                                        type="radio"
                                                                        name={`status_${student.id}`}
                                                                        value={status}
                                                                        checked={data.attendances[student.id] === status}
                                                                        onChange={() => handleStatusChange(student.id, status)}
                                                                        className={`form-radio h-4 w-4 ${status === 'Present' ? 'text-green-600' :
                                                                                status === 'Absent' ? 'text-red-600' :
                                                                                    status === 'Late' ? 'text-yellow-600' : 'text-blue-600'
                                                                            }`}
                                                                    />
                                                                    <span className="ml-2 text-sm text-gray-700">{status}</span>
                                                                </label>
                                                            ))}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="mt-8 flex items-center justify-end">
                                    <Link
                                        href={route('teacher.attendance.index')}
                                        className="text-sm text-gray-600 underline hover:text-indigo-900 mr-4"
                                    >
                                        Cancel
                                    </Link>
                                    <PrimaryButton className="ml-4" disabled={processing}>
                                        Save Attendance
                                    </PrimaryButton>
                                </div>
                            </form>

                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
