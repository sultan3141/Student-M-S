import React, { useState } from 'react';
import TeacherLayout from '@/Layouts/TeacherLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import {
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    ArrowLeftIcon,
    UserIcon,
    InformationCircleIcon,
    CheckIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';

export default function Create({ auth, section, students, date, formattedDate }) {
    const { data, setData, post, processing, errors } = useForm({
        section_id: section.id,
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

    const StatusToggle = ({ currentStatus, targetStatus, label, color, onClick }) => {
        const isActive = currentStatus === targetStatus;

        const colors = {
            green: isActive ? 'bg-green-600 text-white shadow-lg shadow-green-100' : 'bg-gray-50 text-gray-400 hover:bg-green-50 hover:text-green-600',
            red: isActive ? 'bg-red-600 text-white shadow-lg shadow-red-100' : 'bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-600',
            amber: isActive ? 'bg-amber-500 text-white shadow-lg shadow-amber-100' : 'bg-gray-50 text-gray-400 hover:bg-amber-50 hover:text-amber-600'
        };

        return (
            <button
                type="button"
                onClick={onClick}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2 ${colors[color]}`}
            >
                {isActive && <CheckIcon className="w-3 h-3 stroke-[4]" />}
                {label}
            </button>
        );
    };

    return (
        <TeacherLayout>
            <Head title={`Mark Attendance - ${section.name}`} />

            <div className="max-w-5xl mx-auto pb-12">
                {/* Back Button & Header */}
                <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="flex items-start gap-5">
                        <Link
                            href={route('teacher.attendance.index')}
                            className="mt-1 p-3 rounded-2xl bg-white border-2 border-gray-100 text-gray-400 hover:text-blue-600 hover:border-blue-100 hover:bg-blue-50/50 transition-all group lg:shadow-sm"
                        >
                            <ArrowLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-black text-blue-600 uppercase tracking-widest">{section.grade.name}</span>
                                <span className="text-gray-300 italic">&bull;</span>
                                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Section {section.name}</span>
                            </div>
                            <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-none">
                                MARK <span className="text-blue-600">ATTENDANCE</span>
                            </h1>
                            <p className="mt-2 text-sm font-bold text-gray-400 flex items-center gap-2">
                                <CalendarIcon className="w-4 h-4 text-blue-500" />
                                {formattedDate}
                            </p>
                        </div>
                    </div>

                    {/* Batch Actions Container */}
                    <div className="bg-white p-2 rounded-2xl border-2 border-gray-100 shadow-sm flex items-center gap-2">
                        <span className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Batch Actions</span>
                        <div className="w-px h-6 bg-gray-100"></div>
                        <button
                            type="button"
                            onClick={() => markAll('Present')}
                            className="px-4 py-2 rounded-xl bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-widest hover:bg-green-600 hover:text-white transition-all"
                        >
                            All Present
                        </button>
                        <button
                            type="button"
                            onClick={() => markAll('Absent')}
                            className="px-4 py-2 rounded-xl bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all"
                        >
                            All Absent
                        </button>
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    {/* Student Records Layer */}
                    <div className="space-y-4">
                        {students.map((student, index) => (
                            <div
                                key={student.id}
                                className="group bg-white rounded-[24px] border-2 border-gray-50 p-6 transition-all hover:border-blue-100 hover:shadow-xl hover:shadow-blue-50/50"
                            >
                                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                                    {/* Student Identity */}
                                    <div className="flex items-center gap-4 min-w-[240px]">
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center text-gray-400 group-hover:from-blue-50 group-hover:to-blue-100 group-hover:text-blue-600 transition-all duration-500 font-black text-xl border-2 border-white shadow-sm overflow-hidden">
                                            {student.profile_photo_url ? (
                                                <img src={student.profile_photo_url} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                student.name.substring(0, 2).toUpperCase()
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-black text-gray-900 leading-tight mb-0.5">{student.name}</h3>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">ID: {student.student_id}</p>
                                        </div>
                                    </div>

                                    {/* Status Toggles */}
                                    <div className="flex flex-wrap items-center gap-2 lg:mx-auto">
                                        <StatusToggle
                                            currentStatus={data.students[index].status}
                                            targetStatus="Present"
                                            label="Present"
                                            color="green"
                                            onClick={() => updateStatus(index, 'Present')}
                                        />
                                        <StatusToggle
                                            currentStatus={data.students[index].status}
                                            targetStatus="Absent"
                                            label="Absent"
                                            color="red"
                                            onClick={() => updateStatus(index, 'Absent')}
                                        />
                                        <StatusToggle
                                            currentStatus={data.students[index].status}
                                            targetStatus="Late"
                                            label="Late"
                                            color="amber"
                                            onClick={() => updateStatus(index, 'Late')}
                                        />
                                    </div>

                                    {/* Remarks Field */}
                                    <div className="lg:w-64">
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={data.students[index].remarks || ''}
                                                onChange={(e) => updateRemarks(index, e.target.value)}
                                                placeholder="Add a remark..."
                                                className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-sm font-bold text-gray-700 placeholder:text-gray-300 focus:ring-2 focus:ring-blue-100 transition-all"
                                            />
                                            {data.students[index].remarks && (
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Submission Board */}
                    <div className="sticky bottom-8 bg-white/80 backdrop-blur-xl rounded-[32px] border-2 border-gray-100 p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl shadow-blue-900/10 transition-all">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
                                <InformationCircleIcon className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-sm font-black text-gray-900 leading-none mb-1 uppercase tracking-tight">Ready to sync?</h4>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                    {data.students.filter(s => s.status === 'Present').length} Present &bull; {data.students.filter(s => s.status === 'Absent').length} Absent
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <Link
                                href={route('teacher.attendance.index')}
                                className="flex-1 sm:flex-none px-8 py-4 rounded-2xl text-sm font-black text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all text-center uppercase tracking-widest"
                            >
                                Discard
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex-1 sm:flex-none px-10 py-4 bg-blue-600 text-white rounded-2xl text-sm font-black shadow-xl shadow-blue-200 hover:bg-blue-700 disabled:opacity-50 transition-all uppercase tracking-widest"
                            >
                                {processing ? 'Syncing...' : 'Sync Records'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </TeacherLayout>
    );
}
