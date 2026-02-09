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
            <Head title="Attendance Dashboard" />

            {/* Header / Hero Section */}
            <div className="bg-gradient-to-br from-[#1E40AF] to-[#3B82F6] shadow-sm mb-8 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                    <CalendarIcon className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-blue-100 font-bold uppercase tracking-widest text-[10px]">{todayDate}</span>
                            </div>
                            <h1 className="text-3xl font-black text-white tracking-tight">
                                ATTENDANCE <span className="text-blue-200">DASHBOARD</span>
                            </h1>
                        </div>

                        {/* Summary Stats in Hero */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                                <div className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-1">Completed</div>
                                <div className="text-2xl font-black text-white leading-none">
                                    {stats.todayCompleted} <span className="text-xs font-medium text-white/50">/ {stats.totalClasses}</span>
                                </div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                                <div className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-1">Weekly Rate</div>
                                <div className="text-2xl font-black text-white leading-none">{stats.weekRate}%</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 hidden sm:block">
                                <div className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-1">Pending</div>
                                <div className="text-2xl font-black text-white leading-none">{stats.totalClasses - stats.todayCompleted}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Take Attendance Form */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-blue-50 rounded-xl">
                                    <ClockIcon className="w-6 h-6 text-blue-600" />
                                </div>
                                <h2 className="text-xl font-black text-gray-900 tracking-tight">Take Attendance</h2>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">1. Select Grade</label>
                                    <select
                                        value={selectedGrade}
                                        onChange={(e) => setSelectedGrade(e.target.value)}
                                        className="w-full bg-gray-50 border-none rounded-2xl py-4 px-4 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 transition-all"
                                    >
                                        <option value="">Choose Grade</option>
                                        {grades.map(grade => (
                                            <option key={grade.id} value={grade.id}>{grade.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">2. Select Section</label>
                                    <select
                                        value={selectedSection}
                                        onChange={(e) => setSelectedSection(e.target.value)}
                                        disabled={!selectedGrade || loading}
                                        className="w-full bg-gray-50 border-none rounded-2xl py-4 px-4 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 transition-all disabled:opacity-50"
                                    >
                                        <option value="">Choose Section</option>
                                        {sections.map(section => (
                                            <option key={section.id} value={section.id}>{section.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">3. Select Subject</label>
                                    <select
                                        value={selectedSubject}
                                        onChange={(e) => setSelectedSubject(e.target.value)}
                                        disabled={!selectedSection || loading}
                                        className="w-full bg-gray-50 border-none rounded-2xl py-4 px-4 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 transition-all disabled:opacity-50"
                                    >
                                        <option value="">Choose Subject</option>
                                        {subjects.map(subject => (
                                            <option key={subject.id} value={subject.id}>{subject.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <button
                                    onClick={handleTakeAttendance}
                                    disabled={!selectedGrade || !selectedSection || !selectedSubject || loading}
                                    className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-sm shadow-xl shadow-blue-200 hover:bg-blue-700 disabled:opacity-50 transition-all uppercase tracking-widest mt-4"
                                >
                                    {loading ? 'Processing...' : 'Start Marking'}
                                </button>

                                <Link
                                    href={route('teacher.attendance.history')}
                                    className="block w-full text-center py-4 text-sm font-black text-gray-400 uppercase tracking-widest hover:text-blue-600 transition-colors"
                                >
                                    Attendance History
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Today's Schedule */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Today's Schedule</h2>
                            </div>
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                {schedule.length} Classes Today
                            </div>
                        </div>

                        {schedule.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {schedule.map((cls) => {
                                    const isCompleted = cls.status === 'Completed';
                                    return (
                                        <div
                                            key={cls.section_id}
                                            className={`group relative bg-white rounded-[32px] border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${isCompleted
                                                ? 'border-green-100 hover:border-green-300'
                                                : 'border-blue-50 hover:border-blue-200'
                                                }`}
                                        >
                                            <div className="p-8">
                                                {/* Status Badge */}
                                                <div className="absolute top-8 right-8">
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isCompleted
                                                        ? 'bg-green-50 text-green-600'
                                                        : 'bg-amber-50 text-amber-600 animate-pulse'
                                                        }`}>
                                                        {isCompleted ? 'Completed' : 'Upcoming'}
                                                    </span>
                                                </div>

                                                {/* Class Info */}
                                                <div className="mb-8">
                                                    <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1.5">
                                                        {cls.grade_name} &bull; {cls.section_name}
                                                    </div>
                                                    <h3 className="text-xl font-black text-gray-900 group-hover:text-blue-600 transition-colors">
                                                        {cls.subject_name}
                                                    </h3>
                                                </div>

                                                <div className="flex items-center gap-8 mb-8">
                                                    <div className="flex flex-col">
                                                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Students</span>
                                                        <span className="text-sm font-black text-gray-700">{cls.student_count} Total</span>
                                                    </div>
                                                    <div className="w-px h-8 bg-gray-100 italic"></div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Period</span>
                                                        <span className="text-sm font-black text-gray-700 flex items-center gap-2">
                                                            <ClockIcon className="w-4 h-4 text-blue-500" />
                                                            Daily
                                                        </span>
                                                    </div>
                                                </div>

                                                <Link
                                                    href={route('teacher.attendance.create', { section_id: cls.section_id, subject_id: cls.subject_id })}
                                                    className={`flex items-center justify-center w-full py-4 rounded-2xl font-black text-sm transition-all tracking-widest uppercase ${isCompleted
                                                        ? 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600'
                                                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-200'
                                                        }`}
                                                >
                                                    {isCompleted ? 'View Records' : 'Mark Attendance'}
                                                    {!isCompleted && <ArrowRightIcon className="w-4 h-4 ml-2" />}
                                                </Link>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="bg-white rounded-[32px] border-2 border-dashed border-gray-100 p-20 text-center">
                                <div className="w-20 h-20 bg-blue-50 text-blue-300 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                    <ClockIcon className="w-10 h-10" />
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">All Clear Today!</h3>
                                <p className="text-gray-500 font-medium max-w-sm mx-auto">
                                    No classes are scheduled for your attention today. You can relax or catch up on other tasks.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Legend or Information */}
                <div className="mt-8 bg-amber-50 rounded-[32px] p-8 border border-amber-100 flex items-start gap-5">
                    <div className="p-3 bg-amber-500 text-white rounded-2xl shadow-xl shadow-amber-200">
                        <ExclamationCircleIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="text-sm font-black text-amber-900 uppercase tracking-widest mb-1.5">Attendance Lifecycle</h4>
                        <p className="text-xs font-bold text-amber-800/80 leading-relaxed">
                            Once attendance is marked and synced, it becomes a permanent record. This data feeds into student reports, parent notifications, and overall school analytics. Please double-check for accuracy before syncing.
                        </p>
                    </div>
                </div>
            </div>
        </TeacherLayout>
    );
}
