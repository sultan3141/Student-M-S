import React, { useState, useEffect } from 'react';
import TeacherLayout from '@/Layouts/TeacherLayout';
import { Head, Link, router } from '@inertiajs/react';
import axios from 'axios';
import {
    ClockIcon,
    CheckCircleIcon,
    ExclamationCircleIcon,
    CalendarIcon,
    AcademicCapIcon,
    ArrowRightIcon,
    UserGroupIcon,
    BookOpenIcon
} from '@heroicons/react/24/outline';

export default function Index({ auth, schedule, todayDate, stats }) {
    const [selectedGrade, setSelectedGrade] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');

    const [grades, setGrades] = useState([]);
    const [sections, setSections] = useState([]);
    const [subjects, setSubjects] = useState([]);

    const [loading, setLoading] = useState(false);

    // Load grades on mount
    useEffect(() => {
        axios.get(route('teacher.attendance.grades'))
            .then(response => setGrades(response.data))
            .catch(error => console.error('Error loading grades:', error));
    }, []);

    // Load sections when grade changes
    useEffect(() => {
        if (selectedGrade) {
            setLoading(true);
            axios.get(route('teacher.attendance.sections'), {
                params: { grade_id: selectedGrade }
            })
                .then(response => {
                    setSections(response.data);
                    setSelectedSection('');
                    setSubjects([]);
                    setSelectedSubject('');
                })
                .catch(error => console.error('Error loading sections:', error))
                .finally(() => setLoading(false));
        } else {
            setSections([]);
            setSubjects([]);
            setSelectedSection('');
            setSelectedSubject('');
        }
    }, [selectedGrade]);

    // Load subjects when section changes
    useEffect(() => {
        if (selectedSection) {
            setLoading(true);
            axios.get(route('teacher.attendance.subjects'), {
                params: { section_id: selectedSection }
            })
                .then(response => {
                    setSubjects(response.data);
                    setSelectedSubject('');
                })
                .catch(error => console.error('Error loading subjects:', error))
                .finally(() => setLoading(false));
        } else {
            setSubjects([]);
            setSelectedSubject('');
        }
    }, [selectedSection]);

    const handleTakeAttendance = () => {
        if (selectedGrade && selectedSection && selectedSubject) {
            router.get(route('teacher.attendance.create'), {
                grade_id: selectedGrade,
                section_id: selectedSection,
                subject_id: selectedSubject,
            });
        }
    };

    return (
        <TeacherLayout>
            <Head title="Attendance Console" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                {/* Clean Header */}
                <div className="mb-10">
                    <div className="flex items-center gap-2 mb-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                        <Link href={route('teacher.dashboard')} className="hover:text-blue-600 transition-colors">Dashboard</Link>
                        <span className="text-gray-300">/</span>
                        <span className="text-gray-900 border-b border-gray-100 italic">Attendance</span>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 tracking-tight uppercase">
                                Attendance <span className="text-blue-600">Console</span>
                            </h1>
                            <p className="mt-2 text-xs font-bold text-gray-400 flex items-center gap-2">
                                <CalendarIcon className="w-4 h-4 text-blue-500" />
                                {todayDate}
                            </p>
                        </div>
                        <Link
                            href={route('teacher.attendance.history')}
                            className="inline-flex items-center px-6 py-3 bg-white border border-gray-100 rounded-2xl text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-blue-600 hover:border-blue-100 transition-all shadow-sm"
                        >
                            <ClockIcon className="w-4 h-4 mr-2" />
                            View Archive
                        </Link>
                    </div>
                </div>

                {/* Flat Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 transition-colors hover:border-blue-100">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                                <UserGroupIcon className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Active Cohorts</p>
                                <p className="text-2xl font-bold text-gray-900">{stats?.totalClasses ?? 0}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 p-6 transition-colors hover:border-green-100">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-50 rounded-xl text-green-600">
                                <CheckCircleIcon className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Today's Progress</p>
                                <p className="text-2xl font-bold text-gray-900">{stats?.todayCompleted ?? 0}%</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 p-6 transition-colors hover:border-amber-100">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
                                <BookOpenIcon className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Scheduled Today</p>
                                <p className="text-2xl font-bold text-gray-900">{schedule?.length ?? 0} Classes</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Left Column: Attendance Form */}
                    <div className="lg:col-span-4">
                        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
                            <h2 className="text-[11px] font-bold text-gray-900 uppercase tracking-widest mb-8 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                                Attendance Session
                            </h2>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Academic Grade</label>
                                    <select
                                        value={selectedGrade}
                                        onChange={(e) => setSelectedGrade(e.target.value)}
                                        className="w-full px-5 py-4 bg-gray-50/50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 rounded-xl text-[11px] font-bold text-gray-700 transition-all appearance-none cursor-pointer uppercase tracking-tight"
                                    >
                                        <option value="">Select Grade</option>
                                        {grades.map(grade => (
                                            <option key={grade.id} value={grade.id}>{grade.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Class Section</label>
                                    <select
                                        value={selectedSection}
                                        onChange={(e) => setSelectedSection(e.target.value)}
                                        disabled={!selectedGrade || loading}
                                        className="w-full px-5 py-4 bg-gray-50/50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 rounded-xl text-[11px] font-bold text-gray-700 transition-all appearance-none cursor-pointer disabled:opacity-50 uppercase tracking-tight"
                                    >
                                        <option value="">Select Section</option>
                                        {sections.map(section => (
                                            <option key={section.id} value={section.id}>{section.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Session Subject</label>
                                    <select
                                        value={selectedSubject}
                                        onChange={(e) => setSelectedSubject(e.target.value)}
                                        disabled={!selectedSection || loading}
                                        className="w-full px-5 py-4 bg-gray-50/50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 rounded-xl text-[11px] font-bold text-gray-700 transition-all appearance-none cursor-pointer disabled:opacity-50 uppercase tracking-tight"
                                    >
                                        <option value="">Select Subject</option>
                                        {subjects.map(subject => (
                                            <option key={subject.id} value={subject.id}>{subject.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <button
                                    onClick={handleTakeAttendance}
                                    disabled={!selectedGrade || !selectedSection || !selectedSubject || loading}
                                    className="w-full py-5 bg-blue-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-blue-700 disabled:opacity-50 transition-all"
                                >
                                    {loading ? 'Processing...' : 'Launch Session'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Today's Feed */}
                    <div className="lg:col-span-8">
                        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
                            <h2 className="text-[11px] font-bold text-gray-900 uppercase tracking-widest mb-8 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                    Synchronized Activity
                                </div>
                                <span className="text-[9px] font-bold text-gray-300">Synchronized realtime</span>
                            </h2>

                            {schedule?.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {schedule.map((slot, index) => (
                                        <div key={index} className="group p-6 rounded-xl border border-gray-50 bg-gray-50/30 hover:bg-white hover:border-blue-100 transition-all">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="p-2.5 bg-white rounded-lg text-blue-600 border border-gray-100 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                    <AcademicCapIcon className="w-4 h-4" />
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-[8px] font-bold text-gray-300 uppercase tracking-widest block mb-0.5">Session Window</span>
                                                    <span className="text-[10px] font-bold text-gray-900">{slot.start_time} - {slot.end_time}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight mb-1 group-hover:text-blue-600 transition-colors">
                                                    {slot.grade_name} &bull; {slot.section_name}
                                                </h3>
                                                <div className="flex items-center gap-2">
                                                    <span className="px-3 py-1 bg-white border border-gray-100 rounded-lg text-[9px] font-bold text-gray-400 uppercase tracking-widest group-hover:border-blue-50 transition-colors">
                                                        {slot.subject_name}
                                                    </span>
                                                    <span className={`px-3 py-1 rounded-lg text-[8px] font-bold uppercase tracking-widest ${slot.status === 'Completed' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                                                        {slot.status || 'Upcoming'}
                                                    </span>
                                                </div>

                                                {!slot.status || slot.status !== 'Completed' ? (
                                                    <Link
                                                        href={route('teacher.attendance.create', { section_id: slot.section_id, subject_id: slot.subject_id })}
                                                        className="mt-6 flex items-center justify-center w-full py-3 bg-gray-900 text-white rounded-lg text-[9px] font-bold uppercase tracking-widest hover:bg-blue-600 transition-all"
                                                    >
                                                        Record Now
                                                        <ArrowRightIcon className="w-3 h-3 ml-2" />
                                                    </Link>
                                                ) : (
                                                    <div className="mt-6 py-3 text-center border border-dashed border-gray-100 rounded-lg text-[9px] font-bold text-gray-300 uppercase tracking-widest">
                                                        Entries Locked
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-24 text-center">
                                    <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                        <CheckCircleIcon className="w-8 h-8 text-gray-200" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 uppercase tracking-tight">Agenda Clear</h3>
                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-2">No further sessions scheduled for today</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Advisory Footer */}
                <div className="mt-12 bg-gray-50 border border-gray-100 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-6">
                    <div className="p-3 bg-blue-600 text-white rounded-xl shadow-sm">
                        <ExclamationCircleIcon className="w-5 h-5" />
                    </div>
                    <div className="text-center md:text-left flex-1">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
                            <span className="text-gray-900">Finalization advisory:</span> Attendance records are synchronized with permanent academic logs. Please ensure precision before committing records to the system.
                        </p>
                    </div>
                </div>
            </div>
        </TeacherLayout>
    );
}
