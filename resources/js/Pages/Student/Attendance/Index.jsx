import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import StudentLayout from '@/Layouts/StudentLayout';
import {
    CalendarDaysIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    ExclamationCircleIcon,
    ChartBarIcon,
} from '@heroicons/react/24/outline';

export default function AttendanceIndex({ student, academicYear, statistics, recordsByMonth, records }) {
    const [selectedMonth, setSelectedMonth] = useState('all');

    const getStatusColor = (status) => {
        switch (status) {
            case 'Present':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'Absent':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'Late':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Excused':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Present':
                return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
            case 'Absent':
                return <XCircleIcon className="h-5 w-5 text-red-600" />;
            case 'Late':
                return <ClockIcon className="h-5 w-5 text-yellow-600" />;
            case 'Excused':
                return <ExclamationCircleIcon className="h-5 w-5 text-gray-600" />;
            default:
                return null;
        }
    };

    const filteredRecords = selectedMonth === 'all' 
        ? records 
        : records.filter(record => {
            const recordMonth = new Date(record.date).toLocaleString('default', { month: 'long', year: 'numeric' });
            return recordMonth === selectedMonth;
        });

    return (
        <StudentLayout>
            <Head title="My Attendance" />

            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-navy-900" style={{ color: '#0F172A' }}>
                    📅 My Attendance
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                    {student.grade?.name} - Section {student.section?.name} • {academicYear?.name}
                </p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                        <CheckCircleIcon className="h-8 w-8 text-green-600" />
                        <div className="text-3xl font-bold text-green-700">{statistics.present}</div>
                    </div>
                    <div className="text-sm text-green-600 font-medium">Present</div>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                        <XCircleIcon className="h-8 w-8 text-red-600" />
                        <div className="text-3xl font-bold text-red-700">{statistics.absent}</div>
                    </div>
                    <div className="text-sm text-red-600 font-medium">Absent</div>
                </div>

                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                        <ClockIcon className="h-8 w-8 text-yellow-600" />
                        <div className="text-3xl font-bold text-yellow-700">{statistics.late}</div>
                    </div>
                    <div className="text-sm text-yellow-600 font-medium">Late</div>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                        <ExclamationCircleIcon className="h-8 w-8 text-gray-600" />
                        <div className="text-3xl font-bold text-gray-700">{statistics.excused}</div>
                    </div>
                    <div className="text-sm text-gray-600 font-medium">Excused</div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                        <ChartBarIcon className="h-8 w-8 text-blue-600" />
                        <div className="text-3xl font-bold text-blue-700">{statistics.rate}%</div>
                    </div>
                    <div className="text-sm text-blue-600 font-medium">Attendance Rate</div>
                </div>
            </div>

            {/* Monthly Breakdown */}
            {recordsByMonth && recordsByMonth.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Breakdown</h3>
                    <div className="space-y-3">
                        {recordsByMonth.map((month, index) => (
                            <div key={index} className="border-b border-gray-100 pb-3 last:border-0">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium text-gray-700">{month.month}</span>
                                    <span className="text-sm font-semibold text-blue-600">{month.rate}%</span>
                                </div>
                                <div className="flex items-center space-x-4 text-xs text-gray-600">
                                    <span className="flex items-center">
                                        <span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span>
                                        Present: {month.present}
                                    </span>
                                    <span className="flex items-center">
                                        <span className="w-2 h-2 rounded-full bg-red-500 mr-1"></span>
                                        Absent: {month.absent}
                                    </span>
                                    <span className="flex items-center">
                                        <span className="w-2 h-2 rounded-full bg-yellow-500 mr-1"></span>
                                        Late: {month.late}
                                    </span>
                                    {month.excused > 0 && (
                                        <span className="flex items-center">
                                            <span className="w-2 h-2 rounded-full bg-gray-500 mr-1"></span>
                                            Excused: {month.excused}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Attendance Records */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Attendance Records</h3>
                    {recordsByMonth && recordsByMonth.length > 0 && (
                        <select
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="all">All Months</option>
                            {recordsByMonth.map((month, index) => (
                                <option key={index} value={month.month}>{month.month}</option>
                            ))}
                        </select>
                    )}
                </div>

                {filteredRecords && filteredRecords.length > 0 ? (
                    <div className="space-y-2">
                        {filteredRecords.map((record) => (
                            <div
                                key={record.id}
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <div className="flex items-center space-x-4">
                                    {getStatusIcon(record.status)}
                                    <div>
                                        <div className="font-medium text-gray-900">{record.date}</div>
                                        <div className="text-sm text-gray-600">{record.day} • {record.subject}</div>
                                        {record.remarks && (
                                            <div className="text-xs text-gray-500 mt-1">{record.remarks}</div>
                                        )}
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(record.status)}`}>
                                    {record.status}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <CalendarDaysIcon className="h-16 w-16 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 font-medium">No attendance records found</p>
                        <p className="text-sm text-gray-400 mt-1">
                            {selectedMonth === 'all' 
                                ? 'Your attendance records will appear here' 
                                : 'No records for this month'}
                        </p>
                    </div>
                )}
            </div>
        </StudentLayout>
    );
}
