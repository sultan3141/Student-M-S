import React, { useState } from 'react';
import TeacherLayout from '@/Layouts/TeacherLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import {
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    ArrowLeftIcon,
    UserIcon
} from '@heroicons/react/24/outline'; // Using outline for consistent style
import { CheckIcon } from '@heroicons/react/24/solid'; // Using solid for checked state

export default function Create({ auth, section, subject, grade, students, date, formattedDate }) {
    const { data, setData, post, processing, errors } = useForm({
        section_id: section.id,
        subject_id: subject.id,
        date: date,
        students: students.map(s => ({
            id: s.id,
            status: s.status,
            remarks: s.remarks,
        }))
    });

    const updateStatus = (index, status) => {
        const newStudents = [...data.students];
        newStudents[index].status = status;
        setData('students', newStudents);
    };

    const updateRemarks = (index, remarks) => {
        const newStudents = [...data.students];
        newStudents[index].remarks = remarks;
        setData('students', newStudents);
    };

    const markAll = (status) => {
        const newStudents = data.students.map(s => ({ ...s, status }));
        setData('students', newStudents);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('teacher.attendance.store'));
    };

    const StatusButton = ({ currentStatus, targetStatus, icon: Icon, label, color, onClick }) => {
        const isActive = currentStatus === targetStatus;
        return (
            <button
                type="button"
                onClick={onClick}
                className={`flex items-center justify-center p-2 rounded-lg transition-all border ${isActive
                        ? `bg-${color}-50 border-${color}-500 text-${color}-700 ring-1 ring-${color}-500`
                        : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                    }`}
                title={label}
            >
                <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''}`} />
                <span className="ml-2 text-sm font-medium hidden sm:inline">{label}</span>
            </button>
        );
    };

    return (
        <TeacherLayout>
            <Head title={`Mark Attendance - ${subject.name}`} />

            <form onSubmit={submit} className="space-y-6 max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center space-x-4">
                        <Link
                            href={route('teacher.attendance.index')}
                            className="p-2 rounded-full bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
                        >
                            <ArrowLeftIcon className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Mark Attendance</h1>
                            <p className="text-sm text-gray-500">
                                {formattedDate} • {grade.name} - {section.name} • {subject.name}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-gray-500">Mark All:</span>
                        <button
                            type="button"
                            onClick={() => markAll('Present')}
                            className="px-3 py-1.5 rounded-md bg-green-50 text-green-700 text-sm font-medium hover:bg-green-100 transition-colors"
                        >
                            Present
                        </button>
                        <button
                            type="button"
                            onClick={() => markAll('Absent')}
                            className="px-3 py-1.5 rounded-md bg-red-50 text-red-700 text-sm font-medium hover:bg-red-100 transition-colors"
                        >
                            Absent
                        </button>
                    </div>
                </div>
                
                {/* Info Banner */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start">
                    <CheckIcon className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800">
                        <p className="font-medium">Important: Once saved, this attendance record will be locked and cannot be edited.</p>
                        <p className="mt-1 text-blue-700">Please review all entries carefully before submitting.</p>
                    </div>
                </div>

                {/* List */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        <div className="col-span-4 sm:col-span-3">Student</div>
                        <div className="col-span-8 sm:col-span-5 text-center">Status</div>
                        <div className="col-span-12 sm:col-span-4">Remarks</div>
                    </div>

                    <div className="divide-y divide-gray-100">
                        {students.map((student, index) => (
                            <div key={student.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-gray-50/50 transition-colors">
                                {/* Student Info */}
                                <div className="col-span-4 sm:col-span-3">
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-xs ring-2 ring-white shadow-sm">
                                            {student.name.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-gray-900">{student.name}</p>
                                            <p className="text-xs text-gray-500">ID: {student.student_id}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Status Buttons */}
                                <div className="col-span-8 sm:col-span-5 flex justify-center space-x-2">
                                    <StatusButton
                                        currentStatus={data.students[index].status}
                                        targetStatus="Present"
                                        icon={CheckCircleIcon}
                                        label="Present"
                                        color="green"
                                        onClick={() => updateStatus(index, 'Present')}
                                    />
                                    <StatusButton
                                        currentStatus={data.students[index].status}
                                        targetStatus="Absent"
                                        icon={XCircleIcon}
                                        label="Absent"
                                        color="red"
                                        onClick={() => updateStatus(index, 'Absent')}
                                    />
                                    <StatusButton
                                        currentStatus={data.students[index].status}
                                        targetStatus="Late"
                                        icon={ClockIcon}
                                        label="Late"
                                        color="yellow"
                                        onClick={() => updateStatus(index, 'Late')}
                                    />
                                </div>

                                {/* Remarks */}
                                <div className="col-span-12 sm:col-span-4 mt-2 sm:mt-0">
                                    <input
                                        type="text"
                                        value={data.students[index].remarks || ''}
                                        onChange={(e) => updateRemarks(index, e.target.value)}
                                        placeholder="Add note..."
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-gray-50 focus:bg-white text-gray-700"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer / Actions */}
                <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
                    <Link
                        href={route('teacher.attendance.index')}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {processing ? 'Saving...' : 'Save & Lock Attendance'}
                    </button>
                </div>
            </form>
        </TeacherLayout>
    );
}
