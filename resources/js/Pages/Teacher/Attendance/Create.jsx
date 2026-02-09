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
    XMarkIcon,
    CalendarIcon
} from '@heroicons/react/24/outline';

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

    const StatusToggle = ({ currentStatus, targetStatus, label, color, onClick }) => {
        const isActive = currentStatus === targetStatus;

        const colors = {
            green: isActive ? 'bg-green-600 text-white' : 'bg-gray-50 text-gray-400 hover:bg-green-50 hover:text-green-600',
            red: isActive ? 'bg-red-600 text-white' : 'bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-600',
            amber: isActive ? 'bg-amber-500 text-white' : 'bg-gray-50 text-gray-400 hover:bg-amber-50 hover:text-amber-600'
        };

        return (
            <button
                type="button"
                onClick={onClick}
                className={`px-5 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 border border-transparent ${colors[color]} ${isActive ? 'scale-100' : 'opacity-70 hover:opacity-100'}`}
            >
                {isActive && <CheckIcon className="w-3 h-3 stroke-[3]" />}
                {label}
            </button>
        );
    };

    return (
        <TeacherLayout>
            <Head title={`Mark Attendance - ${subject.name}`} />

            <div className="max-w-5xl mx-auto pb-12">
                <div className="mb-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                    <div className="flex items-start gap-4">
                        <Link
                            href={route('teacher.attendance.index')}
                            className="p-3.5 rounded-xl bg-white border border-gray-100 text-gray-400 hover:text-blue-600 hover:border-blue-100 transition-all group shrink-0"
                        >
                            <ArrowLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2 mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                <span className="text-blue-600">{grade.name}</span>
                                <span className="text-gray-300">/</span>
                                <span className="text-gray-900 border-b border-gray-50">Section {section.name}</span>
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 tracking-tight uppercase">
                                Record <span className="text-blue-600">Attendance</span>
                            </h1>
                            <div className="mt-3 flex items-center gap-3">
                                <span className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-bold text-gray-400 tracking-widest flex items-center gap-2">
                                    <CalendarIcon className="w-4 h-4 text-blue-500" />
                                    {formattedDate}
                                </span>
                                <span className="px-4 py-2 bg-blue-50 border border-blue-50 rounded-xl text-[10px] font-bold text-blue-600 tracking-widest uppercase italic">
                                    {subject.name}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Flat Quick Actions */}
                    <div className="bg-white p-2 rounded-2xl border border-gray-100 flex items-center gap-2">
                        <span className="px-4 text-[9px] font-bold text-gray-300 uppercase tracking-widest border-r border-gray-50 mr-1">Batch Ops</span>
                        <button
                            type="button"
                            onClick={() => markAll('Present')}
                            className="px-5 py-2.5 rounded-xl bg-green-50 text-green-600 text-[10px] font-bold uppercase tracking-widest hover:bg-green-600 hover:text-white transition-all"
                        >
                            Mark All Present
                        </button>
                        <button
                            type="button"
                            onClick={() => markAll('Absent')}
                            className="px-5 py-2.5 rounded-xl bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all"
                        >
                            Mark All Absent
                        </button>
                    </div>
                </div>

                {/* Professional Advisory */}
                <div className="bg-gray-50 border border-gray-100 rounded-3xl p-6 flex items-start gap-5 mb-10">
                    <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-sm shrink-0">
                        <InformationCircleIcon className="w-5 h-5" />
                    </div>
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-relaxed">
                        <span className="text-gray-900">Attendance advisory:</span> once synchronized, these records are finalized for reporting and notifications. Please ensure high accuracy before proceeding with the sync.
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <div className="space-y-3">
                        {students.map((student, index) => (
                            <div
                                key={student.id}
                                className="group bg-white rounded-2xl border border-gray-100 p-6 transition-all hover:border-blue-200 relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-1 h-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                                    {/* Student Identity */}
                                    <div className="flex items-center gap-5 min-w-[260px]">
                                        <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-blue-50 group-hover:text-blue-500 transition-all font-bold text-lg border border-gray-50 shadow-sm overflow-hidden">
                                            {student.profile_photo_url ? (
                                                <img src={student.profile_photo_url} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                student.name.substring(0, 2).toUpperCase()
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 leading-tight uppercase tracking-tight">{student.name}</h3>
                                            <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">STU ID: {student.student_id}</p>
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
                                        <input
                                            type="text"
                                            value={data.students[index].remarks || ''}
                                            onChange={(e) => updateRemarks(index, e.target.value)}
                                            placeholder="Session remark..."
                                            className="w-full bg-gray-50/50 border border-gray-100 rounded-xl py-3 px-5 text-[10px] font-bold text-gray-700 placeholder:text-gray-300 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Flat Submission Board */}
                    <div className="sticky bottom-8 bg-white/95 backdrop-blur-md rounded-2xl border border-gray-100 p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg border-t-2 border-t-blue-600 transition-all z-20">
                        <div className="flex items-center gap-5">
                            <div className="w-11 h-11 rounded-xl bg-gray-900 flex items-center justify-center text-white">
                                <InformationCircleIcon className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-[10px] font-bold text-gray-900 leading-none mb-1.5 uppercase tracking-widest">Commit Session Records?</h4>
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest">{data.students.filter(s => s.status === 'Present').length} P</span>
                                    <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                                    <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest">{data.students.filter(s => s.status === 'Absent').length} A</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <Link
                                href={route('teacher.attendance.index')}
                                className="flex-1 sm:flex-none px-6 py-4 rounded-xl text-[10px] font-bold text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-all text-center uppercase tracking-widest"
                            >
                                Discard
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex-1 sm:flex-none px-10 py-4 bg-blue-600 text-white rounded-xl text-[10px] font-bold hover:bg-blue-700 disabled:opacity-50 transition-all uppercase tracking-widest"
                            >
                                {processing ? 'Syncing...' : 'Sync Now'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </TeacherLayout>
    );
}
