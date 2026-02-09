import React, { useState } from 'react';
import TeacherLayout from '@/Layouts/TeacherLayout';
import { Head, router, Link } from '@inertiajs/react';
import {
    CalendarIcon,
    ChartBarIcon,
    FunnelIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    ExclamationCircleIcon
} from '@heroicons/react/24/outline';

export default function History({ auth, records, filters, filterOptions, stats }) {
    const [expandedRecord, setExpandedRecord] = useState(null);
    const [showFilters, setShowFilters] = useState(false);

    const [localFilters, setLocalFilters] = useState({
        date_from: filters.date_from || '',
        date_to: filters.date_to || '',
        grade_id: filters.grade_id || '',
        section_id: filters.section_id || '',
        subject_id: filters.subject_id || '',
    });

    const handleFilterChange = (key, value) => {
        setLocalFilters(prev => ({ ...prev, [key]: value }));
    };

    const applyFilters = () => {
        router.get(route('teacher.attendance.history'), localFilters, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        const cleared = {
            date_from: '',
            date_to: '',
            grade_id: '',
            section_id: '',
            subject_id: '',
        };
        setLocalFilters(cleared);
        router.get(route('teacher.attendance.history'), cleared);
    };

    const toggleRecord = (index) => {
        setExpandedRecord(expandedRecord === index ? null : index);
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Present':
                return <CheckCircleIcon className="w-5 h-5 text-green-600" />;
            case 'Absent':
                return <XCircleIcon className="w-5 h-5 text-red-600" />;
            case 'Late':
                return <ClockIcon className="w-5 h-5 text-yellow-600" />;
            case 'Excused':
                return <ExclamationCircleIcon className="w-5 h-5 text-blue-600" />;
            default:
                return null;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Present':
                return 'bg-green-50 text-green-600';
            case 'Absent':
                return 'bg-red-50 text-red-600';
            case 'Late':
                return 'bg-amber-50 text-amber-600';
            case 'Excused':
                return 'bg-blue-50 text-blue-600';
            default:
                return 'bg-gray-50 text-gray-400';
        }
    };

    return (
        <TeacherLayout>
            <Head title="Attendance History" />

            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10">
                    <div>
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                            <Link href={route('teacher.dashboard')} className="hover:text-blue-600 transition-colors">Dashboard</Link>
                            <span className="text-gray-300">/</span>
                            <Link href={route('teacher.attendance.index')} className="hover:text-blue-600 transition-colors">Attendance</Link>
                            <span className="text-gray-300">/</span>
                            <span className="text-gray-900 border-b border-gray-50 uppercase tracking-tighter">History</span>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight uppercase">
                            Attendance <span className="text-blue-600">Archive</span>
                        </h1>
                    </div>

                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`inline-flex items-center px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${showFilters ? 'bg-gray-900 text-white' : 'bg-white border border-gray-100 text-gray-400 hover:text-blue-600'}`}
                    >
                        <FunnelIcon className="w-4 h-4 mr-2" />
                        {showFilters ? 'Hide Filters' : 'Filter View'}
                    </button>
                </div>

                {/* Analytics Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 transition-colors hover:border-blue-100">
                        <div className="flex items-center gap-6">
                            <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                                <CalendarIcon className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Total Records</p>
                                <p className="text-2xl font-bold text-gray-900 uppercase">{stats.total_records} Entries</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 p-6 transition-colors hover:border-green-100">
                        <div className="flex items-center gap-6">
                            <div className="p-3 bg-green-50 rounded-xl text-green-600">
                                <ChartBarIcon className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Efficiency Score</p>
                                <p className="text-2xl font-bold text-gray-900 uppercase">{stats.avg_attendance_rate}% Stability</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters Board */}
                {showFilters && (
                    <div className="bg-white rounded-2xl p-8 border border-gray-100 mb-10 overflow-hidden">
                        <h3 className="text-[10px] font-bold text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <FunnelIcon className="w-4 h-4 text-blue-600" />
                            Database Refinement
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">Date From</label>
                                <input
                                    type="date"
                                    value={localFilters.date_from}
                                    onChange={(e) => handleFilterChange('date_from', e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50/50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 rounded-xl text-[10px] font-bold text-gray-700 transition-all uppercase tracking-tight"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">Date To</label>
                                <input
                                    type="date"
                                    value={localFilters.date_to}
                                    onChange={(e) => handleFilterChange('date_to', e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50/50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 rounded-xl text-[10px] font-bold text-gray-700 transition-all uppercase tracking-tight"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">Grade</label>
                                <select
                                    value={localFilters.grade_id}
                                    onChange={(e) => handleFilterChange('grade_id', e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50/50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 rounded-xl text-[10px] font-bold text-gray-700 transition-all appearance-none cursor-pointer uppercase tracking-tight"
                                >
                                    <option value="">All Grades</option>
                                    {filterOptions.grades.map(grade => (
                                        <option key={grade.id} value={grade.id}>{grade.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">Section</label>
                                <select
                                    value={localFilters.section_id}
                                    onChange={(e) => handleFilterChange('section_id', e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50/50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 rounded-xl text-[10px] font-bold text-gray-700 transition-all appearance-none cursor-pointer uppercase tracking-tight"
                                >
                                    <option value="">All Sections</option>
                                    {filterOptions.sections.map(section => (
                                        <option key={section.id} value={section.id}>
                                            {section.grade.name} - {section.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">Subject</label>
                                <select
                                    value={localFilters.subject_id}
                                    onChange={(e) => handleFilterChange('subject_id', e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50/50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 rounded-xl text-[10px] font-bold text-gray-700 transition-all appearance-none cursor-pointer uppercase tracking-tight"
                                >
                                    <option value="">All Subjects</option>
                                    {filterOptions.subjects.map(subject => (
                                        <option key={subject.id} value={subject.id}>{subject.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 mt-8">
                            <button
                                onClick={clearFilters}
                                className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-colors"
                            >
                                Reset
                            </button>
                            <button
                                onClick={applyFilters}
                                className="px-8 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-bold hover:bg-blue-700 hover:shadow-blue-100 transition-all uppercase tracking-widest"
                            >
                                Update Results
                            </button>
                        </div>
                    </div>
                )}

                {/* Records Collection */}
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-12">
                    <div className="px-8 py-5 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between">
                        <h3 className="text-[10px] font-bold text-gray-900 uppercase tracking-widest italic">Synchronized Archives</h3>
                        <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{records.length} Cycles</span>
                    </div>

                    {records.length > 0 ? (
                        <div className="divide-y divide-gray-100">
                            {records.map((record, index) => (
                                <div key={index} className="transition-colors hover:bg-gray-50/50">
                                    {/* Summary Row */}
                                    <div
                                        className={`p-8 cursor-pointer underline-offset-4 ${expandedRecord === index ? 'bg-blue-50/20' : 'hover:bg-gray-50/50'}`}
                                        onClick={() => toggleRecord(index)}
                                    >
                                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                            <div className="flex-1">
                                                <div className="flex flex-wrap items-center gap-3 mb-3">
                                                    <span className="text-sm font-bold text-gray-900 tracking-tight">
                                                        {record.formatted_date}
                                                    </span>
                                                    <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                                                    <span className="px-3 py-1 rounded-lg bg-blue-50 text-[9px] font-bold text-blue-600 uppercase tracking-widest">
                                                        {record.grade_name} &bull; {record.section_name}
                                                    </span>
                                                    <span className="px-3 py-1 rounded-lg bg-gray-100 text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                                                        {record.subject_name}
                                                    </span>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-5">
                                                    <div className="flex items-center text-green-600">
                                                        <CheckCircleIcon className="w-3.5 h-3.5 mr-1.5" />
                                                        <span className="text-[9px] font-bold uppercase tracking-widest">{record.present} P</span>
                                                    </div>
                                                    <div className="flex items-center text-red-600">
                                                        <XCircleIcon className="w-3.5 h-3.5 mr-1.5" />
                                                        <span className="text-[9px] font-bold uppercase tracking-widest">{record.absent} A</span>
                                                    </div>
                                                    {record.late > 0 && (
                                                        <div className="flex items-center text-amber-600">
                                                            <ClockIcon className="w-3.5 h-3.5 mr-1.5" />
                                                            <span className="text-[9px] font-bold uppercase tracking-widest">{record.late} L</span>
                                                        </div>
                                                    )}
                                                    <div className="px-4 border-l border-gray-100 ml-1">
                                                        <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">Efficiency: <span className="text-gray-900">{record.attendance_rate}%</span></span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="shrink-0">
                                                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${expandedRecord === index ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 rotate-180' : 'bg-gray-50 text-gray-300'}`}>
                                                    <ChevronDownIcon className="w-5 h-5" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded Details */}
                                    {expandedRecord === index && (
                                        <div className="px-10 pb-10">
                                            <div className="bg-gray-50/50 rounded-[2rem] border border-gray-100 overflow-hidden">
                                                <table className="min-w-full divide-y divide-gray-100">
                                                    <thead>
                                                        <tr className="bg-white/50">
                                                            <th className="px-8 py-4 text-left text-[9px] font-black text-gray-300 uppercase tracking-widest">
                                                                Student
                                                            </th>
                                                            <th className="px-8 py-4 text-left text-[9px] font-black text-gray-300 uppercase tracking-widest">
                                                                Status
                                                            </th>
                                                            <th className="px-8 py-4 text-left text-[9px] font-black text-gray-300 uppercase tracking-widest">
                                                                Analytical Remark
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-100">
                                                        {record.students.map((student, idx) => (
                                                            <tr key={idx} className="hover:bg-white transition-colors">
                                                                <td className="px-8 py-5">
                                                                    <div className="flex flex-col">
                                                                        <span className="text-sm font-black text-gray-900 uppercase tracking-tight">{student.name}</span>
                                                                        <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">ID: {student.student_id}</span>
                                                                    </div>
                                                                </td>
                                                                <td className="px-8 py-5">
                                                                    <span className={`inline-flex items-center px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${getStatusColor(student.status)}`}>
                                                                        {student.status}
                                                                    </span>
                                                                </td>
                                                                <td className="px-8 py-5 text-xs font-bold text-gray-400 italic">
                                                                    {student.remarks || 'No remarks recorded'}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-24 text-center">
                            <div className="w-24 h-24 bg-gray-50/80 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-sm border border-gray-50">
                                <CalendarIcon className="w-10 h-10 text-gray-200" />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tight">No Archive Found</h3>
                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.25em] max-w-xs mx-auto leading-loose opacity-60 mt-4">
                                Try adjusting your filters or date range to find historical attendance sessions.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </TeacherLayout>
    );
}
