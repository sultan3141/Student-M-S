import React, { useState } from 'react';
import TeacherLayout from '@/Layouts/TeacherLayout';
import { Head, router } from '@inertiajs/react';
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
                return 'bg-green-100 text-green-800';
            case 'Absent':
                return 'bg-red-100 text-red-800';
            case 'Late':
                return 'bg-yellow-100 text-yellow-800';
            case 'Excused':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };
    
    return (
        <TeacherLayout>
            <Head title="Attendance History" />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">📚 Attendance History</h1>
                        <p className="mt-1 text-sm text-gray-500">View past attendance records</p>
                    </div>
                    
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        <FunnelIcon className="w-5 h-5 mr-2" />
                        {showFilters ? 'Hide Filters' : 'Show Filters'}
                    </button>
                </div>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center">
                            <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
                                <CalendarIcon className="w-6 h-6" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Total Records</p>
                                <p className="text-2xl font-semibold text-gray-900">{stats.total_records}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center">
                            <div className="p-3 rounded-lg bg-green-50 text-green-600">
                                <ChartBarIcon className="w-6 h-6" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Average Attendance</p>
                                <p className="text-2xl font-semibold text-gray-900">{stats.avg_attendance_rate}%</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Filters */}
                {showFilters && (
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <h3 className="text-sm font-semibold text-gray-700 mb-4">Filter Records</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    From Date
                                </label>
                                <input
                                    type="date"
                                    value={localFilters.date_from}
                                    onChange={(e) => handleFilterChange('date_from', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    To Date
                                </label>
                                <input
                                    type="date"
                                    value={localFilters.date_to}
                                    onChange={(e) => handleFilterChange('date_to', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Grade
                                </label>
                                <select
                                    value={localFilters.grade_id}
                                    onChange={(e) => handleFilterChange('grade_id', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">All Grades</option>
                                    {filterOptions.grades.map(grade => (
                                        <option key={grade.id} value={grade.id}>{grade.name}</option>
                                    ))}
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Section
                                </label>
                                <select
                                    value={localFilters.section_id}
                                    onChange={(e) => handleFilterChange('section_id', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">All Sections</option>
                                    {filterOptions.sections.map(section => (
                                        <option key={section.id} value={section.id}>
                                            {section.grade.name} - {section.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Subject
                                </label>
                                <select
                                    value={localFilters.subject_id}
                                    onChange={(e) => handleFilterChange('subject_id', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">All Subjects</option>
                                    {filterOptions.subjects.map(subject => (
                                        <option key={subject.id} value={subject.id}>{subject.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        
                        <div className="flex items-center justify-end space-x-3 mt-4">
                            <button
                                onClick={clearFilters}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Clear
                            </button>
                            <button
                                onClick={applyFilters}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </div>
                )}
                
                {/* Records List */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                        <h3 className="text-lg font-medium text-gray-900">Past Attendance Records</h3>
                    </div>
                    
                    {records.length > 0 ? (
                        <div className="divide-y divide-gray-100">
                            {records.map((record, index) => (
                                <div key={index} className="transition-colors hover:bg-gray-50/50">
                                    {/* Summary Row */}
                                    <div
                                        className="p-6 cursor-pointer"
                                        onClick={() => toggleRecord(index)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-3">
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {record.formatted_date}
                                                    </span>
                                                    <span className="px-2 py-0.5 rounded-full bg-gray-100 text-xs font-medium text-gray-600">
                                                        {record.grade_name} - {record.section_name}
                                                    </span>
                                                    <span className="px-2 py-0.5 rounded-full bg-blue-100 text-xs font-medium text-blue-700">
                                                        {record.subject_name}
                                                    </span>
                                                </div>
                                                
                                                <div className="mt-2 flex items-center space-x-6 text-sm">
                                                    <span className="flex items-center text-green-600">
                                                        <CheckCircleIcon className="w-4 h-4 mr-1" />
                                                        {record.present} Present
                                                    </span>
                                                    <span className="flex items-center text-red-600">
                                                        <XCircleIcon className="w-4 h-4 mr-1" />
                                                        {record.absent} Absent
                                                    </span>
                                                    {record.late > 0 && (
                                                        <span className="flex items-center text-yellow-600">
                                                            <ClockIcon className="w-4 h-4 mr-1" />
                                                            {record.late} Late
                                                        </span>
                                                    )}
                                                    {record.excused > 0 && (
                                                        <span className="flex items-center text-blue-600">
                                                            <ExclamationCircleIcon className="w-4 h-4 mr-1" />
                                                            {record.excused} Excused
                                                        </span>
                                                    )}
                                                    <span className="text-gray-600">
                                                        Rate: {record.attendance_rate}%
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            <div className="ml-4">
                                                {expandedRecord === index ? (
                                                    <ChevronUpIcon className="w-5 h-5 text-gray-400" />
                                                ) : (
                                                    <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Expanded Details */}
                                    {expandedRecord === index && (
                                        <div className="px-6 pb-6 bg-gray-50/50">
                                            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                                <table className="min-w-full divide-y divide-gray-200">
                                                    <thead className="bg-gray-50">
                                                        <tr>
                                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                                Student
                                                            </th>
                                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                                ID
                                                            </th>
                                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                                Status
                                                            </th>
                                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                                Remarks
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white divide-y divide-gray-200">
                                                        {record.students.map((student, idx) => (
                                                            <tr key={idx} className="hover:bg-gray-50">
                                                                <td className="px-4 py-3 text-sm text-gray-900">
                                                                    {student.name}
                                                                </td>
                                                                <td className="px-4 py-3 text-sm text-gray-500">
                                                                    {student.student_id}
                                                                </td>
                                                                <td className="px-4 py-3">
                                                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
                                                                        {getStatusIcon(student.status)}
                                                                        <span className="ml-1">{student.status}</span>
                                                                    </span>
                                                                </td>
                                                                <td className="px-4 py-3 text-sm text-gray-500">
                                                                    {student.remarks || '-'}
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
                        <div className="p-12 text-center text-gray-500">
                            <CalendarIcon className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                            <p className="text-lg font-medium">No attendance records found</p>
                            <p className="text-sm">Try adjusting your filters or date range</p>
                        </div>
                    )}
                </div>
            </div>
        </TeacherLayout>
    );
}
